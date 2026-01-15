import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTransliterationRules } from '@/contexts/TransliterationRulesContext';
import EditableRule from './EditableRule';

// Sun letters (lam assimilates)
const SUN_LETTERS = [
  { arabic: 'ت', latin: 't', name: 'Ta' },
  { arabic: 'ث', latin: 'ts', name: 'Tsa' },
  { arabic: 'د', latin: 'd', name: 'Dal' },
  { arabic: 'ذ', latin: 'dz', name: 'Dzal' },
  { arabic: 'ر', latin: 'r', name: 'Ra' },
  { arabic: 'ز', latin: 'z', name: 'Zay' },
  { arabic: 'س', latin: 's', name: 'Sin' },
  { arabic: 'ش', latin: 'sy', name: 'Syin' },
  { arabic: 'ص', latin: 'sh', name: 'Shad' },
  { arabic: 'ض', latin: 'dl', name: 'Dlad' },
  { arabic: 'ط', latin: 'th', name: 'Tha' },
  { arabic: 'ظ', latin: 'zh', name: 'Zha' },
  { arabic: 'ل', latin: 'l', name: 'Lam' },
  { arabic: 'ن', latin: 'n', name: 'Nun' },
];

// Moon letters (lam preserved)
const MOON_LETTERS = [
  { arabic: 'ا', latin: 'a', name: 'Alif' },
  { arabic: 'ب', latin: 'b', name: 'Ba' },
  { arabic: 'ج', latin: 'j', name: 'Jim' },
  { arabic: 'ح', latin: 'ḫ', name: 'Ha' },
  { arabic: 'خ', latin: 'kh', name: 'Kha' },
  { arabic: 'ع', latin: "'", name: 'Ain' },
  { arabic: 'غ', latin: 'gh', name: 'Ghain' },
  { arabic: 'ف', latin: 'f', name: 'Fa' },
  { arabic: 'ق', latin: 'q', name: 'Qaf' },
  { arabic: 'ك', latin: 'k', name: 'Kaf' },
  { arabic: 'م', latin: 'm', name: 'Mim' },
  { arabic: 'ه', latin: 'h', name: 'Ha' },
  { arabic: 'و', latin: 'w', name: 'Waw' },
  { arabic: 'ي', latin: 'y', name: 'Ya' },
];

