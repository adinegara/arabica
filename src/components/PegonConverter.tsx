import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check, ArrowDown, Trash2, GripHorizontal } from 'lucide-react';
import { toPegon } from '@/lib/pegon';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const PegonConverter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    setOutputText(toPegon(inputText));
  }, [inputText]);

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

  const sampleText = 'bismillah pada zaman dahulu ada seorang raja';

  const handleResizePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;
    const startY = e.clientY;
    const startHeight = textarea.offsetHeight;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientY - startY;
      textarea.style.height = `${Math.max(140, startHeight + delta)}px`;
    };
    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in px-0">
      {/* Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs sm:text-sm font-medium text-muted-foreground">
            {t('latinText')}
          </label>
          <button
            onClick={() => setInputText(sampleText)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('trySamplePegon')}
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('pegonPlaceholder')}
          className="text-area-box latin-text rounded-b-none border-b-0"
          dir="ltr"
        />
        <div
          onPointerDown={handleResizePointerDown}
          className="flex items-center justify-center gap-4 py-1.5 cursor-ns-resize border-2 border-t-0 border-border rounded-b-xl hover:bg-muted/50 transition-colors select-none touch-none"
        >
          <GripHorizontal className="w-5 h-5 text-muted-foreground/60" />
        </div>
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
            {t('pegonOutput')}
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
          className="text-area-box bg-accent/30 min-h-[140px] sm:min-h-[180px] arabic-text"
          dir="rtl"
        >
          {outputText || (
            <span className="text-muted-foreground/50 text-sm sm:text-base">
              {t('pegonOutputPlaceholder')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PegonConverter;
