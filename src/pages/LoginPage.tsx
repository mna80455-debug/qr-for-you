import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول. تأكد من البيانات.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول بواسطة جوجل.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 font-body" dir="rtl">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center mb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden p-1.5 mb-2">
            <img src="/logo.png" alt="QRify Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">QRify</h1>
          <p className="text-textMuted font-semibold text-sm">أهلاً بك مجدداً في منصة الـ QR الذكية</p>
        </div>

        <Card className="border-border shadow-card bg-white rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-textDark text-right">تسجيل الدخول</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleLogin} className="space-y-4 text-right">
              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-100 p-3.5 rounded-xl font-semibold text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-textDark/80">البريد الإلكتروني</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@example.com"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-textDark/80">كلمة المرور</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  required 
                />
              </div>
              <Button type="submit" className="w-full mt-4 font-bold h-11">
                تسجيل الدخول
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-textMuted font-bold">أو عن طريق</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleGoogleLogin} 
              className="w-full font-bold h-11 flex items-center justify-center gap-3 border-border hover:bg-neutral-50 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.7 0 3.107.677 4.153 1.706l3.143-3.143C19.143 1.94 15.903 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.48 0 11.24-4.557 11.24-11.24 0-.763-.08-1.5-.22-2.2H12.24z"
                />
              </svg>
              <span>تسجيل الدخول بواسطة Google</span>
            </Button>

            <div className="mt-6 text-center text-sm text-textMuted font-semibold border-t border-border pt-4">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-accent hover:underline font-bold">
                أنشئ حساباً الآن
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
