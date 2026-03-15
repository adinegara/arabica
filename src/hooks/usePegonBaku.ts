import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PegonBakuWord {
  id: number;
  latin: string;
  arabic: string;
}

// Cache to avoid refetching
let cachedWords: Record<string, string> | null = null;
let cachedList: PegonBakuWord[] | null = null;

export function usePegonBaku() {
  const [words, setWords] = useState<Record<string, string>>(cachedWords || {});
  const [wordList, setWordList] = useState<PegonBakuWord[]>(cachedList || []);
  const [loading, setLoading] = useState(!cachedWords);

  useEffect(() => {
    if (cachedWords) return;

    async function fetchWords() {
      try {
        const { data, error } = await supabase
          .from('pegon_baku')
          .select('id, latin, arabic')
          .eq('status', 'approved')
          .order('latin');

        if (error) {
          console.error('Failed to fetch pegon baku:', error);
          return;
        }

        const list = (data || []) as PegonBakuWord[];
        const map: Record<string, string> = {};
        for (const row of list) {
          map[row.latin] = row.arabic;
        }

        cachedWords = map;
        cachedList = list;
        setWords(map);
        setWordList(list);
      } finally {
        setLoading(false);
      }
    }

    fetchWords();
  }, []);

  const invalidateCache = () => {
    cachedWords = null;
    cachedList = null;
  };

  return { words, wordList, loading, invalidateCache };
}
