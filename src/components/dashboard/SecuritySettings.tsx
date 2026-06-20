import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, ShieldCheck, Lock, Key, AlertTriangle, Cpu, Terminal } from 'lucide-react';

interface SecurityLog {
  event: string;
  device: string;
  ip: string;
  time: string;
}

export const SecuritySettings = () => {
  const { language } = useLanguage();

  const [emailVerified, setEmailVerified] = useState(true);
  const [twoFactorEmail, setTwoFactorEmail] = useState(false);
  const [twoFactorAuthApp, setTwoFactorAuthApp] = useState(false);
  const [rateLimitLimit, setRateLimitLimit] = useState(60); // 60 requests per minute

  const [scanUrl, setScanUrl] = useState('');
  const [scanResult, setScanResult] = useState<{ status: 'clean' | 'suspicious' | 'broken' | null; message: string }>({ status: null, message: '' });

  const [logs] = useState<SecurityLog[]>([
    { event: 'تسجيل دخول ناجح', device: 'Chrome / Windows', ip: '197.34.112.5', time: 'اليوم، ١٠:٣٠ ص' },
    { event: 'توليد كود QR ديناميكي جديد', device: 'Safari / iPhone', ip: '197.34.112.5', time: 'أمس، ٠٨:١٥ م' },
    { event: 'تحديث إعدادات الأمان (تفعيل 2FA)', device: 'Chrome / Windows', ip: '197.34.112.5', time: 'أمس، ٠٢:٤٠ م' },
  ]);

  // Phishing and URL validation scanner mockup
  const handleScanUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanUrl) return;

    // Simple validation client regex
    const domainPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (!domainPattern.test(scanUrl)) {
      setScanResult({
        status: 'broken',
        message: language === 'ar' ? 'تنسيق الرابط غير صالح أو الدومين غير صحيح!' : 'Invalid URL format or malformed domain!'
      });
      return;
    }

    const suspiciousKeywords = ['phish', 'login-verify', 'free-gift', 'win-prize', 'secure-bank', 'update-password'];
    const isSuspicious = suspiciousKeywords.some(kw => scanUrl.toLowerCase().includes(kw));

    if (isSuspicious) {
      setScanResult({
        status: 'suspicious',
        message: language === 'ar' ? 'خطر! تم الكشف عن كلمات مشبوهة قد تدل على تصيد احتيالي.' : 'Warning! Phishing signature or suspicious patterns detected.'
      });
    } else {
      setScanResult({
        status: 'clean',
        message: language === 'ar' ? 'الرابط آمن تماماً وجاهز للتشفير والتوجيه.' : 'URL is clean and safe to encode.'
      });
    }
  };

  const isRtl = language === 'ar';

  return (
    <div className="space-y-8 text-right font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-textDark dark:text-white flex items-center gap-2">
          <Shield className="text-accent" size={24} />
          <span>{isRtl ? 'مركز الحماية والأمان' : 'Security & Protection Studio'}</span>
        </h2>
        <p className="text-textMuted dark:text-gray-400 mt-1">
          {isRtl ? 'قم بتأمين حسابك، والتحقق من الروابط المشبوهة، وإدارة صلاحيات الولوج.' : 'Configure 2FA, validate target links for phishing, manage rate-limiting, and review audit logs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Core Protection settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 2FA Card */}
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Lock size={18} className="text-accent" />
                <span>{isRtl ? 'المصادقة ثنائية العوامل (2FA)' : 'Two-Factor Authentication (2FA)'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <label className="text-sm font-bold text-textDark dark:text-white">{isRtl ? 'التحقق عبر البريد الإلكتروني (OTP)' : 'Email OTP Verification'}</label>
                  <p className="text-xs text-textMuted dark:text-gray-400 mt-0.5">{isRtl ? 'إرسال رمز مؤقت لإيميلك عند تسجيل الدخول من جهاز غريب.' : 'Send a temporary OTP code to your email when logging in from new devices.'}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={twoFactorEmail} 
                  onChange={e => setTwoFactorEmail(e.target.checked)}
                  className="w-4 h-4 text-accent accent-accent rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border dark:border-gray-800 pt-6">
                <div className="text-right">
                  <label className="text-sm font-bold text-textDark dark:text-white">{isRtl ? 'تطبيقات الأمان (Google Authenticator)' : 'Authenticator App'}</label>
                  <p className="text-xs text-textMuted dark:text-gray-400 mt-0.5">{isRtl ? 'توليد الرموز دورياً عبر الهاتف لضمان أقصى مستويات الحماية.' : 'Use generated codes from Google Authenticator or Authy.'}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={twoFactorAuthApp} 
                  onChange={e => setTwoFactorAuthApp(e.target.checked)}
                  className="w-4 h-4 text-accent accent-accent rounded cursor-pointer"
                />
              </div>

            </CardContent>
          </Card>

          {/* URL scanner validator */}
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <ShieldCheck size={18} className="text-accent" />
                <span>{isRtl ? 'فحص الروابط المشبوهة والاحتيال' : 'Suspicious URL & Phishing Scanner'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-textMuted dark:text-gray-400">
                {isRtl 
                  ? 'اختبر روابط التوجيه قبل تشفيرها في الكود للتأكد من خلوها من علامات التصيد الاحتيالي أو الدومينات المكسورة.' 
                  : 'Scan destination links before saving to detect potential phishing redirects or broken domains.'}
              </p>
              
              <form onSubmit={handleScanUrl} className="flex gap-2">
                <Input 
                  value={scanUrl} 
                  onChange={e => setScanUrl(e.target.value)} 
                  placeholder="http://my-secure-bank-login-verify.com" 
                  className="flex-1 text-xs" 
                />
                <Button type="submit">{isRtl ? 'فحص الرابط' : 'Scan'}</Button>
              </form>

              {scanResult.status && (
                <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  scanResult.status === 'clean' ? 'bg-green-50 text-green-700 border border-green-100' :
                  scanResult.status === 'suspicious' ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse' :
                  'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  <AlertTriangle size={16} />
                  <span>{scanResult.message}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Logs table */}
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Terminal size={18} className="text-accent" />
                <span>{isRtl ? 'سجل العمليات والولوج الأمني' : 'Security Log Audit'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border dark:divide-neutral-800">
                {logs.map((l, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center text-xs font-semibold text-textMuted dark:text-gray-400">
                    <div>
                      <span className="text-textDark dark:text-white font-bold block">{l.event}</span>
                      <span className="text-[10px] block mt-0.5">{l.device} • {l.ip}</span>
                    </div>
                    <span>{l.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Security checklist sidebar */}
        <div className="space-y-6">
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="dark:text-white">{isRtl ? 'حالة حماية الحساب' : 'Account Security Status'}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs font-bold leading-relaxed">
              <div className="flex items-center gap-2 text-green-600">
                <Key size={16} />
                <span>{isRtl ? 'كلمة المرور قوية' : 'Strong Password'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600">
                  <ShieldCheck size={16} />
                  <span>{isRtl ? 'البريد الإلكتروني موثق' : 'Email Address Verified'}</span>
                </div>
                {!emailVerified && (
                  <Button size="sm" onClick={() => setEmailVerified(true)} className="text-[10px] h-7">{isRtl ? 'توثيق' : 'Verify'}</Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="flex items-center gap-1.5 dark:text-white">
                <Cpu size={16} className="text-accent" />
                <span>{isRtl ? 'معدل الحماية والـ Rate Limit' : 'API Rate Limiting'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-textMuted dark:text-gray-400">
                {isRtl 
                  ? 'تحديد عدد طلبات التوليد لحماية الـ APIs من الهجمات السبام (طلبات/دقيقة).' 
                  : 'Define generating rate limits to protect APIs from script spams.'}
              </p>
              <div className="flex gap-2 items-center">
                <Input 
                  type="number" 
                  value={rateLimitLimit} 
                  onChange={e => setRateLimitLimit(Number(e.target.value))} 
                  className="max-w-[80px]" 
                />
                <span className="text-xs text-textMuted font-semibold">{isRtl ? 'طلب في الدقيقة' : 'req / min'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
};
