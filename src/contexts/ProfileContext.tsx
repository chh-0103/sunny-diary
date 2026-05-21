import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import type { UserProfile, ProfileTag, StatusType, StatusRecord } from '@/types';
import { STATUS_CONFIG } from '@/types';
import { supabase } from '@/lib/supabase';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'gender' | 'birthday' | 'birthplace' | 'tags' | 'avatar_url'>>) => Promise<void>;
  setStatus: (status: StatusType) => Promise<void>;
  clearStatus: () => Promise<void>;
}

const ProfileContext = createContext<ProfileState | undefined>(undefined);

const EMPTY_PROFILE: Omit<UserProfile, 'status_history'> = {
  user_id: '',
  gender: '',
  birthday: '',
  birthplace: '',
  tags: [],
  avatar_url: '',
  status: null,
  status_emoji: '',
  status_set_at: '',
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const profileRef = useRef<UserProfile | null>(null);
  profileRef.current = profile;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      const p = data as UserProfile;
      if (p.status_set_at) {
        const elapsed = Date.now() - new Date(p.status_set_at).getTime();
        if (elapsed > 24 * 60 * 60 * 1000) {
          const history = [...(p.status_history || [])];
          if (elapsed >= 3 * 60 * 60 * 1000) {
            const record: StatusRecord = {
              status: p.status!,
              emoji: p.status_emoji,
              started_at: p.status_set_at,
              ended_at: new Date().toISOString(),
            };
            history.push(record);
            const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            const filtered = history.filter(r => new Date(r.ended_at!).getTime() > weekAgo);
            await supabase.from('user_profiles').update({
              status: null, status_emoji: '', status_set_at: null, status_history: filtered,
            }).eq('user_id', user.id);
            p.status = null;
            p.status_emoji = '';
            p.status_set_at = '';
            p.status_history = filtered;
          } else {
            await supabase.from('user_profiles').update({
              status: null, status_emoji: '', status_set_at: null,
            }).eq('user_id', user.id);
            p.status = null;
            p.status_emoji = '';
            p.status_set_at = '';
          }
        }
      }
      setProfile(p);
    } else {
      const initial: UserProfile = {
        user_id: user.id,
        gender: '',
        birthday: '',
        birthplace: '',
        tags: [],
        avatar_url: '',
        status: null,
        status_emoji: '',
        status_set_at: '',
        status_history: [],
      };
      await supabase.from('user_profiles').insert(initial);
      setProfile(initial);
    }
    setLoading(false);
  }, []);

  const updateProfile = async (updates: Partial<Pick<UserProfile, 'gender' | 'birthday' | 'birthplace' | 'tags' | 'avatar_url'>>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: user.id, ...updates }, { onConflict: 'user_id' });

    if (error) {
      console.error('updateProfile error:', error);
      return;
    }

    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const setStatusFn = useCallback(async (status: StatusType) => {
    const { data: { user } } = await supabase.auth.getUser();
    const currentProfile = profileRef.current;
    if (!user || !currentProfile) return;

    const now = new Date().toISOString();
    const history = [...(currentProfile.status_history || [])];

    if (currentProfile.status && currentProfile.status_set_at) {
      const elapsed = Date.now() - new Date(currentProfile.status_set_at).getTime();
      if (elapsed >= 3 * 60 * 60 * 1000) {
        const record: StatusRecord = {
          status: currentProfile.status,
          emoji: currentProfile.status_emoji,
          started_at: currentProfile.status_set_at,
          ended_at: now,
        };
        history.push(record);
      }
    }

    const cfg = STATUS_CONFIG[status];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const filtered = history.filter(r => r.ended_at && new Date(r.ended_at).getTime() > weekAgo);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        status, status_emoji: cfg.emoji, status_set_at: now,
        status_history: filtered,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to set status:', error);
      return;
    }

    setProfile(prev => prev ? {
      ...prev,
      status,
      status_emoji: cfg.emoji,
      status_set_at: now,
      status_history: filtered,
    } : null);
  }, []);

  const clearStatus = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const currentProfile = profileRef.current;
    if (!user || !currentProfile) return;

    const now = new Date().toISOString();
    const history = [...(currentProfile.status_history || [])];

    if (currentProfile.status && currentProfile.status_set_at) {
      const elapsed = Date.now() - new Date(currentProfile.status_set_at).getTime();
      if (elapsed >= 3 * 60 * 60 * 1000) {
        const record: StatusRecord = {
          status: currentProfile.status,
          emoji: currentProfile.status_emoji,
          started_at: currentProfile.status_set_at,
          ended_at: now,
        };
        history.push(record);
      }
    }

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const filtered = history.filter(r => r.ended_at && new Date(r.ended_at).getTime() > weekAgo);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        status: null, status_emoji: '', status_set_at: null,
        status_history: filtered,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to clear status:', error);
      return;
    }

    setProfile(prev => prev ? {
      ...prev,
      status: null,
      status_emoji: '',
      status_set_at: '',
      status_history: filtered,
    } : null);
  }, []);

  return (
    <ProfileContext.Provider value={{
      profile, loading, loadProfile,
      updateProfile, setStatus: setStatusFn, clearStatus,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}