import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Mail, Key, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signIn, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('mode') === 'otp' ? 'otp' : 'password';

  const [tab, setTab] = useState<'otp' | 'password'>(defaultTab as 'otp' | 'password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [countdown > 0]);

  const [showPassword, setShowPassword] = useState(false);
  const lastCharTimeRef = useRef<number>(0);
  const prevDisplayRef = useRef('');
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 250);
    return () => clearInterval(timer);
  }, []);

  const getMaskedPassword = useCallback(() => {
    if (showPassword) return password;
    if (!password) return '';
    const now = Date.now();
    return password.split('').map((c, i) => {
      if (i === password.length - 1 && now - lastCharTimeRef.current < 3000) return c;
      return '•';
    }).join('');
  }, [password, showPassword]);

  const displayPassword = getMaskedPassword();

  useEffect(() => {
    prevDisplayRef.current = displayPassword;
  }, [displayPassword]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const oldValue = prevDisplayRef.current;

    if (newValue.length > oldValue.length) {
      const diff = newValue.length - oldValue.length;
      const added = newValue.slice(-diff);
      const realChars = added.replace(/•/g, '');
      if (realChars) {
        setPassword(p => p + realChars);
        lastCharTimeRef.current = Date.now();
      }
    } else if (newValue.length < oldValue.length) {
      const removed = oldValue.length - newValue.length;
      setPassword(p => p.slice(0, Math.max(0, p.length - removed)));
    }
  };

  const handleSendCode = async () => {
    if (!email.trim() || countdown > 0) return;
    setError('');
    setSubmitting(true);
    const { error: err } = await sendOtp(email.trim());
    setSubmitting(false);
    if (err) {
      setError(err);
    } else {
      setCodeSent(true);
      setCountdown(60);
      setCode('');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !code.trim() || code.length < 6) return;
    setError('');
    setSubmitting(true);
    const { error: err } = await verifyOtp(email.trim(), code.trim());
    if (err) {
      setError(err);
      setSubmitting(false);
    } else {
      navigate('/', { replace: true });
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
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

  const switchTab = (t: 'otp' | 'password') => {
    setTab(t);
    setError('');
    setCode('');
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

        <div className="flex mb-5 bg-white/60 rounded-2xl p-1">
          <button
            onClick={() => switchTab('password')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all
              ${tab === 'password' ? 'bg-white shadow-sm text-warmbrown' : 'text-text-muted'}`}
          >
            <Key size={16} />
            密码登录
          </button>
          <button
            onClick={() => switchTab('otp')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all
              ${tab === 'otp' ? 'bg-white shadow-sm text-warmbrown' : 'text-text-muted'}`}
          >
            <Mail size={16} />
            验证码登录
          </button>
        </div>

        {tab === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-soft mb-1.5">邮箱</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setCodeSent(false); }}
                  placeholder="请输入邮箱"
                  required
                  className="flex-1 rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3
                             text-text-soft placeholder:text-text-muted/50
                             focus:outline-none focus:border-warmbrown/50 transition-all"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={!email.trim() || submitting || countdown > 0}
                  className="shrink-0 rounded-2xl bg-coral text-white px-4 py-3 text-sm font-medium
                             hover:bg-coral/90 disabled:bg-apricot/40 disabled:text-text-muted
                             transition-all min-w-[100px]"
                >
                  {countdown > 0 ? `${countdown}s` : submitting ? '发送中' : codeSent ? '重新发送' : '发送验证码'}
                </button>
              </div>
            </div>

            {codeSent && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-text-soft mb-1.5">验证码</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="请输入8位验证码"
                  required
                  autoFocus
                  className="w-full rounded-2xl border border-apricot/50 bg-white/80 px-4 py-3
                             text-text-soft text-center text-lg tracking-[0.5em] placeholder:text-text-muted/50
                             focus:outline-none focus:border-warmbrown/50 transition-all"
                />
                <p className="text-text-muted text-xs mt-2 text-center">
                  验证码已发送至 {email}，请查收
                </p>
              </div>
            )}

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {submitting ? '验证中...' : '验证并登录'}
            </button>

            <p className="text-center text-sm text-text-muted">
              还没有账号？输入邮箱即可自动注册
            </p>
          </form>
        )}

        {tab === 'password' && (
          <form onSubmit={handlePasswordLogin} className="card space-y-4">
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
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  type="text"
                  value={displayPassword}
                  onChange={handlePasswordChange}
                  placeholder="请输入密码"
                  required
                  autoComplete="off"
                  className="w-full rounded-2xl border border-apricot/50 bg-white/80 pl-4 pr-12 py-3
                             text-text-soft placeholder:text-text-muted/50 tracking-[0.15em]
                             focus:outline-none focus:border-warmbrown/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted
                             hover:text-warmbrown transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {submitting ? '登录中...' : '登录'}
            </button>

            <p className="text-center text-sm text-text-muted">
              还没有账号？切换到验证码登录即可自动注册
            </p>
          </form>
        )}
      </div>
    </div>
  );
}