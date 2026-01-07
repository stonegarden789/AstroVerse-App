
import { GoogleGenAI, Modality, Chat, Type } from "@google/genai";
import type { BirthData, Language, TranslationSet, CognitiveProfile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

// Always use new GoogleGenAI({apiKey: process.env.API_KEY}) as per initialization guidelines.
const ai = new GoogleGenAI({ apiKey: API_KEY });
// FIX: Updated model aliases to use Gemini 3 for enhanced reasoning and analytical quality.
const flashModel = 'gemini-3-flash-preview';
const proModel = 'gemini-3-pro-preview';

const getLanguageName = (lang: Language): string => {
    const languageMap = {
      en: "English",
      ro: "Romanian",
      es: "Spanish",
      fr: "French",
      de: "German"
    };
    return languageMap[lang];
}

const getBaseSystemInstruction = (lang: Language): string => {
  return `You are a world-class professional astrologer named AstroVerse Oracle. You are insightful, warm, and deeply knowledgeable.
- **Language Purity:** Your entire response, including all titles, subtitles, and content, MUST be in ${getLanguageName(lang)}. There should be absolutely no mixed languages.
- **Inclusive Language (Gender Neutrality):** Your entire response MUST be gender-neutral.
- **Formatting:** Use valid Markdown for structure. NEVER use HTML tags like <strong>, <em>, or <br> inside JSON responses. Use standard Markdown (*italic*, **bold**) instead.`;
};

// ... [Keep existing functions: generateAstrologyReading, startAstroChat, startAITeacherChat] ...

export const generateAstrologyReading = async (data: BirthData, language: Language, translations: TranslationSet): Promise<string> => {
    const t = translations.reading.natalChartTemplate;
    
    const userPrompt = `
    Generate a professional, deep-research natal chart reading for the user's birth data:
    - Date: ${data.date}
    - Time: ${data.time}
    - Location: ${data.location}

    The entire report MUST be in ${getLanguageName(language)} and MUST follow this exact Markdown structure. Fill in the placeholders with your deep, multi-paragraph analysis. Use relevant emojis in titles and content to make it engaging.

    ## ${t.summaryTitle}

    * **${t.sunSign}** [Calculate and state the user's Sun Sign here]
    * **${t.risingSign}** [Calculate and state the user's Rising Sign here]
    * **${t.moonSign}** [Calculate and state the user's Moon Sign here]
    * **${t.dominantElement}** [Analyze the chart to find and state the dominant element (Fire, Earth, Air, Water)]
    * **${t.dominantModality}** [Analyze the chart to find and state the dominant modality (Cardinal, Fixed, Mutable)]

    ## ${t.sunInSignTitle('[AI, insert Sun Sign here]')}

    [Provide a deep, professional, multi-paragraph analysis of the Sun in its specific sign. Explain core identity, ego, and life force.]

    ### ${t.sunInHouseTitle('[AI, insert House number here]')}

    [Provide a deep, professional, multi-paragraph analysis of the Sun's position in its respective house, detailing the area of life where the user is meant to shine.]

    ## ${t.moonInSignTitle('[AI, insert Moon Sign here]')}

    [Provide a deep, professional, multi-paragraph analysis of the Moon in its specific sign and house. Discuss emotions, instincts, the subconscious, and what brings the user comfort.]

    ## ${t.chironTitle}

    [Provide a detailed, multi-paragraph analysis of Chiron's position in the chart, discussing the user's core wound, path to healing, and where they can become a teacher for others.]

    ## ${t.aspectsTitle}

    ### ${t.favorableAspectsTitle}

    * [Identify and list the most significant trines and sextiles in the chart, explaining their meaning as innate talents and harmonious energy flows.]
    * [Add more favorable aspects as needed.]
    ...

    ### ${t.challengingAspectsTitle}

    * [Identify and list the most significant squares and oppositions in the chart, explaining them as dynamic tensions and key areas for growth and personal development.]
    * [Add more challenging aspects as needed.]
    ...

    ## ${t.nodesTitle}

    ### ${t.northNodeTitle}
    [Provide a deep, multi-paragraph analysis of the North Node's position, discussing karmic lessons, life's destiny path, and the qualities the soul is striving to develop.]

    ### ${t.southNodeTitle}
    [Provide a deep, multi-paragraph analysis of the South Node's position, discussing the comfort zone, inherited talents, and past-life patterns to be evolved from.]
  `;
  try {
    const response = await ai.models.generateContent({
        model: proModel,
        contents: userPrompt,
        config: { 
            systemInstruction: getBaseSystemInstruction(language),
            temperature: 0.2,
            thinkingConfig: { thinkingBudget: 32768 }
        },
    });
    // Property access .text directly as per GenerateContentResponse guidelines.
    return response.text;
  } catch (error) {
    console.error("Error generating astrology reading:", error);
    throw new Error("Failed to communicate with the Gemini API for the reading.");
  }
};

export const startAstroChat = (birthData: BirthData, language: Language): Chat => {
    const systemInstruction = `You are 'The Archivist Oracle'. Base all answers on birth data: ${birthData.date}, ${birthData.time}, ${birthData.location}. Language: ${getLanguageName(language)}. Be conversational and profound.`;
    
    return ai.chats.create({
      model: proModel,
      config: { 
          systemInstruction,
          thinkingConfig: { thinkingBudget: 32768 }
      },
    });
};

export const startAITeacherChat = (language: Language): Chat => {
    const systemInstruction = `You are a "Certified Astrology Professor". Language: ${getLanguageName(language)}. Focus: Academic astrology only.`;
    
    return ai.chats.create({
      model: proModel,
      config: { 
          systemInstruction,
          thinkingConfig: { thinkingBudget: 32768 }
      },
    });
};

export const generateDailyDashboard = async (birthData: BirthData, language: Language): Promise<any> => {
    // CRITICAL: Explicit instruction to avoid HTML tags in JSON and force Emojis.
    const userPrompt = `
    Generate a daily dashboard for ${birthData.date}.
    1. Focus: A short phrase (5-10 words) starting with an Emoji.
    2. Current Moon: Sign name & Phase, starting with an Emoji.
    3. Card: Title & Message, title starting with an Emoji.
    
    IMPORTANT RULES:
    1. Do NOT use HTML tags (like <strong>, <b>, <i>, <br>) in the JSON values. 
    2. Use plain text or standard Markdown (*italic*, **bold**) if absolutely necessary, but preferably plain text.
    3. Ensure the response is valid JSON.
    Language: ${getLanguageName(language)}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: flashModel,
            contents: userPrompt,
            config: {
                systemInstruction: getBaseSystemInstruction(language),
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        focus: { type: Type.STRING },
                        moon: { type: Type.STRING },
                        card: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                message: { type: Type.STRING },
                            },
                        },
                    },
                },
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating daily dashboard:", error);
        throw new Error("Failed.");
  }
};

export const generateDreamInterpretation = async (dream: string, birthData: BirthData, language: Language): Promise<string> => {
    const userPrompt = `Interpret dream: "${dream}". Birth Date: ${birthData.date}. Language: ${getLanguageName(language)}. Insightful tone.`;
    try {
        const response = await ai.models.generateContent({
            model: flashModel,
            contents: userPrompt,
            config: { systemInstruction: getBaseSystemInstruction(language) },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating dream interpretation:", error);
        throw new Error("Failed.");
    }
};

export const generateVocationalReport = async (birthData: BirthData, language: Language): Promise<string> => {
    const userPrompt = `Vocational astrology report for ${birthData.date}. Language: ${getLanguageName(language)}. Sections: Strengths, Work Environments, Challenges, Ultimate Calling.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating vocational report:", error);
        throw new Error("Failed.");
    }
};

