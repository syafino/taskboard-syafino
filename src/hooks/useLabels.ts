import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Label } from '../types';

export function useLabels(userId: string | undefined) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLabels = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (!error && data) setLabels(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchLabels(); }, [fetchLabels]);

  const addLabel = async (name: string, color: string) => {
    if (!userId) return;
    const { error } = await supabase.from('labels').insert({ name, color, user_id: userId });
    if (!error) await fetchLabels();
  };

  const removeLabel = async (id: string) => {
    await supabase.from('task_labels').delete().eq('label_id', id);
    const { error } = await supabase.from('labels').delete().eq('id', id);
    if (!error) await fetchLabels();
  };

  return { labels, loading, addLabel, removeLabel, refetch: fetchLabels };
}
