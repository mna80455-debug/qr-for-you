import { useLanguage } from './context/LanguageContext';
import { QRCustomizationStudio } from './components/qr/QRCustomizationStudio';
import { motion } from 'framer-motion';

function App() {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background text-textDark font-body relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Dynamic Animated Background to make it beautiful */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[140px]" 
        />
      </div>
      
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
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
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <QRCustomizationStudio />
      </main>
    </div>
  );
}

export default App;