export const generateCosmicCodex = async (language: Language): Promise<string> => {
    const userPrompt = `Glossary of astrology terms (Sun, Moon, etc.). Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: flashModel,
            contents: userPrompt,
            config: { systemInstruction: getBaseSystemInstruction(language) },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating cosmic codex:", error);
        throw new Error("Failed.");
    }
};

export const generateCognitiveProfile = async (profile: CognitiveProfile, language: Language): Promise<string> => {
    const userPrompt = `Psychometric report for MBTI:${profile.mbti}, Enneagram:${profile.enneagram}, OCEAN:${JSON.stringify(profile.ocean)}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: {
                systemInstruction: getBaseSystemInstruction(language),
                temperature: 0.3,
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating cognitive profile:", error);
        throw new Error("Failed.");
    }
};

export const generateIntegralProfileAnalysis = async (scores: any, language: Language, translations: any): Promise<string> => {
    const userPrompt = `Integral NeuroEmotive Profile Analysis for scores: ${JSON.stringify(scores)}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                temperature: 0.4,
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating integral profile:", error);
        throw new Error("Failed.");
    }
};

export const generateFutureReading = async (data: BirthData, language: Language, year: number): Promise<string> => {
    const userPrompt = `Astrological forecast for ${year}. Date: ${data.date}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating future reading:", error);
        throw new Error("Failed.");
    }
};

