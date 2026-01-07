
/* -------------------------------------------------------------------------- */
/*                        EXTENDED ASTROLOGICAL SYSTEMS                       */
/* -------------------------------------------------------------------------- */

// --- VEDIC / SIDEREAL RASHI CALCULATOR (APPROXIMATE) ---
// Using Lahiri Ayanamsha approx (~24 degrees shift backwards from Tropical)
// Note: This is an approximation for UI display. The AI will do a deeper analysis.

const SIDEREAL_SIGNS = [
    { name: 'Mesha (Aries)', startMonth: 4, startDay: 14, endMonth: 5, endDay: 14 },
    { name: 'Vrishabha (Taurus)', startMonth: 5, startDay: 15, endMonth: 6, endDay: 14 },
    { name: 'Mithuna (Gemini)', startMonth: 6, startDay: 15, endMonth: 7, endDay: 15 },
    { name: 'Karka (Cancer)', startMonth: 7, startDay: 16, endMonth: 8, endDay: 16 },
    { name: 'Simha (Leo)', startMonth: 8, startDay: 17, endMonth: 9, endDay: 16 },
    { name: 'Kanya (Virgo)', startMonth: 9, startDay: 17, endMonth: 10, endDay: 16 },
    { name: 'Tula (Libra)', startMonth: 10, startDay: 17, endMonth: 11, endDay: 15 },
    { name: 'Vrischika (Scorpio)', startMonth: 11, startDay: 16, endMonth: 12, endDay: 15 },
    { name: 'Dhanu (Sagittarius)', startMonth: 12, startDay: 16, endMonth: 1, endDay: 13 }, // Spans year end
    { name: 'Makara (Capricorn)', startMonth: 1, startDay: 14, endMonth: 2, endDay: 12 },
    { name: 'Kumbha (Aquarius)', startMonth: 2, startDay: 13, endMonth: 3, endDay: 13 },
    { name: 'Meena (Pisces)', startMonth: 3, startDay: 14, endMonth: 4, endDay: 13 }
];

export const getVedicRashi = (dateStr: string): string => {
    const d = new Date(dateStr);
    const month = d.getMonth() + 1; // 1-12
    const day = d.getDate();

    // Special check for Sagittarius spanning year boundary
    if ((month === 12 && day >= 16) || (month === 1 && day <= 13)) {
        return 'Dhanu (Sagittarius)';
    }

    for (const sign of SIDEREAL_SIGNS) {
        if (
            (month === sign.startMonth && day >= sign.startDay) ||
            (month === sign.endMonth && day <= sign.endDay)
        ) {
            return sign.name;
        }
    }
    return 'Unknown';
};

// --- CELTIC TREE ASTROLOGY (13 Moon Calendar - Robert Graves) ---

const CELTIC_TREES = [
    { name: 'Birch (Beth)', startMonth: 12, startDay: 24, endMonth: 1, endDay: 20 },
    { name: 'Rowan (Luis)', startMonth: 1, startDay: 21, endMonth: 2, endDay: 17 },
    { name: 'Ash (Nion)', startMonth: 2, startDay: 18, endMonth: 3, endDay: 17 },
    { name: 'Alder (Fearn)', startMonth: 3, startDay: 18, endMonth: 4, endDay: 14 },
    { name: 'Willow (Saille)', startMonth: 4, startDay: 15, endMonth: 5, endDay: 12 },
    { name: 'Hawthorn (Uath)', startMonth: 5, startDay: 13, endMonth: 6, endDay: 9 },
    { name: 'Oak (Duir)', startMonth: 6, startDay: 10, endMonth: 7, endDay: 7 },
    { name: 'Holly (Tinne)', startMonth: 7, startDay: 8, endMonth: 8, endDay: 4 },
    { name: 'Hazel (Coll)', startMonth: 8, startDay: 5, endMonth: 9, endDay: 1 },
    { name: 'Vine (Muin)', startMonth: 9, startDay: 2, endMonth: 9, endDay: 29 },
    { name: 'Ivy (Gort)', startMonth: 9, startDay: 30, endMonth: 10, endDay: 27 },
    { name: 'Reed (Ngetal)', startMonth: 10, startDay: 28, endMonth: 11, endDay: 24 },
    { name: 'Elder (Ruis)', startMonth: 11, startDay: 25, endMonth: 12, endDay: 23 }
];

export const getCelticTreeSign = (dateStr: string): string => {
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();

    // Special check for The Nameless Day (Day Zero) usually Dec 23 or near logic
    // Using standard Graves mapping. Birch starts Dec 24.
    
    // Check Birch spanning year boundary
    if ((month === 12 && day >= 24) || (month === 1 && day <= 20)) {
        return 'Birch (Beth)';
    }

    for (const tree of CELTIC_TREES) {
        if (
            (month === tree.startMonth && day >= tree.startDay) ||
            (month === tree.endMonth && day <= tree.endDay)
        ) {
            return tree.name;
        }
    }
    // Fallback for Dec 23 if not covered or similar edge cases
    return 'Elder (Ruis)'; 
};

// --- OPHIUCHUS DETECTOR ---
// Sun Transit: Nov 29 - Dec 17

export const isOphiuchus = (dateStr: string): boolean => {
    const d = new Date(dateStr);
    const month = d.getMonth() + 1;
    const day = d.getDate();

    if (month === 11 && day >= 29) return true; // Nov 29-30
    if (month === 12 && day <= 17) return true; // Dec 1-17
    
    return false;
};