const DocsSection = () => {
  const [showConsonants, setShowConsonants] = useState(false);
  const [showDiacritics, setShowDiacritics] = useState(false);
  const [showVowelRules, setShowVowelRules] = useState(false);
  const [showWordRules, setShowWordRules] = useState(false);
  const [showNunSukunRules, setShowNunSukunRules] = useState(false);
  const [showCombinations, setShowCombinations] = useState(false);
  const { t, language } = useLanguage();
  const { 
    consonants, 
    diacritics, 
    combinations, 
    updateConsonant, 
    updateDiacritic, 
    updateCombination,
    resetRules 
  } = useTransliterationRules();

  // Wasl (liaison) rules - translated
  const WASL_RULES = [
    { rule: t('afterVowelSun'), example: 'أَنْتَ الصَّمَدُ', result: 'antash shamadu', note: t('lamAssimilatesSpace') },
    { rule: t('afterVowelMoon'), example: 'أَنْتَ الْقَادِرُ', result: 'antal qâdiru', note: t('lamPreservedSpace') },
    { rule: t('afterVowelAllah'), example: 'أَنْتَ اللّٰهُ', result: 'antallâhu', note: t('directlyMerges') },
    { rule: t('afterConsonantAl'), example: 'مِنْ الْقَلْب', result: 'minal qalb', note: t('alifDropped') },
  ];

  // Nun Sukun rules - translated
  const NUN_SUKUN_RULES = [
    { 
      rule: t('idgham'), 
      letters: 'ي ر م ل و ن',
      example: 'يَكُنْ لَهُ', 
      result: 'yakul lahu', 
      note: t('nunAssimilates')
    },
    { 
      rule: `${t('iqlab')} (ب)`, 
      letters: 'ب',
      example: 'مِنْ بَعْدِ', 
      result: 'mim ba\'di', 
      note: t('nunBecomesMim')
    },
    { 
      rule: `${t('iqlab')} (ق ك)`, 
      letters: 'ق ك',
      example: 'مِنْكَ', 
      result: 'mingka', 
      note: t('nunBecomesNg')
    },
  ];

  return (
    <section className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          {t('transliterationGuide')}
        </h2>
        <button
          onClick={resetRules}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
          title={t('resetRules')}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('resetRules')}
        </button>
      </div>
      
      <p className="text-muted-foreground mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
        {t('docsIntro')} <span className="text-primary">{t('clickToEdit')}</span>
      </p>


      {/* Consonants */}
      <div className="border-2 border-border rounded-xl mb-3 sm:mb-4 overflow-hidden">
        <button
          onClick={() => setShowConsonants(!showConsonants)}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium text-sm sm:text-base">{t('consonantMappings')}</span>
          {showConsonants ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        {showConsonants && (
          <div className="p-3 sm:p-4 border-t border-border bg-muted/30">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 text-sm">
              {consonants.map((rule, index) => (
                <EditableRule
                  key={rule.arabic}
                  arabic={rule.arabic}
                  latin={rule.latin}
                  description={rule.description}
                  onUpdate={(latin) => updateConsonant(index, latin)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Diacritics */}
      <div className="border-2 border-border rounded-xl mb-3 sm:mb-4 overflow-hidden">
        <button
          onClick={() => setShowDiacritics(!showDiacritics)}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium text-sm sm:text-base">{t('diacritics')}</span>
          {showDiacritics ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        {showDiacritics && (
          <div className="p-3 sm:p-4 border-t border-border bg-muted/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm">
              {diacritics.map((rule, index) => (
                <div key={index} className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-card rounded-lg group cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    const newValue = prompt(`Edit Latin value for ${rule.description}:`, rule.latin);
                    if (newValue !== null) {
                      updateDiacritic(index, newValue);
                    }
                  }}
                >
                  <span className="font-arabic text-base sm:text-lg w-5 sm:w-6 text-center">{'ـ' + rule.arabic}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{rule.latin || '∅'}</span>
                  <span className="text-xs text-muted-foreground ml-auto truncate">{rule.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vowel & Harakat Rules */}
      <div className="border-2 border-border rounded-xl mb-3 sm:mb-4 overflow-hidden">
        <button
          onClick={() => setShowVowelRules(!showVowelRules)}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium text-sm sm:text-base">{t('vowelRules')}</span>
          {showVowelRules ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        {showVowelRules && (
          <div className="p-3 sm:p-4 border-t border-border bg-muted/30 space-y-4">
            {/* Long Vowels */}
            <div>
              <h4 className="font-semibold text-xs sm:text-sm mb-2">{t('longVowels')}</h4>
              <p className="text-xs text-muted-foreground mb-2">{t('longVowelsDesc')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 bg-card rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic">بَا</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">bâ</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('fathaAlif')}</p>
                </div>
                <div className="p-2 bg-card rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic">بِي</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">bî</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('kasraYa')}</p>
                </div>
                <div className="p-2 bg-card rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic">بُو</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">bû</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('dammaWaw')}</p>
                </div>
              </div>
            </div>

            {/* Shadda Rule */}
            <div>
              <h4 className="font-semibold text-xs sm:text-sm mb-2">{t('shaddaRule')}</h4>
              <p className="text-xs text-muted-foreground mb-2">{t('shaddaDesc')}</p>
              <div className="p-2 bg-card rounded-lg text-xs sm:text-sm inline-flex items-center gap-2">
                <span className="font-arabic">رَبَّ</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">rabba</span>
              </div>
            </div>

            {/* Ta Marbuta */}
            <div>
              <h4 className="font-semibold text-xs sm:text-sm mb-2">{t('taMarbutaRule')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2 bg-card rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic">رَحْمَةِ</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">raḫmati</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('taMarbutaT')}</p>
                </div>
                <div className="p-2 bg-card rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic">رَحْمَةْ</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">raḫmah</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('taMarbutaH')}</p>
                </div>
              </div>
            </div>

            {/* Tanwin */}
            <div>
              <h4 className="font-semibold text-xs sm:text-sm mb-2">{t('tanwinRule')}</h4>
              <p className="text-xs text-muted-foreground mb-2">{t('tanwinDesc')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 bg-card rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic">كِتَابًا</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">kitâban</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('tanwinFathah')}</p>
                </div>
                <div className="p-2 bg-card rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic">كِتَابٍ</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">kitâbin</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('tanwinKasrah')}</p>
                </div>
                <div className="p-2 bg-card rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic">كِتَابٌ</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">kitâbun</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('tanwinDammah')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Word Rules (Sun/Moon Letters, Wasl) */}
      <div className="border-2 border-border rounded-xl mb-3 sm:mb-4 overflow-hidden">
        <button
          onClick={() => setShowWordRules(!showWordRules)}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium text-sm sm:text-base">{t('sunMoonRules')}</span>
          {showWordRules ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        {showWordRules && (
          <div className="p-3 sm:p-4 border-t border-border bg-muted/30 space-y-4 sm:space-y-6">
            {/* Wasl Rules */}
            <div>
              <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">{t('waslRules')}</h4>
              <div className="space-y-2">
                {WASL_RULES.map((r, idx) => (
                  <div key={idx} className="p-2 sm:p-3 bg-card rounded-lg text-xs sm:text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-primary">{r.rule}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-muted-foreground">
                      <span className="font-arabic text-sm sm:text-base">{r.example}</span>
                      <span>→</span>
                      <span className="font-medium text-foreground">{r.result}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sun Letters */}
            <div>
              <h4 className="font-semibold text-xs sm:text-sm mb-2">{t('sunLetters')}</h4>
              <p className="text-xs text-muted-foreground mb-2 sm:mb-3">
                {t('sunLettersDesc')}
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 sm:gap-2">
                {SUN_LETTERS.map((l) => (
                  <div key={l.arabic} className="flex flex-col items-center p-1.5 sm:p-2 bg-card rounded-lg">
                    <span className="font-arabic text-base sm:text-lg">{l.arabic}</span>
                    <span className="text-xs text-muted-foreground">{l.latin}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Moon Letters */}
            <div>
              <h4 className="font-semibold text-xs sm:text-sm mb-2">{t('moonLetters')}</h4>
              <p className="text-xs text-muted-foreground mb-2 sm:mb-3">
                {t('moonLettersDesc')}
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 sm:gap-2">
                {MOON_LETTERS.map((l) => (
                  <div key={l.arabic} className="flex flex-col items-center p-1.5 sm:p-2 bg-card rounded-lg">
                    <span className="font-arabic text-base sm:text-lg">{l.arabic}</span>
                    <span className="text-xs text-muted-foreground">{l.latin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nun Sukun Rules */}
      <div className="border-2 border-border rounded-xl mb-3 sm:mb-4 overflow-hidden">
        <button
          onClick={() => setShowNunSukunRules(!showNunSukunRules)}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium text-sm sm:text-base">{t('nunSukunRules')}</span>
          {showNunSukunRules ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        {showNunSukunRules && (
          <div className="p-3 sm:p-4 border-t border-border bg-muted/30 space-y-4">
            <p className="text-xs text-muted-foreground">
              {t('nunSukunDesc')}
            </p>
            <div className="space-y-2">
              {NUN_SUKUN_RULES.map((r, idx) => (
                <div key={idx} className="p-2 sm:p-3 bg-card rounded-lg text-xs sm:text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-primary">{r.rule}</span>
                    <span className="text-muted-foreground font-arabic">({r.letters})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-muted-foreground">
                    <span className="font-arabic text-sm sm:text-base">{r.example}</span>
                    <span>→</span>
                    <span className="font-medium text-foreground">{r.result}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Special Combinations */}
      <div className="border-2 border-border rounded-xl mb-3 sm:mb-4 overflow-hidden">
        <button
          onClick={() => setShowCombinations(!showCombinations)}
          className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium text-sm sm:text-base">{t('specialCombinations')}</span>
          {showCombinations ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        {showCombinations && (
          <div className="p-3 sm:p-4 border-t border-border bg-muted/30">
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              {combinations.map((rule, index) => (
                <div 
                  key={index} 
                  className="flex flex-wrap items-center gap-2 sm:gap-3 p-2 bg-card rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    const newValue = prompt(`Edit Latin value for "${rule.arabic}":`, rule.latin);
                    if (newValue !== null) {
                      updateCombination(index, newValue);
                    }
                  }}
                >
                  <span className="font-arabic text-base sm:text-lg">{rule.arabic}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{rule.latin}</span>
                  {rule.description && (
                    <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">{rule.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </section>
  );
};

export default DocsSection;
