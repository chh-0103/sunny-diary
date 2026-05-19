import { useMemo } from 'react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了，记得早点休息';
  if (hour < 9) return '早上好，新的一天开始了';
  if (hour < 12) return '上午好，今天也要开心';
  if (hour < 14) return '中午好，别忘了好好吃饭';
  if (hour < 18) return '下午好，阳光正好';
  return '晚上好，今天辛苦你了';
}

function formatDate(): string {
  const now = new Date();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDay = weekDays[now.getDay()];
  return `${year}年${month}月${day}日 星期${weekDay}`;
}

export default function WelcomeBanner() {
  const greeting = useMemo(() => getGreeting(), []);
  const dateStr = useMemo(() => formatDate(), []);

  return (
    <div className="text-center py-8 animate-fade-in">
      <p className="text-text-muted text-sm mb-2 tracking-wide">{dateStr}</p>
      <h1 className="font-handwriting text-3xl text-warmbrown leading-relaxed">
        {greeting} <span className="inline-block animate-bloom">{'\u{1F338}'}</span>
      </h1>
      <p className="text-text-muted/60 text-sm mt-3">
        记录下今天的小确幸吧
      </p>
    </div>
  );
}