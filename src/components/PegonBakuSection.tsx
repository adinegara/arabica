import { useState } from 'react';
import { Send, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePegonBaku } from '@/hooks/usePegonBaku';

const PegonBakuSection = () => {
  const { wordList, loading, invalidateCache } = usePegonBaku();
  const [showList, setShowList] = useState(false);
  const [latin, setLatin] = useState('');
  const [arabic, setArabic] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latin.trim() || !arabic.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('submit-pegon-baku', {
        body: { latin: latin.trim(), arabic: arabic.trim(), submitted_by: submittedBy.trim() },
      });

      if (error) throw error;

      toast({
        title: t('bakuSubmitSuccess'),
        description: t('bakuSubmitSuccessDesc'),
      });
      setLatin('');
      setArabic('');
      setSubmittedBy('');
    } catch {
      toast({
        title: t('bakuSubmitError'),
        description: t('bakuSubmitErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 sm:mt-12 px-0 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-1 flex items-center justify-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          {t('bakuTitle')}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t('bakuDescription')}
        </p>
      </div>

      {/* Word List Toggle */}
      <button
        onClick={() => setShowList(!showList)}
        className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-border hover:bg-muted/50 transition-colors mb-4"
      >
        <span className="text-sm font-medium">
          {t('bakuWordList')} ({loading ? '...' : wordList.length})
        </span>
        {showList ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Word List */}
      {showList && (
        <div className="border-2 border-border rounded-xl overflow-hidden mb-6">
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left p-2 px-3 font-medium text-muted-foreground">Latin</th>
                  <th className="text-right p-2 px-3 font-medium text-muted-foreground">Pegon Baku</th>
                </tr>
              </thead>
              <tbody>
                {wordList.map((word) => (
                  <tr key={word.id} className="border-t border-border/50 hover:bg-muted/30">
                    <td className="p-2 px-3">{word.latin}</td>
                    <td className="p-2 px-3 text-right arabic-text text-base" dir="rtl">{word.arabic}</td>
                  </tr>
                ))}
                {wordList.length === 0 && !loading && (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-muted-foreground text-xs">
                      {t('bakuEmpty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submit Form */}
      <form onSubmit={handleSubmit} className="border-2 border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium mb-1">{t('bakuSubmitTitle')}</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={latin}
            onChange={(e) => setLatin(e.target.value)}
            placeholder={t('bakuLatinPlaceholder')}
            className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
            required
            dir="ltr"
          />
          <input
            type="text"
            value={arabic}
            onChange={(e) => setArabic(e.target.value)}
            placeholder={t('bakuArabicPlaceholder')}
            className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors arabic-text"
            required
            dir="rtl"
          />
        </div>
        <input
          type="text"
          value={submittedBy}
          onChange={(e) => setSubmittedBy(e.target.value)}
          placeholder={t('bakuNamePlaceholder')}
          className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
          dir="ltr"
        />
        <button
          type="submit"
          disabled={submitting || !latin.trim() || !arabic.trim()}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          <Send className="w-3.5 h-3.5" />
          {submitting ? t('bakuSubmitting') : t('bakuSubmit')}
        </button>
      </form>
    </div>
  );
};

export default PegonBakuSection;
