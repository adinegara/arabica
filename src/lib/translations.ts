export type Language = 'en' | 'id';

export const translations = {
  en: {
    // Header
    home: 'Home',
    docs: 'Docs',
    toggleTheme: 'Toggle theme',
    
    // Hero
    tagline: 'Arabic to Latin, simplified.',
    
    // Transliterator
    arabicText: 'Arabic Text',
    latinText: 'Latin Text',
    trySample: 'Try sample',
    arabicPlaceholder: 'Type Arabic text here',
    latinPlaceholder: 'Type Latin text here',
    latinTransliteration: 'Latin Transliteration',
    arabicResult: 'Arabic Result',
    transliterationPlaceholder: 'Transliteration will appear here...',
    reverseTransliterationPlaceholder: 'Arabic text will appear here...',
    copied: 'Copied! ✨',
    copiedDescription: 'Transliteration copied to clipboard',
    clear: 'Clear',
    copy: 'Copy',
    switchDirection: 'Switch direction',
    arabicToLatin: 'Arabic → Latin',
    latinToArabic: 'Latin → Arabic',
    
    // DocsSection
    transliterationGuide: 'Transliteration Guide 📖',
    docsIntro: 'This app converts Arabic script to Latin letters. The rules are customizable.',
    editRules: 'Edit Rules',
    resetRules: 'Reset',
    clickToEdit: 'Click to edit',
    consonantMappings: 'Consonant Mappings',
    diacritics: 'Diacritics (Harakat)',
    vowelRules: 'Vowel & Harakat Rules',
    sunMoonRules: 'Sun & Moon Letter Rules',
    nunSukunRules: 'Nun Sukun Rules (نْ)',
    specialCombinations: 'Special Combinations',
    
    // Vowel Rules
    longVowels: 'Long Vowels (Madd)',
    longVowelsDesc: 'When a short vowel is followed by its corresponding letter, it becomes a long vowel.',
    fathaAlif: 'Fatha + Alif → â',
    kasraYa: 'Kasra + Ya → î',
    dammaWaw: 'Damma + Waw → û',
    shaddaRule: 'Shadda (ّ) Rule',
    shaddaDesc: 'Shadda doubles the consonant it sits on.',
    taMarbutaRule: 'Ta Marbuta (ة) Rules',
    taMarbutaT: 'With vowel/tanwin → t',
    taMarbutaH: 'At word end (pause) → h',
    tanwinRule: 'Tanwin Rules',
    tanwinDesc: 'Tanwin adds -n sound at end of indefinite nouns.',
    tanwinFathah: 'Fathatan (ً) → an',
    tanwinKasrah: 'Kasratan (ٍ) → in',
    tanwinDammah: 'Dammatan (ٌ) → un',
    
    // Wasl Rules
    waslRules: 'Wasl (Liaison) Rules',
    afterVowelSun: 'After vowel + Sun letter',
    afterVowelMoon: 'After vowel + Moon letter',
    afterVowelAllah: 'After vowel + Allâh',
    afterConsonantAl: 'After consonant + ال',
    lamAssimilatesSpace: 'Lam assimilates, space before sun letter',
    lamPreservedSpace: 'Lam preserved, space after l',
    directlyMerges: 'Directly merges without space',
    alifDropped: 'Alif dropped, lam preserved',
    
    // Sun/Moon Letters
    sunLetters: '☀️ Sun Letters (Lam Assimilates)',
    sunLettersDesc: 'When ال is followed by a sun letter, the lam sound merges into the following consonant.',
    moonLetters: '🌙 Moon Letters (Lam Preserved)',
    moonLettersDesc: 'When ال is followed by a moon letter, the lam sound is pronounced separately.',
    
    // Nun Sukun
    nunSukunDesc: 'When nun with sukun (نْ) meets certain letters, it changes pronunciation based on tajweed rules.',
    idgham: 'Idgham (يرملون)',
    iqlab: 'Iqlab',
    nunAssimilates: 'Nun assimilates into the following letter',
    nunBecomesMim: 'Nun becomes mim (m) before ba',
    nunBecomesNg: 'Nun becomes ng before qaf/kaf',
    
    // How to customize
    howToCustomize: 'How to Customize',
    step1: 'Open',
    step2: 'Modify the',
    step2b: 'value for any Arabic character',
    step3: 'Add new rules to',
    step4: 'Save and the app will use your new mappings',
    
    // Image Scanner
    scanImage: 'Scan Arabic Text',
    scanDescription: 'Upload an image or take a photo of Arabic text to extract and transliterate it.',
    uploadImage: 'Upload Image',
    takePhoto: 'Take Photo',
    scanProcessing: 'Detecting Arabic text...',
    scanSuccess: 'Text Detected! ✨',
    scanSuccessDesc: 'Arabic text has been extracted from the image.',
    scanNoText: 'No Text Found',
    scanNoTextDesc: 'Could not detect Arabic text in the image. Try a clearer image.',
    scanError: 'Scan Failed',
    scanErrorDesc: 'An error occurred while processing the image.',
    scanTip: 'Tip: Use clear, well-lit images for best results',

    // Scan Latin (Pegon)
    scanLatinImage: 'Scan Latin Text',
    scanLatinDescription: 'Upload an image or take a photo of Indonesian/Latin text to extract and convert it to Pegon.',
    scanLatinProcessing: 'Detecting Latin text...',
    scanLatinSuccessDesc: 'Latin text has been extracted from the image.',
    scanLatinNoTextDesc: 'Could not detect Latin text in the image. Try a clearer image.',
    
    // Footer
    footer: 'Arabica — Convert with ease',
    createdBy: 'Created and crafted by',

    // Pegon
    pegon: 'Pegon',
    pegonTagline: 'Latin Indonesian to Arabic Pegon script.',
    pegonOutput: 'Pegon Output',
    pegonPlaceholder: 'Type Indonesian text here',
    pegonOutputPlaceholder: 'Pegon script will appear here...',
    trySamplePegon: 'Try sample',
    scanLatinText: 'Scan Text',
    detectingPepet: 'Detecting e pepet...',
  },
  id: {
    // Header
    home: 'Beranda',
    docs: 'Panduan',
    toggleTheme: 'Ganti tema',
    
    // Hero
    tagline: 'Arab ke Latin, lebih mudah.',
    
    // Transliterator
    arabicText: 'Teks Arab',
    latinText: 'Teks Latin',
    trySample: 'Coba contoh',
    arabicPlaceholder: 'Ketik teks Arab di sini',
    latinPlaceholder: 'Ketik teks Latin di sini',
    latinTransliteration: 'Transliterasi Latin',
    arabicResult: 'Hasil Arab',
    transliterationPlaceholder: 'Transliterasi akan muncul di sini...',
    reverseTransliterationPlaceholder: 'Teks Arab akan muncul di sini...',
    copied: 'Tersalin! ✨',
    copiedDescription: 'Transliterasi disalin ke clipboard',
    clear: 'Hapus',
    copy: 'Salin',
    switchDirection: 'Ganti arah',
    arabicToLatin: 'Arab → Latin',
    latinToArabic: 'Latin → Arab',
    
    // DocsSection
    transliterationGuide: 'Panduan Transliterasi 📖',
    docsIntro: 'Aplikasi ini mengubah huruf Arab ke huruf Latin. Aturan dapat disesuaikan.',
    editRules: 'Edit Aturan',
    resetRules: 'Reset',
    clickToEdit: 'Klik untuk edit',
    consonantMappings: 'Pemetaan Huruf Konsonan',
    diacritics: 'Harakat (Tanda Baca)',
    vowelRules: 'Aturan Vokal & Harakat',
    sunMoonRules: 'Aturan Huruf Syamsiyah & Qamariyah',
    nunSukunRules: 'Aturan Nun Sukun (نْ)',
    specialCombinations: 'Kombinasi Khusus',
    
    // Vowel Rules
    longVowels: 'Vokal Panjang (Madd)',
    longVowelsDesc: 'Ketika vokal pendek diikuti huruf yang sesuai, menjadi vokal panjang.',
    fathaAlif: 'Fathah + Alif → â',
    kasraYa: 'Kasrah + Ya → î',
    dammaWaw: 'Dhammah + Waw → û',
    shaddaRule: 'Aturan Tasydid (ّ)',
    shaddaDesc: 'Tasydid menggandakan huruf yang ditempatinya.',
    taMarbutaRule: 'Aturan Ta Marbuthah (ة)',
    taMarbutaT: 'Dengan harakat/tanwin → t',
    taMarbutaH: 'Di akhir kata (waqaf) → h',
    tanwinRule: 'Aturan Tanwin',
    tanwinDesc: 'Tanwin menambah bunyi -n di akhir kata nakirah.',
    tanwinFathah: 'Fathatan (ً) → an',
    tanwinKasrah: 'Kasratan (ٍ) → in',
    tanwinDammah: 'Dhammatan (ٌ) → un',
    
    // Wasl Rules
    waslRules: 'Aturan Wasal (Penghubung)',
    afterVowelSun: 'Setelah vokal + Huruf Syamsiyah',
    afterVowelMoon: 'Setelah vokal + Huruf Qamariyah',
    afterVowelAllah: 'Setelah vokal + Allâh',
    afterConsonantAl: 'Setelah konsonan + ال',
    lamAssimilatesSpace: 'Lam melebur, spasi sebelum huruf syamsiyah',
    lamPreservedSpace: 'Lam dipertahankan, spasi setelah l',
    directlyMerges: 'Langsung menyatu tanpa spasi',
    alifDropped: 'Alif dihilangkan, lam dipertahankan',
    
    // Sun/Moon Letters
    sunLetters: '☀️ Huruf Syamsiyah (Lam Melebur)',
    sunLettersDesc: 'Ketika ال diikuti huruf syamsiyah, bunyi lam melebur ke konsonan berikutnya.',
    moonLetters: '🌙 Huruf Qamariyah (Lam Dipertahankan)',
    moonLettersDesc: 'Ketika ال diikuti huruf qamariyah, bunyi lam diucapkan terpisah.',
    
    // Nun Sukun
    nunSukunDesc: 'Ketika nun sukun (نْ) bertemu huruf tertentu, pelafalannya berubah sesuai aturan tajwid.',
    idgham: 'Idgham (يرملون)',
    iqlab: 'Iqlab',
    nunAssimilates: 'Nun melebur ke huruf berikutnya',
    nunBecomesMim: 'Nun berubah menjadi mim (m) sebelum ba',
    nunBecomesNg: 'Nun berubah menjadi ng sebelum qaf/kaf',
    
    // How to customize
    howToCustomize: 'Cara Menyesuaikan',
    step1: 'Buka',
    step2: 'Ubah nilai',
    step2b: 'untuk huruf Arab apa pun',
    step3: 'Tambahkan aturan baru ke',
    step4: 'Simpan dan aplikasi akan menggunakan pemetaan baru Anda',
    
    // Image Scanner
    scanImage: 'Pindai Teks Arab',
    scanDescription: 'Unggah gambar atau ambil foto teks Arab untuk mengekstrak dan mentransliterasinya.',
    uploadImage: 'Unggah Gambar',
    takePhoto: 'Ambil Foto',
    scanProcessing: 'Mendeteksi teks Arab...',
    scanSuccess: 'Teks Terdeteksi! ✨',
    scanSuccessDesc: 'Teks Arab telah diekstrak dari gambar.',
    scanNoText: 'Teks Tidak Ditemukan',
    scanNoTextDesc: 'Tidak dapat mendeteksi teks Arab pada gambar. Coba gambar yang lebih jelas.',
    scanError: 'Pemindaian Gagal',
    scanErrorDesc: 'Terjadi kesalahan saat memproses gambar.',
    scanTip: 'Tips: Gunakan gambar yang jelas dan terang untuk hasil terbaik',

    // Scan Latin (Pegon)
    scanLatinImage: 'Pindai Teks Latin',
    scanLatinDescription: 'Unggah gambar atau ambil foto teks Indonesia/Latin untuk mengekstrak dan mengonversinya ke Pegon.',
    scanLatinProcessing: 'Mendeteksi teks Latin...',
    scanLatinSuccessDesc: 'Teks Latin telah diekstrak dari gambar.',
    scanLatinNoTextDesc: 'Tidak dapat mendeteksi teks Latin pada gambar. Coba gambar yang lebih jelas.',
    
    // Footer
    footer: 'Arabica — Konversi dengan mudah',
    createdBy: 'Dibuat dan dirancang oleh',

    // Pegon
    pegon: 'Pegon',
    pegonTagline: 'Konversi huruf Latin Indonesia ke aksara Arab Pegon.',
    pegonOutput: 'Hasil Pegon',
    pegonPlaceholder: 'Ketik teks Indonesia di sini',
    pegonOutputPlaceholder: 'Aksara Pegon akan muncul di sini...',
    trySamplePegon: 'Coba contoh',
    scanLatinText: 'Pindai Teks',
    detectingPepet: 'Mendeteksi e pepet...',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
