import { 
  defaultConsonants, 
  defaultDiacritics, 
  defaultCombinations,
  type TransliterationConfig 
} from './transliteration-rules';

// Sun letters (الحروف الشمسية) - lam assimilates to these
// ت ث د ذ ر ز س ش ص ض ط ظ ل ن
const SUN_LETTERS = 'تثدذرزسشصضطظلن';

// Idgham letters (يرملون) - nun sukun assimilates into these
const IDGHAM_LETTERS = 'يرملون';

// Map Arabic sun letters to their Latin equivalents
const ARABIC_TO_LATIN_CONSONANT: Record<string, string> = {
  'ت': 't', 'ث': 'ts', 'د': 'd', 'ذ': 'dz', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sy', 'ص': 'sh', 'ض': 'dl', 'ط': 'th', 'ظ': 'zh',
  'ل': 'l', 'ن': 'n',
  // Moon letters
  'ب': 'b', 'ج': 'j', 'ح': 'ḫ', 'خ': 'kh', 'ع': "'", 'غ': 'gh',
  'ف': 'f', 'ق': 'q', 'ك': 'k', 'م': 'm', 'ه': 'h', 'و': 'w', 'ي': 'y',
  'أ': '', 'إ': '', 'ا': '', 'ء': '', 'ئ': '', 'ؤ': ''
};

