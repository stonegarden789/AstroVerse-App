
import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../constants';
import type { User } from '../types';
import { sendSystemEmail, verifyToken } from '../services/emailProxyService';
import { Spinner } from './Spinner';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: User, source?: 'SIGN_IN' | 'VERIFIED') => void;
}

type AuthView = 'signIn' | 'signUp' | 'forgotPassword' | 'pendingVerification' | 'resetLinkSent' | 'resetPassword' | 'resetSuccess';

// Mock User database
interface MockUser {
    email: string;
    // In a real app, this would be a secure hash
    passwordHash: string; 
    isActive: boolean;
}

const EyeIcon: React.FC<{ visible: boolean }> = ({ visible }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {visible ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
        )}
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

const mockHash = (str: string) => btoa(str);

// SIMULATED DATABASE
// Moved outside to persist across re-renders
const mockUsersDB: MockUser[] = [
    { email: 'user@astroverse.uk', passwordHash: mockHash('password123'), isActive: true }
];

const PasswordStrengthMeter: React.FC<{ password?: string }> = ({ password = '' }) => {
    const { language } = useLanguage();
    const t = translations[language].authModal;

    const getStrength = useMemo(() => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    const strength = getStrength;
    const strengthText = [t.passwordStrength.weak, t.passwordStrength.weak, t.passwordStrength.medium, t.passwordStrength.strong, t.passwordStrength.veryStrong][strength];
    const color = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength];
    const width = `${(strength / 4) * 100}%`;

    const requirements = [
        { key: 'length', met: password.length >= 8 },
        { key: 'uppercase', met: /[A-Z]/.test(password) },
        { key: 'number', met: /[0-9]/.test(password) },
        { key: 'symbol', met: /[^A-Za-z0-9]/.test(password) },
    ];

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-300">{t.passwordStrength.title}</p>
                <p className={`text-sm font-bold ${['text-red-400', 'text-red-400', 'text-yellow-400', 'text-blue-400', 'text-green-400'][strength]}`}>{strengthText}</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${color}`} style={{ width }}></div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400 pt-1">
                {requirements.map(req => (
                    <div key={req.key} className={`flex items-center transition-colors ${req.met ? 'text-green-400' : ''}`}>
                         <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           {req.met ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />}
                        </svg>
                        {t.passwordRequirements[req.key as keyof typeof t.passwordRequirements]}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
    const { language } = useLanguage();
    const t = translations[language].authModal;
    
    // State for the entire modal
    const [view, setView] = useState<AuthView>('signIn');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeToken, setActiveToken] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        // Pre-fill email if previously remembered
        const savedEmail = localStorage.getItem('astroverse_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);
    
    const checkPasswordStrength = (pass: string) => {
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const handleGoogleSignIn = () => {
        setIsLoading(true);
        // Simulate Google Auth Delay
        setTimeout(() => {
            const googleUser: User = {
                name: "Google User",
                email: "google.user@example.com",
                tokens: 5,
                subscriptionTier: 'Free'
            };
            setIsLoading(false);
            onAuthSuccess(googleUser, 'SIGN_IN');
        }, 1500);
    };

    const handleFinalizeVerification = () => {
        if (!activeToken) return;
        const verificationData = verifyToken(activeToken);
        if (verificationData && verificationData.type === 'ACTIVATION') {
            const userIndex = mockUsersDB.findIndex(u => u.email === verificationData.email);
            if(userIndex > -1) mockUsersDB[userIndex].isActive = true;

            const authenticatedUser: User = { 
                email: verificationData.email, 
                name: verificationData.email.split('@')[0],
                tokens: 5,
                subscriptionTier: 'Free'
            };
            setActiveToken(null);
            onAuthSuccess(authenticatedUser, 'VERIFIED');
        } else {
            setError("Invalid or expired verification link.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const trimmedEmail = email.trim();

        // Use a mock key if env is missing to allow testing in all environments
        const emailProxyKey = process.env.EMAIL_PROXY_KEY || "TEST_KEY";

        try {
            switch (view) {
                case 'signIn':
                    if (!trimmedEmail || !password) {
                        setError(t.signInError);
                        setIsLoading(false);
                        return;
                    }
                    const user = mockUsersDB.find(u => u.email === trimmedEmail);
                    
                    // Simple hash check simulation
                    if (user && user.passwordHash === mockHash(password)) {
                        if (!user.isActive) {
                            setError(t.inactiveUserError);
                            // Resend activation
                            const token = await sendSystemEmail(trimmedEmail, 'ACTIVATION', emailProxyKey);
                            setActiveToken(token);
                            setView('pendingVerification');
                            return;
                        }
                        const authenticatedUser: User = { 
                            email: user.email, 
                            name: user.email.split('@')[0],
                            tokens: 5,
                            subscriptionTier: 'Free'
                        };
                        
                        if (rememberMe) {
                            localStorage.setItem('astroverse_user', JSON.stringify(authenticatedUser));
                            localStorage.setItem('astroverse_email', trimmedEmail);
                        } else {
                             // Don't clear astroverse_email if we unchecked remember me, just don't save the full user session
                             // But request says "remember password and mail", so we treat them as a unit here for simplicity
                             localStorage.removeItem('astroverse_user');
                             if (!rememberMe) localStorage.removeItem('astroverse_email');
                        }
                        
                        onAuthSuccess(authenticatedUser, 'SIGN_IN');
                    } else {
                        // For testing purposes, if user doesn't exist, create one implicitly or show error
                        // Here we strict check
                        setError(t.signInError);
                    }
                    break;
                case 'signUp':
                    if (!trimmedEmail || !password || !confirmPassword) return;
                    if (mockUsersDB.some(u => u.email === trimmedEmail)) {
                        setError(t.userExistsError);
                        return;
                    }
                    if (password !== confirmPassword) {
                        setError(t.passwordsDoNotMatch);
                        return;
                    }
                    if (checkPasswordStrength(password) < 3) {
                         setError("Password is not strong enough. Use mix of chars/nums/symbols."); 
                         return;
                    }
                    
                    mockUsersDB.push({ email: trimmedEmail, passwordHash: mockHash(password), isActive: false });
                    
                    const token = await sendSystemEmail(trimmedEmail, 'ACTIVATION', emailProxyKey);
                    setActiveToken(token);
                    setView('pendingVerification');
                    break;
                case 'forgotPassword':
                    if (trimmedEmail) {
                        const userExists = mockUsersDB.some(u => u.email === trimmedEmail);
                        if (userExists) {
                            const token = await sendSystemEmail(trimmedEmail, 'RESET', emailProxyKey);
                            setActiveToken(token);
                        }
                        // Always show sent to prevent enumeration
                        setView('resetLinkSent');
                    }
                    break;
                case 'resetPassword':
                     if (password !== confirmPassword) {
                        setError(t.passwordsDoNotMatch);
                        return;
                    }
                     if (checkPasswordStrength(password) < 3) {
                         setError("New password is not strong enough.");
                         return;
                    }
                    const userToUpdate = mockUsersDB.find(u => u.email === trimmedEmail);
                    if (userToUpdate) {
                        userToUpdate.passwordHash = mockHash(password);
                    }
                    setView('resetSuccess');
                    break;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const changeView = (newView: AuthView) => {
        const keepEmail = (view === 'signIn' && (newView === 'signUp' || newView === 'forgotPassword'));
        setView(newView);
        if (!keepEmail) {
            setEmail('');
        }
        setPassword('');
        setConfirmPassword('');
        setError(null);
        setIsPasswordVisible(false);
        setIsConfirmPasswordVisible(false);
    };
    
    const getTitle = () => {
        switch(view) {
            case 'signIn': return t.title;
            case 'signUp': return t.signUpTitle;
            case 'forgotPassword': return t.forgotPasswordTitle;
            case 'pendingVerification': return t.pendingVerification.title;
            case 'resetLinkSent': return t.resetLinkSent.title;
            case 'resetPassword': return t.resetPassword.title;
            case 'resetSuccess': return t.resetPassword.successTitle;
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-48"><Spinner /></div>
        }

        switch (view) {
            case 'pendingVerification':
                return (
                    <div className="space-y-6 text-center">
                        <p className="text-gray-300">{t.pendingVerification.message(email.trim())}</p>
                        <p className="text-xs text-gray-400">{t.pendingVerification.simulationNotice}</p>
                        <button onClick={handleFinalizeVerification} className="w-full button-primary py-3">
                            {t.pendingVerification.verificationLink}
                        </button>
                    </div>
                );
            
            case 'resetLinkSent':
                return (
                     <div className="space-y-6 text-center">
                        <p className="text-gray-300">{t.resetLinkSent.message}</p>
                        <p className="text-xs text-gray-400">{t.resetLinkSent.simulationNotice}</p>
                        <button onClick={() => {
                            if (!activeToken) return;
                            const resetData = verifyToken(activeToken);
                            if (resetData && resetData.type === 'RESET') {
                                setEmail(resetData.email); // Ensure email is set for the reset form
                                setView('resetPassword');
                            } else {
                                 setError("Invalid or expired reset link.");
                                 setView('forgotPassword');
                            }
                        }} className="w-full button-primary py-3">
                            {t.resetLinkSent.resetLink}
                        </button>
                    </div>
                )

            case 'forgotPassword':
                return (
                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                             {error && <p className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded-md">{error}</p>}
                            <p className="text-sm text-gray-400">{t.forgotPasswordInstructions}</p>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">{t.emailLabel}</label>
                                <input
                                    type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all placeholder-gray-500"
                                />
                            </div>
                            <button type="submit" className="w-full button-primary py-3">{t.sendResetLinkButton}</button>
                        </form>
                        <div className="text-center text-sm">
                            <button onClick={() => changeView('signIn')} className="text-violet-400 hover:text-violet-300 transition-colors bg-transparent border-none">{t.backToSignInLink}</button>
                        </div>
                    </div>
                );
            
            case 'resetPassword':
                return (
                     <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-sm text-gray-400">{t.resetPassword.instructions}</p>
                             {error && <p className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded-md">{error}</p>}
                             <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">{t.resetPassword.newPasswordLabel}</label>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                    className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all"
                                />
                                <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-3 top-9 text-gray-400 hover:text-white"><EyeIcon visible={isPasswordVisible} /></button>
                            </div>
                             <div className="relative">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">{t.confirmPasswordLabel}</label>
                                <input
                                    type={isConfirmPasswordVisible ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                    className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all"
                                />
                                <button type="button" onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className="absolute right-3 top-9 text-gray-400 hover:text-white"><EyeIcon visible={isConfirmPasswordVisible} /></button>
                            </div>
                            <PasswordStrengthMeter password={password} />
                            <button type="submit" className="w-full button-primary py-3">{t.resetPassword.button}</button>
                        </form>
                    </div>
                );
            
            case 'resetSuccess':
                return (
                     <div className="space-y-6 text-center">
                        <p className="text-gray-300">{t.resetPassword.successMessage}</p>
                        <button onClick={() => changeView('signIn')} className="w-full button-primary py-3">
                            {t.signInButton}
                        </button>
                    </div>
                );

            case 'signIn':
            case 'signUp':
                return (
                    <div className="space-y-6">
                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            <GoogleIcon />
                            Sign in with Google
                        </button>

                        <div className="flex items-center gap-4">
                            <hr className="flex-grow border-t border-gray-700" />
                            <span className="text-gray-500 text-sm">OR</span>
                            <hr className="flex-grow border-t border-gray-700" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {error && <p className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded-md">{error}</p>}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">{t.emailLabel}</label>
                                <input
                                    type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all"
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">{t.passwordLabel}</label>
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                    className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all"
                                />
                                <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-3 top-9 text-gray-400 hover:text-white"><EyeIcon visible={isPasswordVisible} /></button>
                            </div>
                            {view === 'signUp' && (
                                <>
                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">{t.confirmPasswordLabel}</label>
                                    <input
                                        type={isConfirmPasswordVisible ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                        className="w-full bg-gray-900/50 border border-violet-800/50 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 outline-none transition-all"
                                    />
                                    <button type="button" onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className="absolute right-3 top-9 text-gray-400 hover:text-white"><EyeIcon visible={isConfirmPasswordVisible} /></button>
                                </div>
                                <PasswordStrengthMeter password={password} />
                                </>
                            )}
                            
                            {view === 'signIn' && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-violet-600 focus:ring-violet-500"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                         <button type="button" onClick={() => changeView('forgotPassword')} className="text-violet-400 hover:text-violet-300 transition-colors bg-transparent border-none">{t.forgotPasswordLink}</button>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="w-full button-primary py-3">
                                {view === 'signIn' ? t.signInButton : t.signUpButton}
                            </button>
                        </form>

                        <div className="text-center text-sm">
                            {view === 'signIn' ? (
                                <button onClick={() => changeView('signUp')} className="text-violet-400 hover:text-violet-300 transition-colors bg-transparent border-none">{t.createAccountLink}</button>
                            ) : (
                                <button onClick={() => changeView('signIn')} className="text-violet-400 hover:text-violet-300 transition-colors bg-transparent border-none">{t.signInLink}</button>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="card-base w-full max-w-sm rounded-2xl p-6 sm:p-8 space-y-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold celestial-title">{getTitle()}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};
