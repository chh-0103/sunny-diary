import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    if (password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    setSubmitting(true);
    const { error: err } = await signUp(email.trim(), password);
    setSubmitting(false);

    if (err) {
      setError(err);
    } else {
      setSuccess('注册成功！请查看邮箱确认链接，然后返回登录。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-apricot/30 mb-4">
            <Heart size={28} className="text-coral" />
          </div>
          <h1 className="font-handwriting text-3xl text-warmbrown">加入心晴日记</h1>
          <p className="text-text-muted text-sm mt-2">开始记录你的每一天</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-soft mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              required
              className="w-full rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3
                         text-text-soft placeholder:text-text-muted/50
                         focus:outline-none focus:border-warmbrown/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-soft mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少6个字符"
              required
              minLength={6}
              className="w-full rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3
                         text-text-soft placeholder:text-text-muted/50
                         focus:outline-none focus:border-warmbrown/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-soft mb-1.5">确认密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入密码"
              required
              minLength={6}
              className="w-full rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3
                         text-text-soft placeholder:text-text-muted/50
                         focus:outline-none focus:border-warmbrown/50 transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <button
            type="submit"
            disabled={submitting || !!success}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {submitting ? '注册中...' : '注册'}
          </button>

          <p className="text-center text-sm text-text-muted">
            已有账号？
            <Link to="/login" className="text-coral hover:underline ml-1">登录</Link>
          </p>
        </form>
      </div>
    </div>
  );
}