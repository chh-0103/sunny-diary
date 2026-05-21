import { useLocation, useNavigate } from 'react-router-dom';
import { Home, User, PlusSquare } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/new', icon: PlusSquare, label: '记录' },
  { path: '/profile', icon: User, label: '我的' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="nav-bar">
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`nav-item ${isActive(path) ? 'nav-item-active' : ''}`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}