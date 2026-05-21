export type MoodType = 'happy' | 'calm' | 'sad' | 'anxious' | 'tired' | 'excited' | 'hopeful' | 'confused' | 'lonely' | 'touched';

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'foggy';

export type ThemeName = 'warm' | 'forest' | 'ocean' | 'starry';

export type StatusType = 'tired' | 'happy' | 'emo' | 'energetic' | 'calm' | 'sad' | 'motivated' | 'lazy';

export type ProfileTag = '二次元' | '宅' | '旅游' | '美食' | '运动' | '阅读' | '音乐' | '电影' | '游戏' | '摄影' | '猫奴' | '狗派' | '社恐' | '社牛' | '咖啡' | '奶茶';

export interface StatusRecord {
  status: StatusType;
  emoji: string;
  started_at: string;
  ended_at: string | null;
}

export interface UserProfile {
  user_id: string;
  gender: string;
  birthday: string;
  birthplace: string;
  tags: ProfileTag[];
  avatar_url: string;
  status: StatusType | null;
  status_emoji: string;
  status_set_at: string;
  status_history: StatusRecord[];
}

export const AVAILABLE_TAGS: ProfileTag[] = ['二次元', '宅', '旅游', '美食', '运动', '阅读', '音乐', '电影', '游戏', '摄影', '猫奴', '狗派', '社恐', '社牛', '咖啡', '奶茶'];

export const STATUS_CONFIG: Record<StatusType, { emoji: string; label: string }> = {
  tired: { emoji: '\u{1F634}', label: '疲惫' },
  happy: { emoji: '\u{1F60E}', label: '美滋滋' },
  emo: { emoji: '\u{1F614}', label: 'emo' },
  energetic: { emoji: '\u{26A1}', label: '元气满满' },
  calm: { emoji: '\u{1F33F}', label: '平静' },
  sad: { emoji: '\u{1F622}', label: '难过' },
  motivated: { emoji: '\u{1F4AA}', label: '动力满满' },
  lazy: { emoji: '\u{1F3E0}', label: '想躺平' },
};

export const STATUS_OPTIONS: StatusType[] = ['tired', 'energetic', 'happy', 'calm', 'motivated', 'emo', 'sad', 'lazy'];

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
  tired: { emoji: '\u{1F634}', label: '疲惫', color: '#B8B0C8' },
  excited: { emoji: '\u{1F389}', label: '兴奋', color: '#FF6B6B' },
  hopeful: { emoji: '\u{1F31F}', label: '期待', color: '#F0C040' },
  confused: { emoji: '\u{1F914}', label: '困惑', color: '#A0B8D0' },
  lonely: { emoji: '\u{1F319}', label: '孤独', color: '#8899AA' },
  touched: { emoji: '\u{1F497}', label: '感动', color: '#E8708A' },
};

export const WEATHER_CONFIG: Record<WeatherType, { emoji: string; label: string }> = {
  sunny: { emoji: '\u2600\uFE0F', label: '晴' },
  cloudy: { emoji: '\u26C5', label: '多云' },
  rainy: { emoji: '\u{1F327}\uFE0F', label: '雨' },
  snowy: { emoji: '\u{1F328}\uFE0F', label: '雪' },
  windy: { emoji: '\u{1F32C}\uFE0F', label: '风' },
  foggy: { emoji: '\u{1F32B}\uFE0F', label: '雾' },
};

export const MOOD_OPTIONS: MoodType[] = ['happy', 'excited', 'touched', 'calm', 'hopeful', 'confused', 'tired', 'lonely', 'sad', 'anxious'];
export const WEATHER_OPTIONS: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'foggy'];