import { useEffect, useRef } from 'react';
import { useLanguage } from './context/LanguageContext';
import { QRCustomizationStudio } from './components/qr/QRCustomizationStudio';
import { gsap } from 'gsap';

function App() {
  const { language } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const bgCircle1Ref = useRef<HTMLDivElement>(null);
  const bgCircle2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Header animation
    gsap.fromTo(headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
    );

    // Background floating circles animation
    gsap.to(bgCircle1Ref.current, {
      scale: 1.1,
      rotation: 8,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to(bgCircle2Ref.current, {
      scale: 1.2,
      rotation: -8,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-textDark font-body relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Dynamic Animated Background to make it beautiful */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          ref={bgCircle1Ref}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[140px]" 
        />
        <div 
          ref={bgCircle2Ref}
          className="absolute bottom-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[140px]" 
        />
      </div>
      
      {/* Header */}
      <header ref={headerRef} className="border-b border-slate-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50 opacity-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
              <img src="/logo.png" alt="QR for You Logo" className="w-full h-full object-cover" />
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif" }} className="font-black text-2xl tracking-tight text-slate-900">QR for You</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <QRCustomizationStudio />
      </main>
    </div>
  );
}

export default App;