export const generateCompatibilityReading = async (personA: BirthData, personB: BirthData, language: Language): Promise<string> => {
    const userPrompt = `Compatibility reading. Person A: ${personA.date}, Person B: ${personB.date}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating compatibility:", error);
        throw new Error("Failed.");
    }
};

export const generateDailyHoroscope = async (data: BirthData, language: Language): Promise<string> => {
    const userPrompt = `Daily horoscope for ${data.date}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: flashModel,
            contents: userPrompt,
            config: { systemInstruction: getBaseSystemInstruction(language) },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating daily horoscope:", error);
        throw new Error("Failed.");
    }
};

export const generateFutureEvents = async (data: BirthData, language: Language): Promise<string> => {
    const userPrompt = `List of astrological events for next 30 days. Date: ${data.date}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating future events:", error);
        throw new Error("Failed.");
    }
};

export const generateAboutAstrology = async (language: Language): Promise<string> => {
    const userPrompt = `
    GENEREAZĂ UN TRATAT COMPLET: "Despre Astrologie și Sistemele Integrate ASTROVERSE".
    LIMBA DE RĂSPUNS: ${getLanguageName(language)}.

    OBIECTIV:
    Oferă o prezentare vastă, academică și interdisciplinară care explică fundamentele tuturor sistemelor astrologice integrate în platformă.
    Textul trebuie să fie fix, de referință, educativ și sofisticat.

    STRUCTURĂ OBLIGATORIE ȘI DETALIATĂ:

    # 🏛️ Astrologie și Sisteme de Cunoaștere: O Sinteză Epistemologică

    ## 1. 🌌 Astrologia Occidentală (Sistemul Tropical)
    *   **Definiție**: Relația dintre Soare și anotimpuri (Echinocții/Solstiții).
    *   **Componente Cheie**:
        - **Zodiacul**: Cele 12 arhetipuri psihologice.
        - **Casele**: Cele 12 domenii de experiență umană.
        - **Aspectele**: Geometria sacră (trigoane, cuadraturi) care definește fluxul energetic.
        - **Dominante Planetare**: Forțele care guvernează harta natală.
    *   **Rol în AstroVerse**: Oferă planul psihologic de bază și structura ego-ului.

    ## 2. 🕉️ Astrologia Vedică (Jyotisha - "Știința Luminii")
    *   **Diferența Fundamentală**: Utilizează Zodiacul Sideral (bazat pe constelații reale), care este decalat cu aprox. 24° față de cel Tropical.
    *   **Concepte Unice**:
        - **Nakshatre**: Cele 27 de conace lunare care oferă o precizie emoțională extremă.
        - **Dasha**: Sistemul perioadelor planetare care prezice *când* se vor activa anumite evenimente.
        - **Karma**: Analiza datoriilor spirituale și a drumului sufletului.
    *   **Rol în AstroVerse**: Oferă perspectiva spirituală, destinul sufletului și calendarul evenimentelor majore.

    ## 3. 🐉 Astrologia Chinezescă (BaZi - Cei Patru Piloni)
    *   **Fundament**: Calendarul Lunisolar și fluxul Qi-ului.
    *   **Structura**:
        - **Cei 4 Piloni**: Anul (social), Luna (interioară), Ziua (sinele adevărat/Day Master), Ora (secretă).
        - **Cele 5 Elemente**: Lemn, Foc, Pământ, Metal, Apă și ciclurile lor (Generare vs. Distrugere).
        - **Yin & Yang**: Polaritatea fundamentală a energiei.
    *   **Rol în AstroVerse**: Analiza constituției energetice, a norocului ciclic și a dinamicii relaționale subtile.

    ## 4. 🔱 Sisteme Arhetipale Extinse & Mitologice
    *   **Ophiuchus (Al 13-lea Semn)**:
        - Integrarea constelației reale pe ecliptică (30 Nov - 17 Dec).
        - Arhetipul Vindecătorului și al Transmutării.
    *   **Zodiacul Celtic (Arboricol)**:
        - Conexiunea druidică cu natura și ciclurile vegetale (13 luni lunare).
        - Arhetipuri bazate pe spiritul copacilor (ex: Stejar, Salcie).
    *   **Rol în AstroVerse**: Conectarea omului cu ritmurile naturale și cu arhetipuri uitate, oferind o identitate mai fluidă.

    ## 5. 🌈 Astrologie Energetică & Biofizică
    *   **Aliniere Energetică**:
        - Corespondențe între frecvențele planetare și spectrul vizibil (Culori).
        - Rezonanța structurilor cristaline (Minerale) cu biocampul uman.
    *   **Bioritmuri**:
        - Modelarea matematică a ciclurilor sinusoidale naturale: Fizic (23 zile), Emoțional (28 zile), Intelectual (33 zile).
    *   **Rol în AstroVerse**: Optimizarea stării de bine zilnice prin sincronizare vibrațională.

    ## 6. ✨ Astronomie Observațională (Astro View)
    *   **Știința din Spatele Simbolului**:
        - Utilizarea efemeridelor NASA/JPL pentru poziții precise.
        - Diferența dintre "Semn" (simbol, 30°) și "Constelație" (grupare stelară inegală).
    *   **Rol în AstroVerse**: Ancorarea interpretărilor simbolice în realitatea fizică a cosmosului.

    ## 7. 🧭 Integrare Interdisciplinară: De ce AstroVerse?
    *   **Sinteza**: Niciun sistem nu deține adevărul absolut. Suprapunerea lor oferă o "hologramă" completă a individului.
    *   **Abordarea**: De la psihologia jungiană (Occidental) la karma (Vedic) și bioenergie (Chinezesc/Bioritmuri).
    *   **Beneficiul Utilizatorului**: Trecerea de la simpla "ghicire" la un instrument complex de autocunoaștere, planificare strategică și evoluție conștientă.

    ---
    *Acest text servește drept bază teoretică pentru toate modulele aplicației.*
    `;

    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating about astrology:", error);
        throw new Error("Failed.");
    }
};

export const generateMythology = async (data: BirthData, language: Language): Promise<string> => {
    const userPrompt = `Mythology for zodiac sign of ${data.date}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: flashModel,
            contents: userPrompt,
            config: { systemInstruction: getBaseSystemInstruction(language) },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating mythology:", error);
        throw new Error("Failed.");
    }
};

