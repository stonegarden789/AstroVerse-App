import React, { useState, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations, MOCK_COMMUNITY_USERS } from '../constants';
import { Spinner } from './Spinner';

type View = 'onboarding' | 'profileSetup' | 'connectionsList';
type User = typeof MOCK_COMMUNITY_USERS[0];

const ZODIAC_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const LIFE_PATH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

const ZODIAC_ICONS: { [key: string]: string } = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

const ProfileCard: React.FC<{ user: User, onSendIntent: (user: User) => void }> = ({ user, onSendIntent }) => {
    const { language } = useLanguage();
    const t = translations[language].astroConnections.connectionsList;

    return (
        <div className="card-base p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="flex-shrink-0 text-5xl text-violet-300 bg-black/20 rounded-full h-20 w-20 flex items-center justify-center border-2 border-violet-800/50">
                {ZODIAC_ICONS[user.zodiac]}
            </div>
            <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-bold text-white">👤 {user.nickname}</h3>
                <div className="flex justify-center sm:justify-start gap-4 mt-1 text-sm text-gray-300">
                    <span><strong className="text-violet-300">♈️ Zodiac:</strong> {user.zodiac}</span>
                    <span><strong className="text-violet-300">🔢 Life Path:</strong> {user.lifePath}</span>
                </div>
                {user.bio && <p className="text-xs text-gray-400 mt-2 italic">"{user.bio}"</p>}
            </div>
            <button className="button-primary text-sm mt-2 sm:mt-0 flex items-center gap-2" onClick={() => onSendIntent(user)}>
                <span>✨</span> {t.sendIntentButton}
            </button>
        </div>
    );
}

