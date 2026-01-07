
/* -------------------------------------------------------------------------- */
/*                          CHINESE ZODIAC UTILITIES                          */
/* -------------------------------------------------------------------------- */

import type { Language } from '../types';

// --- TYPE DEFINITIONS ---

export interface ChineseZodiacData {
    animal: string;
    animalEn: string;
    element: string; // Wood, Fire, etc.
    yinYang: 'Yin' | 'Yang';
    description: string;
    traits: string[];
    luckyColors: string[];
    luckyNumbers: number[];
    compatibility: string[]; // Best matches
    incompatibility: string[]; // Avoid
    profession: string;
}

// --- DATA: CHINESE NEW YEAR DATES (1920 - 2040) ---
// Simplified map for Year -> CNY Start Date (Month-Day string "MM-DD")
// Critical for calculating Jan/Feb births correctly.
const CNY_DATES: { [year: number]: string } = {
    1920: '02-20', 1921: '02-08', 1922: '01-28', 1923: '02-16', 1924: '02-05', 1925: '01-24', 1926: '02-13', 1927: '02-02', 1928: '01-23', 1929: '02-10',
    1930: '01-30', 1931: '02-17', 1932: '02-06', 1933: '01-26', 1934: '02-14', 1935: '02-04', 1936: '01-24', 1937: '02-11', 1938: '01-31', 1939: '02-19',
    1940: '02-08', 1941: '01-27', 1942: '02-15', 1943: '02-05', 1944: '01-25', 1945: '02-13', 1946: '02-02', 1947: '01-22', 1948: '02-10', 1949: '01-29',
    1950: '02-17', 1951: '02-06', 1952: '01-27', 1953: '02-14', 1954: '02-03', 1955: '01-24', 1956: '02-12', 1957: '01-31', 1958: '02-18', 1959: '02-08',
    1960: '01-28', 1961: '02-15', 1962: '02-05', 1963: '01-25', 1964: '02-13', 1965: '02-02', 1966: '01-21', 1967: '02-09', 1968: '01-30', 1969: '02-17',
    1970: '02-06', 1971: '01-27', 1972: '02-15', 1973: '02-03', 1974: '01-23', 1975: '02-11', 1976: '01-31', 1977: '02-18', 1978: '02-07', 1979: '01-28',
    1980: '02-16', 1981: '02-05', 1982: '01-25', 1983: '02-13', 1984: '02-02', 1985: '02-20', 1986: '02-09', 1987: '01-29', 1988: '02-17', 1989: '02-06',
    1990: '01-27', 1991: '02-15', 1992: '02-04', 1993: '01-23', 1994: '02-10', 1995: '01-31', 1996: '02-19', 1997: '02-07', 1998: '01-28', 1999: '02-16',
    2000: '02-05', 2001: '01-24', 2002: '02-12', 2003: '02-01', 2004: '01-22', 2005: '02-09', 2006: '01-29', 2007: '02-18', 2008: '02-07', 2009: '01-26',
    2010: '02-14', 2011: '02-03', 2012: '01-23', 2013: '02-10', 2014: '01-31', 2015: '02-19', 2016: '02-08', 2017: '01-28', 2018: '02-16', 2019: '02-05',
    2020: '01-25', 2021: '02-12', 2022: '02-01', 2023: '01-22', 2024: '02-10', 2025: '01-29', 2026: '02-17', 2027: '02-06', 2028: '01-26', 2029: '02-13',
    2030: '02-03', 2031: '01-23', 2032: '02-11', 2033: '01-31', 2034: '02-19', 2035: '02-08', 2036: '01-28', 2037: '02-15', 2038: '02-04', 2039: '01-24',
    2040: '02-12'
};

const ANIMALS_ORDER = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

// --- TRANSLATIONS & STATIC DATA ---

