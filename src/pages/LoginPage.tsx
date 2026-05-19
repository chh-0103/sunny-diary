import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError('');
    setSubmitting(true);

    const { error: err } = await signIn(email.trim(), password);
    if (err) {
      setError(err);
      setSubmitting(false);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-apricot/30 mb-4">
            <Heart size={28} className="text-coral" />
          </div>
          <h1 className="font-handwriting text-3xl text-warmbrown">心晴日记</h1>
          <p className="text-text-muted text-sm mt-2">记录每一个心情瞬间</p>
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
              placeholder="请输入密码"
              required
              minLength={6}
              className="w-full rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3
                         text-text-soft placeholder:text-text-muted/50
                         focus:outline-none focus:border-warmbrown/50 transition-all"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {submitting ? '登录中...' : '登录'}
          </button>

          <p className="text-center text-sm text-text-muted">
            还没有账号？
            <Link to="/register" className="text-coral hover:underline ml-1">注册</Link>
          </p>
        </form>
      </div>
    </div>
  );
}