export function transliterate(
  arabicText: string, 
  config: TransliterationConfig = {
    consonants: defaultConsonants,
    diacritics: defaultDiacritics,
    combinations: defaultCombinations,
    useLongVowelMarks: true,
    useEmphatic: true,
  }
): string {
  if (!arabicText.trim()) return '';

  // Process word by word to maintain proper spacing
  const words = arabicText.split(/(\s+)/);
type WordInfo = { text: string; arabicWord: string; alType: 'sun' | 'moon' | 'allah' | null; sunLetterConsonant: string | null; endsWithNunSukun: boolean; firstConsonant: string | null } | string;
  const transliteratedWords: WordInfo[] = [];
  for (const word of words) {
    // Preserve whitespace
    if (/^\s+$/.test(word)) {
      transliteratedWords.push(' ');
      continue;
    }

    if (!word.trim()) continue;

    let result = word;
    let alType: 'sun' | 'moon' | 'allah' | null = null;
    let sunLetterConsonant: string | null = null;

    // Step 0: Detect ال at word start OR after prefix (بِ، لِ، كَ، فَ، وَ) and determine sun/moon letter type
    // Pattern matches: ال at start, or prefix + ال (e.g., بِال، لِل، كَال، فَال، وَال)
    // IMPORTANT: ال means alif THEN lam. This is different from لَا (lam then alif = negation)
    const alPatternStart = /^[اٱ]ل/;
    // For prefix pattern: must have alif BEFORE lam (not after like in لَا)
    // Match: prefix + vowel? + alif + lam (e.g., بِالْ، وَالْ)
    // But also handle لِلْ (li + lam of definite article, where alif is elided)
    const alPatternAfterPrefix = /^[بكفو][َِ][اٱ]ل|^ل[ِ]ل/;
    const alMatchStart = result.match(alPatternStart);
    const alMatchPrefix = result.match(alPatternAfterPrefix);
    
    // Find position of ل in the definite article
    let alPosition = -1;
    if (alMatchStart) {
      alPosition = 1; // ال - lam is at position 1
    } else if (alMatchPrefix) {
      // For prefix patterns, find the lam that's part of the definite article
      // In بِالْ - lam is at position 3 (after ب + ِ + ا)
      // In لِلْ - the second lam is the definite article, at position 2
      if (result.startsWith('ل') && result[1] === 'ِ' && result[2] === 'ل') {
        alPosition = 2; // لِلْ pattern
      } else {
        // Find alif then lam
        for (let pi = 0; pi < result.length && pi < 5; pi++) {
          if ((result[pi] === 'ا' || result[pi] === 'ٱ') && result[pi + 1] === 'ل') {
            alPosition = pi + 1;
            break;
          }
        }
      }
    }
    
    if (alPosition >= 0) {
      const diacriticChars = 'ًٌٍَُِّْٰٖٗٓۗۚۙ۝';
      const shaddaCharDetect = 'ّ';
      
      // Check if the lam itself has a shadda (means root word starts with lam, e.g., الَّذِي)
      let lamHasShadda = false;
      let tempIdx = alPosition + 1; // Start right after ل
      while (tempIdx < result.length && diacriticChars.includes(result[tempIdx])) {
        if (result[tempIdx] === shaddaCharDetect) {
          lamHasShadda = true;
        }
        tempIdx++;
      }
      
      // If lam has shadda, the root word starts with lam (e.g., الَّذِي = ال + لذي)
      if (lamHasShadda) {
        alType = 'sun';
        sunLetterConsonant = 'l';
      } else {
        // Find the next actual consonant after the lam (skip all diacritics)
        let searchIdx = alPosition + 1;
        while (searchIdx < result.length && diacriticChars.includes(result[searchIdx])) {
          searchIdx++;
        }
        const nextLetter = result[searchIdx] || '';
        
        // Check if it's part of Allah (special case - handled by combinations)
        if (result.includes('لّٰه') || result.includes('للّٰه') || result.includes('لله')) {
          alType = 'allah';
        } else if (SUN_LETTERS.includes(nextLetter)) {
          alType = 'sun';
          sunLetterConsonant = ARABIC_TO_LATIN_CONSONANT[nextLetter] || '';
        } else {
          alType = 'moon';
        }
      }
    }

    // Step 1: Handle special combinations first (longest match first)
    const sortedCombinations = [...config.combinations].sort(
      (a, b) => b.arabic.length - a.arabic.length
    );
    for (const rule of sortedCombinations) {
      result = result.split(rule.arabic).join(rule.latin);
    }

    // Step 2: Process character by character
    let output = '';
    let i = 0;

    const shaddaChar = 'ّ';
    const sukunChar = 'ْ';

    // Precompute fast lookups for this run
    const consonantMap = new Map(config.consonants.map(r => [r.arabic, r.latin] as const));
    const diacriticMap = new Map(config.diacritics.map(r => [r.arabic, r.latin] as const));
    const isArabicMark = (c: string) => !!c && diacriticMap.has(c);

    // When ال- is followed by a sun letter with shadda, we already represent
    // one of the doubled consonants via the assimilated lam. So the first sun
    // letter's shadda should be ignored once.
    let suppressNextShaddaOnce = false;

    while (i < result.length) {
      const char = result[i];
      const nextChar = result[i + 1] || '';
      const prevOutput = output.slice(-1);

      // Skip if already Latin (from combinations)
      if (/[a-zA-ZâîûÂÎÛḫ\-']/.test(char)) {
        output += char;
        i++;
        continue;
      }

      // Handle ال (definite article) at word start
      if (i === 0 && (char === 'ا' || char === 'ٱ') && nextChar === 'ل') {
        // Collect any marks sitting on the ل (lam)
        let j = i + 2;
        const lamMarks: string[] = [];
        while (j < result.length && isArabicMark(result[j])) {
          lamMarks.push(result[j]);
          j++;
        }

        const lamHasShadda = lamMarks.includes(shaddaChar);
        const lamHasSukun = lamMarks.includes(sukunChar);
        const lamVowelMark = lamMarks.find(m => {
          if (m === shaddaChar || m === sukunChar) return false;
          return (diacriticMap.get(m) ?? '').length > 0;
        });

        // Special case: "ٱلَّذِي" and similar words where the lam itself has shadda.
        // This indicates a doubled "l" right after the prefix: Al-l...
        if (lamHasShadda) {
          output += 'al-';
          output += 'l';
          if (!lamHasSukun && lamVowelMark) {
            output += diacriticMap.get(lamVowelMark) ?? '';
          }

          // Skip ا + ل + all marks on lam, continue from the next consonant (e.g., ذ)
          i = j;
          continue;
        }

        if (alType === 'sun' && sunLetterConsonant) {
          // Sun letter: ال + صَّ...
          // Represent assimilation as: a + sun + "-" + (rest of word starting with sun letter).
          // The sun letter typically has shadda in the script; we suppress that shadda once
          // because the assimilated lam already provides the "first" consonant.
          output += 'a' + sunLetterConsonant + '-';
          suppressNextShaddaOnce = true;

          // Skip alif + lam, then skip any marks on the lam
          i += 2;
          while (i < result.length && isArabicMark(result[i])) i++;
          continue;
        } else if (alType === 'moon') {
          // Moon letter: ال + ق → al-q (keep lam)
          output += 'al-';
          // Skip alif + lam, then skip any marks on the lam
          i += 2;
          while (i < result.length && isArabicMark(result[i])) i++;
          continue;
        } else {
          // Default: just output 'a' for alif, lam will be handled next
          output += 'a';
          i++;
          continue;
        }
      }

      // Handle ال after prefix (بِال، لِل، كَال، فَال، وَال)
      // بِالسُّوْءِ → bissû-i (not bilssû-i)
      // IMPORTANT: Only match when alif comes BEFORE lam (definite article)
      // Do NOT match لَا (lam + alif = negation) like in وَلَا
      const prefixLetters = 'بكفو'; // Note: ل handled separately for لِلْ pattern
      if (i === 0 && prefixLetters.includes(char)) {
        // Check if this is prefix + ال pattern
        let prefixEnd = i + 1;
        // Skip any diacritics on the prefix letter
        while (prefixEnd < result.length && isArabicMark(result[prefixEnd])) {
          prefixEnd++;
        }
        // Must have alif THEN lam (not lam then alif like لَا)
        const hasAlif = result[prefixEnd] === 'ا' || result[prefixEnd] === 'ٱ';
        const lamPos = hasAlif ? prefixEnd + 1 : -1; // Only valid if alif exists before lam
        
        if (hasAlif && result[lamPos] === 'ل' && alType) {
          // This is a prefix + definite article pattern
          // Output the prefix consonant with its vowel
          // Special handling for letters not in consonantMap (و، ي، ل)
          const prefixConsonantMap: Record<string, string> = {
            'ب': 'b', 'ل': 'l', 'ك': 'k', 'ف': 'f', 'و': 'w'
          };
          const prefixConsonant = prefixConsonantMap[char] || consonantMap.get(char) || 'w';
          output += prefixConsonant;
          
          // Get the prefix vowel
          let pj = i + 1;
          while (pj < prefixEnd) {
            const mark = result[pj];
            if (mark !== shaddaChar && mark !== sukunChar) {
              const markLatin = diacriticMap.get(mark);
              if (markLatin && /^[aiu]$/.test(markLatin)) {
                output += markLatin;
                break;
              }
            }
            pj++;
          }
          
          // Now handle the definite article
          // Skip to the lam and collect its marks
          let lamIdx = lamPos + 1;
          const lamMarks: string[] = [];
          while (lamIdx < result.length && isArabicMark(result[lamIdx])) {
            lamMarks.push(result[lamIdx]);
            lamIdx++;
          }
          
          const lamHasShadda = lamMarks.includes(shaddaChar);
          
          if (alType === 'sun' && sunLetterConsonant) {
            // Sun letter after prefix: بِالسُّوْءِ → bi + ss... (lam assimilates completely)
            // Just suppress the shadda on the sun letter since we're not outputting the lam
            suppressNextShaddaOnce = false; // Don't suppress - we want the doubled consonant
            // Skip prefix + alif(optional) + lam + marks
            i = lamIdx;
            continue;
          } else if (alType === 'moon') {
            // Moon letter after prefix: بِالْقَمَرِ → bil-qamari
            output += 'l-';
            i = lamIdx;
            continue;
          } else if (lamHasShadda) {
            // Lam with shadda (e.g., بِاللَّيْلِ)
            output += 'l-l';
            // Find vowel on lam
            const lamVowel = lamMarks.find(m => {
              if (m === shaddaChar || m === sukunChar) return false;
              return (diacriticMap.get(m) ?? '').length > 0;
            });
            if (lamVowel) {
              output += diacriticMap.get(lamVowel) ?? '';
            }
            i = lamIdx;
            continue;
          }
        }
      }

      // Handle Alif (ا) - extends previous vowel or silent
      if (char === 'ا') {
        // If previous output ends with 'a', make it long 'â'
        if (prevOutput === 'a') {
          output = output.slice(0, -1) + 'â';
        }
        // Otherwise alif is silent (after lam, etc.) or already handled
        i++;
        continue;
      }

      // Handle Alif Maqsura (ى) - always long â
      if (char === 'ى') {
        if (prevOutput === 'a') {
          output = output.slice(0, -1) + 'â';
        } else {
          output += 'â';
        }
        i++;
        continue;
      }

      // Handle Waw (و) - can be consonant 'w' or long vowel 'û'
      if (char === 'و') {
        // Collect any marks on the waw
        let wawIdx = i + 1;
        const wawMarks: string[] = [];
        while (wawIdx < result.length && isArabicMark(result[wawIdx])) {
          wawMarks.push(result[wawIdx]);
          wawIdx++;
        }
        
        const wawHasSukun = wawMarks.includes(sukunChar);
        const wawHasShadda = wawMarks.includes(shaddaChar);
        const wawHasVowel = wawMarks.some(m => {
          if (m === shaddaChar || m === sukunChar) return false;
          // Exclude tanwin marks - they belong to the next consonant, not waw
          if ('ًٌٍ'.includes(m)) return false;
          const latin = diacriticMap.get(m) ?? '';
          return latin.length > 0 && /[aiu]/.test(latin);
        });
        
        // Waw is a long vowel (û) when:
        // 1. Previous output is 'u' AND waw has sukun, OR
        // 2. Previous output is 'u' AND waw has NO vowel mark (implicit long vowel)
        if (prevOutput === 'u' && (wawHasSukun || !wawHasVowel) && !wawHasShadda) {
          output = output.slice(0, -1) + 'û';
          i = wawIdx; // Skip waw and all its marks
          continue;
        }
        
        // If waw has sukun but previous is not 'u', still treat as û
        if (wawHasSukun && !wawHasVowel) {
          output += 'û';
          i = wawIdx;
          continue;
        }

        // Otherwise it's consonant 'w'
        output += 'w';
        if (wawHasShadda) {
          output += 'w';
        }
        // Add any vowel on the waw
        const wawVowelMark = wawMarks.find(m => {
          if (m === shaddaChar || m === sukunChar) return false;
          return (diacriticMap.get(m) ?? '').length > 0;
        });
        if (wawVowelMark && !wawHasSukun) {
          output += diacriticMap.get(wawVowelMark) ?? '';
        }
        i = wawIdx;
        continue;
      }

      // Handle Ya (ي) - can be consonant 'y' or long vowel 'î'
      if (char === 'ي') {
        // Collect any marks on the ya
        let yaIdx = i + 1;
        const yaMarks: string[] = [];
        while (yaIdx < result.length && isArabicMark(result[yaIdx])) {
          yaMarks.push(result[yaIdx]);
          yaIdx++;
        }
        
        const yaHasSukun = yaMarks.includes(sukunChar);
        const yaHasShadda = yaMarks.includes(shaddaChar);
        const yaHasVowel = yaMarks.some(m => {
          if (m === shaddaChar || m === sukunChar) return false;
          // Exclude tanwin marks - they belong to the next consonant, not ya
          if ('ًٌٍ'.includes(m)) return false;
          const latin = diacriticMap.get(m) ?? '';
          return latin.length > 0 && /[aiu]/.test(latin);
        });

        // Ya is a long vowel (î) when:
        // 1. Previous output is 'i' AND ya has sukun, OR
        // 2. Previous output is 'i' AND ya has NO vowel mark (implicit long vowel)
        if (prevOutput === 'i' && (yaHasSukun || !yaHasVowel) && !yaHasShadda) {
          output = output.slice(0, -1) + 'î';
          i = yaIdx; // Skip ya and all its marks
          continue;
        }
        
        // If ya has sukun but previous is not 'i', still treat as î
        if (yaHasSukun && !yaHasVowel) {
          output += 'î';
          i = yaIdx;
          continue;
        }

        // Otherwise it's consonant 'y'
        output += 'y';
        if (yaHasShadda) {
          output += 'y';
        }
        // Add any vowel on the ya
        const yaVowelMark = yaMarks.find(m => {
          if (m === shaddaChar || m === sukunChar) return false;
          return (diacriticMap.get(m) ?? '').length > 0;
        });
        if (yaVowelMark && !yaHasSukun) {
          output += diacriticMap.get(yaVowelMark) ?? '';
        }
        i = yaIdx;
        continue;
      }

      // Handle Hamza variants
      if (char === 'أ' || char === 'إ' || char === 'ء' || char === 'ئ' || char === 'ؤ') {
        // Hamza is a glottal stop, represented as apostrophe or absorbed into vowel
        // At word start, it's usually silent
        if (output.length === 0) {
          // Skip hamza at start, let the following vowel handle it
          i++;
          continue;
        }
        // After "al-" prefix, hamza is also silent (e.g., الْأَحَدُ → al-aḫadu)
        if (output.endsWith('-')) {
          i++;
          continue;
        }
        
        // Check if hamza is at end before punctuation
        // شَيْءٍ. → syaî'. (not syaî-in.)
        let hj = i + 1;
        // Skip any diacritics on the hamza
        while (hj < result.length && isArabicMark(result[hj])) {
          hj++;
        }
        const afterHamza = result[hj] || '';
        // Only apply apostrophe rule when followed by actual punctuation (. or ,)
        const isBeforePunctuation = /^[.,،]/.test(afterHamza);
        
        if (isBeforePunctuation) {
          // Hamza at end before punctuation becomes apostrophe, drop any tanwin
          output += "'";
          i = hj; // Skip hamza and its diacritics
          continue;
        }
        
        // Mid-word hamza
        output += '-';
        i++;
        continue;
      }

      // Handle Alif with madda (آ)
      if (char === 'آ') {
        output += 'â';
        i++;
        continue;
      }

      // Handle Ta Marbuta (ة) - special rules:
      // - 't' when it has a vowel (construct state / idafa)
      // - 'h' at end of word with sukun or no vowel (pause position)
      if (char === 'ة') {
        let j = i + 1;
        const marks: string[] = [];
        while (j < result.length && isArabicMark(result[j])) {
          marks.push(result[j]);
          j++;
        }
        
        const hasSukun = marks.includes(sukunChar);
        const vowelMark = marks.find(m => {
          if (m === shaddaChar || m === sukunChar) return false;
          const latin = diacriticMap.get(m) ?? '';
          // Check for actual short vowels (a, i, u), not tanwin
          return /^[aiu]$/.test(latin);
        });
        const hasTanwin = marks.some(m => 'ًٌٍ'.includes(m));
        
        // Check if at end of word (no more consonants after)
        const remainingText = result.slice(j);
        const isAtEndOfWord = !remainingText.trim() || /^[\s.,،؛؟]/.test(remainingText);
        
        // Ta marbuta is 't' when:
        // 1. It has a vowel mark (fatha, kasra, damma) - construct state
        // 2. It has tanwin (ً ٍ ٌ) - indefinite noun
        // Otherwise it's 'h' (pause position)
        if (vowelMark || hasTanwin) {
          output += 't';
          if (vowelMark) {
            output += diacriticMap.get(vowelMark) ?? '';
          } else if (hasTanwin) {
            const tanwinMark = marks.find(m => 'ًٌٍ'.includes(m));
            if (tanwinMark) {
              output += diacriticMap.get(tanwinMark) ?? '';
            }
          }
        } else {
          // End of word or has sukun - pronounce as 'h'
          output += 'h';
        }
        
        i = j;
        continue;
      }

      // Consonants: consume any following harakat in ANY order (e.g. kasra+shadda or shadda+kasra)
      const consonantLatin = consonantMap.get(char);
      if (consonantLatin) {
        let j = i + 1;
        const marks: string[] = [];
        while (j < result.length && isArabicMark(result[j])) {
          marks.push(result[j]);
          j++;
        }

        // If we're right after an "al-" sun-letter prefix, ignore the shadda once.
        const effectiveMarks =
          suppressNextShaddaOnce && SUN_LETTERS.includes(char)
            ? marks.filter(m => m !== shaddaChar)
            : marks;
        if (suppressNextShaddaOnce && SUN_LETTERS.includes(char)) {
          suppressNextShaddaOnce = false;
        }

        const hasShadda = effectiveMarks.includes(shaddaChar);
        const hasSukun = effectiveMarks.includes(sukunChar);
        const vowelMark = effectiveMarks.find(m => {
          if (m === shaddaChar || m === sukunChar) return false;
          const latin = diacriticMap.get(m) ?? '';
          return latin.length > 0;
        });

        // Check if this consonant is immediately followed by . or , (treat as sukun)
        const nextNonMark = result[j] || '';
        const isBeforePunctuation = /^[.,،]/.test(nextNonMark);
        const treatAsSukun = hasSukun || isBeforePunctuation;

        // Handle nun with sukun followed by qaf/kaf (iqlab: n → ng)
        // مِنْكَ → mingka
        if (char === 'ن' && treatAsSukun) {
          const nextConsonant = result[j] || '';
          if (nextConsonant === 'ق' || nextConsonant === 'ك') {
            output += 'ng';
            i = j;
            continue;
          }
          // Handle nun sukun + ba (iqlab: n → m) within word
          if (nextConsonant === 'ب') {
            output += 'm';
            i = j;
            continue;
          }
        }

        output += consonantLatin;
        if (hasShadda) output += consonantLatin;
        
        // Special handling for tanwin fathah + alif (ًا) at end before punctuation
        // وَاسِعًا. → wâsi'a. (not wâsi'an.)
        const hasTanwinFathah = effectiveMarks.includes('ً');
        const nextIsAlif = result[j] === 'ا';
        if (hasTanwinFathah && nextIsAlif) {
          // Check what comes after the alif
          let afterAlif = j + 1;
          while (afterAlif < result.length && isArabicMark(result[afterAlif])) afterAlif++;
          const afterAlifChar = result[afterAlif] || '';
          // Only drop 'n' when followed by punctuation (. or ,), NOT at end of text
          const isBeforePunctuation = /^[.,،]/.test(afterAlifChar);
          
          if (isBeforePunctuation) {
            // At end or before punctuation: tanwin becomes just 'a' (drop the 'n')
            output += 'a';
            i = afterAlif; // Skip past the alif
            continue;
          } else {
            // Before another word: keep normal tanwin 'an'
            output += 'an';
            i = j + 1; // Skip past the alif
            continue;
          }
        }
        
        if (!treatAsSukun && vowelMark) output += diacriticMap.get(vowelMark) ?? '';

        i = j;
        continue;
      }

      // Standalone marks (just in case) — usually consumed with the consonant above
      const markLatin = diacriticMap.get(char);
      if (markLatin !== undefined) {
        output += markLatin;
        i++;
        continue;
      }

      // Handle Arabic punctuation
      if (char === '،') {
        output += ',';
        i++;
        continue;
      } else if (char === '؛') {
        output += ';';
        i++;
        continue;
      } else if (char === '؟') {
        output += '?';
        i++;
        continue;
      }

      // Arabic numerals to Western numerals
      if (/[٠-٩]/.test(char)) {
        const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
        const index = arabicNumerals.indexOf(char);
        output += index.toString();
        i++;
        continue;
      }
      
      // If it's common punctuation, keep it
      if (/[.,;:!?\-–—()'""]/.test(char)) {
        output += char;
        i++;
        continue;
      }

    // Skip unknown characters (Quranic marks, etc.)
      i++;
    }

    // Check if word ends with nun sukun (for idgham processing)
    const endsWithNunSukun = /نْ\s*$/.test(word) || output.endsWith('n');
    
    // Find first consonant of the word (for idgham from previous word)
    // BUT if word starts with alif+vowel (e.g., اَوْ), the word starts with a vowel sound,
    // so idgham should NOT apply - set firstConsonant to null in that case
    let firstConsonant: string | null = null;
    const diacriticChars = 'ًٌٍَُِّْٰٖٗٓۗۚۙ۝';
    const vowelMarks = 'َُِ'; // fatha, damma, kasra
    
    // Check if word starts with alif + vowel mark (word starts with vowel sound)
    let startsWithVowel = false;
    if (word.length > 0) {
      const firstChar = word[0];
      if (firstChar === 'ا' || firstChar === 'أ' || firstChar === 'إ' || firstChar === 'آ') {
        // Check if followed by a vowel mark
        if (word.length > 1 && vowelMarks.includes(word[1])) {
          startsWithVowel = true;
        }
        // آ (alif madda) always starts with vowel
        if (firstChar === 'آ') {
          startsWithVowel = true;
        }
      }
    }
    
    // Only find first consonant if word doesn't start with a vowel sound
    if (!startsWithVowel) {
      for (let fi = 0; fi < word.length; fi++) {
        const fc = word[fi];
        // Skip alif, alif with hamza variants, and diacritics
        if (fc === 'ا' || fc === 'ٱ' || fc === 'أ' || fc === 'إ' || fc === 'آ' || diacriticChars.includes(fc)) continue;
        // Skip lam if part of ال prefix
        if (fc === 'ل' && fi > 0 && (word[fi-1] === 'ا' || word[fi-1] === 'ٱ')) {
          // Skip lam and its diacritics, find the next consonant
          let lamIdx = fi + 1;
          while (lamIdx < word.length && diacriticChars.includes(word[lamIdx])) lamIdx++;
          if (lamIdx < word.length) {
            firstConsonant = word[lamIdx];
          }
          break;
        }
        if (ARABIC_TO_LATIN_CONSONANT[fc] !== undefined) {
          firstConsonant = fc;
          break;
        }
      }
    }

    // Store metadata about this word for wasl processing
    if (output.trim()) {
      transliteratedWords.push({ text: output, arabicWord: word, alType, sunLetterConsonant, endsWithNunSukun, firstConsonant });
    }
  }

  // Join words with wasl rules and idgham
  let finalOutput = '';
  let lastWordEndChar = ''; // Track the last character of the previous word (not space)
  let prevWordEndsWithNunSukun = false;
  
  for (let idx = 0; idx < transliteratedWords.length; idx++) {
    const item = transliteratedWords[idx];
    
    // Handle space - don't add yet, we'll handle spacing in word processing
    if (typeof item === 'string') {
      continue; // Skip spaces, we handle them when processing words
    }
    
    const { text, arabicWord, alType, sunLetterConsonant, endsWithNunSukun, firstConsonant } = item;
    const isAfterVowel = /[aiu]/.test(lastWordEndChar);
    
    // Check for iqlab (نْ + ب) - nun becomes mim before ba
    // مِنْ بَعْدِهِمْ → mim ba'dihim
    let processedText = text;
    
    // Check if next word starts with mim with shadda (مِّ)
    // Tanwin/nun + مِّ should assimilate, and we suppress the shadda doubling
    const nextWordStartsWithShaddaMim = firstConsonant === 'م' && /^م[ًٌٍَُِّْٰٖٗٓۗۚۙ۝]*ّ/.test(arabicWord);
    
    if (prevWordEndsWithNunSukun && firstConsonant === 'ب') {
      // Replace the trailing 'n' with 'm' (iqlab rule)
      if (finalOutput.endsWith('n')) {
        finalOutput = finalOutput.slice(0, -1) + 'm';
      }
    }
    // Check for iqlab (نْ + ق/ك) - nun becomes 'ng' before qaf/kaf
    else if (prevWordEndsWithNunSukun && (firstConsonant === 'ق' || firstConsonant === 'ك')) {
      if (finalOutput.endsWith('n')) {
        finalOutput = finalOutput.slice(0, -1) + 'ng';
      }
    }
    // Check for tanwin/nun sukun + مِّ (mim with shadda) - idgham with suppression
    // عَدْلٍ مِّنْكُمْ → 'adlim mingkum (not 'adlim mmingkum)
    else if (prevWordEndsWithNunSukun && nextWordStartsWithShaddaMim) {
      // Replace the trailing 'n' with 'm' (assimilation)
      if (finalOutput.endsWith('n')) {
        finalOutput = finalOutput.slice(0, -1) + 'm';
      }
      // Remove the doubled 'm' from the next word (shadda was already "consumed" by assimilation)
      processedText = processedText.replace(/^mm/, 'm');
    }
    // Check for nun sukun idgham (نْ + يرملون)
    // The nun assimilates INTO the next consonant - it gets replaced by the next letter
    // يَكُنْ لَهُ → yakul lahu (nun becomes lam, attached to previous word)
    else if (prevWordEndsWithNunSukun && firstConsonant && IDGHAM_LETTERS.includes(firstConsonant)) {
      const firstLatinConsonant = ARABIC_TO_LATIN_CONSONANT[firstConsonant] || '';
      // Replace the trailing 'n' with the assimilated consonant
      if (finalOutput.endsWith('n') && firstLatinConsonant) {
        finalOutput = finalOutput.slice(0, -1) + firstLatinConsonant;
      }
      // The next word stays as-is (no doubling needed)
    }

    // Check if the current word starts with a prefix (wa-, fa-, bi-, li-, ka-)
    // If so, wasl rules should NOT merge with previous word
    const startsWithPrefix = /^[wfblk]a/.test(text) || /^[wfblk]i/.test(text);
    
    // Wasl rule: if previous word ends with long vowel (â) and next word starts with ال (no prefix),
    // the long vowel shortens (â → a) and connects
    // ذَا الجَلَالِ → "dzal jalâli" (not "dzâ al-jalâli" or "dzl jalâli")
    const prevEndsWithLongA = finalOutput.endsWith('â');
    if (prevEndsWithLongA && alType && !startsWithPrefix) {
      // Shorten the long â to short 'a'
      finalOutput = finalOutput.slice(0, -1) + 'a';
    }

    // Special wasl: merge before Allâh even if not detected as alType
    
    // Special wasl: merge before Allâh even if not detected as alType
    if (!startsWithPrefix && isAfterVowel && /^[Aa]llâh/.test(processedText)) {
      finalOutput += processedText.replace(/^[Aa]/, '');
    } else if (!startsWithPrefix && (isAfterVowel || prevEndsWithLongA) && alType) {
      if (alType === 'allah') {
        // "أَنْتَ اللّٰهُ" → "antallâhu" - drop the A, connect ll
        const merged = processedText.replace(/^[Aa]llâh/, 'llâh');
        finalOutput += merged;
      } else if (alType === 'sun' && sunLetterConsonant) {
        // "الصَّمَدُ" after vowel → "sh-shamadu"
        // Current text is like "ash-shamadu": strip the "a" prefix and replace hyphen with space
        const wordWithoutPrefix = processedText.replace(/^a/, '');
        finalOutput += wordWithoutPrefix.replace('-', ' ');
      } else if (alType === 'moon') {
        // "الْأَحَدُ" after vowel → "l aḫadu"
        // Current text is like "al-aḫadu": strip "a" and replace hyphen with space
        const wordWithoutA = processedText.replace(/^a/, '');
        finalOutput += wordWithoutA.replace('-', ' ');
      } else {
        finalOutput += ' ' + processedText;
      }
    } else {
      // No wasl - add space if needed
      if (finalOutput) {
        finalOutput += ' ';
      }
      finalOutput += processedText;
    }
    
    // Update tracking variables
    prevWordEndsWithNunSukun = endsWithNunSukun;
    const lastChar = text.replace(/[^a-zâîûḫ]/gi, '').slice(-1).toLowerCase();
    if (lastChar) {
      lastWordEndChar = lastChar;
    }
  }
  
  // Clean up: normalize multiple spaces to single space
  finalOutput = finalOutput.replace(/\s+/g, ' ').trim();
  
  // Waqf rule: drop final short vowel (i, u) before punctuation
  // اللّٰهِ. → Allâh. (not Allâhi.)
  // Note: 'a' is NOT dropped because tanwin fathah + alif becomes 'a' and should stay
  // قَدْرًا. → qadra. (the 'a' from tanwin stays)
  finalOutput = finalOutput.replace(/([iu])([.,،؛])/g, '$2');
  
  // Clean up double hyphens or hyphen at start/end
  finalOutput = finalOutput.replace(/^-+|-+$/g, '');
  finalOutput = finalOutput.replace(/-+/g, '-');
  
  // Capitalize first letter of sentences
  finalOutput = finalOutput.replace(/(^|[.!?]\s+)([a-z])/g, (_, prefix, letter) => 
    prefix + letter.toUpperCase()
  );

  return finalOutput;
}