export const generateDecisionMatrixReport = async (profile: CognitiveProfile, decision: string, language: Language): Promise<string> => {
    const userPrompt = `Decision Matrix Report. Decision: ${decision}. Profile: ${JSON.stringify(profile)}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating decision matrix:", error);
        throw new Error("Failed.");
    }
};

export const generateAcademyLesson = async (lessonTitle: string, language: Language): Promise<string> => {
    const userPrompt = `Generate a comprehensive, academic, yet accessible educational lesson for the astrology topic: "${lessonTitle}".
    
    Language: ${getLanguageName(language)}.
    
    Structure:
    1. **Introduction**: Brief definition and significance.
    2. **Core Concepts**: Detailed explanation of the mechanics.
    3. **Interpretation**: How this applies to a natal chart or daily life.
    4. **Key Takeaways**: Bullet points summarizing the lesson.
    
    Tone: Professional, educational, inspiring. Avoid fluff.`;

    try {
        const response = await ai.models.generateContent({
            model: proModel, // Upgraded model for better educational content
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating lesson:", error);
        throw new Error("Failed.");
    }
};

export const generateNumerologyReport = async (fullName: string, dob: string, language: Language): Promise<string> => {
    const userPrompt = `Numerology report for ${fullName}, DOB: ${dob}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating numerology:", error);
        throw new Error("Failed.");
    }
};

