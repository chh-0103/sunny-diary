import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Camera, Trash2 } from 'lucide-react';
import { useDiaryStore } from '@/store';
import { MOOD_CONFIG, WEATHER_CONFIG } from '@/types';
import ImageViewer from '@/components/ImageViewer';
import type { DiaryEntry, DiarySupplement } from '@/types';

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

export default function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, loadEntries, getSupplements, addSupplement, deleteSupplement, deleteEntry } = useDiaryStore();

  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [supplements, setSupplements] = useState<DiarySupplement[]>([]);
  const [supplementText, setSupplementText] = useState('');
  const [adding, setAdding] = useState(false);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (entries.length === 0) {
      loadEntries().then(() => {
        const found = useDiaryStore.getState().entries.find(e => e.id === id);
        if (found) setEntry(found);
      });
    } else {
      const found = entries.find(e => e.id === id);
      setEntry(found || null);
    }
  }, [id, entries, loadEntries]);

  useEffect(() => {
    if (id) {
      getSupplements(id).then(setSupplements);
    }
  }, [id, getSupplements]);

  const handleAddSupplement = useCallback(async () => {
    if (!id || !supplementText.trim() || adding) return;
    setAdding(true);

    const supplement: DiarySupplement = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      diaryId: id,
      content: supplementText.trim(),
      createdAt: new Date().toISOString(),
    };

    await addSupplement(supplement);
    setSupplements(prev => [...prev, supplement]);
    setSupplementText('');
    setAdding(false);
  }, [id, supplementText, adding, addSupplement]);

  const handleDeleteSupplement = async (supplementId: string) => {
    await deleteSupplement(supplementId);
    setSupplements(prev => prev.filter(s => s.id !== supplementId));
  };

  const handleDeleteEntry = async () => {
    if (!id) return;
    await deleteEntry(id);
    navigate('/', { replace: true });
  };

  if (!entry) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="text-text-muted text-lg mb-4">找不到这条日记</p>
          <button onClick={() => navigate('/')} className="btn-ghost">返回首页</button>
        </div>
      </div>
    );
  }

  const moodCfg = MOOD_CONFIG[entry.mood];
  const weatherCfg = WEATHER_CONFIG[entry.weather];

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
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-10 h-10 rounded-full bg-white/80 border border-red-200
                     flex items-center justify-center hover:bg-red-50 transition-colors"
          title="删除日记"
        >
          <Trash2 size={18} className="text-red-400" />
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 mx-5 max-w-sm shadow-xl animate-bloom">
            <p className="text-text-soft text-center mb-2 font-medium">确定要删除这条日记吗？</p>
            <p className="text-text-muted text-sm text-center mb-5">删除后无法恢复</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 btn-ghost text-sm">
                取消
              </button>
              <button onClick={handleDeleteEntry} className="flex-1 bg-red-400 text-white rounded-2xl py-2.5 text-sm font-medium
                         hover:bg-red-500 transition-colors">
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{moodCfg.emoji}</span>
        <span className="text-3xl">{weatherCfg.emoji}</span>
        <div className="flex-1" />
        <span className="text-xs text-text-muted">{formatDateTime(entry.createdAt)}</span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ backgroundColor: moodCfg.color + '20', color: moodCfg.color }}>
          {moodCfg.emoji} {moodCfg.label}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-apricot/30 text-warmbrown">
          {weatherCfg.emoji} {weatherCfg.label}
        </span>
      </div>

      {entry.images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          {entry.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setViewerImage(img)}
              className="relative group rounded-xl overflow-hidden"
            >
              <img src={img} alt="" className="w-full aspect-square object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors
                              flex items-center justify-center">
                <Camera size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="card mb-8">
        <p className="text-text-soft text-base leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </p>
      </div>

      {supplements.length > 0 && (
        <div className="space-y-3 mb-8">
          <h3 className="text-sm font-medium text-text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-warmbrown" />
            后来补充的想法
          </h3>
          {supplements.map((s) => (
            <div key={s.id} className="supplement-block group">
              <div className="flex items-start justify-between gap-2">
                <p className="text-text-soft text-sm leading-relaxed whitespace-pre-wrap flex-1">
                  {s.content}
                </p>
                <button
                  onClick={() => handleDeleteSupplement(s.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity
                             text-text-muted hover:text-red-400 shrink-0 mt-0.5"
                  title="删除补充"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-warmbrown bg-warmbrown/10 px-2 py-0.5 rounded-full">
                  后来添加
                </span>
                <span className="text-xs text-text-muted">{formatDateTime(s.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-cream/90 backdrop-blur-sm border-t border-apricot/30 p-4 z-30">
        <div className="max-w-[640px] mx-auto flex gap-3">
          <input
            value={supplementText}
            onChange={(e) => setSupplementText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddSupplement(); } }}
            placeholder="补充一些想法..."
            className="flex-1 rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3
                       text-sm text-text-soft placeholder:text-text-muted/50
                       focus:outline-none focus:border-warmbrown/50 transition-all"
          />
          <button
            onClick={handleAddSupplement}
            disabled={!supplementText.trim() || adding}
            className="w-12 h-12 rounded-2xl bg-coral text-white flex items-center justify-center
                       hover:bg-coral/90 disabled:bg-apricot/40 disabled:text-text-muted
                       transition-all duration-300 shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {viewerImage && (
        <ImageViewer src={viewerImage} onClose={() => setViewerImage(null)} />
      )}
    </div>
  );
}