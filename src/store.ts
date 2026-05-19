import { create } from 'zustand';
import type { DiaryEntry, DiarySupplement, MoodType, WeatherType } from '@/types';
import { db } from '@/db';

interface DiaryState {
  entries: DiaryEntry[];
  loading: boolean;
  filterMood: MoodType | null;
  filterWeather: WeatherType | null;

  loadEntries: () => Promise<void>;
  addEntry: (entry: DiaryEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setFilterMood: (mood: MoodType | null) => void;
  setFilterWeather: (weather: WeatherType | null) => void;
  clearFilters: () => void;

  getSupplements: (diaryId: string) => Promise<DiarySupplement[]>;
  addSupplement: (supplement: DiarySupplement) => Promise<void>;
  deleteSupplement: (id: string) => Promise<void>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  loading: false,
  filterMood: null,
  filterWeather: null,

  loadEntries: async () => {
    set({ loading: true });
    const entries = await db.diaryEntries.orderBy('createdAt').reverse().toArray();
    set({ entries, loading: false });
  },

  addEntry: async (entry) => {
    await db.diaryEntries.put(entry);
    await db.diaryEntries.orderBy('createdAt').reverse().toArray().then(entries => set({ entries }));
  },

  deleteEntry: async (id) => {
    await db.diaryEntries.delete(id);
    await db.diarySupplements.where('diaryId').equals(id).delete();
    set(state => ({ entries: state.entries.filter(e => e.id !== id) }));
  },

  setFilterMood: (mood) => set({ filterMood: mood }),
  setFilterWeather: (weather) => set({ filterWeather: weather }),
  clearFilters: () => set({ filterMood: null, filterWeather: null }),

  getSupplements: async (diaryId) => {
    return db.diarySupplements.where('diaryId').equals(diaryId).sortBy('createdAt');
  },

  addSupplement: async (supplement) => {
    await db.diarySupplements.put(supplement);
  },

  deleteSupplement: async (id) => {
    await db.diarySupplements.delete(id);
  },
}));