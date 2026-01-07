
import React, { createContext, useState, useCallback, useRef, useContext, ReactNode } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audio';

interface TTSContextType {
    isPlaying: boolean;
    isLoading: boolean;
    currentlyPlayingId: string | null;
    error: string | null;
    play: (text: string, id: string) => void;
    stop: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

/**
 * Cleans and chunks text for optimal TTS processing.
 * Intelligently splits by sentence endings to avoid robotic cutoffs.
 */
function cleanAndChunkText(rawText: string): string[] {
    // 1. Strict input validation
    if (!rawText || typeof rawText !== 'string') return [];

    try {
        // 2. Strip Markdown, emojis, and unwanted characters
        const withoutMarkdown = rawText
            .replace(/#{2,4}\s/g, '') // Remove ### headers
            .replace(/<strong>(.*?)<\/strong>/g, '$1') // Remove <strong> tags
            .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **bold**
            .replace(/\*([^*]+)\*/g, '$1')   // Remove *italic*
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') // Remove emojis
            .replace(/\s+/g, ' ') // Collapse whitespace
            .trim();

        if (!withoutMarkdown) return [];

        // 3. Split by sentence boundaries (. ! ?)
        // Safe match with fallback
        const sentences = withoutMarkdown.match(/[^.!?]+[.!?]+(\s|$)/g) || [withoutMarkdown];

        // 4. Merge small sentences into chunks
        const mergedChunks: string[] = [];
        let currentChunk = '';
        const MAX_CHUNK_LENGTH = 800; // Gemini TTS ideal chunk size ~1000 chars

        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (!trimmedSentence) continue;

            if (currentChunk.length + trimmedSentence.length + 1 > MAX_CHUNK_LENGTH && currentChunk.length > 0) {
                mergedChunks.push(currentChunk.trim());
                currentChunk = trimmedSentence;
            } else {
                currentChunk = currentChunk ? `${currentChunk} ${trimmedSentence}` : trimmedSentence;
            }
        }
        // Add the last remaining chunk
        if (currentChunk.length > 0) {
            mergedChunks.push(currentChunk.trim());
        }

        // 5. Final check for very large chunks that might have lacked punctuation
        return mergedChunks.flatMap(chunk => {
            if (chunk.length <= MAX_CHUNK_LENGTH) return [chunk];
            // Fallback: split huge chunks by commas or just length
            const subChunks = [];
            let temp = '';
            const words = chunk.split(' ');
            for(const word of words) {
                if(temp.length + word.length > MAX_CHUNK_LENGTH) {
                    subChunks.push(temp.trim());
                    temp = word;
                } else {
                    temp = temp ? `${temp} ${word}` : word;
                }
            }
            if(temp) subChunks.push(temp.trim());
            return subChunks;
        });
    } catch (e) {
        console.error("Error chunking text:", e);
        // Fallback: return the raw text as a single chunk if safe, or empty array
        return rawText ? [rawText.substring(0, 800)] : [];
    }
}


export const TTSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const abortControllerRef = useRef<AbortController | null>(null);

    const stop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        sourceNodesRef.current.forEach(source => {
            try {
                source.stop();
                source.disconnect();
            } catch (e) {
                // Ignore errors that may happen if context is already closed
            }
        });
        sourceNodesRef.current.clear();

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.error);
        }
        audioContextRef.current = null;
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentlyPlayingId(null);
        setError(null);
    }, []);

    const play = useCallback(async (text: string, id: string) => {
        if (!text) return;
        stop(); // Stop any previous playback

        const controller = new AbortController();
        abortControllerRef.current = controller;
        const { signal } = controller;

        setCurrentlyPlayingId(id);
        setIsLoading(true);
        setError(null);

        try {
            const chunks = cleanAndChunkText(text);
            if (chunks.length === 0) {
                stop();
                return;
            }

            // Initialize AudioContext right away
            const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = newAudioContext;
            
            let nextStartTime = newAudioContext.currentTime + 0.1; // Small buffer
            let isFirstChunk = true;

            // Process chunks sequentially
            for (const chunk of chunks) {
                if (signal.aborted) return;

                // 1. Fetch audio for a single chunk
                const audioBase64 = await generateSpeech(chunk);
                if (signal.aborted) return;

                if (!audioBase64) {
                    console.warn("A TTS chunk failed to generate. Skipping.");
                    continue;
                }

                // 2. Decode the audio data
                const decodedBytes = decode(audioBase64);
                const audioBuffer = await decodeAudioData(decodedBytes, newAudioContext, 24000, 1);
                if (signal.aborted) return;

                // 3. Once the first chunk is ready, update state to start playing
                if (isFirstChunk) {
                    setIsLoading(false);
                    setIsPlaying(true);
                    isFirstChunk = false;
                }

                // 4. Schedule playback for this chunk
                // Ensure we don't schedule in the past if processing took too long
                const startTime = Math.max(nextStartTime, newAudioContext.currentTime);
                
                const source = newAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(newAudioContext.destination);
                source.start(startTime);

                // Update the start time for the next chunk
                nextStartTime = startTime + audioBuffer.duration;

                source.onended = () => {
                    sourceNodesRef.current.delete(source);
                    // Only stop if we are truly done and nothing else is scheduled/playing
                    // We check if the set is empty AND if we've processed all chunks logic (implicit via loop completion)
                    if (sourceNodesRef.current.size === 0 && !signal.aborted) {
                         // Small timeout to allow any barely-finished processing to clear
                         setTimeout(() => {
                             if(sourceNodesRef.current.size === 0) stop();
                         }, 200);
                    }
                };
                sourceNodesRef.current.add(source);
            }
        } catch (err: any) {
            if (signal.aborted) {
                console.log("TTS playback was successfully aborted by the user.");
            } else {
                console.error("An error occurred during TTS playback:", err);
                setError("Failed to generate audio.");
                stop();
            }
        }
    }, [stop]);

    const value = { isPlaying, isLoading, currentlyPlayingId, error, play, stop };

    return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
};

export const useTTS = (): TTSContextType => {
    const context = useContext(TTSContext);
    if (context === undefined) {
        throw new Error('useTTS must be used within a TTSProvider');
    }
    return context;
};
