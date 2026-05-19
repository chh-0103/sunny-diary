import { useNavigate } from 'react-router-dom';
import { Feather } from 'lucide-react';

export default function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-apricot/20 flex items-center justify-center mb-6">
        <Feather size={40} className="text-warmbrown/60" />
      </div>
      <h2 className="font-handwriting text-2xl text-warmbrown mb-3">
        还没有记录呢
      </h2>
      <p className="text-text-muted text-sm text-center leading-relaxed mb-8 max-w-xs">
        每一天都值得被温柔地记住，<br />开始写下你的第一条日记吧
      </p>
      <button onClick={() => navigate('/new')} className="btn-primary">
        写下第一条日记
      </button>
    </div>
  );
}