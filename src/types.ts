export type MoodType = 'happy' | 'calm' | 'sad' | 'anxious' | 'grateful' | 'tired';

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'foggy';

export interface DiaryEntry {
  id: string;
  user_id: string;
  content: string;
  mood: MoodType;
  weather: WeatherType;
  images: string[];
  supplements: DiarySupplement[];
  created_at: string;
  updated_at: string;
}

export interface DiarySupplement {
  id: string;
  content: string;
  created_at: string;
}

export const MOOD_CONFIG: Record<MoodType, { emoji: string; label: string; color: string }> = {
  happy: { emoji: '\u{1F60A}', label: '开心', color: '#F4B860' },
  calm: { emoji: '\u{1F33F}', label: '平静', color: '#A3B899' },
  sad: { emoji: '\u{1F622}', label: '难过', color: '#8FA8C8' },
  anxious: { emoji: '\u{1F630}', label: '焦虑', color: '#D4A0C8' },
  grateful: { emoji: '\u{1F496}', label: '感恩', color: '#E8927C' },
  tired: { emoji: '\u{1F634}', label: '疲惫', color: '#B8B0C8' },
};

export const WEATHER_CONFIG: Record<WeatherType, { emoji: string; label: string }> = {
  sunny: { emoji: '\u2600\uFE0F', label: '晴' },
  cloudy: { emoji: '\u26C5', label: '多云' },
  rainy: { emoji: '\u{1F327}\uFE0F', label: '雨' },
  snowy: { emoji: '\u{1F328}\uFE0F', label: '雪' },
  windy: { emoji: '\u{1F32C}\uFE0F', label: '风' },
  foggy: { emoji: '\u{1F32B}\uFE0F', label: '雾' },
};

export const MOOD_OPTIONS: MoodType[] = ['happy', 'calm', 'sad', 'anxious', 'grateful', 'tired'];
export const WEATHER_OPTIONS: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'foggy'];