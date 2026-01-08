
export interface BirthData {
  date: string;
  time: string;
  location: string;
}

export interface User {
  name: string;
  email: string;
  tokens: number; // Added token balance
  subscriptionTier: 'Free' | 'Explorer' | 'Insight' | 'Prime';
  // Persistent Birth Data
  birthDate?: string;
  birthTime?: string;
  birthLocation?: string;
  isPrimarySet?: boolean;
}

export interface Comment {
  id: number;
  author: string;
  rating: number;
  text: string;
}

export type Language = 'en' | 'ro' | 'es' | 'fr' | 'de';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'RON';

export type AppView = 'form' | 'dashboard' | 'natalChart' | 'aiFuture' | 'compatibility' | 'dailyZodiac' | 'profile' | 'futureEvents' | 'aboutAstrology' | 'legendsMythology' | 'askTheOracle' | 'dreamInterpretation' | 'vocationalReport' | 'cosmicCodex' | 'cognitiveProfiler' | 'decisionMatrix' | 'aboutProject' | 'astroAcademy' | 'integralNeuroEmotiveProfile' | 'integralNumerology' | 'tarotOracle' | 'astroConnections' | 'astroView' | 'energeticAlignment' | 'bioRhythms' | 'chineseZodiac' | 'extendedProfile' | 'faq';

export interface NatalChartTemplate {
  summaryTitle: string;
  sunSign: string;
  risingSign: string;
  moonSign: string;
  dominantElement: string;
  dominantModality: string;
  sunInSignTitle: (sign: string) => string;
  sunInHouseTitle: (house: string) => string;
  moonInSignTitle: (sign: string) => string;
  chironTitle: string;
  aspectsTitle: string;
  favorableAspectsTitle: string;
  challengingAspectsTitle: string;
  nodesTitle: string;
  northNodeTitle: string;
  southNodeTitle: string;
  genericIntroduction: string;
  genericConclusion: string;
  keyPlacements: string;
}

export interface CognitiveProfile {
  ocean: {
    O: 'High' | 'Medium' | 'Low';
    C: 'High' | 'Medium' | 'Low';
    E: 'High' | 'Medium' | 'Low';
    A: 'High' | 'Medium' | 'Low';
    N: 'High' | 'Medium' | 'Low';
  };
  mbti: string; // e.g., "INTJ"
  enneagram: string; // e.g., "Type 5"
}

// --- MONETIZATION TYPES ---

export type TransactionType = 'LOG_REPORT_AI' | 'LOG_REPORT_PSYCHO' | 'LOG_REPORT_CAREER' | 'LOG_CHAT_AI' | 'LOG_SUBSCRIPTION' | 'LOG_TOKEN_PURCHASE' | 'LOG_FAIL_CONSUMPTION';

export interface TransactionLog {
    id: string;
    timestamp: string; // ISO Date
    userId: string;
    transactionType: TransactionType;
    tokensConsumed: number;
    tokensAdded: number;
    cogsCostUsd: number;
    revenueUsd: number;
    profitMargin: number; // 0.0 to 1.0
}

export interface TokenPackage {
    id: 'SMALL' | 'MEDIUM' | 'LARGE';
    tokens: number;
    price: number;
    profitMargin: number;
    label: string;
    bonus?: string; // e.g. "10% BONUS"
}

export interface SubscriptionTier {
    id: 'EXPLORER' | 'INSIGHT' | 'PRIME';
    name: string;
    price: number;
    tokensIncluded: number;
    discountOnExtras: number;
    cogs: number;
}

export interface ResourceCost {
    tokens: number;
    cogs: number;
    logType: TransactionType;
}

// --- PERSISTENCE TYPES (FIRESTORE) ---

export interface SavedReport {
    reportId: string;
    userId: string;
    reportType: string; // e.g., 'AI_Future_Forecast'
    content: string; // The full Markdown content
    generationDate: string; // ISO Timestamp
    costTokens: number;
}


