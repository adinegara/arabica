import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  defaultConsonants, 
  defaultDiacritics, 
  defaultCombinations,
  TransliterationRule,
  TransliterationConfig 
} from '@/lib/transliteration-rules';

const STORAGE_KEY = 'arabica-transliteration-rules';

interface StoredRules {
  consonants: TransliterationRule[];
  diacritics: TransliterationRule[];
  combinations: TransliterationRule[];
}

const loadFromStorage = (): StoredRules | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load rules from localStorage:', e);
  }
  return null;
};

const saveToStorage = (rules: StoredRules) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  } catch (e) {
    console.error('Failed to save rules to localStorage:', e);
  }
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear rules from localStorage:', e);
  }
};

interface TransliterationRulesContextType {
  consonants: TransliterationRule[];
  diacritics: TransliterationRule[];
  combinations: TransliterationRule[];
  updateConsonant: (index: number, latin: string) => void;
  updateDiacritic: (index: number, latin: string) => void;
  updateCombination: (index: number, latin: string) => void;
  resetRules: () => void;
  getConfig: () => TransliterationConfig;
}

const TransliterationRulesContext = createContext<TransliterationRulesContextType | undefined>(undefined);

export const TransliterationRulesProvider = ({ children }: { children: ReactNode }) => {
  const [consonants, setConsonants] = useState<TransliterationRule[]>(() => {
    const stored = loadFromStorage();
    return stored?.consonants || [...defaultConsonants];
  });
  
  const [diacritics, setDiacritics] = useState<TransliterationRule[]>(() => {
    const stored = loadFromStorage();
    return stored?.diacritics || [...defaultDiacritics];
  });
  
  const [combinations, setCombinations] = useState<TransliterationRule[]>(() => {
    const stored = loadFromStorage();
    return stored?.combinations || [...defaultCombinations];
  });

  // Save to localStorage whenever rules change
  useEffect(() => {
    saveToStorage({ consonants, diacritics, combinations });
  }, [consonants, diacritics, combinations]);

  const updateConsonant = (index: number, latin: string) => {
    setConsonants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], latin };
      return updated;
    });
  };

  const updateDiacritic = (index: number, latin: string) => {
    setDiacritics(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], latin };
      return updated;
    });
  };

  const updateCombination = (index: number, latin: string) => {
    setCombinations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], latin };
      return updated;
    });
  };

  const resetRules = () => {
    setConsonants([...defaultConsonants]);
    setDiacritics([...defaultDiacritics]);
    setCombinations([...defaultCombinations]);
    clearStorage();
  };

  const getConfig = (): TransliterationConfig => ({
    consonants,
    diacritics,
    combinations,
    useLongVowelMarks: true,
    useEmphatic: true,
  });

  return (
    <TransliterationRulesContext.Provider value={{
      consonants,
      diacritics,
      combinations,
      updateConsonant,
      updateDiacritic,
      updateCombination,
      resetRules,
      getConfig,
    }}>
      {children}
    </TransliterationRulesContext.Provider>
  );
};

export const useTransliterationRules = () => {
  const context = useContext(TransliterationRulesContext);
  if (!context) {
    throw new Error('useTransliterationRules must be used within a TransliterationRulesProvider');
  }
  return context;
};
