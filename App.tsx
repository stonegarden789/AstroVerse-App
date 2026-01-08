
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { NatalChartDisplay } from './components/NatalChartDisplay';
import { AIFuture } from './components/AIFuture';
import { Compatibility } from './components/Compatibility';
import { DailyZodiac } from './components/DailyZodiac';
import { FeaturePage } from './components/FeaturePage';
import { ProfileSettings } from './components/ProfileSettings';
import { FutureEvents } from './components/FutureEvents';
import { AboutAstrology } from './components/AboutAstrology';
import { LegendsMythology } from './components/LegendsMythology';
import { AskTheOracle } from './components/AskTheOracle';
import { DreamInterpretation } from './components/DreamInterpretation';
import { VocationalReport } from './components/VocationalReport';
import { CosmicCodex } from './components/CosmicCodex';
import { CognitiveProfiler } from './components/CognitiveProfiler';
import { DecisionMatrix } from './components/DecisionMatrix';
import { AboutProject } from './components/AboutProject';
import { AstroAcademy } from './components/AstroAcademy';
import { IntegralNeuroEmotiveProfile } from './components/IntegralNeuroEmotiveProfile';
import { IntegralNumerology } from './components/IntegralNumerology';
import { TarotOracle } from './components/TarotOracle';
import { AstroConnections } from './components/AstroConnections';
import { FAQPage } from './components/FAQPage';
import { LoadingScreen } from './components/LoadingScreen';
import { AdBanner } from './components/AdBanner';
import { AuthModal } from './components/AuthModal';
import { AstroView } from './components/AstroView';
import { EnergeticAlignment } from './components/EnergeticAlignment';
import { BioRhythms } from './components/BioRhythms';
import { ChineseZodiac } from './components/ChineseZodiac';
import { ExtendedProfile } from './components/ExtendedProfile';
import { AstroStore } from './components/AstroStore';
import { StripeDebug } from './components/StripeDebug';
import { Toast } from './components/Toast';
import { useLanguage } from './hooks/useLanguage';
import type { BirthData, User, Comment, AppView, CognitiveProfile } from './types';
import { translations } from './constants';
import { MonetizationManager } from './utils/monetization';
import { saveUserData, getUserData, consumeUserTokens } from './utils/firebase';
import { TOKEN_COSTS } from './utils/tokenCosts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cognitiveProfile, setCognitiveProfile] = useState<CognitiveProfile | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'StarGazer22', rating: 5, text: 'This was so accurate, it gave me chills! Amazing app.' },
    { id: 2, author: 'LeoKing', rating: 4, text: 'Really insightful reading. The text-to-speech is a great feature.' },
  ]);
  const [error, setError] = useState<string | null>(null);
  const { language, setLanguage, setCurrency } = useLanguage(); 
  const t = translations[language];
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingBirthData, setPendingBirthData] = useState<{ data: BirthData, shouldSave: boolean } | null>(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('astroverse_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (typeof parsedUser.tokens !== 'number') parsedUser.tokens = 50; 
        setUser(parsedUser);
        
        if(parsedUser.email) {
            getUserData(parsedUser.email).then(remoteData => {
                if(remoteData) {
                    const merged = { ...parsedUser, ...remoteData };
                    setUser(merged);
                    if(merged.isPrimarySet && merged.birthDate) {
                        setBirthData({
                            date: merged.birthDate,
                            time: merged.birthTime || '',
                            location: merged.birthLocation || ''
                        });
                    }
                }
            });
        }
      } catch (e) {
        console.error("Failed to parse saved user");
        localStorage.removeItem('astroverse_user');
      }
    }
  }, []);

  useEffect(() => {
      if (user && user.isPrimarySet && user.birthDate && user.birthTime && user.birthLocation) {
          setBirthData({
              date: user.birthDate,
              time: user.birthTime,
              location: user.birthLocation
          });
      }
  }, [user]);

  useEffect(() => {
      if (user) {
          localStorage.setItem('astroverse_user', JSON.stringify(user));
      }
  }, [user]);

  const handleFormSubmit = async (data: BirthData, shouldSave: boolean) => {
    setIsLoading(true);
    setError(null);

    if (shouldSave) {
        if (user) {
            const updatedUser: User = {
                ...user,
                birthDate: data.date,
                birthTime: data.time,
                birthLocation: data.location,
                isPrimarySet: true
            };
            setUser(updatedUser);
            await saveUserData(user.email, {
                birthDate: data.date,
                birthTime: data.time,
                birthLocation: data.location,
                isPrimarySet: true
            });

        } else {
            setPendingBirthData({ data, shouldSave });
            setIsAuthModalOpen(true);
            setIsLoading(false);
            return; 
        }
    }

    setBirthData(data);
    setTimeout(() => {
        setCurrentView('dashboard');
        setIsLoading(false); 
    }, 1500);
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
  };
  
  const handleSignIn = () => setIsAuthModalOpen(true);
  
  const handleSignOut = () => {
      setUser(null);
      setBirthData(null); 
      localStorage.removeItem('astroverse_user');
      localStorage.removeItem('astroverse_email');
      setCurrentView('form');
  };
  
  const handleAuthSuccess = async (authenticatedUser: User, source?: 'SIGN_IN' | 'VERIFIED') => {
      if (typeof authenticatedUser.tokens !== 'number') {
          authenticatedUser.tokens = 50; 
          authenticatedUser.subscriptionTier = 'Free';
      }

      const remoteData = await getUserData(authenticatedUser.email);
      let mergedUser = { ...authenticatedUser, ...remoteData };

      if (pendingBirthData && pendingBirthData.shouldSave) {
          mergedUser.birthDate = pendingBirthData.data.date;
          mergedUser.birthTime = pendingBirthData.data.time;
          mergedUser.birthLocation = pendingBirthData.data.location;
          mergedUser.isPrimarySet = true;
          
          await saveUserData(mergedUser.email, {
              birthDate: pendingBirthData.data.date,
              birthTime: pendingBirthData.data.time,
              birthLocation: pendingBirthData.data.location,
              isPrimarySet: true
          });

          setBirthData(pendingBirthData.data);
          setCurrentView('dashboard');
          setPendingBirthData(null); 
      } else if (mergedUser.isPrimarySet && mergedUser.birthDate) {
          setBirthData({
              date: mergedUser.birthDate,
              time: mergedUser.birthTime || '',
              location: mergedUser.birthLocation || ''
          });
      }

      setUser(mergedUser);
      setIsAuthModalOpen(false);
      
      if (source === 'VERIFIED') {
        alert(`${t.authModal.accountActivated.title}\n${t.authModal.accountActivated.message}`);
      }
  }

  const handleAddComment = (comment: { rating: number; text: string }) => {
    if (user) {
      const newComment: Comment = {
        id: Date.now(),
        author: user.name,
        ...comment,
      };
      setComments(prev => [newComment, ...prev]);
    }
  };

  // --- CORE MONETIZATION LOGIC (UPDATED) ---

  const handleConsumeTokens = (cost: number, featureName: string): boolean => {
      if (!user) {
          setIsAuthModalOpen(true);
          return false;
      }

      // Optimistic Update handled by the service component, but here we trigger the process
      // IMPORTANT: This logic is now async in reality, but for UI components expecting synchronous result
      // we do a quick check locally then fire the async request.
      
      if (user.tokens < cost) {
          setToast({ message: `Insufficient Funds! You need ${cost} tokens.`, type: 'error' });
          setIsStoreOpen(true);
          return false;
      }

      // Fire and forget (in this synchronous wrapper), but UI updates via state
      consumeUserTokens(user.email, cost, featureName).then(() => {
          const newUser = { ...user, tokens: user.tokens - cost };
          setUser(newUser);
          setToast({ message: `Spent ${cost} Tokens on ${featureName}`, type: 'success' });
      }).catch(err => {
          if (err.message === 'INSUFFICIENT_FUNDS') {
              setToast({ message: `Transaction Failed: Insufficient Funds`, type: 'error' });
              setIsStoreOpen(true);
          } else {
              setToast({ message: `Transaction Error`, type: 'error' });
          }
          // Revert optimistic update if we did one (not done here yet to be safe)
      });

      return true; // Return true to allow immediate UI transition, error handled async
  };

  const handlePurchaseTokens = (packId: 'SMALL' | 'MEDIUM' | 'LARGE') => {
      if (!user) return;
      const result = MonetizationManager.purchaseTokens(user.email, packId);
      const newUser = { ...user, tokens: user.tokens + result.tokensAdded };
      setUser(newUser);
      saveUserData(user.email, { tokens: newUser.tokens }); 
      setToast({ message: `Successfully purchased ${result.tokensAdded} Tokens!`, type: 'success' });
      setIsStoreOpen(false);
  };

  const handleSubscribe = (tierId: 'EXPLORER' | 'INSIGHT' | 'PRIME') => {
      if (!user) return;
      const result = MonetizationManager.subscribe(user.email, tierId);
      const newUser: User = { 
          ...user, 
          tokens: user.tokens + result.tokensAdded,
          subscriptionTier: tierId === 'EXPLORER' ? 'Explorer' : tierId === 'INSIGHT' ? 'Insight' : 'Prime'
      };
      setUser(newUser);
      saveUserData(user.email, { 
          tokens: newUser.tokens,
          subscriptionTier: newUser.subscriptionTier
      });
      setToast({ message: `Welcome to ${tierId}! ${result.tokensAdded} Tokens added.`, type: 'success' });
      setIsStoreOpen(false);
  }

  const renderDashboardContent = () => {
    switch (currentView) {
        case 'dashboard':
            return <Dashboard onNavigate={handleNavigate} birthData={birthData} cognitiveProfile={cognitiveProfile} />;
        case 'natalChart':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <NatalChartDisplay 
                        birthData={birthData!}
                        user={user}
                        comments={comments}
                        onAddComment={handleAddComment}
                        onSignIn={handleSignIn}
                    />
                </FeaturePage>
            );
        case 'aiFuture':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <AIFuture 
                        birthData={birthData!} 
                        user={user}
                        onConsumeTokens={(amt, feat) => handleConsumeTokens(TOKEN_COSTS.AI_FUTURE_FORECAST, 'AI Future')}
                        onOpenStore={() => setIsStoreOpen(true)}
                    />
                </FeaturePage>
            );
        case 'compatibility':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <Compatibility birthData={birthData!} />
                </FeaturePage>
            );
        case 'dailyZodiac':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <DailyZodiac birthData={birthData!} />
                </FeaturePage>
            );
        case 'profile':
            return (
                <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <ProfileSettings />
                </FeaturePage>
            );
        case 'futureEvents':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <FutureEvents birthData={birthData!} />
                </FeaturePage>
            );
        case 'aboutAstrology':
            return (
                <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <AboutAstrology />
                </FeaturePage>
            );
        case 'legendsMythology':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <LegendsMythology birthData={birthData!} />
                </FeaturePage>
            );
        case 'askTheOracle':
             return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <AskTheOracle birthData={birthData!} />
                </FeaturePage>
            );
        case 'dreamInterpretation':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <DreamInterpretation birthData={birthData!} />
                </FeaturePage>
            );
        case 'vocationalReport':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <VocationalReport birthData={birthData!} />
                </FeaturePage>
            );
        case 'cosmicCodex':
            return (
                <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <CosmicCodex />
                </FeaturePage>
            );
        case 'cognitiveProfiler':
            return (
                 <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <CognitiveProfiler onProfileComplete={setCognitiveProfile} />
                </FeaturePage>
            );
        case 'decisionMatrix':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <DecisionMatrix cognitiveProfile={cognitiveProfile!} />
                </FeaturePage>
            );
        case 'aboutProject':
            return (
                <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <AboutProject />
                </FeaturePage>
            );
        case 'faq':
            return (
                <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <FAQPage />
                </FeaturePage>
            );
        case 'astroAcademy':
            return (
                 <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <AstroAcademy />
                </FeaturePage>
            );
        case 'integralNeuroEmotiveProfile':
            return (
                 <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <IntegralNeuroEmotiveProfile />
                </FeaturePage>
            );
        case 'integralNumerology':
            return (
                 <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <IntegralNumerology />
                </FeaturePage>
            );
        case 'tarotOracle':
            return (
                 <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <TarotOracle />
                </FeaturePage>
            );
        case 'astroConnections':
            return (
                 <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <AstroConnections />
                </FeaturePage>
            );
        case 'astroView':
            return (
                <FeaturePage onBack={() => handleNavigate(birthData ? 'dashboard' : 'form')}>
                    <AstroView />
                </FeaturePage>
            );
        case 'energeticAlignment':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <EnergeticAlignment birthData={birthData!} />
                </FeaturePage>
            );
        case 'bioRhythms':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <BioRhythms birthData={birthData!} />
                </FeaturePage>
            );
        case 'chineseZodiac':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <ChineseZodiac birthData={birthData!} />
                </FeaturePage>
            );
        case 'extendedProfile':
            return (
                <FeaturePage onBack={() => handleNavigate('dashboard')}>
                    <ExtendedProfile birthData={birthData!} />
                </FeaturePage>
            );
        default:
            return null;
    }
  }

  const renderContent = () => {
    if (isLoading) {
        return <LoadingScreen />;
    }
    if (currentView === 'form') {
        return <Hero onSubmit={handleFormSubmit} user={user} />;
    }
    return (
      <div className="pb-20">
        <main className="container mx-auto max-w-5xl px-4 py-8 sm:py-16">
          {renderDashboardContent()}
        </main>
        <footer className="text-center py-6 mt-10">
          <p className="text-xs text-gray-500">
            © 2025 AstroVerse. {t.footer.rights}
            <span className="opacity-50 ml-2">v1.2 (Real-Time Tokens)</span>
          </p>
        </footer>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-gray-200 antialiased">
      <div className="relative z-10">
        <Header 
          user={user} 
          onSignIn={handleSignIn} 
          onSignOut={handleSignOut} 
          isTransparentOnTop={currentView === 'form'} 
          onNavigate={handleNavigate}
          birthData={birthData}
          cognitiveProfile={cognitiveProfile}
          onOpenStore={() => setIsStoreOpen(true)}
        />
        {renderContent()}
      </div>
       {currentView !== 'form' && <AdBanner />}
       
       {isAuthModalOpen && (
        <AuthModal 
            onClose={() => {
                setIsAuthModalOpen(false);
                setPendingBirthData(null); 
            }}
            onAuthSuccess={handleAuthSuccess}
        />
       )}
       
       {isStoreOpen && (
           <AstroStore 
                onClose={() => setIsStoreOpen(false)}
                onPurchaseToken={handlePurchaseTokens}
                onSubscribe={handleSubscribe}
                currentBalance={user ? user.tokens : 0}
           />
       )}
       
       {toast && (
           <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(null)} 
           />
       )}
       
       <StripeDebug />
    </div>
  );
};

export default App;
