import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDiaryStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import MoodSelector from '@/components/MoodSelector';
import WeatherSelector from '@/components/WeatherSelector';
import ImageUploader from '@/components/ImageUploader';
import BottomNav from '@/components/BottomNav';
import type { MoodType, WeatherType } from '@/types';

export default function NewDiaryPage() {
  const navigate = useNavigate();
  const addEntry = useDiaryStore(s => s.addEntry);
  const { user } = useAuth();

  const [mood, setMood] = useState<MoodType | null>(null);
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = mood && weather && content.trim();

  const handleSave = async () => {
    if (!canSave || !mood || !weather) return;
    setSaving(true);

    await addEntry({
      content: content.trim(),
      mood,
      weather,
      images,
    });

    setSaving(false);
    navigate('/');
  };

  return (
    <div className="page-container animate-fade-in pb-28">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/80 border border-apricot/50
                     flex items-center justify-center hover:bg-apricot/20 transition-colors"
        >
          <ArrowLeft size={20} className="text-text-soft" />
        </button>
        <h1 className="font-handwriting text-2xl text-warmbrown">新日记</h1>
        <span className="text-xs text-text-muted hidden sm:block">{user?.email}</span>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-soft">想写点什么</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今天想记录些什么呢？"
            rows={10}
            autoFocus
            className="w-full rounded-2xl border border-apricot/50 bg-white/80 p-5
                       text-text-soft placeholder:text-text-muted/50 resize-none
                       focus:outline-none focus:border-warmbrown/50 focus:bg-white
                       transition-all duration-300 text-base leading-relaxed min-h-[240px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MoodSelector value={mood} onChange={setMood} compact />
          <WeatherSelector value={weather} onChange={setWeather} compact />
        </div>

        <ImageUploader images={images} onChange={setImages} />

        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className={`w-full py-4 rounded-2xl font-medium text-base transition-all duration-300
                      ${canSave && !saving
                        ? 'btn-primary'
                        : 'bg-apricot/40 text-text-muted cursor-not-allowed'}`}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              保存中...
            </span>
          ) : (
            '保存日记'
          )}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}