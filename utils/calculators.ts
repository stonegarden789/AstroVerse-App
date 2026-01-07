
/* -------------------------------------------------------------------------- */
/*                        ASTROLOGY & BIOPHYSICS LOGIC                        */
/* -------------------------------------------------------------------------- */

// --- DATA DICTIONARIES ---

const LIFE_PATH_COLORS: { [key: number]: { color: string, hex: string, benefit: string, tips: string[] } } = {
    1: { color: 'Red', hex: '#ef4444', benefit: 'Vitality, Leadership, Courage', tips: ['Wear red to boost confidence.', 'Use red jasper for grounding.', 'Visualize red light filling your spine.'] },
    2: { color: 'Orange', hex: '#f97316', benefit: 'Harmony, Creativity, Connection', tips: ['Surround yourself with soft textures.', 'Meditate on the sacral chakra.', 'Practice active listening.'] },
    3: { color: 'Yellow', hex: '#eab308', benefit: 'Joy, Expression, Optimism', tips: ['Seek sunlight daily.', 'Engage in creative writing.', 'Wear gold jewelry.'] },
    4: { color: 'Green', hex: '#22c55e', benefit: 'Stability, Healing, Growth', tips: ['Spend time in forests.', 'Keep plants in your workspace.', 'Focus on heart-centered breathing.'] },
    5: { color: 'Blue', hex: '#3b82f6', benefit: 'Freedom, Change, Communication', tips: ['Visit bodies of water.', 'Sing or chant to clear the throat chakra.', 'Travel to new places.'] },
    6: { color: 'Indigo', hex: '#6366f1', benefit: 'Nurturing, Vision, Responsibility', tips: ['Decorate with calming blues.', 'Practice acts of service.', 'Trust your intuition.'] },
    7: { color: 'Violet', hex: '#8b5cf6', benefit: 'Spirituality, Wisdom, Introspection', tips: ['Meditate in silence.', 'Read philosophical texts.', 'Use amethyst crystals.'] },
    8: { color: 'Rose/Power Pink', hex: '#ec4899', benefit: 'Abundance, Power, Authority', tips: ['Dress for success.', 'Visualize material goals.', 'Practice gratitude for wealth.'] },
    9: { color: 'Gold/White', hex: '#fbbf24', benefit: 'Compassion, Completion, Universality', tips: ['Volunteer for a cause.', 'Practice forgiveness.', 'Visualize white light protection.'] },
    11: { color: 'Silver', hex: '#94a3b8', benefit: 'Intuition, Illumination, Mastery', tips: ['Trust your gut feelings.', 'Keep a dream journal.', 'Seek balance in all things.'] },
    22: { color: 'Cream/Coral', hex: '#ffedd5', benefit: 'Building, Manifestation, Legacy', tips: ['Plan long-term goals.', 'Build solid foundations.', 'Teach others what you know.'] },
    33: { color: 'Sky Blue', hex: '#0ea5e9', benefit: 'Healing, Teaching, Uplifting', tips: ['Offer guidance to others.', 'Practice unconditional love.', 'Express your truth gently.'] }
};