export const generateTarotReading = async (question: string, cards: any[], language: Language): Promise<string> => {
    const userPrompt = `Tarot reading. Question: ${question}. Cards: ${JSON.stringify(cards)}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating tarot:", error);
        throw new Error("Failed.");
    }
};

export const generateCelticCrossReading = async (question: string, cards: any[], language: Language): Promise<string> => {
    const userPrompt = `Celtic Cross Tarot reading. Question: ${question}. Cards: ${JSON.stringify(cards)}. Language: ${getLanguageName(language)}.`;
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating celtic cross:", error);
        throw new Error("Failed.");
    }
};

export const generateLunarGuide = async (language: Language, t: TranslationSet): Promise<any> => {
    const userPrompt = `Daily Lunar Guide JSON. Language: ${getLanguageName(language)}. Schema: phaseName, illuminationPercentage, suggestion. Ensure the suggestion is poetic and profound.`;
    try {
        const response = await ai.models.generateContent({
            model: flashModel,
            contents: userPrompt,
            config: {
                systemInstruction: getBaseSystemInstruction(language),
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        phaseName: { type: Type.STRING },
                        illuminationPercentage: { type: Type.INTEGER },
                        suggestion: { type: Type.STRING },
                    },
                },
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating lunar guide:", error);
        throw new Error("Failed.");
    }
};

export const generateImageWithPrompt = async (prompt: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9"): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: { aspectRatio: aspectRatio }
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data returned from Nano Banana model.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed.");
    }
};

export const editImageWithPrompt = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data in response");
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed.");
    }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to communicate with the Gemini API for speech generation.");
    }
};

export const generateConstellationData = async (constellation: string, language: Language): Promise<any> => {
    const userPrompt = `Generați date pentru constelația: ${constellation}`;
    const systemInstruction = `
Ești "Astro View ✨", motorul central de inteligență al aplicației premium AstroVerse.
Rolul tău este să generezi conținut de nivel editorial și artistic despre constelații.

REGULI STRICTE DE LIMBĂ:
- Toate câmpurile de text (nume, descrieri, mituri, explicații) TREBUIE să fie în limba: **${getLanguageName(language)}**.
- NU amesteca limbile. Dacă limba cerută este Română, totul trebuie să fie adaptat cultural.
- Singura excepție este \`prompt_grafic_premium\`, care trebuie să rămână în ENGLEZĂ.

Obiectivul tău este dublu:
1. EDUCAȚIE PREMIUM: Să oferi date astronomice precise, verificate, combinate cu istorie culturală profundă.
2. MONETIZARE VIZUALĂ: Să construiești un prompt de generare a imaginii (Text-to-Image) extrem de sofisticat.
    `;

    try {
        const response = await ai.models.generateContent({
            model: flashModel, // Switch to flash for stability
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        meta_info: {
                            type: Type.OBJECT,
                            properties: {
                                modul: { type: Type.STRING },
                                versiune_api: { type: Type.STRING },
                                status_generare: { type: Type.STRING }
                            }
                        },
                        identitate_constelatie: {
                            type: Type.OBJECT,
                            properties: {
                                nume_oficial: { type: Type.STRING },
                                clasificare_iau: { type: Type.STRING },
                                simbol_emoji: { type: Type.STRING },
                                tipologie: { type: Type.STRING },
                                ranking_dimensiune: { type: Type.STRING }
                            }
                        },
                        astrologie_si_arhetip: {
                            type: Type.OBJECT,
                            properties: {
                                este_zodie: { type: Type.BOOLEAN },
                                element: { type: Type.STRING },
                                polaritate: { type: Type.STRING },
                                casa_asociata: { type: Type.STRING },
                                planeta_guvernatoare: { type: Type.STRING },
                                cuvinte_cheie_arhetip: { type: Type.STRING }
                            }
                        },
                        ghid_observare_pro: {
                            type: Type.OBJECT,
                            properties: {
                                sezon_optim_nord: { type: Type.STRING },
                                fereastra_vizibilitate: { type: Type.STRING },
                                ascensie_dreapta_ra: { type: Type.STRING },
                                declinatie_dec: { type: Type.STRING },
                                suprafata_grade: { type: Type.STRING },
                                moment_optim_vizibilitate: { type: Type.STRING },
                                navigare_stelara: { type: Type.STRING },
                                grad_dificultate: { type: Type.STRING }
                            }
                        },
                        corpuri_celesti_exlcusive: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    nume: { type: Type.STRING },
                                    distinctie: { type: Type.STRING },
                                    magnitudine: { type: Type.STRING },
                                    tip_spectral: { type: Type.STRING },
                                    distanta: { type: Type.STRING },
                                    culoare_vizuala: { type: Type.STRING }
                                }
                            }
                        },
                        context_narativ: {
                            type: Type.OBJECT,
                            properties: {
                                mitul_fondator: { type: Type.STRING },
                                fact_box_premium: { type: Type.STRING },
                                astrofizica_explicata: { type: Type.STRING },
                                aliniere_personala: { type: Type.STRING }
                            }
                        },
                        assets_monetizare: {
                            type: Type.OBJECT,
                            properties: {
                                descriere_imagine_galerie: { type: Type.STRING },
                                prompt_grafic_premium: { type: Type.STRING }
                            }
                        }
                    }
                }
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating constellation data:", error);
        throw new Error("Failed to generate constellation data.");
    }
};

