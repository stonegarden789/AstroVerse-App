
import type { Language, Translations, TranslationSet, Currency } from './types';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'ro', 'es', 'fr', 'de'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  ro: 'Română',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export const CURRENCIES: Record<Currency, { symbol: string, rate: number, label: string }> = {
    USD: { symbol: '$', rate: 1, label: 'USD ($)' },
    EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
    GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
    RON: { symbol: 'RON', rate: 4.60, label: 'RON (lei)' }
};

export const ASTRO_QUOTES = [
    "Suntem făcuți din praf de stele.",
    "Cosmosul este în noi.",
    "Privește în sus la stele, nu în jos la picioarele tale.",
    "Astrologia este un limbaj. Dacă înțelegi acest limbaj, cerul îți vorbește.",
    "Vina, dragă Brutus, nu este în stelele noastre, ci în noi înșine.",
    "Toți suntem în noroi, dar unii dintre noi se uită la stele."
];

export const MOCK_COMMUNITY_USERS = [
    { id: 1, nickname: 'AstroUser', zodiac: 'Aries', lifePath: 1, bio: 'Hello stars!' }
];

export const COGNITIVE_PROFILER_QUIZ = {
    questions: [
        {
            id: 0,
            questionKey: 'q1',
            answers: [
                { textKey: 'q1_a1', scores: { ocean: { E: 1 } } },
                { textKey: 'q1_a2', scores: { ocean: { I: 1 } } }
            ]
        }
    ],
    translations: {
        en: { q1: 'I enjoy social gatherings.', q1_a1: 'Yes', q1_a2: 'No' },
        ro: { q1: 'Îmi plac întâlnirile sociale.', q1_a1: 'Da', q1_a2: 'Nu' },
        es: { q1: 'Me gustan las reuniones sociales.', q1_a1: 'Sí', q1_a2: 'No' },
        fr: { q1: 'J\'aime les reuniuni sociale.', q1_a1: 'Oui', q1_a2: 'Non' },
        de: { q1: 'Ich mag gesellschaftliche Zusammenkünfte.', q1_a1: 'Ja', q1_a2: 'Nein' },
    }
};

export const INTEGRAL_NEURO_EMOTIVE_PROFILE_QUIZ = {
    questions: [
        {
            category: 'logic',
            type: 'mcq',
            questionKey: 'q1',
            optionsKey: 'q1_opts',
            correctOption: 'opt_a',
            isInverted: false
        }
    ],
    translations: {
        en: { q1: 'Logic Question 1', q1_opts: { opt_a: 'Option A', opt_b: 'Option B' } },
        ro: { q1: 'Întrebare Logică 1', q1_opts: { opt_a: 'Opțiunea A', opt_b: 'Opțiunea B' } },
        es: { q1: 'Pregunta Lógica 1', q1_opts: { opt_a: 'Opción A', opt_b: 'Opción B' } },
        fr: { q1: 'Question Logique 1', q1_opts: { opt_a: 'Option A', opt_b: 'Option B' } },
        de: { q1: 'Logische Frage 1', q1_opts: { opt_a: 'Option A', opt_b: 'Option B' } },
    }
};

