import { useState, useEffect } from 'react';
import { Copy, Check, ArrowDown, ArrowUp, Trash2, ScanLine, ArrowUpDown } from 'lucide-react';
import { transliterate } from '@/lib/transliterator';
import { reverseTransliterate } from '@/lib/reverse-transliterator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTransliterationRules } from '@/contexts/TransliterationRulesContext';
import ImageScanner from './ImageScanner';

type Direction = 'arabic-to-latin' | 'latin-to-arabic';

const Transliterator = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [direction, setDirection] = useState<Direction>('arabic-to-latin');
  const [copied, setCopied] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { getConfig } = useTransliterationRules();

  useEffect(() => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    
    if (direction === 'arabic-to-latin') {
      const result = transliterate(inputText, getConfig());
      setOutputText(result);
    } else {
      const result = reverseTransliterate(inputText, getConfig());
      setOutputText(result);
    }
  }, [inputText, getConfig, direction]);

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast({ title: t('copied'), description: t('copiedDescription') });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const toggleDirection = () => {
    setDirection(prev => prev === 'arabic-to-latin' ? 'latin-to-arabic' : 'arabic-to-latin');
    setInputText('');
    setOutputText('');
  };

  const sampleArabicText = 'اَللّٰهُمَّ اِنِّيْ اَسْأَلُكَ اَنْ تَرْزُقَنِيْ رِزْقًا حَلاَلاً وَاسِعًا طَيِّبًا';
  const sampleLatinText = 'Allâhumma innî as-aluka an tarzuqanî rizqan ḫalâlan wâsi\'an thayyiban';

  const isArabicToLatin = direction === 'arabic-to-latin';
  
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in px-0">
      {/* Direction Toggle */}
      <div className="flex justify-center mb-4">
        <button
          onClick={toggleDirection}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-border rounded-full hover:bg-muted transition-colors"
          title={t('switchDirection')}
        >
          <ArrowUpDown className="w-4 h-4" />
          {isArabicToLatin ? t('arabicToLatin') : t('latinToArabic')}
        </button>
      </div>

      {/* Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs sm:text-sm font-medium text-muted-foreground">
            {isArabicToLatin ? t('arabicText') : t('latinText')}
          </label>
          <div className="flex items-center gap-2">
            {isArabicToLatin && (
              <>
                <button
                  onClick={() => setShowScanner(true)}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  {t('scanImage')}
                </button>
                <span className="text-muted-foreground/30">|</span>
              </>
            )}
            <button
              onClick={() => setInputText(isArabicToLatin ? sampleArabicText : sampleLatinText)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('trySample')}
            </button>
          </div>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isArabicToLatin ? t('arabicPlaceholder') : t('latinPlaceholder')}
          className={`text-area-box ${isArabicToLatin ? 'arabic-text' : 'latin-text'}`}
          dir={isArabicToLatin ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Arrow indicator */}
      <div className="flex justify-center py-2 sm:py-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        </div>
      </div>

      {/* Output */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs sm:text-sm font-medium text-muted-foreground">
            {isArabicToLatin ? t('latinTransliteration') : t('arabicResult')}
          </label>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={handleClear}
              className="p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors"
              title={t('clear')}
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors"
              title={t('copy')}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
        <div 
          className={`text-area-box bg-accent/30 min-h-[140px] sm:min-h-[180px] ${isArabicToLatin ? 'latin-text' : 'arabic-text'}`}
          dir={isArabicToLatin ? 'ltr' : 'rtl'}
        >
          {outputText || (
            <span className="text-muted-foreground/50 text-sm sm:text-base">
              {isArabicToLatin ? t('transliterationPlaceholder') : t('reverseTransliterationPlaceholder')}
            </span>
          )}
        </div>
      </div>

      {/* Image Scanner Modal */}
      {showScanner && (
        <ImageScanner
          onTextDetected={(text) => setInputText(text)}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default Transliterator;
