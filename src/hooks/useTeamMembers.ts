import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { TeamMember } from '../types';

export function useTeamMembers(userId: string | undefined) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (!error && data) setMembers(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const addMember = async (name: string, color: string) => {
    if (!userId) return;
    const { error } = await supabase.from('team_members').insert({ name, color, user_id: userId });
    if (!error) await fetchMembers();
  };

  const removeMember = async (id: string) => {
    await supabase.from('task_assignees').delete().eq('member_id', id);
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (!error) await fetchMembers();
  };

  return { members, loading, addMember, removeMember, refetch: fetchMembers };
}