const ANIMALS_DATA: Record<string, Record<string, any>> = {
    'Rat': {
        ro: { name: 'Șobolan', description: 'Inteligent, adaptabil și plin de resurse. Șobolanii sunt supraviețuitori înnăscuți.', traits: ['Ambițios', 'Sincer', 'Generos'], profession: 'Antreprenor, Scriitor' },
        en: { name: 'Rat', description: 'Quick-witted, resourceful, and versatile. Rats are natural survivors.', traits: ['Ambitious', 'Honest', 'Generous'], profession: 'Entrepreneur, Writer' },
        compatibility: ['Dragon', 'Monkey', 'Ox'], incompatible: ['Horse', 'Goat'], luckyColors: ['Blue', 'Gold', 'Green'], luckyNumbers: [2, 3]
    },
    'Ox': {
        ro: { name: 'Bivol', description: 'Harnic, puternic și determinat. Bivolii inspiră încredere prin stabilitatea lor.', traits: ['Răbdător', 'Conservator', 'Loial'], profession: 'Inginer, Fermier' },
        en: { name: 'Ox', description: 'Diligent, dependable, and strong. Oxen inspire confidence through stability.', traits: ['Patient', 'Conservative', 'Loyal'], profession: 'Engineer, Farmer' },
        compatibility: ['Rat', 'Snake', 'Rooster'], incompatible: ['Tiger', 'Dragon', 'Horse', 'Goat'], luckyColors: ['White', 'Yellow', 'Green'], luckyNumbers: [1, 4]
    },
    'Tiger': {
        ro: { name: 'Tigru', description: 'Curajos, competitiv și imprevizibil. Tigrii sunt lideri naturali și protectori.', traits: ['Curajos', 'Încrezător', 'Carismatic'], profession: 'Manager, Actor' },
        en: { name: 'Tiger', description: 'Brave, competitive, and unpredictable. Tigers are natural leaders.', traits: ['Courageous', 'Confident', 'Charismatic'], profession: 'Manager, Actor' },
        compatibility: ['Horse', 'Dog', 'Pig'], incompatible: ['Snake', 'Monkey'], luckyColors: ['Blue', 'Gray', 'Orange'], luckyNumbers: [1, 3, 4]
    },
    'Rabbit': {
        ro: { name: 'Iepure', description: 'Gentil, elegant și alert. Iepurii caută pacea și evită conflictele.', traits: ['Empatic', 'Modest', 'Diplomat'], profession: 'Artist, Diplomat' },
        en: { name: 'Rabbit', description: 'Gentle, quiet, elegant, and alert. Rabbits seek peace and avoid conflict.', traits: ['Empathetic', 'Modest', 'Diplomatic'], profession: 'Artist, Diplomat' },
        compatibility: ['Goat', 'Dog', 'Pig'], incompatible: ['Rat', 'Rooster'], luckyColors: ['Red', 'Pink', 'Purple'], luckyNumbers: [3, 4, 6]
    },
    'Dragon': {
        ro: { name: 'Dragon', description: 'Puternic, norocos și nobil. Dragonul este singurul animal mitic, simbolizând autoritatea.', traits: ['Inteligent', 'Entuziast', 'Încrezător'], profession: 'Lider, Inventator' },
        en: { name: 'Dragon', description: 'Confident, intelligent, and enthusiastic. The Dragon symbolizes power and authority.', traits: ['Intelligent', 'Enthusiastic', 'Confident'], profession: 'Leader, Inventor' },
        compatibility: ['Rat', 'Monkey', 'Rooster'], incompatible: ['Ox', 'Dog'], luckyColors: ['Gold', 'Silver', 'Gray'], luckyNumbers: [1, 6, 7]
    },
    'Snake': {
        ro: { name: 'Șarpe', description: 'Enigmatic, inteligent și înțelept. Șerpii sunt gânditori profunzi și intuitivi.', traits: ['Înțelept', 'Privat', 'Hotărât'], profession: 'Om de știință, Analist' },
        en: { name: 'Snake', description: 'Enigmatic, intelligent, and wise. Snakes are deep thinkers and highly intuitive.', traits: ['Wise', 'Private', 'Determined'], profession: 'Scientist, Analyst' },
        compatibility: ['Ox', 'Rooster'], incompatible: ['Tiger', 'Pig'], luckyColors: ['Black', 'Red', 'Yellow'], luckyNumbers: [2, 8, 9]
    },
    'Horse': {
        ro: { name: 'Cal', description: 'Energic, independent și nerăbdător. Cailor le place libertatea și călătoriile.', traits: ['Energetic', 'Independent', 'Nerăbdător'], profession: 'Jurnalist, Aventurier' },
        en: { name: 'Horse', description: 'Animated, active, and energetic. Horses love freedom and traveling.', traits: ['Energetic', 'Independent', 'Impatient'], profession: 'Journalist, Adventurer' },
        compatibility: ['Tiger', 'Goat', 'Dog'], incompatible: ['Rat', 'Ox', 'Rooster'], luckyColors: ['Yellow', 'Green'], luckyNumbers: [2, 3, 7]
    },
    'Goat': {
        ro: { name: 'Capră', description: 'Creativă, blândă și pasională. Caprele sunt visătoare și iubesc arta.', traits: ['Creativ', 'Blând', 'Simpatic'], profession: 'Actor, Muzician' },
        en: { name: 'Goat', description: 'Calm, gentle, and sympathetic. Goats are dreamers who love art.', traits: ['Creative', 'Gentle', 'Sympathetic'], profession: 'Actor, Musician' },
        compatibility: ['Rabbit', 'Horse', 'Pig'], incompatible: ['Ox', 'Dog'], luckyColors: ['Brown', 'Red', 'Purple'], luckyNumbers: [2, 7]
    },
    'Monkey': {
        ro: { name: 'Maimuță', description: 'Spirituală, inteligentă și neastâmpărată. Maimuțele rezolvă problemele cu ingeniozitate.', traits: ['Curios', 'Inovator', 'Jucăuș'], profession: 'Regizor, Vânzător' },
        en: { name: 'Monkey', description: 'Sharp, smart, and curiosity. Monkeys solve problems with ingenuity.', traits: ['Curious', 'Innovative', 'Playful'], profession: 'Director, Salesperson' },
        compatibility: ['Rat', 'Dragon', 'Snake'], incompatible: ['Tiger', 'Pig'], luckyColors: ['White', 'Blue', 'Gold'], luckyNumbers: [4, 9]
    },
    'Rooster': {
        ro: { name: 'Cocoș', description: 'Observator, muncitor și curajos. Cocoșii sunt perfecționiști și atenți la detalii.', traits: ['Observator', 'Muncitor', 'Curajos'], profession: 'Chirurg, Militar' },
        en: { name: 'Rooster', description: 'Observant, hardworking, and courageous. Roosters are perfectionists.', traits: ['Observant', 'Hardworking', 'Courageous'], profession: 'Surgeon, Soldier' },
        compatibility: ['Ox', 'Dragon', 'Snake'], incompatible: ['Rabbit', 'Dog'], luckyColors: ['Gold', 'Brown', 'Yellow'], luckyNumbers: [5, 7, 8]
    },
    'Dog': {
        ro: { name: 'Câine', description: 'Loial, onest și prudent. Câinii sunt prieteni adevărați și parteneri de încredere.', traits: ['Loial', 'Onest', 'Prudent'], profession: 'Profesor, Polițist' },
        en: { name: 'Dog', description: 'Lovely, honest, and prudent. Dogs are true friends and reliable partners.', traits: ['Loyal', 'Honest', 'Prudent'], profession: 'Teacher, Police Officer' },
        compatibility: ['Tiger', 'Rabbit', 'Horse'], incompatible: ['Dragon', 'Goat', 'Rooster'], luckyColors: ['Red', 'Green', 'Purple'], luckyNumbers: [3, 4, 9]
    },
    'Pig': {
        ro: { name: 'Mistreț', description: 'Compătimitor, generos și diligent. Mistreții se bucură de viață și sunt foarte realiști.', traits: ['Generos', 'Diligent', 'Compătimitor'], profession: 'Doctor, Entertainer' },
        en: { name: 'Pig', description: 'Compassionate, generous, and diligent. Pigs enjoy life and are very realistic.', traits: ['Generous', 'Diligent', 'Compassionate'], profession: 'Doctor, Entertainer' },
        compatibility: ['Tiger', 'Rabbit', 'Goat'], incompatible: ['Snake', 'Monkey'], luckyColors: ['Yellow', 'Gray', 'Brown'], luckyNumbers: [2, 5, 8]
    }
};

