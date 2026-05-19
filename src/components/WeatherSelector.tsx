import { WEATHER_CONFIG, WEATHER_OPTIONS } from '@/types';
import type { WeatherType } from '@/types';

interface WeatherSelectorProps {
  value: WeatherType | null;
  onChange: (weather: WeatherType) => void;
  compact?: boolean;
}

export default function WeatherSelector({ value, onChange, compact = false }: WeatherSelectorProps) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <label className="text-sm font-medium text-text-soft">
        {compact ? (
          <span className="flex items-center gap-1.5">
            <span>{'\u26C5'}</span> 天气
          </span>
        ) : (
          '今天的天气'
        )}
      </label>
      <div className={compact ? 'flex gap-2 flex-wrap' : 'grid grid-cols-3 gap-3'}>
        {WEATHER_OPTIONS.map((weather) => {
          const cfg = WEATHER_CONFIG[weather];
          const isSelected = value === weather;
          return (
            <button
              key={weather}
              onClick={() => onChange(weather)}
              className={`flex items-center gap-1.5 rounded-2xl border-2 transition-all duration-300
                         ${compact ? 'px-3 py-2' : 'flex-col gap-2 py-4'}`}
              style={{
                borderColor: isSelected ? '#C49A6C' : '#F5E6D3',
                backgroundColor: isSelected ? '#F5E6D3' : '#FFFFFF99',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span className={compact ? 'text-xl' : 'text-3xl'}>{cfg.emoji}</span>
              <span
                className={compact ? 'text-xs font-medium' : 'text-sm font-medium'}
                style={{ color: isSelected ? '#C49A6C' : '#A3968A' }}
              >
                {cfg.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}