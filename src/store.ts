import { create } from 'zustand';
import type { DiaryEntry, DiarySupplement, MoodType, WeatherType } from '@/types';
import { supabase } from '@/lib/supabase';

interface DiaryState {
  entries: DiaryEntry[];
  loading: boolean;
  filterMood: MoodType | null;
  filterWeather: WeatherType | null;

  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'supplements'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setFilterMood: (mood: MoodType | null) => void;
  setFilterWeather: (weather: WeatherType | null) => void;
  clearFilters: () => void;

  addSupplement: (diaryId: string, supplement: DiarySupplement) => Promise<void>;
  deleteSupplement: (diaryId: string, supplementId: string) => Promise<void>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  loading: false,
  filterMood: null,
  filterWeather: null,

  loadEntries: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from('diaries')
      .select('*')
      .order('created_at', { ascending: false });

    set({ entries: (data as DiaryEntry[]) || [], loading: false });
  },

  addEntry: async (entry) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('diaries')
      .insert({ ...entry, user_id: user.id, supplements: [] })
      .select()
      .single();

    if (data) {
      set((state) => ({ entries: [data as DiaryEntry, ...state.entries] }));
    }
  },

  deleteEntry: async (id) => {
    await supabase.from('diaries').delete().eq('id', id);
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
  },

  setFilterMood: (mood) => set({ filterMood: mood }),
  setFilterWeather: (weather) => set({ filterWeather: weather }),
  clearFilters: () => set({ filterMood: null, filterWeather: null }),

  addSupplement: async (diaryId, supplement) => {
    const entry = get().entries.find((e) => e.id === diaryId);
    if (!entry) return;

    const newSupplements = [...entry.supplements, supplement];
    await supabase
      .from('diaries')
      .update({ supplements: newSupplements, updated_at: new Date().toISOString() })
      .eq('id', diaryId);

    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === diaryId ? { ...e, supplements: newSupplements, updated_at: new Date().toISOString() } : e
      ),
    }));
  },

  deleteSupplement: async (diaryId, supplementId) => {
    const entry = get().entries.find((e) => e.id === diaryId);
    if (!entry) return;

    const newSupplements = entry.supplements.filter((s) => s.id !== supplementId);
    await supabase
      .from('diaries')
      .update({ supplements: newSupplements, updated_at: new Date().toISOString() })
      .eq('id', diaryId);

    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === diaryId ? { ...e, supplements: newSupplements, updated_at: new Date().toISOString() } : e
      ),
    }));
  },
}));