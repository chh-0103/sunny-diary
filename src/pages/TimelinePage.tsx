import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDiaryStore } from '@/store';
import WelcomeBanner from '@/components/WelcomeBanner';
import FilterBar from '@/components/FilterBar';
import DiaryCard from '@/components/DiaryCard';
import EmptyState from '@/components/EmptyState';

export default function TimelinePage() {
  const navigate = useNavigate();
  const {
    entries, loading, filterMood, filterWeather,
    loadEntries, setFilterMood, setFilterWeather, clearFilters,
  } = useDiaryStore();

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (filterMood) result = result.filter(e => e.mood === filterMood);
    if (filterWeather) result = result.filter(e => e.weather === filterWeather);
    return result;
  }, [entries, filterMood, filterWeather]);

  return (
    <div className="page-container relative pb-28">
      <WelcomeBanner />

      {entries.length > 0 && (
        <div className="mb-6">
          <FilterBar
            selectedMood={filterMood}
            selectedWeather={filterWeather}
            onSelectMood={setFilterMood}
            onSelectWeather={setFilterWeather}
            onClear={clearFilters}
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-apricot/40" />
                <div className="w-10 h-10 rounded-full bg-apricot/40" />
              </div>
              <div className="h-4 bg-apricot/30 rounded w-3/4 mb-2" />
              <div className="h-4 bg-apricot/30 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState />
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-text-muted text-lg mb-2">没有找到匹配的记录</p>
          <button onClick={clearFilters} className="btn-ghost mt-4">
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, i) => (
            <DiaryCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/new')}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-coral text-white
                   flex items-center justify-center shadow-lg shadow-coral/30
                   hover:shadow-xl hover:shadow-coral/40 hover:-translate-y-1
                   active:translate-y-0 transition-all duration-300 z-40
                   animate-breathe"
        aria-label="新建日记"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}