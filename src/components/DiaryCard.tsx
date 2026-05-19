import { useNavigate } from 'react-router-dom';
import type { DiaryEntry } from '@/types';
import { MOOD_CONFIG, WEATHER_CONFIG } from '@/types';

interface DiaryCardProps {
  entry: DiaryEntry;
  index: number;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function DiaryCard({ entry, index }: DiaryCardProps) {
  const navigate = useNavigate();
  const moodCfg = MOOD_CONFIG[entry.mood];
  const weatherCfg = WEATHER_CONFIG[entry.weather];

  const previewText = entry.content.length > 80
    ? entry.content.slice(0, 80) + '...'
    : entry.content;

  return (
    <div
      onClick={() => navigate(`/diary/${entry.id}`)}
      className="card cursor-pointer hover:shadow-md transition-all duration-300
                 hover:-translate-y-1 animate-slide-up group"
      style={{
        animationDelay: `${index * 0.08}s`,
        borderLeftWidth: '4px',
        borderLeftColor: moodCfg.color,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{moodCfg.emoji}</span>
          <span className="text-2xl">{weatherCfg.emoji}</span>
        </div>
        <span className="text-xs text-text-muted">{formatTime(entry.created_at)}</span>
      </div>

      {entry.images.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {entry.images.slice(0, 3).map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0
                         border border-apricot/50 group-hover:border-warmbrown/30 transition-colors"
            />
          ))}
          {entry.images.length > 3 && (
            <div className="w-16 h-16 rounded-xl bg-apricot/30 flex items-center justify-center
                            text-xs text-text-muted flex-shrink-0">
              +{entry.images.length - 3}
            </div>
          )}
        </div>
      )}

      <p className="text-text-soft text-sm leading-relaxed whitespace-pre-wrap">
        {previewText}
      </p>

      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ backgroundColor: moodCfg.color + '20', color: moodCfg.color }}>
          {moodCfg.emoji} {moodCfg.label}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-apricot/30 text-warmbrown">
          {weatherCfg.emoji} {weatherCfg.label}
        </span>
      </div>
    </div>
  );
}