// Romanian Translations for Colors
const LIFE_PATH_COLORS_RO: { [key: number]: { color: string, benefit: string, tips: string[] } } = {
    1: { color: 'Roșu', benefit: 'Vitalitate, Leadership, Curaj', tips: ['Poartă roșu pentru încredere.', 'Folosește jasp roșu pentru împământare.', 'Vizualizează lumină roșie la baza coloanei.'] },
    2: { color: 'Portocaliu', benefit: 'Armonie, Creativitate, Conexiune', tips: ['Înconjoară-te de texturi moi.', 'Meditează asupra chakrei sacrale.', 'Practică ascultarea activă.'] },
    3: { color: 'Galben', benefit: 'Bucurie, Expresie, Optimism', tips: ['Caută lumina soarelui zilnic.', 'Scrie creativ.', 'Poartă bijuterii aurii.'] },
    4: { color: 'Verde', benefit: 'Stabilitate, Vindecare, Creștere', tips: ['Petrece timp în pădure.', 'Ține plante în spațiul de lucru.', 'Concentrează-te pe respirația din inimă.'] },
    5: { color: 'Albastru', benefit: 'Libertate, Schimbare, Comunicare', tips: ['Vizitează ape curgătoare.', 'Cântă pentru a curăța chakra gâtului.', 'Călătorește în locuri noi.'] },
    6: { color: 'Indigo', benefit: 'Grijă, Viziune, Responsabilitate', tips: ['Decorează cu albastru calmant.', 'Fă fapte bune.', 'Ai încredere în intuiția ta.'] },
    7: { color: 'Violet', benefit: 'Spiritualitate, Înțelepciune, Introspecție', tips: ['Meditează în tăcere.', 'Citește texte filozofice.', 'Folosește cristale de ametist.'] },
    8: { color: 'Roz Puternic', benefit: 'Abundență, Putere, Autoritate', tips: ['Îmbracă-te pentru succes.', 'Vizualizează obiective materiale.', 'Practică recunoștința pentru bogăție.'] },
    9: { color: 'Aur/Alb', benefit: 'Compasiune, Finalizare, Universalitate', tips: ['Fă voluntariat.', 'Practică iertarea.', 'Vizualizează protecția luminii albe.'] },
    11: { color: 'Argintiu', benefit: 'Intuiție, Iluminare, Măiestrie', tips: ['Ai încredere în instincte.', 'Ține un jurnal de vise.', 'Caută echilibrul în toate.'] },
    22: { color: 'Crem/Coral', benefit: 'Construcție, Manifestare, Moștenire', tips: ['Planifică pe termen lung.', 'Construiește fundații solide.', 'Învață-i pe alții.'] },
    33: { color: 'Bleu', benefit: 'Vindecare, Predare, Înălțare', tips: ['Oferă îndrumare.', 'Practică iubirea necondiționată.', 'Exprimă-ți adevărul cu blândețe.'] }
};

const ZODIAC_CRYSTALS: { [key: string]: { crystal: string, benefit: string } } = {
    'Aries': { crystal: 'Carnelian', benefit: 'Boosts energy and courage.' },
    'Taurus': { crystal: 'Rose Quartz', benefit: 'Promotes love and peace.' },
    'Gemini': { crystal: 'Citrine', benefit: 'Enhances clarity and joy.' },
    'Cancer': { crystal: 'Moonstone', benefit: 'Strengthens intuition and emotions.' },
    'Leo': { crystal: 'Tiger\'s Eye', benefit: 'Increases confidence and protection.' },
    'Virgo': { crystal: 'Amazonite', benefit: 'Soothes anxiety and brings order.' },
    'Libra': { crystal: 'Lapis Lazuli', benefit: 'Encourages harmony and truth.' },
    'Scorpio': { crystal: 'Obsidian', benefit: 'Provides shielding and grounding.' },
    'Sagittarius': { crystal: 'Turquoise', benefit: 'Brings luck and protection during travel.' },
    'Capricorn': { crystal: 'Garnet', benefit: 'Inspires success and commitment.' },
    'Aquarius': { crystal: 'Amethyst', benefit: 'Enhances spiritual awareness.' },
    'Pisces': { crystal: 'Aquamarine', benefit: 'Calms the mind and aids meditation.' }
};

