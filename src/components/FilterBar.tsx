import { MOOD_CONFIG, WEATHER_CONFIG, MOOD_OPTIONS, WEATHER_OPTIONS } from '@/types';
import type { MoodType, WeatherType } from '@/types';
import { X } from 'lucide-react';

interface FilterBarProps {
  selectedMood: MoodType | null;
  selectedWeather: WeatherType | null;
  onSelectMood: (mood: MoodType | null) => void;
  onSelectWeather: (weather: WeatherType | null) => void;
  onClear: () => void;
}

export default function FilterBar({
  selectedMood,
  selectedWeather,
  onSelectMood,
  onSelectWeather,
  onClear,
}: FilterBarProps) {
  const hasFilter = selectedMood || selectedWeather;

  return (
    <div className="animate-slide-up space-y-3" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-text-soft bg-apricot/40 px-2 py-0.5 rounded-full whitespace-nowrap">筛选</span>
        {hasFilter && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-coral hover:text-coral/70 transition-colors"
          >
            <X size={12} /> 清除
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <span className="text-xs text-text-muted whitespace-nowrap mr-1">心情</span>
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood}
            onClick={() => onSelectMood(selectedMood === mood ? null : mood)}
            className={`pill whitespace-nowrap ${selectedMood === mood ? 'pill-active' : ''}`}
          >
            {MOOD_CONFIG[mood].emoji} {MOOD_CONFIG[mood].label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <span className="text-xs text-text-muted whitespace-nowrap mr-1">天气</span>
        {WEATHER_OPTIONS.map((weather) => (
          <button
            key={weather}
            onClick={() => onSelectWeather(selectedWeather === weather ? null : weather)}
            className={`pill whitespace-nowrap ${selectedWeather === weather ? 'pill-active' : ''}`}
          >
            {WEATHER_CONFIG[weather].emoji} {WEATHER_CONFIG[weather].label}
          </button>
        ))}
      </div>
    </div>
  );
}