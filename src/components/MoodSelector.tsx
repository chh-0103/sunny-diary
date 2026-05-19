import { MOOD_CONFIG, MOOD_OPTIONS } from '@/types';
import type { MoodType } from '@/types';

interface MoodSelectorProps {
  value: MoodType | null;
  onChange: (mood: MoodType) => void;
  compact?: boolean;
}

export default function MoodSelector({ value, onChange, compact = false }: MoodSelectorProps) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <label className="text-sm font-medium text-text-soft">
        {compact ? (
          <span className="flex items-center gap-1.5">
            <span>{'\u{2600}\uFE0F'}</span> 心情
          </span>
        ) : (
          '今天的心情'
        )}
      </label>
      <div className={compact ? 'flex gap-2 flex-wrap' : 'grid grid-cols-3 gap-3'}>
        {MOOD_OPTIONS.map((mood) => {
          const cfg = MOOD_CONFIG[mood];
          const isSelected = value === mood;
          return (
            <button
              key={mood}
              onClick={() => onChange(mood)}
              className={`flex items-center gap-1.5 rounded-2xl border-2 transition-all duration-300
                         ${compact ? 'px-3 py-2' : 'flex-col gap-2 py-4'}`}
              style={{
                borderColor: isSelected ? cfg.color : '#F5E6D3',
                backgroundColor: isSelected ? cfg.color + '15' : '#FFFFFF99',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span className={compact ? 'text-xl' : 'text-3xl'}>{cfg.emoji}</span>
              <span
                className={compact ? 'text-xs font-medium' : 'text-sm font-medium'}
                style={{ color: isSelected ? cfg.color : '#A3968A' }}
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