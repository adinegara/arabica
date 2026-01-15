# Arabica

A modern web application for Arabic-to-Latin transliteration (romanization) with AI-powered OCR capabilities.

## Overview

Arabica is a sophisticated transliteration tool designed to convert Arabic script to Latin characters following standardized romanization rules. It handles complex Arabic linguistic features including diacritical marks, sun/moon letters, and phonetic assimilation rules (tajweed).

## Features

- **Bidirectional Transliteration** - Convert Arabic to Latin and Latin to Arabic
- **AI-Powered OCR** - Extract Arabic text from images using computer vision
- **Customizable Rules** - Edit transliteration mappings in real-time
- **Multi-language Interface** - English and Indonesian UI support
- **Dark/Light Theme** - System preference detection with manual toggle
- **Interactive Documentation** - Learn transliteration rules with examples
- **Mobile Responsive** - Works seamlessly on all devices

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| State | React Query, React Context |
| Backend | Supabase Edge Functions |
| AI/OCR | OpenAI GPT-4 Vision |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for OCR feature)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd arabica

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Transliterator.tsx    # Main transliteration UI
│   ├── ImageScanner.tsx      # OCR image scanning
│   ├── DocsSection.tsx       # Rules documentation
│   ├── Header.tsx            # Navigation header
│   └── ui/                   # shadcn/ui components
├── lib/                 # Core logic
│   ├── transliterator.ts          # Arabic→Latin conversion
│   ├── reverse-transliterator.ts  # Latin→Arabic conversion
│   ├── transliteration-rules.ts   # Rule definitions
│   └── translations.ts            # i18n strings
├── contexts/            # React context providers
│   ├── LanguageContext.tsx
│   └── TransliterationRulesContext.tsx
├── pages/               # Route pages
└── hooks/               # Custom React hooks
```

## Transliteration Rules

Arabica supports comprehensive Arabic transliteration including:

### Consonants
| Arabic | Latin | Arabic | Latin |
|--------|-------|--------|-------|
| ب | b | ص | sh/ṣ |
| ت | t | ض | dh/ḍ |
| ث | ts | ط | th/ṭ |
| ج | j | ظ | zh/ẓ |
| ح | h/ḥ | ع | ' |
| خ | kh | غ | gh |
| د | d | ف | f |
| ذ | dz | ق | q |
| ر | r | ك | k |
| ز | z | ل | l |
| س | s | م | m |
| ش | sy | ن | n |
| ه | h | و | w |
| ي | y | ء | ' |

### Diacritical Marks (Harakat)
- **Fatha** (◌َ) → a
- **Kasra** (◌ِ) → i
- **Damma** (◌ُ) → u
- **Tanwin** (◌ً ◌ٍ ◌ٌ) → an, in, un
- **Shadda** (◌ّ) → doubled consonant
- **Sukun** (◌ْ) → no vowel

### Special Rules
- **Sun Letters** - Assimilation of "al-" prefix
- **Moon Letters** - Preserved "al-" prefix
- **Ta Marbuta** - Context-dependent "t" or "h"
- **Long Vowels** - â, î, û markings

See [transliteration-rules.md](./transliteration-rules.md) for complete documentation.

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## OCR Setup

To enable image scanning:

1. Set up a Supabase project
2. Deploy the OCR edge function:
   ```bash
   supabase login
   supabase link --project-ref <PROJECT_ID>
   supabase functions deploy ocr-arabic
   ```
3. Configure OpenAI API key in Supabase secrets

See [llm-docs.md](./llm-docs.md) for detailed setup instructions.

## Deployment

Build and deploy to any static hosting provider:

```bash
npm run build    # Generates dist/ folder
```

Deploy the `dist/` folder to:
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- Any static file server

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source. See LICENSE file for details.

## Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Transliteration rules based on Indonesian/Malay romanization standards
# arabica
