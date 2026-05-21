import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const DAYS = ['日', '一', '二', '三', '四', '五', '六'];

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    if (value) return parseInt(value.split('-')[0]);
    return new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) return parseInt(value.split('-')[1]) - 1;
    return new Date().getMonth();
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (open && value) {
      setViewYear(parseInt(value.split('-')[0]));
      setViewMonth(parseInt(value.split('-')[1]) - 1);
    }
  }, [open, value]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const goPrevYear = () => setViewYear(viewYear - 1);
  const goNextYear = () => setViewYear(viewYear + 1);

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const handleSelectDay = (d: number) => {
    onChange(toDateStr(viewYear, viewMonth, d));
    setOpen(false);
  };

  const displayValue = value || '';

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        readOnly
        value={displayValue}
        onClick={() => setOpen(!open)}
        placeholder="选择日期"
        className="rounded-xl border border-apricot/50 bg-white/80 px-3 py-2 text-sm text-text-soft
                   focus:outline-none focus:border-warmbrown/50 transition-all cursor-pointer w-full"
      />

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-apricot/30 p-4 z-50 w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <button onClick={goPrevYear}
              className="p-1 rounded-lg hover:bg-apricot/20 transition-colors" title="上一年">
              <ChevronsLeft size={18} className="text-warmbrown" />
            </button>
            <button onClick={goPrevMonth}
              className="p-1 rounded-lg hover:bg-apricot/20 transition-colors" title="上一月">
              <ChevronLeft size={18} className="text-warmbrown" />
            </button>
            <span className="text-sm font-medium text-text-soft min-w-[90px] text-center">
              {viewYear}年 {MONTHS[viewMonth]}
            </span>
            <button onClick={goNextMonth}
              className="p-1 rounded-lg hover:bg-apricot/20 transition-colors" title="下一月">
              <ChevronRight size={18} className="text-warmbrown" />
            </button>
            <button onClick={goNextYear}
              className="p-1 rounded-lg hover:bg-apricot/20 transition-colors" title="下一年">
              <ChevronsRight size={18} className="text-warmbrown" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs text-text-muted py-1.5 font-medium">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1;
              const dateStr = toDateStr(viewYear, viewMonth, d);
              const isSelected = value === dateStr;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={d}
                  onClick={() => handleSelectDay(d)}
                  className={`text-center text-sm py-1.5 rounded-lg transition-all
                    ${isSelected
                      ? 'bg-coral text-white font-medium'
                      : isToday
                        ? 'bg-apricot/30 text-warmbrown font-medium'
                        : 'hover:bg-apricot/20 text-text-soft'}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}