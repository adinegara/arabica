// Pegon character mappings (Latin Indonesian → Arabic Pegon)
// Based on Dasar Pegon 1.xls

const DIGRAPHS: Record<string, string> = {
  kho: 'خ',
  ny: 'پ',
  ng: 'ع',
  sy: 'ش',
  kh: 'ح',
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
  e: 'ي',
  o: 'و',
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
      if (VOWELS[ch]) {
        result += VOWELS[ch];
      } else if (CONSONANTS[ch]) {
        result += CONSONANTS[ch];
      } else {
        // Keep unrecognized characters as-is (punctuation, numbers, etc.)
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
