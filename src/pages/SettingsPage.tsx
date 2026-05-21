import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import type { ThemeName } from '@/types';
import BottomNav from '@/components/BottomNav';
import { Palette, Lock, LogOut, ChevronRight, Image, Check, UserX } from 'lucide-react';

const THEME_LABELS: Record<ThemeName, { name: string; emoji: string; colors: string[] }> = {
  warm: { name: '暖阳', emoji: '\u2600\uFE0F', colors: ['#F5E6D3', '#E8927C', '#C49A6C', '#FFF8F0'] },
  forest: { name: '森林', emoji: '\u{1F332}', colors: ['#D4E3D0', '#7BA07A', '#6B8F6B', '#F4F7F2'] },
  ocean: { name: '海洋', emoji: '\u{1F30A}', colors: ['#D0E0F0', '#6B9BC4', '#5A85A8', '#F2F6FA'] },
  starry: { name: '星空', emoji: '\u{1F31F}', colors: ['#E0DDF0', '#9B8EC4', '#7B6EA8', '#F5F4FA'] },
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { signIn, signOut } = useAuth();
  const { theme, bgImage, setTheme, setBgImage } = useTheme();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('请填写所有字段'); return;
    }
    if (newPassword.length < 6) {
      setPasswordError('新密码至少6个字符'); return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的新密码不一致'); return;
    }

    setChangingPassword(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setPasswordError('请先登录'); setChangingPassword(false); return; }

    const { error: signInErr } = await signIn(user.email, oldPassword);
    if (signInErr) {
      setPasswordError('当前密码错误');
      setChangingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess('密码修改成功');
      setTimeout(() => { setShowPasswordModal(false); resetPasswordFields(); }, 1500);
    }
    setChangingPassword(false);
  };

  const resetPasswordFields = () => {
    setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    setPasswordError(''); setPasswordSuccess('');
  };

  const handleBgImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setBgImage(reader.result as string);
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="page-container pb-28">
      <h1 className="font-handwriting text-2xl text-warmbrown mb-6">设置</h1>

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-coral" />
            <h3 className="font-handwriting text-lg text-warmbrown">个性装扮</h3>
          </div>

          <p className="text-text-muted text-xs mb-4">选择主题配色</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {(Object.entries(THEME_LABELS) as [ThemeName, typeof THEME_LABELS['warm']][]).map(([key, info]) => (
              <button key={key} onClick={() => setTheme(key)}
                className={`relative rounded-2xl p-3 border-2 transition-all
                  ${theme === key ? 'border-coral shadow-md' : 'border-transparent bg-white/60'}`}>
                <div className="flex gap-1 mb-2">
                  {info.colors.map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-sm font-medium text-text-soft">{info.emoji} {info.name}</span>
                {theme === key && (
                  <Check size={16} className="absolute top-2 right-2 text-coral" />
                )}
              </button>
            ))}
          </div>

          <p className="text-text-muted text-xs mb-2">自定义背景</p>
          <div className="flex gap-2">
            <button onClick={handleBgImageUpload}
              className="btn-ghost text-xs py-1.5 px-4 flex items-center gap-1">
              <Image size={14} /> 上传背景图
            </button>
            {bgImage && (
              <button onClick={() => setBgImage(null)}
                className="text-xs text-red-400 hover:underline py-1.5">
                清除背景
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <button onClick={() => setShowPasswordModal(true)}
            className="card w-full text-left flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-apricot/30 flex items-center justify-center">
                <Lock size={18} className="text-warmbrown" />
              </div>
              <span className="text-text-soft font-medium">修改密码</span>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </button>

          <button onClick={() => { signOut(); navigate('/login'); }}
            className="card w-full text-left flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-apricot/30 flex items-center justify-center">
                <LogOut size={18} className="text-warmbrown" />
              </div>
              <span className="text-text-soft font-medium">退出登录</span>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </button>

          <button onClick={() => { signOut(); navigate('/login'); }}
            className="card w-full text-left flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-apricot/30 flex items-center justify-center">
                <UserX size={18} className="text-warmbrown" />
              </div>
              <span className="text-text-soft font-medium">切换账号</span>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => { setShowPasswordModal(false); resetPasswordFields(); }}>
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 mx-5 max-w-sm w-full shadow-xl animate-bloom">
            <h3 className="font-handwriting text-xl text-warmbrown mb-4 text-center">修改密码</h3>
            <div className="space-y-3">
              <input type="password" value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="当前密码"
                className="w-full rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3 text-sm
                           text-text-soft placeholder:text-text-muted/50 focus:outline-none focus:border-warmbrown/50" />
              <input type="password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="新密码（至少6位）"
                className="w-full rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3 text-sm
                           text-text-soft placeholder:text-text-muted/50 focus:outline-none focus:border-warmbrown/50" />
              <input type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="确认新密码"
                className="w-full rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3 text-sm
                           text-text-soft placeholder:text-text-muted/50 focus:outline-none focus:border-warmbrown/50" />

              {passwordError && <p className="text-red-400 text-xs text-center">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 text-xs text-center">{passwordSuccess}</p>}

              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowPasswordModal(false); resetPasswordFields(); }}
                  className="flex-1 btn-ghost text-sm">取消</button>
                <button onClick={handleChangePassword} disabled={changingPassword}
                  className="flex-1 btn-primary text-sm disabled:opacity-50">
                  {changingPassword ? '修改中...' : '确认修改'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}