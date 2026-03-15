// Pegon character mappings (Latin Indonesian → Arabic Pegon)
// Based on Dasar Pegon 1.xls

const DIGRAPHS: Record<string, string> = {
  kho: 'خ',
  ny: 'پ',
  ng: 'ع',
  sy: 'ش',
  kh: 'خ',
  ts: 'ث',
  dz: 'ذ',
  sh: 'ص',
  dh: 'ض',
  th: 'ط',
  zh: 'ظ',
  gh: 'غ',
};

const CONSONANTS: Record<string, string> = {
  b: 'ب',
  c: 'چ',
  d: 'د',
  f: 'ف',
  g: 'ك',
  h: 'ه',
  j: 'ج',
  k: 'ك',
  l: 'ل',
  m: 'م',
  n: 'ن',
  p: 'ف',
  q: 'ق',
  r: 'ر',
  s: 'س',
  t: 'ت',
  v: 'ف',
  w: 'و',
  x: 'كس',
  y: 'ي',
  z: 'ز',
};

const VOWELS: Record<string, string> = {
  a: 'ا',
  i: 'ي',
  u: 'و',
  e: 'ي',   // e taling (default)
  é: 'ي',   // e taling (AI-marked)
  ĕ: '',    // e pepet — no ي output
  o: 'و',
};

// Vowels at the start of a word get an alif prefix (Awal Kata column in XLS)
const VOWELS_WORD_START: Record<string, string> = {
  a: 'ا',
  i: 'إي',  // alif hamza below + ya
  u: 'او',  // alif + waw
  e: 'اي',  // e taling (default)
  é: 'اي',  // e taling (AI-marked)
  ĕ: 'ا',   // e pepet — just alif, no ya
  o: 'او',  // alif + waw
};

const NUMBERS: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
};

// Sorted digraphs by length descending for longest-match-first
const SORTED_DIGRAPHS = Object.keys(DIGRAPHS).sort((a, b) => b.length - a.length);

function convertWord(word: string): string {
  let result = '';
  let i = 0;

  while (i < word.length) {
    let matched = false;

    // Try digraphs first (longest match)
    for (const digraph of SORTED_DIGRAPHS) {
      if (word.startsWith(digraph, i)) {
        result += DIGRAPHS[digraph];
        i += digraph.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const ch = word[i];
      if (ch in VOWELS) {
        // Use word-start form if this vowel is at the beginning of the word
        result += (i === 0 ? VOWELS_WORD_START[ch] : VOWELS[ch]);
      } else if (CONSONANTS[ch]) {
        result += CONSONANTS[ch];
      } else if (NUMBERS[ch]) {
        result += NUMBERS[ch];
      } else {
        // Keep unrecognized characters as-is (punctuation, etc.)
        result += ch;
      }
      i++;
    }
  }

  return result;
}

export function toPegon(latinText: string): string {
  const lower = latinText.toLowerCase();
  // Split by spaces while preserving whitespace
  return lower
    .split(/(\s+)/)
    .map((segment) => (/\s+/.test(segment) ? segment : convertWord(segment)))
    .join('');
}