// Tarot Deck with ALL 22 Major Arcana cards and verified stable image URLs (Wikipedia Commons)
export const TAROT_DECK: Record<Language, any[]> = {
    en: [
        { name: 'The Fool', arcana: '0', keywords: 'Beginnings, Innocence', meaning: { short: 'A new beginning.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg' },
        { name: 'The Magician', arcana: 'I', keywords: 'Willpower, Creation', meaning: { short: 'Manifestation.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg' },
        { name: 'The High Priestess', arcana: 'II', keywords: 'Intuition, Mystery', meaning: { short: 'Internal knowledge.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg' },
        { name: 'The Empress', arcana: 'III', keywords: 'Femininity, Nature', meaning: { short: 'Abundance.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/RWS_Tarot_03_Empress.jpg' },
        { name: 'The Emperor', arcana: 'IV', keywords: 'Authority, Structure', meaning: { short: 'Stability.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg' },
        { name: 'The Hierophant', arcana: 'V', keywords: 'Tradition, Conformity', meaning: { short: 'Spiritual wisdom.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg' },
        { name: 'The Lovers', arcana: 'VI', keywords: 'Love, Alignment', meaning: { short: 'Relationships.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg' },
        { name: 'The Chariot', arcana: 'VII', keywords: 'Control, Victory', meaning: { short: 'Willpower.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg' },
        { name: 'Strength', arcana: 'VIII', keywords: 'Courage, Persuasion', meaning: { short: 'Inner strength.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/RWS_Tarot_08_Strength.jpg' },
        { name: 'The Hermit', arcana: 'IX', keywords: 'Solitude, Guidance', meaning: { short: 'Self-reflection.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg' },
        { name: 'Wheel of Fortune', arcana: 'X', keywords: 'Karma, Destiny', meaning: { short: 'Change.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg' },
        { name: 'Justice', arcana: 'XI', keywords: 'Fairness, Truth', meaning: { short: 'Cause and effect.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg' },
        { name: 'The Hanged Man', arcana: 'XII', keywords: 'Sacrifice, Perspective', meaning: { short: 'Waiting.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg' },
        { name: 'Death', arcana: 'XIII', keywords: 'Transformation, Endings', meaning: { short: 'Transition.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg' },
        { name: 'Temperance', arcana: 'XIV', keywords: 'Balance, Moderation', meaning: { short: 'Patience.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg' },
        { name: 'The Devil', arcana: 'XV', keywords: 'Addiction, Materialism', meaning: { short: 'Shadow self.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg' },
        { name: 'The Tower', arcana: 'XVI', keywords: 'Upheaval, Revelation', meaning: { short: 'Sudden change.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg' },
        { name: 'The Star', arcana: 'XVII', keywords: 'Hope, Inspiration', meaning: { short: 'Renewal.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg' },
        { name: 'The Moon', arcana: 'XVIII', keywords: 'Illusion, Fear', meaning: { short: 'Unconscious.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg' },
        { name: 'The Sun', arcana: 'XIX', keywords: 'Joy, Success', meaning: { short: 'Positivity.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg' },
        { name: 'Judgement', arcana: 'XX', keywords: 'Rebirth, Calling', meaning: { short: 'Awakening.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg' },
        { name: 'The World', arcana: 'XXI', keywords: 'Completion, Wholeness', meaning: { short: 'Integration.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg' }
    ],
    ro: [
        { name: 'Nebunul', arcana: '0', keywords: 'Începuturi, Inocență', meaning: { short: 'Un nou început.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg' },
        { name: 'Magicianul', arcana: 'I', keywords: 'Voință, Creație', meaning: { short: 'Manifestare.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg' },
        { name: 'Marea Preoteasă', arcana: 'II', keywords: 'Intuiție, Mister', meaning: { short: 'Cunoaștere interioară.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg' },
        { name: 'Împărăteasa', arcana: 'III', keywords: 'Feminitate, Natură', meaning: { short: 'Abundență.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/RWS_Tarot_03_Empress.jpg' },
        { name: 'Împăratul', arcana: 'IV', keywords: 'Autoritate, Structură', meaning: { short: 'Stabilitate.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg' },
        { name: 'Marele Preot', arcana: 'V', keywords: 'Tradiție, Conformism', meaning: { short: 'Înțelepciune spirituală.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg' },
        { name: 'Îndrăgostiții', arcana: 'VI', keywords: 'Iubire, Aliniere', meaning: { short: 'Relații.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg' },
        { name: 'Faetonul', arcana: 'VII', keywords: 'Control, Victorie', meaning: { short: 'Voință.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg' },
        { name: 'Forța', arcana: 'VIII', keywords: 'Curaj, Compasiune', meaning: { short: 'Putere interioară.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/RWS_Tarot_08_Strength.jpg' },
        { name: 'Pustnicul', arcana: 'IX', keywords: 'Singurătate, Ghidare', meaning: { short: 'Reflecție.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg' },
        { name: 'Roata Norocului', arcana: 'X', keywords: 'Karma, Destin', meaning: { short: 'Schimbare.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg' },
        { name: 'Dreptatea', arcana: 'XI', keywords: 'Echitate, Adevăr', meaning: { short: 'Cauză și efect.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg' },
        { name: 'Spânzuratul', arcana: 'XII', keywords: 'Sacrificiu, Perspectivă', meaning: { short: 'Așteptare.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg' },
        { name: 'Moartea', arcana: 'XIII', keywords: 'Transformare, Finaluri', meaning: { short: 'Tranziție.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg' },
        { name: 'Cumpătarea', arcana: 'XIV', keywords: 'Echilibru, Moderație', meaning: { short: 'Răbdare.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg' },
        { name: 'Diavolul', arcana: 'XV', keywords: 'Dependență, Materialism', meaning: { short: 'Umbra.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg' },
        { name: 'Turnul', arcana: 'XVI', keywords: 'Haos, Revelație', meaning: { short: 'Schimbare bruscă.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg' },
        { name: 'Steaua', arcana: 'XVII', keywords: 'Speranță, Inspirație', meaning: { short: 'Reînnoire.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg' },
        { name: 'Luna', arcana: 'XVIII', keywords: 'Iluzie, Frică', meaning: { short: 'Subconștient.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg' },
        { name: 'Soarele', arcana: 'XIX', keywords: 'Bucurie, Succes', meaning: { short: 'Pozitivitate.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg' },
        { name: 'Judecata', arcana: 'XX', keywords: 'Renaștere, Chemare', meaning: { short: 'Treziire.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg' },
        { name: 'Lumea', arcana: 'XXI', keywords: 'Împlinire, Unitate', meaning: { short: 'Integrare.' }, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg' }
    ],
    es: [],
    fr: [],
    de: []
};

TAROT_DECK.es = TAROT_DECK.en;
TAROT_DECK.fr = TAROT_DECK.en;
TAROT_DECK.de = TAROT_DECK.en;

const enTranslations: TranslationSet = {
    header: {
        title: 'AstroVerse',
        signIn: 'Sign In',
        signOut: 'Sign Out',
        welcome: 'Welcome',
        tokens: 'Tokens',
        menu: {
            home: '🏠 Home',
            natalChart: '📜 Natal Chart',
            askTheOracle: '🔮 Ask the Oracle',
            dreamInterpretation: '🌙 Dream Interpretation',
            vocationalReport: '💼 Vocational Report',
            aiFuture: '✨ AI Future Forecast',
            compatibility: '💞 Compatibility',
            dailyZodiac: '🗓️ Daily Horoscope',
            futureEvents: '⏳ Future Events',
            aboutAstrology: '🏛️ About Astrology',
            legendsMythology: '🏺 Legends & Mythology',
            cosmicCodex: '📖 Cosmic Codex',
            cognitiveProfiler: '🧠 Cognitive Profiler',
            decisionMatrix: '⚖️ Decision Matrix',
            astroAcademy: '🎓 Astro Academy',
            integralNeuroEmotiveProfile: '🧘 Integral Neuro-Emotive Profile',
            integralNumerology: '🔢 Integral Numerology',
            tarotOracle: '🃏 Tarot Oracle',
            astroConnections: '🤝 Astro Connections',
            aboutProject: 'ℹ️ About Project',
            faq: '🤔 FAQ',
            astroView: '✨ Astro View',
            energeticAlignment: '🌈 Energetic Alignment',
            bioRhythms: '🧬 Bio-Rhythms',
            chineseZodiac: '🐉 Chinese Zodiac',
            extendedProfile: '🔱 Extended Archetypal Profile',
        },
    },
    hero: { 
        title: 'AstroVerse', 
        subtitle: 'Unveil your cosmic blueprint. Enter your birth details to begin your journey through the stars.', 
        quote: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
        lunarIntroQuote: "Destiny is a letter written in the sky, which we read with the alphabet of our sorrows."
    },
    form: { 
        dateLabel: 'Date of Birth', 
        timeLabel: 'Time of Birth', 
        locationLabel: 'Place of Birth', 
        locationPlaceholder: 'e.g., London, UK', 
        submitButton: 'Generate Natal Chart', 
        required: 'This field is required',
        saveDataLabel: 'Save permanently to my account',
        saveAndGenerate: 'Save & Generate Chart',
        generateOnly: 'Generate Chart (No Save)'
    },
    reading: { title: 'Your Natal Chart', date: 'Date', time: 'Time', location: 'Location', listenButton: '🎧 Listen to Reading', listeningButton: '🎶 Listening...', newReadingButton: 'Start New Reading', natalChartTemplate: { summaryTitle: 'Natal Chart Summary', sunSign: 'Sun Sign', risingSign: 'Rising Sign', moonSign: 'Moon Sign', dominantElement: 'Dominant Element', dominantModality: 'Dominant Modality', sunInSignTitle: sign => `Sun in ${sign}`, sunInHouseTitle: house => `Sun in the ${house} House`, moonInSignTitle: sign => `Moon in ${sign}`, chironTitle: 'Chiron: The Wounded Healer', aspectsTitle: 'Key Aspects', favorableAspectsTitle: 'Favorable Aspects (Trines & Sextiles)', challengingAspectsTitle: 'Challenging Aspects (Squares & Oppositions)', nodesTitle: 'Lunar Nodes: Your Karmic Path', northNodeTitle: 'North Node: Your Soul\'s Destiny', southNodeTitle: 'South Node: Your Past Life Comfort Zone', genericIntroduction: '', genericConclusion: '', keyPlacements: '' } },
    feedback: { title: '💌 Share Your Feedback', signInPrompt: 'Sign in to leave your feedback and join the community.', signInButton: 'Sign In to Comment', yourFeedback: 'Your Feedback', ratingLabel: 'Your Rating', commentLabel: 'Your Comment', commentPlaceholder: 'Tell us what you think...', submitButton: 'Submit Feedback', commentsTitle: '💬 Community Comments' },
    dashboard: { 
        title: 'Cosmic Dashboard', subtitle: 'Explore the universe within and around you.', 
        natalChart: { title: '📜 Natal Chart', description: 'Generate your foundational cosmic blueprint.' },
        aiFuture: { title: '✨ AI Future Forecast', description: 'Get a personalized astrological forecast for next year.' },
        compatibility: { title: '💞 Compatibility', description: 'Compare your chart with someone else\'s.', person1: 'Person 1 (You)', person2: 'Person 2', button: 'Check Compatibility' },
        dailyZodiac: { title: '🗓️ Daily Horoscope', description: 'Receive your daily astrological guidance.', button: 'Get Today\'s Horoscope' },
        dynamic: { focusTitle: 'Today\'s Focus', moonTitle: 'Current Moon', cardTitle: 'Astrological Card' },
        askTheOracle: { title: '🔮 Ask the Oracle', description: 'Chat with an AI astrologer about your chart.' },
        dreamInterpretation: { title: '🌙 Dream Interpretation', description: 'Uncover the symbolic meaning of your dreams.' },
        vocationalReport: { title: '💼 Vocational Report', description: 'Discover your professional strengths and calling.' },
        cognitiveProfiler: { title: '🧠 Cognitive Profiler', description: 'Take a psychometric test to map your mind.' },
        decisionMatrix: { title: '⚖️ Decision Matrix', description: 'Analyze choices through your cognitive profile.', disabledTooltip: 'Complete the Cognitive Profiler first.' },
        astroAcademy: { title: '🎓 Astro Academy', description: 'Learn astrology from basics to advanced concepts.' },
        integralNeuroEmotiveProfile: { title: '🧘 Integral Neuro-Emotive Profile', description: 'Assess your IQ & EQ through a dynamic test.' },
        integralNumerology: { title: '🔢 Integral Numerology', description: 'Discover your core numbers and life path.' },
        tarotOracle: { title: '🃏 Tarot Oracle', description: 'Get guidance with daily, 3-card, or Celtic Cross readings.' },
        astroConnections: { title: '🤝 Astro Connections', description: 'Find and connect with others in the community.' },
        astroView: { title: '✨ Astro View', description: 'Deep cosmic insights and premium visualization of constellations.' },
        energeticAlignment: { title: '🌈 Energetic Alignment', description: 'Find your resonance with colors and minerals.' },
        bioRhythms: { title: '🧬 Bio-Rhythms', description: 'Monitor your physical, emotional, and intellectual cycles.' },
        chineseZodiac: { title: '🐉 Chinese Zodiac', description: 'Discover your lunar animal, element, and yearly fortune.' },
        extendedProfile: { title: '🔱 Extended Archetypal Profile', description: 'Discover your Sidereal (Vedic), Celtic Tree, and Ophiuchus profile.' },
    },
    aiFuture: { title: year => `✨ AI Astrological Forecast for ${year}`, description: 'Discover the major themes and opportunities awaiting you in the coming year.', button: `Generate ${new Date().getFullYear() + 1} Forecast`, premium: { title: '🌟 Unlock In-Depth Reports', description: 'Upgrade to Premium to receive detailed monthly breakdowns, relationship forecasts, and career guidance for the entire year.', button: 'Upgrade to Premium', alert: 'Premium features are not yet available.' } },
    featurePage: { backButton: 'Back', generating: 'Generating...', share: { title: 'Share Your Reading', button: 'Share' }, shareModal: { title: 'Share', copy: 'Copy to Clipboard', copied: 'Copied!' } },
    profile: { 
        title: '⚙️ Profile & Settings', 
        languageTitle: '🌐 Language & Region', 
        reportLanguageLabel: 'Report Language (Output)',
        currencyLabel: 'Currency',
        notificationsTitle: '📧 Email Notifications', 
        notificationsSubtitle: 'Manage your email preferences (Feature in development).', 
        dailyHoroscope: 'Daily Horoscope', 
        specialReports: 'Special Reports', 
        featureUpdates: 'Feature Updates' 
    },
    futureEvents: { title: '⏳ Your Future Events', description: 'See a list of significant, personalized astrological events for the next 30 days.', button: 'Generate Events List' },
    aboutAstrology: { 
        title: '🏛️ About Astrology',
        content: `Astrology is the study of the movements and relative positions of celestial bodies interpreted as having an influence on human affairs and the natural world.`
    },
    legendsMythology: { title: '🏺 Legends & Mythology', description: 'Discover the Greek/Roman mythology story associated with your zodiac sign.', button: 'Reveal My Legend' },
    askTheOracle: { title: '🔮 Ask the Oracle', subtitle: 'Chat with an AI astrologer about your chart.', placeholder: 'Ask a question about your chart...' },
    dreamInterpretation: { title: '🌙 Dream Interpretation', subtitle: 'Describe your dream to receive a symbolic, psychological, and astrological interpretation.', placeholder: 'Describe your dream here...', button: 'Interpret My Dream' },
    vocationalReport: { title: '💼 Vocational Report', subtitle: 'Generate an in-depth vocational astrology report to discover your professional strengths, ideal work environments, and ultimate calling.', button: 'Generate Vocational Report' },
    cosmicCodex: { title: '📖 Cosmic Codex', subtitle: 'A glossary of essential astrological terms.' },
    cognitiveProfiler: { title: '🧠 Cognitive Profiler', startTitle: 'Discover Your Cognitive Profile', startDescription: 'This 13-question test synthesizes principles from MBTI, Big Five (OCEAN), and the Enneagram to generate a unique psychometric profile. Answer honestly to get the most accurate result.', startButton: 'Start the Test', question: 'Question', of: 'of', resultsTitle: 'Your Cognitive Profile Report', resultsDescription: 'This report is a synthesis of your answers, providing insights into your behavioral patterns, cognitive functions, and core motivations.', yourResults: 'Your Results', retakeButton: 'Retake Test' },
    decisionMatrix: { title: '⚖️ Conscious Choice Matrix', step1: { title: 'Step 1: Define Your Decision', placeholder: 'e.g., "Should I accept the new job offer?" or "Should I move to a new city?"' }, step2: { title: 'Step 2: Cognitive Analysis (MBTI)' }, step3: { title: 'Step 3: Motivational Analysis (Enneagram)' }, step4: { title: 'Step 4: Synthesis & Recommendation' }, button: 'Analyze My Decision', resultTitle: 'Decision Analysis Report', startOver: 'Analyze Another Decision' },
    aboutProject: { 
        title: 'ℹ️ About This Project', 
        placeholder: `
# 🌌 ASTROVERSE
## Ontological Manifest & System Architecture

Astroverse is an advanced digital ecosystem that realizes the convergence of celestial mechanics, archetypal psychology, and computational artificial intelligence. It is not a simple divination application, but a holistic platform for analyzing the human being, designed to translate universal symbolism into actionable data, deep insights, and personal evolution strategies. 🚀

Astroverse functions as a system for mapping consciousness, where astronomical, mythological, and psychological data are algorithmically processed to reveal the structure of identity, the dynamics of the present, and the potential of the future.

### 🧬 I. CORE READINGS: The Foundation of Energetic Identity
This section defines the user's ontological imprint, establishing the basic structure of personality, potential, and inner rhythms.

**Natal Chart**
An algorithm for positioning celestial bodies at time T0, which defines the matrix of individual potentialities and the architecture of personal destiny. 🗺️

**Extended Archetypal Profile**
In-depth analysis of Jungian archetypes superimposed over astrological houses, providing a detailed map of the conscious and unconscious psyche. 🎭

**Chinese Zodiac**
Integration of the Chinese sexagenary system for interpreting macro-temporal rhythms, life cycles, and the influence of elements. 🐉

**Energetic Alignment**
Assessing the degree of coherence between personal intention and the current astral context, indicating the level of energetic flow or resistance. ✨

**Bio-Rhythms**
Mathematical monitoring (sinusoidal model) of physical, emotional, and intellectual cycles to optimize performance and decisions. 🌊

**Vocational Report**
Identifying directions for professional fulfillment through the analysis of lunar nodes, the position of the Midheaven, and the dynamics of career houses. 💼

**Integral Numerology**
Analysis of numerical frequencies derived from onomastic and temporal data to extract personal destiny algorithms. 🔢

### 🔮 II. ORACULAR & SYMBOLIC SYSTEMS: Dialogue with the Unconscious and Synchronicity
Tools dedicated to symbolic interpretation and exploration of the subtle dimensions of human experience:

**Ask the Oracle**
NLP (Natural Language Processing) interface for philosophical, existential, and esoteric inquiries, offering archetypally contextualized responses. 🔮

**Dream Interpretation**
Symbolic decryption of dreams through the lens of the collective unconscious, universal myths, and recurring archetypes. 🌙

**Tarot Oracle**
A divination system based on synchronicity and the recognition of archetypal patterns using the Rider–Waite deck. 🃏

### 📈 III. FORECASTS: Predictive Modeling & Time Dynamics
This section explores future temporal vectors using predictive astrology augmented by artificial intelligence.

**AI Future Forecast**
A predictive engine that correlates planetary transits with personal data to generate medium and long-term probabilistic scenarios. ✨

**Daily Horoscope**
Micro-analysis of lunar and planetary transits for quick and contextual daily guidance. 📅

**Compatibility**
Computational synastry analysis between two energetic imprints to evaluate relational resonance. 💕

**Future Events**
A calendar of major astrological and astronomical events, with impact on individual and collective consciousness. ⏳

**Astro View**
Real-time visualization of celestial configurations reported to the user's geographic location. 🛰️

### 🧠 IV. PSYCHOMETRICS: The Science of Self and Conscious Decision
An analytical approach to human behavior by integrating esoteric data with modern cognitive models.

**Cognitive Profiler**
Mapping thinking, learning, and decision-making styles based on planetary configurations. 🧠

**Decision Matrix**
A tool for optimizing major choices using astrological opportunity windows (Electional Astrology). ⚖️

**Integral Neuro-Emotive Profile**
Synthesis between emotional states and simulated neurological patterns based on transits and astral rhythms. 🧘

### 🎓 V. COMMUNITY & LEARNING: Expansion of Collective Consciousness

**Astro Academy**
An educational module for continuous study in the field of astrology, hermeticism, and cosmic symbolism. 🎓

**Astro Connections**
A social network built on energetic affinities, archetypal profiles, and common astral resonances. 🤝

### 🏛️ VI. RESOURCES: The Information Pillars of the System

**About Astrology**
Astroverse epistemology and the historical, philosophical, and symbolic foundations of astrology. 🏛️

**Cosmic Codex**
An exhaustive encyclopedia of technical, mythological, and esoteric terms used in the platform. 📖

**About Project**
The Astroverse vision: democratizing access to ancestral wisdom through advanced technology. ℹ️

**FAQ**
A support center for usage, correct data interpretation, and frequently asked questions. 🤔
        `
    },
    faq: { 
        title: '🤔 FAQ: Scientific & Methodological Inquiries', 
        scientificFaq: `
# 🏛️ FAQ: Scientific & Methodological Inquiries

Această secțiune oferă o perspectivă academică și tehnică asupra mecanismelor care guvernează ecosistemul **AstroVerse**, explicând validitatea și utilitatea fiecărui modul analitic.

## 💳 INFRASTRUCTURĂ ȘI TRANZACȚIONALITATE

**Q: Cum facilitează arhitectura bazată pe tokeni explorarea personalizată a sistemului?** **A:** Sistemul nostru utilizează o unitate de schimb internă (tokeni) pentru a asigura o lichiditate modulară a serviciilor. Utilizatorul achiziționează un volum de resurse pe care le poate aloca ulterior în mod asincron, conform priorităților sale de analiză, oferind o flexibilitate totală în accesarea modulelor de înaltă complexitate. 💎

**Q: Care este avantajul economic al modelului de achiziție a tokenilor față de abonamentele tradiționale?** **A:** Spre deosebire de modelele liniare, sistemul de tokeni elimină risipa de resurse. Utilizatorul investește strict în modulele necesare profilării sale curente, transformând fiecare interacțiune într-o investiție precisă în auto-cunoaștere și optimizare. 📈

---

## 🪐 CORE READINGS: ANALIZĂ ONTOLOGICĂ

### **Natal Chart**

1. **Q: Care este rigoarea matematică din spatele generării Hărții Natale în AstroVerse?** **A:** Utilizăm algoritmi de telemăsurătoare astronomică de precizie epocale (J2000.0) pentru a mapa pozițiile corpurilor cerești la momentul T0, oferind o matrice energetică fundamentală de o acuratețe absolută. 🗺️
2. **Q: Cum contribuie Harta Natală la definirea vectorilor de dezvoltare personală?** **A:** Aceasta funcționează ca un blueprint ontologic, identificând predispozițiile cognitive și emoționale native care servesc drept bază pentru toate analizele ulterioare ale sistemului.

### **Extended Archetypal Profile**

1. **Q: Ce reprezintă profilarea arhetipală extinsă din punct de vedere neuro-psihologic?** **A:** Este o sinteză între psihologia analitică jungiană și simbolismul planetar, care izolează structurile profunde ale personalității pentru a înțelege motivațiile subconștiente. 🎭
2. **Q: De ce este această analiză superioară testelor standard de personalitate?** **A:** Deoarece integrează variabile temporale și cosmice care depășesc auto-evaluarea subiectivă, oferind o perspectivă multidimensională asupra identității.

### **Chinese Zodiac**

1. **Q: Cum integrează AstroVerse sistemul sexagenar în analizele moderne?** **A:** Analizăm rezonanța dintre elementele primordiale și tulpinile cerești pentru a identifica ritmurile macro-temporale care guvernează dinamica succesului și a echilibrului. 🐉
2. **Q: Care este utilitatea practică a cunoașterii zodiei chinezești în acest ecosistem?** **A:** Oferă un strat suplimentar de interpretare a compatibilității și a ciclurilor de noroc, esențial pentru planificarea strategică pe termen lung.

### **Energetic Alignment**

1. **Q: Ce metodologie utilizează funcția de Aliniere Energetică?** **A:** Se bazează pe calculul unghiurilor de aspect dintre tranzitele curente și punctele sensibile ale hărții natale, măsurând gradul de coerență vibratorie al utilizatorului. ✨
2. **Q: Cum poate fi utilizat acest modul pentru optimizarea stării de bine?** **A:** Identifică perioadele de maximă eficiență energetică, permițând utilizatorului să își sincronizeze eforturile cu fluxul universal pentru rezultate maxime.

### **Bio-Rhythms**

1. **Q: Care este fundamentul biologic al calculului sinusoidelor de bioritm?** **A:** Algoritmul monitorizează cele trei cicluri critice (fizic, emoțional, intelectual) bazându-se pe periodicitatea biologică recunoscută, oferind o prognoză a capacității de performanță. 🌊
2. **Q: Cum previne acest modul stările de burnout sau ineficiență?** **A:** Prin vizualizarea perioadelor de declin ciclic, utilizatorul poate implementa strategii de conservare a energiei și de management al stresului în moumentele critice.

### **Ask the Oracle**

1. **Q: Cum procesează Inteligența Artificială interogările de natură ezoterică?** **A:** Modulul utilizează procesarea limbajului natural (NLP) pentru a corela întrebările filosofice cu vasta bază de date hermetice și simbolice a AstroVerse. 🔮
2. **Q: Care este valoarea adăugată a acestui modul față de o căutare informațională simplă?** **A:** Oracle oferă un răspuns contextualizat și sintetic, acționând ca un mentor filosofic digital capabil de asocieri complexe de idei.

### **Dream Interpretation**

1. **Q: Ce cadru metodologic este aplicat în decriptarea activității onirice?** **A:** Interpretarea se bazează pe semiotica viselor și pe lexiconul de simboluri universale ale inconștientului colectiv, oferind o punte între viața conștientă și cea latentă. 🌙
2. **Q: De ce este esențială înțelegerea viselor pentru un profil de personalitate complet?** **A:** Visele reprezintă procesarea nocturnă a reziduurilor psihice și a dorințelor reprimate, revelând direcții de evoluție pe care logica diurnă le poate omite.

### **Astro View**

1. **Q: Ce date tehnice furnizează modulul Astro View?** **A:** Oferă o telemetrie vizuală a sferelor cerești în timp real, raportată la coordonatele GPS ale utilizatorului, facilitând orientarea astronomică și astrologică. 🛰️
2. **Q: Cum îmbunătățește această vizualizare conexiunea utilizatorului cu mediul cosmic?** **A:** Transformă conceptele abstracte în observații tangibile, permițând observarea directă a fenomenelor care influențează profilul astrologic curent.

### **Vocational Report**

1. **Q: Cum identifică algoritmul vectorii de succes profesional?** **A:** Analizează casa a X-a (Midheaven), poziția lui Saturn și a Nodurilor Lunare pentru a extrage algoritmi de performanță și împlinire în carieră. 💼
2. **Q: Care este utilitatea acestui raport în managementul carierei moderne?** **A:** Oferă o direcție strategică utilizatorului, minimizând riscul de eroare vocațională și maximizând potențialul de realizare socio-economică.

### **Integral Numerology**

1. **Q: Care este baza de calcul a numerologiei integrative în AstroVerse?** **A:** Folosim metode avansate de reducere teozofică și corelare alfanumerică pentru a extrage frecvențele vibraționale ale onomasticii și datelor temporale. 🔢
2. **Q: Cum completează datele numerologice analiza astrologică?** **A:** Numerologia oferă structura cantitativă a destinului, funcționând ca un sistem de verificare încrucișată pentru previziunile calitative ale astrelor.

### **Tarot Oracle**

1. **Q: Cum este simulată sincronicitatea în extracția digitală de Tarot?** **A:** Utilizăm generatoare de numere pseudo-aleatorii calibrate pe variabile de context, permițând manifestarea principiului sincronicității jungiene în spațiul digital. 🃏
2. **Q: Care este valoarea educativă a afișajului în grid de 10 cărți?** **A:** Permite o vizualizare panoramică a dinamicii dintre arhetipuri, oferind o interpretare sistemică a situației analizate, dincolo de semnificația izolată a fiecărei cărți.

---

## 📈 FORECASTS: MODELARE PREDICTIVĂ

### **AI Future Forecast**

1. **Q: Ce modele statistice utilizează motorul predictiv AstroVerse?** **A:** AI-ul procesează vectorii de probabilitate rezultați din mișcarea planetară actuală raportată la punctele radix, simulând scenarii de viitor cu un grad ridicat de precizie. ✨
2. **Q: Cum poate un utilizator să modifice rezultatul unei prognoze?** **A:** Prognoza identifică ferestre de oportunitate; utilizatorul deține liberul arbitru pentru a acționa în acele intervale, transformând potențialul în realitate.

### **Compatibility**

1. **Q: Ce reprezintă sinastria computațională în acest modul?** **A:** Este analiza termodinamică a relației dintre două hărți natale, măsurând gradul de atracție, tensiune și durabilitate între două profiluri energetice. 💕
2. **Q: De ce este acest instrument vital pentru relațiile interpersonale?** **A:** Oferă o foaie de parcurs pentru comunicare și înțelegere reciprocă, anticipând zonele de conflict și punctele de rezonanță profundă.

### **Daily Horoscope**

1. **Q: Cum se diferențiază Horoscopul Daily AstroVerse de previziunile mass-media?** **A:** Este un micro-horoscop personalizat, calibrat pe tranzitele Lunii și ale planetelor rapide în raport cu casele astrologice specifice ale utilizatorului. 📅
2. **Q: Care este valoarea operațională a acestui ghid zilnic?** **A:** Permite ajustarea tactică a comportamentului cotidian pentru a evita disonanțele energetice minore și a profita de fluxurile favorabile.

### **Future Events**

1. **Q: Ce criterii definesc un eveniment ca fiind relevant în calendarul nostru?** **A:** Sunt selectate tranzitele majore (aspecte interplanetare, ingrese, eclipse) care au un impact dovedit statistic asupra psihicului colectiv și individual. ⏳
2. **Q: Cum ajută acest calendar în planificarea pe termen lung?** **A:** Oferă o perspectivă asupra "vremii astrologice" viitoare, permițând utilizatorului să își plaseze proiectele importante în perioade de expansiune cosmică.

### **Legends & Mythology**

1. **Q: De ce este inclusă mitologia într-o aplicație tehnologică?** **A:** Miturile reprezintă arhiva narativă a arhetipurilor; înțelegerea lor conferă profunzime și context cultural interpretărilor astrologice moderne. 🏺
2. **Q: Cum îmbogățește acest modul experiența utilizatorului?** **A:** Transformă procesul de analiză într-o călătorie culturală, facilitând asimilarea conceptelor complexe prin intermediul poveștilor fondatoare ale umanității.

---

## 🧠 PSYCHOMETRICS: INGINERIE COGNITIVĂ

### **Cognitive Profiler**

1. **Q: Cum mapează sistemul funcțiile executive cerebrale?** **A:** Corelăm aspectele mercuriene și marțiene cu procesele de procesare a informației și luare a deciziilor, oferind un profil al stilului cognitiv. 🧠
2. **Q: Care este valoarea practică a acestui profil în educație sau muncă?** **A:** Permite utilizatorului să își identifice metoda optimă de învățare și de rezolvare a problemelor, crescând eficiența intelectuală.

### **Decision Matrix**

1. **Q: Ce este euristica decizională bazată pe astrologie?** **A:** Este un instrument de optimizare a alegerilor care cântărește riscurile și beneficiile prin prisma sincronicității astrale. ⚖️
2. **Q: Cum elimină acest modul paralizia decizională?** **A:** Oferă un cadru de referință obiectiv, bazat pe datele de tranzit, care ajută la prioritizarea acțiunilor în moumentele de incertitudine.

### **Integral Neuro-Emotive Profile**

1. **Q: Ce reprezintă sinteza neuro-emotivă în contextul AstroVerse?** **A:** Este o evaluare a rezilienței psihologice, combinând pattern-urile emoționale lunare cu dinamica impulsivității sau a reținerii sugerate de planetele sociale. 🧘
2. **Q: Cum susține acest profil sănătatea mintală și echilibrul interior?** **A:** Oferă utilizatorului o hartă a punctelor vulnerabile emoțional, permițând intervenții conștiente pentru menținerea homeostaziei psihice.

---

## 🎓 COMMUNITY & LEARNING

### **Astro Academy**

1. **Q: Care este rigoarea curiculei educaționale din Astro Academy?** **A:** Oferim cursuri sistematice de alfabetizare ezoterică, trecând de la concepte de bază la mecanica cerească avansată și tehnici de interpretare riguroase. 🎓
2. **Q: Cum transformă acest modul un simplu utilizator într-un expert?** **A:** Prin furnizarea instrumentelor teoretice necesare pentru a valida și a înțelege independent datele furnizate de restul aplicației.

### **Astro Connections**

1. **Q: Cum funcționează algoritmul de networking bazat pe energie?** **A:** Sistemul identifică profiluri cu afinități de sinastrie ridicate, facilitând conexiuni umane bazate pe rezonanță autentică, nu doar pe interese superficiale. 🤝
2. **Q: Care este utilitatea socială a unei comunități profilate astrologic?** **A:** Reduce disonanța socială și crește calitatea interacțiunilor prin gruparea indivizilor care se pot susține și înțelege la un nivel arhetipal profund.

---

## 🏛️ RESOURCES & PERSISTENCE

### **About Astrology / Cosmic Codex / About Project**

1. **Q: Care este scopul acestor module documentare?** **A:** Acestea servesc drept bibliotecă de referință imuabilă, asigurând transparența metodologică și definirea termenilor tehnici utilizați în platformă. 🏛️
2. **Q: Cum garantează aceste resurse stabilitatea informațională a AstroVerse?** **A:** Fiind pagini cu conținut fix, ele reprezintă "Constituția" aplicației, oferind utilizatorului un punct de reper constant indiferent de actualizările algoritmice.

---

**Protocol de Persistență:** Acest FAQ este integrat în arhitectura de bază a aplicației AstroVerse pentru a asigura punerea în valoare constantă a fiecărui modul de analiză.
        `,
        questions: [] 
    },
    astroAcademy: { 
        title: '🎓 Astro Academy', 
        module1: { title: 'Module 1', progress: 'Progress', lessons: ['The Zodiac', 'The Planets', 'The Elements', 'The Houses'] }, 
        module2: { title: 'Module 2', progress: 'Progress', lessons: ['Planetary Aspects', 'The Ascendant', 'Retrogrades', 'Transits'] }, 
        module3: { title: 'Module 3', progress: 'Progress', lessons: ['Synastry (Compatibility)', 'Lunar Nodes (Karma)', 'Predictive Astrology', 'Midpoints'] }, 
        aiTeacher: { title: 'AI Teacher', subtitle: 'Ask me anything', placeholder: 'Question', button: 'Ask' }, 
        lessonModal: { generating: 'Generating', title: l => l } 
    },
    integralNeuroEmotiveProfile: { title: 'Integral Profile', startTitle: 'Start', startDescription: 'Desc', startButton: 'Start', question: 'Q', of: 'of', likert: ['1','2','3','4','5'], resultsTitle: 'Results', sirScore: 'SIR', sivScore: 'SIV', seaScore: 'SEA', sevScore: 'SEV', retakeButton: 'Retake', analysis: { title: 'Analysis', generating: 'Gen', section1Title: 'S1', section2Title: 'S2', section3Title: 'S3' } },
    integralNumerology: { title: 'Numerology', subtitle: 'Subtitle', form: { fullNameLabel: 'Name', fullNamePlaceholder: 'Name', dobLabel: 'DOB', button: 'Generate' }, reportTitle: 'Report' },
    tarotOracle: { title: 'Tarot', menuTitle: 'Menu', dailyTitle: 'Daily', threeCardTitle: '3 Card', celticCrossTitle: 'Celtic', dailySubtitle: 'Sub', threeCardSubtitle: 'Sub', celticCrossSubtitle: 'Sub', drawCardButton: 'Draw', askQuestionPlaceholder: 'Ask', getReadingButton: 'Get', readingFor: 'Reading', backToMenu: 'Back', positions: { past: 'Past', present: 'Present', future: 'Future', situation: 'Sit', challenge: 'Chal', past_foundation: 'Found', recent_past: 'Recent', potential: 'Pot', near_future: 'Near', self_perception: 'Self', external_influence: 'Ext', hopes_fears: 'Hopes', outcome: 'Out' } },
    astroConnections: { title: 'Connections', onboarding: { title: 'Join', subtitle: 'Sub', privacy: 'Priv', joinButton: 'Join', declineButton: 'No' }, profileSetup: { title: 'Setup', nicknameLabel: 'Nick', nicknamePlaceholder: 'Nick', bioLabel: 'Bio', bioPlaceholder: 'Bio', saveButton: 'Save' }, connectionsList: { title: 'List', filterByZodiac: 'Filter', filterByLifePath: 'Filter', allSigns: 'All', allPaths: 'All', sendIntentButton: 'Send' } },
    authModal: { title: 'Auth', emailLabel: 'Email', passwordLabel: 'Pass', signInButton: 'Sign In', createAccountLink: 'Create', forgotPasswordLink: 'Forgot', signUpTitle: 'Sign Up', confirmPasswordLabel: 'Confirm', signUpButton: 'Sign Up', signInLink: 'Sign In', signInError: 'Error', userExistsError: 'Exists', userNotFoundError: 'Not Found', inactiveUserError: 'Inactive', passwordsDoNotMatch: 'Match', passwordStrength: { title: 'Strength', weak: 'Weak', medium: 'Med', strong: 'Strong', veryStrong: 'Very' }, passwordRequirements: { length: 'Len', uppercase: 'Up', number: 'Num', symbol: 'Sym' }, pendingVerification: { title: 'Pending', message: e => e, simulationNotice: 'Sim', verificationLink: 'Verify' }, forgotPasswordTitle: 'Forgot', forgotPasswordInstructions: 'Instr', sendResetLinkButton: 'Send', backToSignInLink: 'Back', resetLinkSent: { title: 'Sent', message: 'Msg', simulationNotice: 'Sim', resetLink: 'Reset' }, resetPassword: { title: 'Reset', instructions: 'Instr', newPasswordLabel: 'New', button: 'Btn', successTitle: 'Success', successMessage: 'Msg' }, accountActivated: { title: 'Active', message: 'Msg' } },
    lunarGuide: { title: 'Lunar', currentPhase: 'Phase', intentionTitle: 'Intent', illumination: p => `${p}%` },
    loading: 'Loading...', error: { title: 'Error', reading: 'Reading error', audio: 'Audio error' }, errorBoundary: { title: 'Error', message: 'Msg', refreshButton: 'Refresh' }, footer: { rights: 'Rights' },
    astroView: { 
        title: '✨ Astro View', 
        inputLabel: 'Constellation Name (e.g. Orion)', 
        inputPlaceholder: 'Search constellation or star...', 
        button: '✨ Analyze & Visualize', 
        generateArtButton: 'Constellation Map', 
        sections: { 
            identity: 'Identity', 
            archetype: 'Archetype & Symbolism', 
            observing: 'Observation & Visibility Details', 
            bodies: 'Exclusive Celestial Bodies', 
            narrative: 'Narrative', 
            astrophysics: 'Astrophysics', 
            personalAlignment: 'Personal Alignment', 
            art: 'Constellation Map' 
        } 
    },
    energeticAlignment: { title: 'Energetic', subtitle: 'Sub', labels: { powerColor: 'Power', crystal: 'Crystal', benefits: 'Benefits', tips: 'Tips', zodiac: 'Zodiac', lifePath: 'LP' } },
    bioRhythms: { title: 'Bio', subtitle: 'Sub', labels: { physical: 'Phys', emotional: 'Emo', intellectual: 'Int', state: 'State', percentage: 'Pct' }, states: { peak: 'Peak', low: 'Low', rising: 'Rising', falling: 'Falling', critical: 'Critical' } },
    chineseZodiac: { title: 'Chinese', subtitle: 'Sub', labels: { element: 'Elem', polarity: 'Pol', luckyNumbers: 'Nums', luckyColors: 'Cols', compatibility: 'Comp', incompatibility: 'Avoid' }, button: 'Forecast' },
    extendedProfile: { title: 'Extended', subtitle: 'Sub', labels: { vedicSign: 'Vedic', celticTree: 'Celtic', ophiuchusStatus: 'Oph', isOphiuchus: 'Yes', isNotOphiuchus: 'No' }, button: 'Generate' },
    aiImageEditor: {
        title: 'AI Image Editor',
        subtitle: 'Transform your photos with cosmic energy.',
        uploadArea: {
            title: 'Drop your image here, or click to browse',
            or: 'OR',
            cameraButton: 'Use Camera'
        },
        promptLabel: 'What would you like to change?',
        promptPlaceholder: 'e.g. Add a galaxy background, make it look like a painting...',
        generateButton: 'Generate Edit',
        startOver: 'Start Over',
        generating: 'Processing Image...'
    },
    aiImageGenerator: {
        title: 'AI Vision Generator',
        subtitle: 'Visualize your dreams and cosmic insights.',
        promptLabel: 'Describe your vision',
        promptPlaceholder: 'e.g. A golden aura surrounding a meditating person in space...',
        aspectRatioLabel: 'Aspect Ratio',
        generateButton: 'Generate Image',
        startOver: 'Create New',
        generating: 'Manifesting Visuals...'
    },
    store: {
        title: '💎 AstroStore',
        subtitle: 'Invest in your cosmic journey. Secure access to premium insights.',
        tokenBalance: 'Your Balance:',
        // FIX: Replaced 'string' type placeholders with actual string values and corrected semicolons to commas
        tabs: {
            subscriptions: 'Subscriptions',
            tokens: 'Tokens',
        },
        subscriptions: {
            explorer: { title: 'Astro Explorer', desc: '5 Tokens/mo • 10% Discount' },
            insight: { title: 'Astro-Insight', desc: '15 Tokens/mo • 15% Discount' },
            prime: { title: 'Celestial Prime', desc: '30 Tokens/mo • 20% Discount' },
            month: '/mo',
            selectButton: 'Subscribe'
        },
        tokens: {
            small: { title: 'Starter Pack', desc: '10 Tokens' },
            medium: { title: 'Cosmic Voyager', desc: '30 Tokens' },
            large: { title: 'Infinity Bundle', desc: '50 Tokens' },
            buyButton: 'Buy Now'
        },
        premiumUnlock: {
            title: '🔓 Unlock This Premium Feature',
            desc: 'This deep analysis requires advanced AI processing.',
            unlockButton: 'Unlock for'
        },
        insufficientFunds: {
            title: 'Fonduri Insuficiente',
            message: 'Ai nevoie de mai multe jetoane pentru a accesa această funcție premium.',
            action: 'Obține Jetoane'
        }
    }
};

const roTranslations: TranslationSet = {
    ...enTranslations,
    header: {
        ...enTranslations.header,
        title: 'AstroVerse',
        signIn: 'Autentificare',
        signOut: 'Deconectare',
        welcome: 'Bun venit',
        tokens: 'Jetoane',
        menu: {
            home: '🏠 Acasă',
            natalChart: '📜 Astrograma Natală',
            askTheOracle: '🔮 Întreabă Oracolul',
            dreamInterpretation: '🌙 Interpretare Vise',
            vocationalReport: '💼 Raport Vocațional',
            aiFuture: '✨ Prognoză AI Viitor',
            compatibility: '💞 Compatibilitate',
            dailyZodiac: '🗓️ Horoscop Zilnic',
            futureEvents: '⏳ Evenimente Viitoare',
            aboutAstrology: '🏛️ Despre Astrologie',
            legendsMythology: '🏺 Legende & Mitologie',
            cosmicCodex: '📖 Codex Cosmic',
            cognitiveProfiler: '🧠 Profil Cognitiv',
            decisionMatrix: '⚖️ Matrice Decizională',
            astroAcademy: '🎓 Astro Academia',
            integralNeuroEmotiveProfile: '🧘 Profil Neuro-Emotiv Integral',
            integralNumerology: '🔢 Numerologie Integrală',
            tarotOracle: '🃏 Oracol Tarot',
            astroConnections: '🤝 Conexiuni Astro',
            aboutProject: 'ℹ️ Despre Proiect',
            faq: '🤔 Întrebări Frecvente',
            astroView: '✨ Astro View',
            energeticAlignment: '🌈 Aliniere Energetică',
            bioRhythms: '🧬 Bioritmuri',
            chineseZodiac: '🐉 Zodiac Chinezesc',
            extendedProfile: '🔱 Profil Arhetipal Extins',
        },
    },
    hero: { 
        title: 'AstroVerse', 
        subtitle: 'Descoperă amprenta ta cosmică. Introdu datele nașterii pentru a începe călătoria printre stele.', 
        quote: "Cosmosul este în noi. Suntem făcuți din praf de stele. Suntem o cale prin care universul se cunoaște pe sine.",
        lunarIntroQuote: "Destinul este o scrisoare scrisă pe cer, pe care o citim cu alfabetul durerilor noastre."
    },
    form: { 
        dateLabel: 'Data Nașterii', 
        timeLabel: 'Ora Nașterii', 
        locationLabel: 'Locul Nașterii', 
        locationPlaceholder: 'ex: București, România', 
        submitButton: 'Generează Astrograma', 
        required: 'Acest câmp este obligatoriu',
        saveDataLabel: 'Salvați permanent aceste date în contul meu',
        saveAndGenerate: 'Salvați și Generați Harta Astrală',
        generateOnly: 'Generați Harta Astrală (Datele nu se vor salva)'
    },
    reading: { title: 'Astrograma Ta Natală', date: 'Data', time: 'Ora', location: 'Locația', listenButton: '🎧 Ascultă Interpretarea', listeningButton: '🎶 Se redă...', newReadingButton: 'Interpretare Nouă', natalChartTemplate: { summaryTitle: 'Rezumatul Astrogramei Natale', sunSign: 'Zodia Soarelui', risingSign: 'Zodia Ascendentului', moonSign: 'Zodia Lunii', dominantElement: 'Element Dominant', dominantModality: 'Modalitate Dominantă', sunInSignTitle: sign => `Soarele în ${sign}`, sunInHouseTitle: house => `Soarele în Casa a ${house}-a`, moonInSignTitle: sign => `Luna în ${sign}`, chironTitle: 'Chiron: Vindecătorul Rănit', aspectsTitle: 'Aspecte Cheie', favorableAspectsTitle: 'Aspecte Favorabile (Trigoane și Sextile)', challengingAspectsTitle: 'Aspecte Provocatoare (Cuadraturi și Opoziții)', nodesTitle: 'Nodurile Lunare: Calea Ta Karmică', northNodeTitle: 'Nodul Nord: Destinul Sufletului Tău', southNodeTitle: 'Nodul Sud: Zona de Confort din Viețile Anterioare', genericIntroduction: '', genericConclusion: '', keyPlacements: '' } },
    dashboard: { 
        ...enTranslations.dashboard,
        title: 'Cosmic Dashboard', subtitle: 'Explorează universul din tine și din jurul tău.', 
        natalChart: { title: '📜 Astrograma Natală', description: 'Generează amprenta ta cosmică fundamentală.' },
        tarotOracle: { title: '🃏 Oracol Tarot', description: 'Obține îndrumare cu citiri zilnice, de 3 cărți sau Crucea Celtică.' },
    },
    aboutProject: {
        title: 'ℹ️ Despre Proiect',
        placeholder: `
# 🌌 ASTROVERSE
## Manifest Ontologic & Arhitectura Sistemului

Astroverse este un ecosistem digital avansat care realizează convergența dintre mecanica cerească, psihologia arhetipală și inteligența artificială computațională. Nu este o simplă aplicație de divinație, ci o platformă holistică de analiză a ființei umane, concepută pentru a traduce simbolismul universal în date acționabile, insight-uri profunde și strategii de evoluție personală. 🚀

Astroverse funcționează ca un sistem de cartografiere a conștiinței, unde datele astronomice, mitologice și psihologice sunt procesate algoritmic pentru a revela structura identității, dinamica prezentului și potențialul viitorului.

### 🧬 I. CORE READINGS: Fundamentul Identității Energetice
Această secțiune definește amprenta ontologică a utilizatorului, stabilind structura de bază a personalității, potențialului și ritmurilor interioare.

**Natal Chart (Harta Natală)**
Algoritm de poziționare a corpurilor cerești la momentul T0, care definește matricea potențialităților individuale și arhitectura destinului personal. 🗺️

**Extended Archetypal Profile**
Analiză profundă a arhetipurilor jungiene suprapuse peste casele astrologice, oferind o hartă detaliată a psihicului conștient și inconștient. 🎭

**Chinese Zodiac**
Integrarea sistemului sexagenar chinezesc pentru interpretarea ritmurilor macro-temporale, a ciclurilor de viață și a influenței elementelor. 🐉

**Energetic Alignment**
Evaluarea gradului de coerență dintre intenția personală și contextul astral actual, indicând nivelul de flux sau rezistență energetică. ✨

**Bio-Rhythms**
Monitorizarea matematică (model sinusoidal) a ciclurilor fizice, emoționale și intelectuale pentru optimizarea performanței și a deciziilor. 🌊

**Vocational Report**
Identificarea direcțiilor de împlinire profesională prin analiza nodurilor lunare, a poziției Midheaven și a dinamicii caselor de carieră. 💼

**Integral Numerology**
Analiza frecvențelor numerice derivate din date onomastice și temporale pentru extragerea algoritmilor personali de destin. 🔢

### 🔮 II. ORACULAR & SYMBOLIC SYSTEMS: Dialog cu Inconștientul și Sincronicitatea
Instrumente dedicate interpretării simbolice și explorării dimensiunilor subtile ale experienței umane:

**Ask the Oracle**
Interfață NLP (Natural Language Processing) pentru interogații filosofice, existențiale și ezoterice, oferind răspunsuri contextualizate arhetipal. 🔮

**Dream Interpretation**
Decriptarea simbolică a viselor prin prisma inconștientului colectiv, miturilor universale și arhetipurilor recurente. 🌙

**Tarot Oracle**
Sistem de divinație bazat pe sincronicitate și recunoașterea pattern-urilor arhetipale utilizând setul Rider–Waite. 🃏

### 📈 III. FORECASTS: Modelare Predictivă & Dinamica Timpului
Această secțiune explorează vectorii temporali viitori, folosind astrologia predictivă augmentată de inteligență artificială.

**AI Future Forecast**
Motor predictiv care corelează tranzitele planetare cu datele personale pentru a genera scenarii probabilistice pe termen mediu și lung. ✨

**Daily Horoscope**
Micro-analiză a tranzitelor lunare și planetare pentru ghidaj cotidian rapid și contextual. 📅

**Compatibility**
Analiză de sinastrie computațională între două amprente energetice pentru evaluarea rezonanței relaționale. 💕

**Future Events**
Calendar al evenimentelor astrologice și astronomice majore, cu impact asupra conștiinței individuale și colective. ⏳

**Astro View**
Vizualizare în timp real a configurațiilor cerești raportate la locația geografică a utilizatorului. 🛰️

### 🧠 IV. PSYCHOMETRICS: Știința Sinelui și Decizia Conștientă
O abordare analitică a comportamentului uman prin integrarea datelor ezoterice cu modele cognitive moderne.

**Cognitive Profiler**
Maparea stilurilor de gândire, învățare și proces decizional pe baza configurațiilor planetare. 🧠

**Decision Matrix**
Instrument de optimizare a alegerilor majore folosind ferestre de oportunitate astrologică (Electoral Astrology). ⚖️

**Integral Neuro-Emotive Profile**
Sinteză între stările emoționale și pattern-urilor neurologice simulate pe baza tranzitelor și ritmurilor astrale. 🧘

### 🎓 V. COMMUNITY & LEARNING: Expansiunea Conștiinței Colective

**Astro Academy**
Modul educațional pentru studiu continuu în domeniul astrologiei, hermetismului și simbolismului cosmic. 🎓

**Astro Connections**
Rețea socială construită pe afinități energetice, profiluri arhetipale și rezonanțe astrale comune. 🤝

### 🏛️ VI. RESOURCES: Pilonii Informaționali ai Sistemului

**About Astrology**
Epistemologia Astroverse și fundamentele istorice, filosofice și simbolice ale astrologiei. 🏛️

**Cosmic Codex**
Enciclopedie exhaustivă a termenilor tehnici, mitologici și ezoterici utilizați în platformă. 📖

**About Project**
Viziunea Astroverse: democratizarea accesului la înțelepciunea ancestrală prin tehnologie avansată. ℹ️

**FAQ**
Centru de suport pentru utilizare, interpretare corectă a datelor și întrebări frecvente. 🤔
        `
    },
    faq: {
        title: '🤔 FAQ: Scientific & Methodological Inquiries',
        scientificFaq: `
# 🏛️ FAQ: Scientific & Methodological Inquiries

Această secțiune oferă o perspectivă academică și tehnică asupra mecanismelor care guvernează ecosistemul **AstroVerse**, explicând validitatea și utilitatea fiecărui modul analitic.

## 💳 INFRASTRUCTURĂ ȘI TRANZACȚIONALITATE

**Q: Cum facilitează arhitectura bazată pe tokeni explorarea personalizată a sistemului?** **A:** Sistemul nostru utilizează o unitate de schimb internă (tokeni) pentru a asigura o lichiditate modulară a serviciilor. Utilizatorul achiziționează un volum de resurse pe care le poate aloca ulterior în mod asincron, conform priorităților sale de analiză, oferind o flexibilitate totală în accesarea modulelor de înaltă complexitate. 💎

**Q: Care este avantajul economic al modelului de achiziție a tokenilor față de abonamentele tradiționale?** **A:** Spre deosebire de modelele liniare, sistemul de tokeni elimină risipa de resurse. Utilizatorul investește strict în modulele necesare profilării sale curente, transformând fiecare interacțiune într'o investiție precisă în auto-cunoaștere și optimizare. 📈

---

## 🪐 CORE READINGS: ANALIZĂ ONTOLOGICĂ

### **Natal Chart**

1. **Q: Care este rigoarea matematică din spatele generării Hărții Natale în AstroVerse?** **A:** Utilizăm algoritmi de telemăsurătoare astronomică de precizie epocale (J2000.0) pentru a mapa pozițiile corpurilor cerești la momentul T0, oferind o matrice energetică fundamentală de o acuratețe absolută. 🗺️
2. **Q: Cum contribuie Harta Natală la definirea vectorilor de dezvoltare personală?** **A:** Aceasta funcționează ca un blueprint ontologic, identificând predispozițiile cognitive și emoționale native care servesc drept bază pentru toate analizele ulterioare ale sistemului.

### **Extended Archetypal Profile**

1. **Q: Ce reprezintă profilarea arhetipală extinsă din punct de vedere neuro-psihologic?** **A:** Este o sinteză între psihologia analitică jungiană și simbolismul planetar, care izolează structurile profunde ale personalității pentru a înțelege motivațiile subconștiente. 🎭
2. **Q: De ce este această analiză superioară testelor standard de personalitate?** **A:** Deoarece integrează variabile temporale și cosmice care depășesc auto-evaluarea subiectivă, oferind o perspectivă multidimensională asupra identității.

### **Chinese Zodiac**

1. **Q: Cum integrează AstroVerse sistemul sexagenar în analizele moderne?** **A:** Analizăm rezonanța dintre elementele primordiale și tulpinile cerești pentru a identifica ritmurile macro-temporale care guvernează dinamica succesului și a echilibrului. 🐉
2. **Q: Care este utilitatea practică a cunoașterii zodiei chinezești în acest ecosistem?** **A:** Oferă un strat suplimentar de interpretare a compatibilității și a ciclurilor de noroc, esențial pentru planificarea strategică pe termen lung.

### **Energetic Alignment**

1. **Q: Ce metodologie utilizează funcția de Aliniere Energetică?** **A:** Se bazează pe calculul unghiurilor de aspect dintre tranzitele curente și punctele sensibile ale hărții natale, măsurând gradul de coerență vibratorie al utilizatorului. ✨
2. **Q: Cum poate fi utilizat acest modul pentru optimizarea stării de bine?** **A:** Identifică perioadele de maximă eficiență energetică, permițând utilizatorului să își sincronizeze eforturile cu fluxul universal pentru rezultate maxime.

### **Bio-Rhythms**

1. **Q: Care este fundamentul biologic al calculului sinusoidelor de bioritm?** **A:** Algoritmul monitorizează cele trei cicluri critice (fizic, emoțional, intelectual) bazându-se pe periodicitatea biologică recunoscută, oferind o prognoză a capacității de performanță. 🌊
2. **Q: Cum previne acest modul stările de burnout sau ineficiență?** **A:** Prin vizualizarea perioadelor de declin ciclic, utilizatorul poate implementa strategii de conservare a energiei și de management al stresului în moumentele critice.

### **Ask the Oracle**

1. **Q: Cum procesează Inteligența Artificială interogările de natură ezoterică?** **A:** Modulul utilizează procesarea limbajului natural (NLP) pentru a corela întrebările filosofice cu vasta bază de date hermetice și simbolice a AstroVerse. 🔮
2. **Q: Care este valoarea adăugată a acestui modul față de o căutare informațională simplă?** **A:** Oracle oferă un răspuns contextualizat și sintetic, acționând ca un mentor filosofic digital capabil de asocieri complexe de idei.

### **Dream Interpretation**

1. **Q: Ce cadru metodologic este aplicat în decriptarea activității onirice?** **A:** Interpretarea se bazează pe semiotica viselor și pe lexiconul de simboluri universale ale inconștientului colectiv, oferind o punte între viața conștientă și cea latentă. 🌙
2. **Q: De ce este esențială înțelegerea viselor pentru un profil de personalitate complet?** **A:** Visele reprezintă procesarea nocturnă a reziduurilor psihice și a dorințelor reprimate, revelând direcții de evoluție pe care logica diurnă le poate omite.

### **Astro View**

1. **Q: Ce date tehnice furnizează modulul Astro View?** **A:** Oferă o telemetrie vizuală a sferelor cerești în timp real, raportată la coordonatele GPS ale utilizatorului, facilitând orientarea astronomică și astrologică. 🛰️
2. **Q: Cum îmbunătățește această vizualizare conexiunea utilizatorului cu mediul cosmic?** **A:** Transformă conceptele abstracte în observații tangibile, permițând observarea directă a fenomenelor care influențează profilul astrologic curent.

### **Vocational Report**

1. **Q: Cum identifică algoritmul vectorii de succes profesional?** **A:** Analizează casa a X-a (Midheaven), poziția lui Saturn și a Nodurilor Lunare pentru a extrage algoritmi de performanță și împlinire în carieră. 💼
2. **Q: Care este utilitatea acestui raport în managementul carierei moderne?** **A:** Oferă o direcție strategică utilizatorului, minimizând riscul de eroare vocațională și maximizând potențialul de realizare socio-economică.

### **Integral Numerology**

1. **Q: Care este baza de calcul a numerologiei integrative în AstroVerse?** **A:** Folosim metode avansate de reducere teozofică și corelare alfanumerică pentru a extrage frecvențele vibraționale ale onomasticii și datelor temporale. 🔢
2. **Q: Cum completează datele numerologice analiza astrologică?** **A:** Numerologia oferă structura cantitativă a destinului, funcționând ca un sistem de verificare încrucișată pentru previziunile calitative ale astrelor.

### **Tarot Oracle**

1. **Q: Cum este simulată sincronicitatea în extracția digitală de Tarot?** **A:** Utilizăm generatoare de numere pseudo-aleatorii calibrate pe variabile de context, permițând manifestarea principiului sincronicității jungiene în spațiul digital. 🃏
2. **Q: Care este valoarea educativă a afișajului în grid de 10 cărți?** **A:** Permite o vizualizare panoramică a dinamicii dintre arhetipuri, oferind o interpretare sistemică a situației analizate, dincolo de semnificația izolată a fiecărei cărți.

---

## 📈 FORECASTS: MODELARE PREDICTIVĂ

### **AI Future Forecast**

1. **Q: Ce modele statistice utilizează motorul predictiv AstroVerse?** **A:** AI-ul procesează vectorii de probabilitate rezultați din mișcarea planetară actuală raportată la punctele radix, simulând scenarii de viitor cu un grad ridicat de precizie. ✨
2. **Q: Cum poate un utilizator să modifice rezultatul unei prognoze?** **A:** Prognoza identifică ferestre de oportunitate; utilizatorul deține liberul arbitru pentru a acționa în acele intervale, transformând potențialul în realitate.

### **Compatibility**

1. **Q: Ce reprezintă sinastria computațională în acest modul?** **A:** Este analiza termodinamică a relației dintre două hărți natale, măsurând gradul de atracție, tensiune și durabilitate între două profiluri energetice. 💕
2. **Q: De ce este acest instrument vital pentru relațiile interpersonale?** **A:** Oferă o foaie de parcurs pentru comunicare și înțelegere reciprocă, anticipând zonele de conflict și punctele de rezonanță profundă.

### **Daily Horoscope**

1. **Q: Cum se diferențiază Horoscopul Daily AstroVerse de previziunile mass-media?** **A:** Este un micro-horoscop personalizat, calibrat pe tranzitele Lunii și ale planetelor rapide în raport cu casele astrologice specifice ale utilizatorului. 📅
2. **Q: Care este valoarea operațională a acestui ghid zilnic?** **A:** Permite ajustarea tactică a comportamentului cotidian pentru a evita disonanțele energetice minore și a profita de fluxurile favorabile.

### **Future Events**

1. **Q: Ce criterii definesc un eveniment ca fiind relevant în calendarul nostru?** **A:** Sunt selectate tranzitele majore (aspecte interplanetare, ingrese, eclipse) care au un impact dovedit statistic asupra psihicului colectiv și individual. ⏳
2. **Q: Cum ajută acest calendar în planificarea pe termen lung?** **A:** Oferă o perspectivă asupra "vremii astrologice" viitoare, permițând utilizatorului să își plaseze proiectele importante în perioade de expansiune cosmică.

### **Legends & Mythology**

1. **Q: De ce este inclusă mitologia într'o aplicație tehnologică?** **A:** Miturile reprezintă arhiva narativă a arhetipurilor; înțelegerea lor conferă profunzime și context cultural interpretărilor astrologice moderne. 🏺
2. **Q: Cum îmbogățește acest modul experiența utilizatorului?** **A:** Transformă procesul de analiză într'o călătorie culturală, facilitând asimilarea conceptelor complexe prin intermediul poveștilor fondatoare ale umanității.

---

## 🧠 PSYCHOMETRICS: INGINERIE COGNITIVĂ

### **Cognitive Profiler**

1. **Q: Cum mapează sistemul funcțiile executive cerebrale?** **A:** Corelăm aspectele mercuriene și marțiene cu procesele de procesare a informației și luare a deciziilor, oferind o profilare a stilului cognitiv. 🧠
2. **Q: Care este valoarea practică a acestui profil în educație sau muncă?** **A:** Permite utilizatorului să își identifice metoda optimă de învățare și de rezolvare a problemelor, crescând eficiența intelectuală.

### **Decision Matrix**

1. **Q: Ce este euristica decizională bazată pe astrologie?** **A:** Este un instrument de optimizare a alegerilor care cântărește riscurile și beneficiile prin prisma sincronicității astrale. ⚖️
2. **Q: Cum elimină acest modul paralizia decizională?** **A:** Oferă un cadru de referință obiectiv, bazat pe datele de tranzit, care ajută la prioritizarea acțiunilor în moumentele de incertitudine.

### **Integral Neuro-Emotive Profile**

1. **Q: Ce reprezintă sinteza neuro-emotivă în contextul AstroVerse?** **A:** Este o evaluare a rezilienței psihologice, combinând pattern-urile emoționale lunare cu dinamica impulsivității sau a reținerii sugerate de planetele sociale. 🧘
2. **Q: Cum susține acest profil sănătatea mintală și echilibrul interior?** **A:** Oferă utilizatorului o hartă a punctelor vulnerabile emoțional, permițând intervenții conștiente pentru menținerea homeostaziei psihice.

---

## 🎓 COMMUNITY & LEARNING

### **Astro Academy**

1. **Q: Care este rigoarea curiculei educaționale din Astro Academy?** **A:** Oferim cursuri sistematice de alfabetizare ezoterică, trecând de la concepte de bază la mecanica cerească avansată și tehnici de interpretare riguroase. 🎓
2. **Q: Cum transformă acest modul un simplu utilizator într'un expert?** **A:** Prin furnizarea instrumentelor teoretice necesare pentru a valida și a înțelege independent datele furnizate de restul aplicației.

### **Astro Connections**

1. **Q: Cum funcționează algoritmul de networking bazat pe energie?** **A:** Sistemul identifică profiluri cu afinități de sinastrie ridicate, facilitând conexiuni umane bazate pe rezonanță autentică, nu doar pe interese superficiale. 🤝
2. **Q: Care este utilitatea socială a unei comunități profilate astrologic?** **A:** Reduce disonanța socială și crește calitatea interacțiunilor prin gruparea indivizilor care se pot susține și înțelege la un nivel arhetipal profund.

---

## 🏛️ RESOURCES & PERSISTENCE

### **About Astrology / Cosmic Codex / About Project**

1. **Q: Care este scopul acestor module documentare?** **A:** Acestea servesc drept bibliotecă de referință imuabilă, asigurând transparența metodologică și definirea termenilor tehnici utilizați în platformă. 🏛️
2. **Q: Cum garantează aceste resurse stabilitatea informațională a AstroVerse?** **A:** Fiind pagini cu conținut fix, ele reprezintă "Constituția" aplicației, oferind utilizatorului un punct de reper constant indiferent de actualizările algoritmice.

---

**Protocol de Persistență:** Acest FAQ este integrat în arhitectura de bază a aplicației AstroVerse pentru a asigura punerea în valoare constantă a fiecărui modul de analiză.
        `,
        questions: [] 
    },
    tarotOracle: {
        title: 'Tarot',
        menuTitle: 'Meniu',
        dailyTitle: 'Zilnic',
        threeCardTitle: '3 Cărți',
        celticCrossTitle: 'Crucea Celtică',
        dailySubtitle: 'O singură carte pentru azi.',
        threeCardSubtitle: 'Trecut, prezent, viitor.',
        celticCrossSubtitle: 'Perspectivă aprofundată asupra situației.',
        drawCardButton: 'Extrage',
        askQuestionPlaceholder: 'Pune o întrebare clară și sinceră...',
        getReadingButton: 'Obține Citirea',
        readingFor: 'Citire pentru',
        backToMenu: 'Înapoi',
        positions: {
            past: 'Trecut',
            present: 'Prezent',
            future: 'Viitor',
            situation: 'Situație',
            challenge: 'Provocare',
            past_foundation: 'Fundație',
            recent_past: 'Trecut Recent',
            potential: 'Potențial',
            near_future: 'Viitor Apropiat',
            self_perception: 'Percepția de Sine',
            external_influence: 'Influență Externă',
            hopes_fears: 'Speranțe/Temeri',
            outcome: 'Rezultat'
        }
    }
};

export const translations: Translations = {
    en: enTranslations,
    ro: roTranslations,
    es: enTranslations,
    fr: enTranslations,
    de: enTranslations,
};