export interface TranslationSet {
  header: {
    title: string;
    signIn: string;
    signOut: string;
    welcome: string;
    tokens: string;
    menu: {
      home: string;
      natalChart: string;
      askTheOracle: string;
      dreamInterpretation: string;
      vocationalReport: string;
      aiFuture: string;
      compatibility: string;
      dailyZodiac: string;
      futureEvents: string;
      aboutAstrology: string;
      legendsMythology: string;
      cosmicCodex: string;
      cognitiveProfiler: string;
      decisionMatrix: string;
      astroAcademy: string;
      integralNeuroEmotiveProfile: string;
      integralNumerology: string;
      tarotOracle: string;
      astroConnections: string;
      aboutProject: string;
      faq: string;
      astroView: string;
      energeticAlignment: string;
      bioRhythms: string;
      chineseZodiac: string;
      extendedProfile: string;
    };
  };
  hero: {
    title: string;
    subtitle: string;
    quote?: string;
    lunarIntroQuote: string;
  };
  form: {
    dateLabel: string;
    timeLabel: string;
    locationLabel: string;
    locationPlaceholder: string;
    submitButton: string;
    required: string;
    saveDataLabel: string;
    saveAndGenerate: string;
    generateOnly: string;
  };
  reading: {
    title: string;
    date: string;
    time: string;
    location: string;
    listenButton: string;
    listeningButton: string;
    newReadingButton: string;
    natalChartTemplate: NatalChartTemplate;
  };
  feedback: {
    title: string;
    signInPrompt: string;
    signInButton: string;
    yourFeedback: string;
    ratingLabel: string;
    commentLabel: string;
    commentPlaceholder: string;
    submitButton: string;
    commentsTitle: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    natalChart: {
      title: string;
      description: string;
    };
    aiFuture: {
      title: string;
      description: string;
    };
    compatibility: {
      title: string;
      description: string;
      person1: string;
      person2: string;
      button: string;
    };
    dailyZodiac: {
      title: string;
      description: string;
      button: string;
    };
    dynamic: {
        focusTitle: string;
        moonTitle: string;
        cardTitle: string;
    },
    askTheOracle: {
        title: string;
        description: string;
    };
    dreamInterpretation: {
        title: string;
        description: string;
    };
    vocationalReport: {
        title: string;
        description: string;
    };
    cognitiveProfiler: {
      title: string;
      description: string;
    };
    decisionMatrix: {
        title: string;
        description: string;
        disabledTooltip: string;
    };
    astroAcademy: {
        title: string;
        description: string;
    };
    integralNeuroEmotiveProfile: {
        title: string;
        description: string;
    };
    integralNumerology: {
        title: string;
        description: string;
    };
    tarotOracle: {
        title: string;
        description: string;
    };
    astroConnections: {
      title: string;
      description: string;
    };
    astroView: {
        title: string;
        description: string;
    };
    energeticAlignment: {
        title: string;
        description: string;
    };
    bioRhythms: {
        title: string;
        description: string;
    };
    chineseZodiac: {
        title: string;
        description: string;
    };
    extendedProfile: {
        title: string;
        description: string;
    }
  };
  aiFuture: {
    title: (year: number) => string;
    description: string;
    button: string;
    premium: {
        title: string;
        description: string;
        button: string;
        alert: string;
    }
  };
  featurePage: {
      backButton: string;
      generating: string;
      share: {
        title: string;
        button: string;
      };
      shareModal: {
        title: string;
        copy: string;
        copied: string;
      }
  };
  profile: {
    title: string;
    languageTitle: string;
    reportLanguageLabel: string;
    currencyLabel: string;
    notificationsTitle: string;
    notificationsSubtitle: string;
    dailyHoroscope: string;
    specialReports: string;
    featureUpdates: string;
  };
  futureEvents: {
    title: string;
    description: string;
    button: string;
  };
  aboutAstrology: {
    title: string;
    content: string;
  };
  legendsMythology: {
    title: string;
    description: string;
    button: string;
  };
  askTheOracle: {
    title: string;
    subtitle: string;
    placeholder: string;
  };
  dreamInterpretation: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
  };
  vocationalReport: {
    title: string;
    subtitle: string;
    button: string;
  };
  cosmicCodex: {
    title: string;
    subtitle: string;
  };
   cognitiveProfiler: {
    title: string;
    startTitle: string;
    startDescription: string;
    startButton: string;
    question: string;
    of: string;
    resultsTitle: string;
    resultsDescription: string;
    yourResults: string;
    retakeButton: string;
  };
  decisionMatrix: {
    title: string;
    step1: {
        title: string;
        placeholder: string;
    };
    step2: {
        title: string;
    };
    step3: {
        title: string;
    };
    step4: {
        title: string;
    };
    button: string;
    resultTitle: string;
    startOver: string;
  };
  aboutProject: {
    title: string;
    placeholder: string;
  };
  faq: {
    title: string;
    scientificFaq: string;
    questions: {
        question: string;
        answer: string;
    }[];
  };
  astroAcademy: {
    title: string;
    module1: {
        title: string;
        progress: string;
        lessons: string[];
    };
    module2: {
        title: string;
        progress: string;
        lessons: string[];
    };
    module3: {
        title: string;
        progress: string;
        lessons: string[];
    };
    aiTeacher: {
        title: string;
        subtitle: string;
        placeholder: string;
        button: string;
    };
    lessonModal: {
        generating: string;
        title: (lesson: string) => string;
    }
  };
  integralNeuroEmotiveProfile: {
    title: string;
    startTitle: string;
    startDescription: string;
    startButton: string;
    question: string;
    of: string;
    likert: string[];
    resultsTitle: string;
    sirScore: string;
    sivScore: string;
    seaScore: string;
    sevScore: string;
    retakeButton: string;
    analysis: {
        title: string;
        generating: string;
        section1Title: string;
        section2Title: string;
        section3Title: string;
    };
  };
  integralNumerology: {
    title: string;
    subtitle: string;
    form: {
        fullNameLabel: string;
        fullNamePlaceholder: string;
        dobLabel: string;
        button: string;
    },
    reportTitle: string;
  };
  tarotOracle: {
    title: string;
    menuTitle: string;
    dailyTitle: string;
    threeCardTitle: string;
    celticCrossTitle: string;
    dailySubtitle: string;
    threeCardSubtitle: string;
    celticCrossSubtitle: string;
    drawCardButton: string;
    askQuestionPlaceholder: string;
    getReadingButton: string;
    readingFor: string;
    backToMenu: string;
    positions: {
      past: string;
      present: string;
      future: string;
      situation: string;
      challenge: string;
      past_foundation: string;
      recent_past: string;
      potential: string;
      near_future: string;
      self_perception: string;
      external_influence: string;
      hopes_fears: string;
      outcome: string;
    };
  };
  astroConnections: {
    title: string;
    onboarding: {
      title: string;
      subtitle: string;
      privacy: string;
      joinButton: string;
      declineButton: string;
    };
    profileSetup: {
      title: string;
      nicknameLabel: string;
      nicknamePlaceholder: string;
      bioLabel: string;
      bioPlaceholder: string;
      saveButton: string;
    };
    connectionsList: {
      title: string;
      filterByZodiac: string;
      filterByLifePath: string;
      allSigns: string;
      allPaths: string;
      sendIntentButton: string;
    };
  };
  energeticAlignment: {
      title: string;
      subtitle: string;
      labels: {
          powerColor: string;
          crystal: string;
          benefits: string;
          tips: string;
          zodiac: string;
          lifePath: string;
      }
  };
  bioRhythms: {
      title: string;
      subtitle: string;
      labels: {
          physical: string;
          emotional: string;
          intellectual: string;
          state: string;
          percentage: string;
      };
      states: {
          peak: string;
          low: string;
          rising: string;
          falling: string;
          critical: string;
      }
  };
  chineseZodiac: {
      title: string;
      subtitle: string;
      labels: {
          element: string;
          polarity: string;
          luckyNumbers: string;
          luckyColors: string;
          compatibility: string;
          incompatibility: string;
      };
      button: string;
  };
  extendedProfile: {
      title: string;
      subtitle: string;
      labels: {
          vedicSign: string;
          celticTree: string;
          ophiuchusStatus: string;
          isOphiuchus: string;
          isNotOphiuchus: string;
      };
      button: string;
  };
  aiImageEditor: {
    title: string;
    subtitle: string;
    uploadArea: {
      title: string;
      or: string;
      cameraButton: string;
    };
    promptLabel: string;
    promptPlaceholder: string;
    generateButton: string;
    startOver: string;
    generating: string;
  };
  aiImageGenerator: {
    title: string;
    subtitle: string;
    promptLabel: string;
    promptPlaceholder: string;
    aspectRatioLabel: string;
    generateButton: string;
    startOver: string;
    generating: string;
  };
  authModal: {
    title: string;
    emailLabel: string;
    passwordLabel: string;
    signInButton: string;
    createAccountLink: string;
    forgotPasswordLink: string;
    signUpTitle: string;
    confirmPasswordLabel: string;
    signUpButton: string;
    signInLink: string;
    signInError: string;
    userExistsError: string;
    userNotFoundError: string;
    inactiveUserError: string;
    passwordsDoNotMatch: string;
    passwordStrength: {
      title: string;
      weak: string;
      medium: string;
      strong: string;
      veryStrong: string;
    };
    passwordRequirements: {
      length: string;
      uppercase: string;
      number: string;
      symbol: string;
    };
    pendingVerification: {
      title: string;
      message: (email: string) => string;
      simulationNotice: string;
      verificationLink: string;
    };
    forgotPasswordTitle: string;
    forgotPasswordInstructions: string;
    sendResetLinkButton: string;
    backToSignInLink: string;
    resetLinkSent: {
      title: string;
      message: string;
      simulationNotice: string;
      resetLink: string;
    };
    resetPassword: {
      title: string;
      instructions: string;
      newPasswordLabel: string;
      button: string;
      successTitle: string;
      successMessage: string;
    };
    accountActivated: {
        title: string;
        message: string;
    }
  };
  lunarGuide: {
    title: string;
    currentPhase: string;
    intentionTitle: string;
    illumination: (percentage: number) => string;
  };
  loading: string;
  error: {
    title: string;
    reading: string;
    audio: string;
  };
  errorBoundary: {
    title: string;
    message: string;
    refreshButton: string;
  };
  footer: {
    rights: string;
  };
  astroView: {
    title: string;
    inputLabel: string;
    inputPlaceholder: string;
    button: string;
    generateArtButton: string;
    sections: {
        identity: string;
        archetype: string;
        observing: string;
        bodies: string;
        narrative: string;
        astrophysics: string;
        personalAlignment: string;
        art: string;
    }
  };
  store: {
      title: string;
      subtitle: string;
      tokenBalance: string;
      tabs: {
          subscriptions: string;
          tokens: string;
      };
      subscriptions: {
          explorer: { title: string; desc: string; };
          insight: { title: string; desc: string; };
          prime: { title: string; desc: string; };
          month: string;
          selectButton: string;
      };
      tokens: {
          small: { title: string; desc: string; };
          medium: { title: string; desc: string; };
          large: { title: string; desc: string; };
          buyButton: string;
      };
      premiumUnlock: {
          title: string;
          desc: string;
          unlockButton: string;
      };
      insufficientFunds: {
          title: string;
          message: string;
          action: string;
      }
  }
}

export type Translations = {
  [key in Language]: TranslationSet;
};
