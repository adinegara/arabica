# Arabic Transliteration Rules

This document contains the transliteration mapping rules from Arabic to Latin script, based on Indonesian/Malay transliteration style. You can customize these rules for your own project.

---

## Consonant Mappings

| Arabic | Latin | Description |
|:------:|:-----:|-------------|
| ب | b | Ba |
| ت | t | Ta |
| ث | ts | Tsa |
| ج | j | Jim |
| ح | ḫ | Ha (guttural) |
| خ | kh | Kha |
| د | d | Dal |
| ذ | dz | Dzal |
| ر | r | Ra |
| ز | z | Zay |
| س | s | Sin |
| ش | sy | Syin |
| ص | sh | Shad |
| ض | dl | Dlad |
| ط | th | Tha |
| ظ | zh | Zha |
| ع | ' | Ain |
| غ | gh | Ghain |
| ف | f | Fa |
| ق | q | Qaf |
| ك | k | Kaf |
| ل | l | Lam |
| م | m | Mim |
| ن | n | Nun |
| ه | h | Ha |
| ٱ | *(silent)* | Alif Wasla |

> **Note:** و (Waw), ي (Ya), and ا (Alif) are handled specially as they can be consonants or vowels.

---

## Diacritics (Harakat)

| Arabic | Latin | Description |
|:------:|:-----:|-------------|
| َ | a | Fatha → a |
| ِ | i | Kasra → i |
| ُ | u | Damma → u |
| ً | an | Fathatan → an |
| ٍ | in | Kasratan → in |
| ٌ | un | Dammatan → un |
| ْ | *(none)* | Sukun (no vowel) |
| ّ | *(doubles consonant)* | Shadda |
| ٰ | â | Superscript Alif → â (long a) |
| ٖ | î | Subscript Alif → î (long i) |
| ٗ | û | Inverted Damma → û (long u) |
| ٓ | *(none)* | Madda mark |
| ۗ | *(none)* | Waqf marker |
| ۚ | *(none)* | Pause marker |
| ۙ | *(none)* | Waqf marker |
| ۝ | . | Verse separator |

---

## Vowel & Harakat Rules

### Long Vowels (Madd)

When a short vowel is followed by its corresponding letter, it becomes a long vowel:

| Pattern | Arabic | Latin | Rule |
|---------|:------:|:-----:|------|
| Fatha + Alif | بَا | bâ | a + ا → â |
| Kasra + Ya | بِي | bî | i + ي → î |
| Damma + Waw | بُو | bû | u + و → û |

### Shadda Rule (ّ)

Shadda doubles the consonant it sits on:

| Arabic | Latin | Note |
|:------:|:-----:|------|
| رَبَّ | rabba | ب with shadda = bb |
| اللّٰه | Allâh | ل with shadda = ll |

### Ta Marbuta (ة) Rules

| Condition | Arabic | Latin | Rule |
|-----------|:------:|:-----:|------|
| With vowel/tanwin | رَحْمَةِ | raḫmati | ة → t |
| At word end (pause) | رَحْمَةْ | raḫmah | ة → h |

### Tanwin Rules

Tanwin adds -n sound at end of indefinite nouns:

| Arabic | Latin | Rule |
|:------:|:-----:|------|
| كِتَابًا | kitâban | Fathatan (ً) → an |
| كِتَابٍ | kitâbin | Kasratan (ٍ) → in |
| كِتَابٌ | kitâbun | Dammatan (ٌ) → un |

---

## Sun & Moon Letter Rules

### Sun Letters (الحروف الشمسية)

When ال is followed by a sun letter, the lam sound **assimilates** into the following consonant:

| Letter | Latin | Example |
|:------:|:-----:|---------|
| ت | t | الت → at-t... |
| ث | ts | الث → ats-ts... |
| د | d | الد → ad-d... |
| ذ | dz | الذ → adz-dz... |
| ر | r | الر → ar-r... |
| ز | z | الز → az-z... |
| س | s | الس → as-s... |
| ش | sy | الش → asy-sy... |
| ص | sh | الص → ash-sh... |
| ض | dl | الض → adl-dl... |
| ط | th | الط → ath-th... |
| ظ | zh | الظ → azh-zh... |
| ل | l | الل → al-l... |
| ن | n | الن → an-n... |

