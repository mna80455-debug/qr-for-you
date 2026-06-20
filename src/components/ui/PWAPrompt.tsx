import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from './Button';
import { Download, X, Share } from 'lucide-react';

export const PWAPrompt = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      return;
    }

    // Detect if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show after a small delay to not annoy the user immediately
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show prompt for iOS if not dismissed before
    if (ios) {
      const iosDismissed = localStorage.getItem('ios_pwa_dismissed');
      if (!iosDismissed) {
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install prompt outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('ios_pwa_dismissed', 'true');
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-2xl z-50 transition-all duration-300 animate-slide-up">
      <button 
        onClick={handleDismiss} 
        className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-4">
        <div className="bg-accent/10 text-accent p-3 rounded-xl shrink-0">
          <Download size={22} className="stroke-[2.5]" />
        </div>
        
        <div className="space-y-1.5 flex-1 pr-4">
          <h4 className="text-sm font-bold text-textDark dark:text-white">
            {isRtl ? 'تحميل تطبيق QR Universe' : 'Download QR Universe App'}
          </h4>
          <p className="text-xs text-textMuted dark:text-neutral-400 leading-relaxed font-semibold">
            {isRtl 
              ? 'قم بتثبيت التطبيق على جهازك للوصول السريع بدون إنترنت وتتبع أفضل لأكواد الـ QR.' 
              : 'Install our web app for offline scanning, faster load times, and quick access from your home screen.'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2.5">
        <button 
          onClick={handleDismiss}
          className="text-xs font-bold text-textMuted dark:text-neutral-400 hover:text-textDark dark:hover:text-white px-3 py-2 transition-colors"
        >
          {isRtl ? 'ليس الآن' : 'Not Now'}
        </button>

        {isIOS ? (
          <div className="flex items-center gap-1.5 bg-accent/5 dark:bg-accent/10 text-accent text-[11px] font-bold px-3 py-2 rounded-xl border border-accent/10">
            <Share size={12} />
            <span>
              {isRtl 
                ? 'اضغط مشاركة ثم "إضافة للشاشة الرئيسية"' 
                : 'Tap Share -> "Add to Home Screen"'}
            </span>
          </div>
        ) : (
          <Button 
            onClick={handleInstall} 
            size="sm" 
            className="text-xs font-bold gap-1.5 shadow-md shadow-accent/20"
          >
            <Download size={12} />
            <span>{isRtl ? 'تثبيت التطبيق' : 'Install App'}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
