// Default transliteration mapping from Arabic to Latin
// Based on Indonesian/Malay transliteration style

export interface TransliterationRule {
  arabic: string;
  latin: string;
  description?: string;
}

// Base consonants (excluding و, ي, ا which need special handling)
export const defaultConsonants: TransliterationRule[] = [
  { arabic: "ب", latin: "b", description: "Ba" },
  { arabic: "ت", latin: "t", description: "Ta" },
  { arabic: "ث", latin: "ts", description: "Tsa" },
  { arabic: "ج", latin: "j", description: "Jim" },
  { arabic: "ح", latin: "ḫ", description: "Ha (guttural)" },
  { arabic: "خ", latin: "kh", description: "Kha" },
  { arabic: "د", latin: "d", description: "Dal" },
  { arabic: "ذ", latin: "dz", description: "Dzal" },
  { arabic: "ر", latin: "r", description: "Ra" },
  { arabic: "ز", latin: "z", description: "Zay" },
  { arabic: "س", latin: "s", description: "Sin" },
  { arabic: "ش", latin: "sy", description: "Syin" },
  { arabic: "ص", latin: "sh", description: "Shad" },
  { arabic: "ض", latin: "dl", description: "Dlad" },
  { arabic: "ط", latin: "th", description: "Tha" },
  { arabic: "ظ", latin: "zh", description: "Zha" },
  { arabic: "ع", latin: "'", description: "Ain" },
  { arabic: "غ", latin: "gh", description: "Ghain" },
  { arabic: "ف", latin: "f", description: "Fa" },
  { arabic: "ق", latin: "q", description: "Qaf" },
  { arabic: "ك", latin: "k", description: "Kaf" },
  { arabic: "ل", latin: "l", description: "Lam" },
  { arabic: "م", latin: "m", description: "Mim" },
  { arabic: "ن", latin: "n", description: "Nun" },
  { arabic: "ه", latin: "h", description: "Ha" },
  // Note: Ta Marbuta (ة) is handled specially in transliterator.ts - 't' with vowel, 'h' at end
  { arabic: "ٱ", latin: "", description: "Alif Wasla (silent)" },
];

// Diacritics (harakat)
// Note: Shadda doubles the preceding consonant; Sukun indicates no vowel.
// The transliterator handles these programmatically rather than via simple replacement.
export const defaultDiacritics: TransliterationRule[] = [
  { arabic: "َ", latin: "a", description: "Fatha → a" },
  { arabic: "ِ", latin: "i", description: "Kasra → i" },
  { arabic: "ُ", latin: "u", description: "Damma → u" },
  { arabic: "ً", latin: "an", description: "Fathatan → an" },
  { arabic: "ٍ", latin: "in", description: "Kasratan → in" },
  { arabic: "ٌ", latin: "un", description: "Dammatan → un" },
  { arabic: "ْ", latin: "", description: "Sukun (no vowel)" },
  { arabic: "ّ", latin: "", description: "Shadda (doubles consonant)" },
  { arabic: "ٰ", latin: "â", description: "Superscript Alif → â (long a)" },
  { arabic: "ٖ", latin: "î", description: "Subscript Alif → î (long i)" },
  { arabic: "ٗ", latin: "û", description: "Inverted Damma → û (long u)" },
  { arabic: "ٓ", latin: "", description: "Madda mark" },
  { arabic: "ۗ", latin: "", description: "Waqf marker" },
  { arabic: "ۚ", latin: "", description: "Pause marker" },
  { arabic: "ۙ", latin: "", description: "Waqf marker" },
  { arabic: "۝", latin: ".", description: "Verse separator" },
];

// Special combinations (order matters - longer patterns first)
export const defaultCombinations: TransliterationRule[] = [
  // Sacred names / common dua openers (keeps Allah/Allahumma consistent with the sample)
  { arabic: "اَللَّهُمَّ", latin: "Allâhumma", description: "Allahumma (with harakat)" },
  { arabic: "اَللَّهُمَّ", latin: "Allâhumma", description: "Allahumma (with harakat)" },
  { arabic: "اللّٰهُمَّ", latin: "Allâhumma", description: "Allahumma (Quranic spelling)" },
  { arabic: "ٱللّٰهُمَّ", latin: "Allâhumma", description: "Allahumma (wasla)" },
  { arabic: "اللَّهُمَّ", latin: "Allâhumma", description: "Allahumma" },
  { arabic: "اللهم", latin: "Allâhumma", description: "Allahumma (no harakat)" },

  { arabic: "اللّٰه", latin: "Allâh", description: "Allah (Quranic spelling)" },
  { arabic: "ٱللّٰه", latin: "Allâh", description: "Allah (wasla)" },
  { arabic: "الله", latin: "Allâh", description: "Allah (no harakat)" },
  { arabic: "اَللَّه", latin: "Allâh", description: "Allah (with harakat)" },
  { arabic: "اَللَّه", latin: "Allâh", description: "Allah (with harakat)" },

  // Common phrases
  { arabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ", latin: "Bismillâhir raḫmânir raḫîm", description: "Bismillah" },
];

export type TransliterationConfig = {
  consonants: TransliterationRule[];
  diacritics: TransliterationRule[];
  combinations: TransliterationRule[];
  useLongVowelMarks: boolean; // â, î, û vs aa, ii, uu
  useEmphatic: boolean; // ḫ, ṣ vs h, s
};

export const defaultConfig: TransliterationConfig = {
  consonants: defaultConsonants,
  diacritics: defaultDiacritics,
  combinations: defaultCombinations,
  useLongVowelMarks: true,
  useEmphatic: true,
};