export const generateChineseForecast = async (data: BirthData, language: Language): Promise<string> => {
    // NEW: Dynamically determine the current year
    const today = new Date();
    const currentYear = today.getFullYear();

    const userPrompt = `
    Analyze the user's birth data for a full BaZi (Four Pillars) Chinese Astrology reading:
    - Birth Date: ${data.date}
    - Birth Time: ${data.time || "Unknown"}
    - Birth Location: ${data.location || "Unknown"} (used for solar time correction if possible, otherwise ignore)

    Current System Context:
    - Today's Date: ${today.toISOString().split('T')[0]}
    - **CURRENT PREDICTION YEAR: ${currentYear}**

    INSTRUCTIONS:
    Generate a detailed, structured Chinese Zodiac and BaZi report in ${getLanguageName(language)}.
    You MUST detect the current year (${currentYear}) and base all "Current Year" predictions on it. DO NOT use old years.

    Follow this EXACT structure:

    # 🏮 Analiza Zodiacală Chinezescă Completă (BaZi)

    ## A. Prezentare Generală: [Animalul Anului]
    - **Istorie și Simbolistică**: [Brief history]
    - **Elementul de Bază (Fix)**: [Element] + [Personality nuance]
    - **Puncte Forte**: [List]
    - **Puncte Slabe**: [List]
    - **Compatibilitate**: [Best matches & conflicts]
    - **Profesii Potrivite**: [List]
    - **Stil de Viață**: [Social behavior]

    ## B. Pilonul Anului (Zodia Principală)
    - **Personalitate Specifică**: [Analysis of the birth year animal]
    - **Influența Elementului Anului**: [Impact of birth year element]
    - **Energie Vitală**: [Temperament]
    - **Drumul în Viață**: [Destiny path]

    ## C. Pilonul Lunii (Animalul Interior)
    - **Temperament Interior**: [Inner self analysis]
    - **Emoții și Iubire**: [How they process feelings]
    - **Motivații Ascunse**: [Psychological drivers]

    ## D. Pilonul Zilei (Maestrul Zilei / Day Master)
    - **Elementul Personal (Day Master)**: [Identity the Day Master Element]
    - **Esența Adevărată**: [The true inner self]
    - **Puncte Forte/Slabe**: [Specific to day master]
    - **Impact în Relații și Carieră**: [Analysis]

    ${data.time ? `## E. Pilonul Orei (Destinul Secret)\n- **Talente Ascunse**: [Based on birth hour]\n- **Potențial Neexplorat**: [Analysis]` : ''}

    ## 🐉 Previziuni pentru Anul ${currentYear} (Anul [Calculate Animal of ${currentYear}] de [Calculate Element of ${currentYear}])
    - **Energia Anului ${currentYear}**: [General vibe of the year]
    - **Influența asupra Zodiei Tale**: [Specific impact]
    - **Provocări și Oportunități**: [Analysis]
    - **Viața Profesională**: [Forecast]
    - **Viața Amoroasă**: [Forecast]
    - **Sănătate**: [General advice]
    - **Bani și Prosperitate**: [Forecast]
    - **Lecția Karmică a Anului**: [Spiritual lesson]
    - **Strategie**: [Ce să atragi / Ce să eviți]

    ## ✨ Elementele Tale Norocoase
    - **Numere Norocoase**: [List]
    - **Culori Norocoase**: [List]
    - **Direcții Favorabile**: [Compass directions]
    - **Pietre/Cristale Recomandate**: [Spiritual recommendation]
    - **Mesaj Inspirațional**: [A final quote or wisdom for the user]

    Use markdown formatting (##, **, -).
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating Chinese forecast:", error);
        throw new Error("Failed to generate forecast.");
    }
};

