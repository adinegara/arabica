import { 
  defaultConsonants, 
  defaultDiacritics, 
  defaultCombinations,
  type TransliterationConfig 
} from './transliteration-rules';

/**
 * Reverse transliterate Latin text back to Arabic
 * This creates a basic approximation - exact reconstruction is not always possible
 * since transliteration loses some information (like exact harakat placement)
 */
export function reverseTransliterate(
  latinText: string,
  config: TransliterationConfig = {
    consonants: defaultConsonants,
    diacritics: defaultDiacritics,
    combinations: defaultCombinations,
    useLongVowelMarks: true,
    useEmphatic: true,
  }
): string {
  if (!latinText.trim()) return '';

  let result = latinText;

  // Step 1: Handle special combinations first (reverse them)
  // Sort by Latin length (longest first) to avoid partial matches
  const sortedCombinations = [...config.combinations].sort(
    (a, b) => b.latin.length - a.latin.length
  );
  for (const rule of sortedCombinations) {
    if (rule.latin) {
      result = result.split(rule.latin).join(rule.arabic);
    }
  }

  // Step 2: Build reverse mapping for consonants (Latin → Arabic)
  // Sort by Latin length (longest first) to match multi-char sequences first
  const consonantReverseMap: { latin: string; arabic: string }[] = [];
  for (const rule of config.consonants) {
    if (rule.latin) {
      consonantReverseMap.push({ latin: rule.latin, arabic: rule.arabic });
    }
  }
  // Add special consonants not in the main list
  consonantReverseMap.push({ latin: 'w', arabic: 'و' });
  consonantReverseMap.push({ latin: 'y', arabic: 'ي' });
  
  // Sort by length descending
  consonantReverseMap.sort((a, b) => b.latin.length - a.latin.length);

  // Step 3: Build reverse mapping for diacritics
  const diacriticReverseMap: { latin: string; arabic: string }[] = [];
  for (const rule of config.diacritics) {
    if (rule.latin) {
      diacriticReverseMap.push({ latin: rule.latin, arabic: rule.arabic });
    }
  }
  diacriticReverseMap.sort((a, b) => b.latin.length - a.latin.length);

  // Step 4: Process character by character
  let output = '';
  let i = 0;

  while (i < result.length) {
    const remaining = result.slice(i);
    let matched = false;

    // Skip if already Arabic
    if (/[\u0600-\u06FF]/.test(result[i])) {
      output += result[i];
      i++;
      continue;
    }

    // Try to match long vowels first
    if (remaining.startsWith('â') || remaining.startsWith('aa')) {
      output += 'َا'; // fatha + alif
      i += remaining.startsWith('aa') ? 2 : 1;
      continue;
    }
    if (remaining.startsWith('î') || remaining.startsWith('ii')) {
      output += 'ِي'; // kasra + ya
      i += remaining.startsWith('ii') ? 2 : 1;
      continue;
    }
    if (remaining.startsWith('û') || remaining.startsWith('uu')) {
      output += 'ُو'; // damma + waw
      i += remaining.startsWith('uu') ? 2 : 1;
      continue;
    }

    // Try to match "al-" prefix (definite article)
    if (remaining.toLowerCase().startsWith('al-')) {
      output += 'ال';
      i += 3;
      continue;
    }

    // Try to match consonants (longest first)
    for (const { latin, arabic } of consonantReverseMap) {
      if (remaining.toLowerCase().startsWith(latin.toLowerCase())) {
        output += arabic;
        i += latin.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Try to match diacritics/vowels
    for (const { latin, arabic } of diacriticReverseMap) {
      if (remaining.startsWith(latin)) {
        output += arabic;
        i += latin.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Handle simple vowels
    if (result[i] === 'a') {
      output += 'َ'; // fatha
      i++;
      continue;
    }
    if (result[i] === 'i') {
      output += 'ِ'; // kasra
      i++;
      continue;
    }
    if (result[i] === 'u') {
      output += 'ُ'; // damma
      i++;
      continue;
    }

    // Handle apostrophe (ain)
    if (result[i] === "'" || result[i] === '\u2019') {
      output += 'ع';
      i++;
      continue;
    }

    // Handle hyphen (skip)
    if (result[i] === '-') {
      i++;
      continue;
    }

    // Preserve spaces and punctuation
    if (/[\s.,،!?]/.test(result[i])) {
      output += result[i];
      i++;
      continue;
    }

    // Skip unknown characters
    i++;
  }

  return output;
}
