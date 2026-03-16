import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
        } else {
          const { data, error: signInError } = await supabase.auth.signInAnonymously();
          if (signInError) {
            console.error('Anonymous sign-in error:', signInError);
            setError(signInError.message);
          } else {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
        setError(String(err));
      }
      setLoading(false);
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, error };
}