const ZODIAC_CRYSTALS_RO: { [key: string]: { crystal: string, benefit: string } } = {
    'Aries': { crystal: 'Carneol', benefit: 'Amplifică energia și curajul.' },
    'Taurus': { crystal: 'Cuarț Roz', benefit: 'Promovează iubirea și pacea.' },
    'Gemini': { crystal: 'Citrin', benefit: 'Îmbunătățește claritatea și bucuria.' },
    'Cancer': { crystal: 'Piatra Lunii', benefit: 'Întărește intuiția și emoțiile.' },
    'Leo': { crystal: 'Ochi de Tigru', benefit: 'Crește încrederea și protecția.' },
    'Virgo': { crystal: 'Amazonit', benefit: 'Calmează anxietatea și aduce ordine.' },
    'Libra': { crystal: 'Lapis Lazuli', benefit: 'Încurajează armonia și adevărul.' },
    'Scorpio': { crystal: 'Obsidian', benefit: 'Oferă scut și împământare.' },
    'Sagittarius': { crystal: 'Turcoaz', benefit: 'Aduce noroc și protecție în călătorii.' },
    'Capricorn': { crystal: 'Granat', benefit: 'Inspiră succes și angajament.' },
    'Aquarius': { crystal: 'Ametist', benefit: 'Amplifică conștientizarea spirituală.' },
    'Pisces': { crystal: 'Acvamarin', benefit: 'Calmează mintea și ajută la meditație.' }
};

// --- LOGIC FUNCTIONS ---

export const getLifePathNumber = (birthDate: string): number => {
    const digits = birthDate.replace(/-/g, '').split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    
    // Reduce until single digit or master number
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return sum;
};

export const getZodiacSign = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
};

export const getEnergeticProfile = (birthDate: string, language: string) => {
    const lp = getLifePathNumber(birthDate);
    const zodiac = getZodiacSign(birthDate);
    
    const isRo = language === 'ro';
    
    // Select correct dictionary based on language
    const colorData = isRo ? (LIFE_PATH_COLORS_RO[lp] || LIFE_PATH_COLORS_RO[1]) : (LIFE_PATH_COLORS[lp] || LIFE_PATH_COLORS[1]);
    // Always use base data for hex codes which are language agnostic
    const baseColorData = LIFE_PATH_COLORS[lp] || LIFE_PATH_COLORS[1]; 
    
    const crystalData = isRo ? (ZODIAC_CRYSTALS_RO[zodiac] || ZODIAC_CRYSTALS_RO['Aries']) : (ZODIAC_CRYSTALS[zodiac] || ZODIAC_CRYSTALS['Aries']);

    return {
        lifePath: lp,
        zodiac: zodiac,
        powerColor: colorData.color,
        hex: baseColorData.hex,
        colorBenefit: colorData.benefit,
        tips: colorData.tips,
        crystal: crystalData.crystal,
        crystalBenefit: crystalData.benefit
    };
};

export interface BioRhythmCycle {
    value: number; // -1 to 1
    percentage: number; // 0 to 100
    state: 'Peak' | 'Low' | 'Rising' | 'Falling' | 'Critical';
}

export const calculateBiorhythms = (birthDate: string) => {
    const birth = new Date(birthDate);
    const target = new Date();
    // Reset time to ensure day calculation is accurate
    birth.setHours(0,0,0,0);
    target.setHours(0,0,0,0);
    
    const diffTime = target.getTime() - birth.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const calculateCycle = (cycleLength: number): BioRhythmCycle => {
        const raw = Math.sin((2 * Math.PI * days) / cycleLength);
        const nextDayRaw = Math.sin((2 * Math.PI * (days + 1)) / cycleLength);
        
        const percentage = Math.round(((raw + 1) / 2) * 100);
        let state: 'Peak' | 'Low' | 'Rising' | 'Falling' | 'Critical' = 'Rising';
        
        if (Math.abs(raw) < 0.1) state = 'Critical'; // Crossing zero
        else if (raw > 0.9) state = 'Peak';
        else if (raw < -0.9) state = 'Low';
        else if (nextDayRaw > raw) state = 'Rising';
        else state = 'Falling';
        
        return { value: raw, percentage, state };
    };

    return {
        physical: calculateCycle(23),
        emotional: calculateCycle(28),
        intellectual: calculateCycle(33),
        daysLived: days
    };
};