export const generateExtendedProfile = async (data: BirthData, language: Language, rashi: string, tree: string, isOphiuchus: boolean): Promise<string> => {
    const userPrompt = `
    GENEREAZĂ UN PROFIL ASTROLOGIC-ARHETIPAL EXTINS ÎN 3 SISTEME PENTRU:
    - Data Nașterii: ${data.date}
    - Ora: ${data.time || "N/A"}
    - Locație: ${data.location || "N/A"}
    
    DATE CALCULATE PRELIMINAR (GHIDARE):
    - Rashi Vedic (Sideral): ${rashi}
    - Zodiac Arboricol (Celtic): ${tree}
    - Status Ophiuchus: ${isOphiuchus ? "POZITIV (Este Ophiuchus)" : "Negativ (Nu este Ophiuchus)"}

    URMEAZĂ ACEST FORMAT STRICT ȘI TON AUTORITAR DAR EMPATIC. FOLOSEȘTE EMOJI.
    Limba de răspuns: ${getLanguageName(language)}.

    # 🔱 Profilul Tău Arhetipal Extins: Dincolo de Zodiacul Vestic

    ## 🕉️ SISTEMUL 1 — ASTROLOGIA VEDICĂ (JYOTISH)
    ### 🔹 Secțiunea 1: Bazele, Metodologia și Contextul Istoric
    *Definirea Jyotish ca „Știința Luminii”. Explică diferența Ayanamsha (de ce semnul lor diferă sideral). Explică importanța Lunii (Chandra) ca bază a Rashi-ului.*

    ### 🔹 Secțiunea 2: Analiza Rashi-ului Tău: ${rashi}
    * **Structura Tehnică**:
      - **Nakshatra**: [Identifică Nakshatra Lunii]
      - **Planeta Guvernatoare**: [Planeta și semnificația ei]
      - **Element (Tattva)**: [Agni/Vayu/Prithvi/Jala]
      - **Guna**: [Sattva/Rajas/Tamas și ce înseamnă pentru temperament]
    * **Arhetip Psihologic**: [Puncte forte & umbre profunde]
    * **Lecția Karmică**: [O frază clară, profundă despre datoria sufletului]
    * **Direcții Profesionale**: [Roluri care amplifică potențialul dharmic]
    * **Sănătate & Echilibrare**: [Practici ayurvedice/mentale utile specifice Rashi-ului]

    ### 🔹 Secțiunea 3: Dashas, Bhuktis & Timpul Sideral
    *Explică Maha Dasha și Bhukti. Oferă un ghid utilitar: „Cum să navighezi în Dasha ta actuală” (mindset, teme, capcane, oportunități).*

    ## 🌳 SISTEMUL 2 — ZODIACUL ARBORICOL (CELTIC / DRUIDIC)
    ### 🔹 Secțiunea 1: Context Istoric & Ogham
    *Originea în tradiția druidică. Ogham = alfabetul arborilor.*

    ### 🔹 Secțiunea 2: Profilul Tău Arboricol: ${tree}
    * **Personalitate Arhetipală**: [Bazat pe mitologie și ecologie]
    * **Funcție Ecologică**: [Rolul arborelui în natură reflectat în psyche-ul uman]
    * **Puncte de Putere & Umbre**: [Analiză]
    * **Compatibilități Ecosistemice**: [Ce semne-arbori sunt compatibile, unde există fricțiuni și de ce]
    * **Practică de Reechilibrare**: [Ritual, meditație sau exercițiu în natură specific arborelui]
    * **Mini-secțiune**: „Cum să-ți accesezi Arborele Interior”

    ## 🐍 SISTEMUL 3 — OPHIUCHUS (AL 13-LEA SEMN SIDERAL)
    ### 🔹 Secțiunea 1: Context Astronomic
    *Explică Ophiuchus, confuzia NASA vs. Astrologie și tranzitul real al Soarelui (29 Nov - 17 Dec).*

    ### 🔹 Secțiunea 2: ${isOphiuchus ? "PROFIL OPHIUCHUS ACTIVAT — Arhetipul Vindecătorului" : "Analiza potențialului Ophiuchus (Nu ești Ophiuchus, dar poți accesa energia)"}
    * **Harta Arhetipală**:
        - **Cuvânt-Cheie**: [Un cuvânt definitoriu]
        - **Umbra**: [Aspectul negativ sau provocarea]
        - **Darul**: [Talentul unic]
        - **Animal Arhetipal**: [Animalul simbolic asociat]
    * **Trăsături Psihologice**: [Profunde și transformatoare]
    * **Misiunea Arhetipală**: [Transformare, adevăr, integrarea luminii și întunericului]
    * **Rol în Evoluție**: [How această energie la creșterea spirituală]

    ### 🔹 Secțiunea 3: Relațiile Inter-Arhetipale
    *Analiză sincretică: Cum interacționează Rashi-ul tău (${rashi}) + Arborele (${tree}) + influența Ophiuchus în:*
    - **Relații**: [Dinamică afectivă]
    - **Carieră**: [Mod de lucru]
    - **Conflict**: [Cum reacționezi]
    - **Decizii Dificile**: [Mecanismul decizional]

    ### 🔹 Secțiunea 4: Analiză Comparativă „Eu Vestic vs. Eu Astronomic”
    *Cum se schimbă percepția identității tale prin prisma acestui sistem tripartit.*

    ## 🔱 SINTEZĂ — ARHITECTURA ENERGETICĂ A PERSONALITĂȚII TALE
    ### Recomandări Practice pentru ${rashi}
    *Focus pe limite, autonomie și specificul zodiei. Include „Meditația pe Balanța Interioară” (sau echivalentul specific zodiei).*

    ### Plan de Acțiune Concret
    1.  **Plan în 3 pași**: [Trei acțiuni imediate pentru aliniere]
    2.  **Ritual**: [Un ritual simplu de seară sau dimineață]
    3.  **Jurnal**: [3 întrebări de reflecție profundă]
    4.  **Stil de Viață**: [O schimbare mică cu impact mare]

    ### ⚠️ Riscuri și Capcane ale Arhetipului
    *Ce trebuie evitat și de ce (ex. evitarea conflictelor, dependența de feedback, supra-analiza).*

    ### 🔮 Concluzie Poetică
    *O încheiere mistică, simbolică și memorabilă, ca un mic ritual de închidere.*

    ### 📚 Index Arhetipal
    * **${rashi}**: [Frază-rezumat]
    * **${tree}**: [Frază-rezumat]
    * **Ophiuchus**: [Frază-rezumat]

    ---
    *Acest profil este generat folosind calcule siderale și naturale avansate pentru a oferi o perspectivă completă asupra Sinelui.*
    `;

    try {
        const response = await ai.models.generateContent({
            model: proModel,
            contents: userPrompt,
            config: { 
                systemInstruction: getBaseSystemInstruction(language),
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating extended profile:", error);
        throw new Error("Failed to generate profile.");
    }
};
