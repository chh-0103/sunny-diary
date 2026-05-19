import Dexie, { Table } from 'dexie';
import type { DiaryEntry, DiarySupplement } from '@/types';

class DiaryDatabase extends Dexie {
  diaryEntries!: Table<DiaryEntry, string>;
  diarySupplements!: Table<DiarySupplement, string>;

  constructor() {
    super('SunnyDiaryDB');
    this.version(1).stores({
      diaryEntries: 'id, createdAt, mood, weather',
      diarySupplements: 'id, diaryId, createdAt',
    });
  }
}

export const db = new DiaryDatabase();