**Example:** الشَّمْسُ → asy-syamsu

### Moon Letters (الحروف القمرية)

When ال is followed by a moon letter, the lam sound is **preserved**:

| Letter | Latin | Example |
|:------:|:-----:|---------|
| ا | a | الا → al-a... |
| ب | b | الب → al-b... |
| ج | j | الج → al-j... |
| ح | ḫ | الح → al-ḫ... |
| خ | kh | الخ → al-kh... |
| ع | ' | الع → al-'... |
| غ | gh | الغ → al-gh... |
| ف | f | الف → al-f... |
| ق | q | الق → al-q... |
| ك | k | الك → al-k... |
| م | m | الم → al-m... |
| ه | h | اله → al-h... |
| و | w | الو → al-w... |
| ي | y | الي → al-y... |

**Example:** الْقَمَرُ → al-qamaru

---

## Wasl (Liaison) Rules

| Rule | Arabic | Latin | Note |
|------|:------:|:-----:|------|
| After vowel + Sun letter | أَنْتَ الصَّمَدُ | antash shamadu | Lam assimilates, space before sun letter |
| After vowel + Moon letter | أَنْتَ الْقَادِرُ | antal qâdiru | Lam preserved, space after l |
| After vowel + Allâh | أَنْتَ اللّٰهُ | antallâhu | Directly merges without space |
| After consonant + ال | مِنْ الْقَلْب | minal qalb | Alif dropped, lam preserved |

---

## Nun Sukun Rules (نْ)

When nun with sukun (نْ) meets certain letters, it changes pronunciation based on tajweed rules:

| Rule | Trigger Letters | Arabic | Latin | Note |
|------|-----------------|:------:|:-----:|------|
| Idgham | ي ر م ل و ن | يَكُنْ لَهُ | yakul lahu | Nun assimilates into the following letter |
| Iqlab (ب) | ب | مِنْ بَعْدِ | mim ba'di | Nun becomes mim (m) before ba |
| Iqlab (ق ك) | ق ك | مِنْكَ | mingka | Nun becomes ng before qaf/kaf |

---

## Special Combinations

These are pre-defined phrase mappings that take priority over character-by-character transliteration:

| Arabic | Latin | Description |
|--------|-------|-------------|
| اَللَّهُمَّ | Allâhumma | Allahumma (with harakat) |
| اللّٰهُمَّ | Allâhumma | Allahumma (Quranic spelling) |
| ٱللّٰهُمَّ | Allâhumma | Allahumma (wasla) |
| اللَّهُمَّ | Allâhumma | Allahumma |
| اللهم | Allâhumma | Allahumma (no harakat) |
| اللّٰه | Allâh | Allah (Quranic spelling) |
| ٱللّٰه | Allâh | Allah (wasla) |
| الله | Allâh | Allah (no harakat) |
| اَللَّه | Allâh | Allah (with harakat) |
| بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ | Bismillâhir raḫmânir raḫîm | Bismillah |

---

## Configuration Options

```typescript
type TransliterationConfig = {
  consonants: TransliterationRule[];
  diacritics: TransliterationRule[];
  combinations: TransliterationRule[];
  useLongVowelMarks: boolean; // â, î, û vs aa, ii, uu
  useEmphatic: boolean; // ḫ, ṣ vs h, s
};
```

### Options Explained

- **useLongVowelMarks**: When `true`, uses circumflex marks (â, î, û). When `false`, uses doubled vowels (aa, ii, uu).
- **useEmphatic**: When `true`, uses special characters for emphatic consonants (ḫ for ح). When `false`, uses simple letters.

---

## How to Customize

1. Copy the rules you need from this document
2. Modify the `latin` value for any Arabic character
3. Add new rules to the `combinations` array for special phrases
4. Adjust the configuration options as needed

---

## TypeScript Interface

```typescript
interface TransliterationRule {
  arabic: string;
  latin: string;
  description?: string;
}
```

---

*Based on Indonesian/Malay transliteration style. Customize as needed for your project.*