// Comprehensive Emoji Picker Data
const EMOJI_CATEGORIES = {
    'Faces': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', 'kz', '😨', '😩', '🤯', '😭', '😤', '😠', '😡'],
    'Hands': ['👋', 'Qw', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    'Celestial': ['✨', '⭐️', '🌟', '💫', '⚡️', '☄️', '💥', '🔥', '🌈', '☀️', '🌤', '⛅️', '☁️', '🌦', '🌧', '⛈', '🌩', '🌨', '❄️', '☃️', '⛄️', '🌬', '💨', '🌪', '🌫', '☂️', '☔️', '💧', '💦', '🌊', '🌙', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌚', '🌝', '🌛', '🌜', '🌞'],
    'Love': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    'Zodiac': ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎'],
    'Objects': ['🔮', '🧿', '🕯', '🗝', '📿', '⚗️', '🔭', '📜', '🖊', '💎', '🏺', '🧘', '🧘‍♀️', '🧘‍♂️', '🕉', '☸️', '☯️', '✝️', '☦️', '☪️', '☮️', '🕎', '🔯'],
};

const EmojiPicker: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => {
    const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('Faces');

    return (
        <div className="bg-gray-800 rounded-lg p-2 mt-2 border border-violet-800/30">
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-700 mb-2 scrollbar-thin">
                {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as keyof typeof EMOJI_CATEGORIES)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${activeCategory === cat ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-8 gap-1 h-32 overflow-y-auto scrollbar-thin">
                {EMOJI_CATEGORIES[activeCategory].map((emoji) => (
                    <button
                        key={emoji}
                        onClick={() => onSelect(emoji)}
                        className="hover:bg-gray-700 rounded p-1 text-lg transition-colors"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

const IntentModal: React.FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => {
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSend = () => {
        setSent(true);
        setTimeout(onClose, 2000);
    };

    const addEmoji = (emoji: string) => setMessage(prev => prev + emoji);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="card-base max-w-md w-full p-6 rounded-2xl" onClick={e => e.stopPropagation()}>
                {!sent ? (
                    <>
                        <h3 className="text-xl font-bold celestial-title mb-4">Send Intent to {user.nickname}</h3>
                        <p className="text-sm text-gray-400 mb-4">Introduce yourself or share a cosmic vibration.</p>
                        
                        <div className="relative">
                            <textarea 
                                className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-violet-400 outline-none"
                                placeholder="Write your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="absolute bottom-3 right-3 text-gray-400 hover:text-yellow-400 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                        
                        {showEmojiPicker && <EmojiPicker onSelect={addEmoji} />}

                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={onClose} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
                            <button onClick={handleSend} disabled={!message.trim()} className="button-primary px-6 py-2">Send</button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold text-white">Intent Sent!</h3>
                        <p className="text-gray-400 mt-2">The stars are aligning...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AstroConnections: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].astroConnections;
    
    // In a real app, this would be fetched from a user's profile
    const [hasOptedIn, setHasOptedIn] = useState(false); 
    const [profile, setProfile] = useState<{ nickname: string; bio: string } | null>(null);

    const [view, setView] = useState<View>('onboarding');
    const [isLoading, setIsLoading] = useState(false);
    
    const [zodiacFilter, setZodiacFilter] = useState('all');
    const [lifePathFilter, setLifePathFilter] = useState('all');
    
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const filteredUsers = useMemo(() => {
        return MOCK_COMMUNITY_USERS.filter(user => {
            const zodiacMatch = zodiacFilter === 'all' || user.zodiac === zodiacFilter;
            const lifePathMatch = lifePathFilter === 'all' || user.lifePath === parseInt(lifePathFilter);
            return zodiacMatch && lifePathMatch;
        });
    }, [zodiacFilter, lifePathFilter]);


    const handleJoin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setHasOptedIn(true);
            setView('profileSetup');
            setIsLoading(false);
        }, 1000);
    };
    
    const handleSaveProfile = (nickname: string, bio: string) => {
        setIsLoading(true);
        setTimeout(() => {
            setProfile({ nickname, bio });
            setView('connectionsList');
            setIsLoading(false);
        }, 1000);
    };

    const renderOnboarding = () => (
        <div className="text-center animate-fade-in max-w-lg mx-auto">
            <h2 className="text-3xl font-bold celestial-title">{t.onboarding.title}</h2>
            <p className="text-gray-300 mt-2">{t.onboarding.subtitle}</p>
            <div className="card-base p-4 rounded-xl mt-6 text-sm text-gray-400">
                <p>{t.onboarding.privacy}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button onClick={handleJoin} className="button-primary w-full" disabled={isLoading}>
                    {isLoading ? <Spinner /> : t.onboarding.joinButton}
                </button>
                <button onClick={() => alert("You can join later from your profile settings.")} className="w-full text-gray-300 hover:text-white transition-colors">
                    {t.onboarding.declineButton}
                </button>
            </div>
        </div>
    );

    const ProfileSetupForm: React.FC = () => {
        const [nickname, setNickname] = useState('');
        const [bio, setBio] = useState('');
        
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if(nickname.trim()) {
                handleSaveProfile(nickname, bio);
            }
        };

        return (
            <div className="text-center animate-fade-in max-w-md mx-auto">
                <h2 className="text-3xl font-bold celestial-title">{t.profileSetup.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div>
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">{t.profileSetup.nicknameLabel}</label>
                        <input
                            type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required
                            placeholder={t.profileSetup.nicknamePlaceholder}
                            className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 outline-none"
                        />
                    </div>
                     <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">{t.profileSetup.bioLabel}</label>
                        <textarea
                            id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
                            placeholder={t.profileSetup.bioPlaceholder}
                            className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 outline-none resize-none"
                        />
                    </div>
                    <button type="submit" className="w-full button-primary py-3" disabled={isLoading || !nickname.trim()}>
                         {isLoading ? <Spinner /> : t.profileSetup.saveButton}
                    </button>
                </form>
            </div>
        );
    }
    
    const renderConnectionsList = () => (
        <div className="animate-fade-in w-full space-y-6">
            <h2 className="text-3xl font-bold celestial-title text-center">{t.connectionsList.title}</h2>
            
            <div className="card-base p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                     <label className="text-xs text-gray-400">{t.connectionsList.filterByZodiac}</label>
                     <select value={zodiacFilter} onChange={e => setZodiacFilter(e.target.value)} className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-violet-400 outline-none">
                        <option value="all">{t.connectionsList.allSigns}</option>
                        {ZODIAC_SIGNS.map(sign => <option key={sign} value={sign}>{sign}</option>)}
                     </select>
                </div>
                 <div className="flex-1 w-full">
                     <label className="text-xs text-gray-400">{t.connectionsList.filterByLifePath}</label>
                     <select value={lifePathFilter} onChange={e => setLifePathFilter(e.target.value)} className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-violet-400 outline-none">
                        <option value="all">{t.connectionsList.allPaths}</option>
                        {LIFE_PATH_NUMBERS.map(num => <option key={num} value={num}>{num}</option>)}
                     </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <ProfileCard 
                            key={user.id} 
                            user={user} 
                            onSendIntent={(u) => setSelectedUser(u)}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-400 py-8">No matching connections found.</p>
                )}
            </div>
        </div>
    );
    
    const getCurrentView = () => {
        if (!hasOptedIn) return 'onboarding';
        if (!profile) return 'profileSetup';
        return 'connectionsList';
    }
    
    const currentView = getCurrentView();

    return (
        <div className="card-base p-6 sm:p-8 rounded-2xl min-h-[70vh]">
            {currentView === 'onboarding' && renderOnboarding()}
            {currentView === 'profileSetup' && <ProfileSetupForm />}
            {currentView === 'connectionsList' && renderConnectionsList()}
            
            {selectedUser && (
                <IntentModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                />
            )}
        </div>
    );
};