const ELEMENTS_RO: Record<string, string> = { 'Wood': 'Lemn', 'Fire': 'Foc', 'Earth': 'Pământ', 'Metal': 'Metal', 'Water': 'Apă' };

// --- LOGIC FUNCTIONS ---

export const getChineseZodiacInfo = (dateOfBirth: string, language: Language = 'en'): ChineseZodiacData | null => {
    if (!dateOfBirth) return null;

    const dob = new Date(dateOfBirth);
    let year = dob.getFullYear();
    const month = dob.getMonth() + 1;
    const day = dob.getDate();

    // 1. Determine Chinese Year
    // Check if DOB is before CNY of that year. If so, it belongs to previous Chinese year.
    const cnyDateString = CNY_DATES[year];
    if (cnyDateString) {
        const [cnyMonth, cnyDay] = cnyDateString.split('-').map(Number);
        if (month < cnyMonth || (month === cnyMonth && day < cnyDay)) {
            year--;
        }
    }

    // 2. Calculate Animal (Cycle of 12)
    // 1900 was Year of the Rat.
    // (Year - 1900) % 12 -> Index
    const startYear = 1900;
    const offset = (year - startYear) % 12;
    // Handle negative years just in case (though input should be restricted)
    const animalIndex = offset >= 0 ? offset : 12 + offset; 
    const animalKey = ANIMALS_ORDER[animalIndex];

    // 3. Calculate Element (Heavenly Stems - Cycle of 10)
    // Last digit of year: 0/1 Metal, 2/3 Water, 4/5 Wood, 6/7 Fire, 8/9 Earth
    const lastDigit = year % 10;
    let element = '';
    if (lastDigit === 0 || lastDigit === 1) element = 'Metal';
    else if (lastDigit === 2 || lastDigit === 3) element = 'Water';
    else if (lastDigit === 4 || lastDigit === 5) element = 'Wood';
    else if (lastDigit === 6 || lastDigit === 7) element = 'Fire';
    else element = 'Earth';

    // 4. Calculate Yin/Yang
    // Even years (Chinese year) are Yang, Odd are Yin (Simplified rule, typically aligned with element stems)
    // Actually: 0=Yang Metal, 1=Yin Metal, etc.
    const yinYang = lastDigit % 2 === 0 ? 'Yang' : 'Yin';

    // 5. Build Data Object
    const baseData = ANIMALS_DATA[animalKey];
    const langData = language === 'ro' ? baseData.ro : baseData.en;
    
    // Translate Element if needed
    const displayElement = language === 'ro' ? ELEMENTS_RO[element] : element;

    return {
        animal: langData.name,
        animalEn: animalKey, // Keep English key for API calls/Image mapping
        element: displayElement,
        yinYang: yinYang,
        description: langData.description,
        traits: langData.traits,
        profession: langData.profession,
        luckyColors: baseData.luckyColors,
        luckyNumbers: baseData.luckyNumbers,
        compatibility: baseData.compatibility,
        incompatibility: baseData.incompatible
    };
};
