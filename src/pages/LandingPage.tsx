import { Link } from 'react-router-dom';
import { QrCode, ArrowLeft, Sparkles, BarChart3, Layers, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';

export const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<'restaurant' | 'event' | 'portfolio'>('restaurant');
  const [trialInput, setTrialInput] = useState('https://qrify.app');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTrialGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setHasGenerated(true);
      setIsGenerating(false);
    }, 800);
  };

  const useCaseDetails = {
    restaurant: {
      title: 'قوائم الطعام للمطاعم',
      desc: 'اسمح للعملاء بمسح الرمز لرؤية منيو رقمي تفاعلي، والطلب والدفع بسهولة. يتميز باللون البرتقالي الدافئ.',
      accent: 'from-orange-500 to-amber-600',
      colorText: 'text-orange-500',
      bgText: 'bg-orange-50',
      borderClass: 'border-orange-200',
      tag: 'قائمة طعام شهية',
      preview: 'المنيو: برجر كلاسيك، بطاطس مقرمشة، آيس كريم'
    },
    event: {
      title: 'تسجيل حضور الفعاليات',
      desc: 'إدارة قوائم الضيوف وتذاكر الحضور بفعالية وتوليد تقارير سريعة. يتميز باللون البنفسجي الهادئ.',
      accent: 'from-purple-500 to-indigo-600',
      colorText: 'text-purple-500',
      bgText: 'bg-purple-50',
      borderClass: 'border-purple-200',
      tag: 'قمة الابتكار 2026',
      preview: 'الفعالية: مؤتمر المبتكرين. الضيف: أحمد محمد'
    },
    portfolio: {
      title: 'بورتفوليو رقمي تفاعلي',
      desc: 'شارك أعمالك ومشاريعك على GitHub وروابط التواصل الاجتماعي بمسحة واحدة. يتميز باللون الوردي الهادئ.',
      accent: 'from-pink-500 to-rose-600',
      colorText: 'text-pink-500',
      bgText: 'bg-pink-50',
      borderClass: 'border-pink-200',
      tag: 'معرض أعمالي',
      preview: 'مطور واجهات: GitHub، LinkedIn، معرض الأعمال'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-accent/20 selection:text-accent overflow-hidden font-body relative">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }} 
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[140px]" 
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-slate-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-black text-2xl tracking-tight text-slate-900">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
              <img src="/logo.png" alt="QRify Logo" className="w-full h-full object-cover" />
            </div>
            <span>QRify</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 font-semibold">
            <a href="#features" className="hover:text-blue-600 transition-colors">الميزات</a>
            <a href="#use-cases" className="hover:text-blue-600 transition-colors">حالات الاستخدام</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">لماذا نحن</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary" size="sm" className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200">تسجيل الدخول</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">حساب جديد مجاني</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col lg:flex-row items-center justify-between gap-16">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 space-y-8 text-right max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200/60 bg-blue-50 text-xs text-blue-700 font-bold tracking-wide shadow-sm">
            <Sparkles size={14} className="text-blue-500" /> الجيل الجديد من منصات الـ QR الذكية
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900">
            أنشئ، خصص، وتتبع<br />
            <span className="bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent">رموز QR الخاصة بك</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed font-medium">
            توقف عن استخدام رموز QR الجامدة. أنشئ رموز QR ديناميكية تتكيف مع علامتك التجارية وتوفر تحليلات متقدمة لجمهورك في ثوانٍ.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all">
                ابدأ الآن مجاناً <ArrowLeft size={18} />
              </Button>
            </Link>
            <a href="#pricing" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700">
                استعرض الباقات
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Hero Trial Generator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex-1 w-full max-w-md relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[2.5rem] blur-3xl pointer-events-none" />
          <div className="relative border border-slate-200/60 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
               <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <span className="text-xs text-slate-400 font-medium">تجربة مجانية سريعة</span>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 text-right block">أدخل أي رابط لإنشاء الرمز:</label>
                <input 
                  type="text" 
                  value={trialInput}
                  onChange={(e) => { setTrialInput(e.target.value); setHasGenerated(false); }}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-left font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  dir="ltr"
                />
              </div>

              {hasGenerated ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="flex flex-col items-center justify-center space-y-4"
                >
                  <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100 relative group overflow-hidden">
                    <QRCode value={trialInput || 'https://qrify.app'} size={180} />
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <LockIcon className="text-slate-700 w-10 h-10" />
                    </div>
                  </div>
                  
                  <div className="text-center bg-blue-50 border border-blue-100 rounded-xl p-4 w-full">
                    <p className="text-sm text-blue-900 font-bold mb-2">رائع! لقد تم إنشاء الرمز بنجاح 🎉</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      لإضافة الألوان، رفع شعارك الخاص (Logo)، وتتبع عدد المسحات (Analytics)، قم بإنشاء حسابك الآن مجاناً!
                    </p>
                    <Link to="/register">
                      <Button className="w-full text-sm font-bold shadow-sm bg-blue-600 hover:bg-blue-700">
                        أنشئ حسابك لفتح المميزات
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <Button 
                  onClick={handleTrialGenerate} 
                  disabled={isGenerating || !trialInput}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12"
                >
                  {isGenerating ? 'جارٍ الإنشاء...' : 'توليد الرمز التجريبي'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </section>



      {/* Dynamic Demo Showcase */}
      <section id="use-cases" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200/60 relative">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            منصة واحدة. لأي تخصص.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 font-medium text-lg"
          >
            شاهد كيف تتغير المنصة وتتكيف بالكامل مع احتياجاتك الخاصة.
          </motion.p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center gap-1.5 border border-slate-200 bg-white p-1.5 rounded-xl max-w-md mx-auto mb-16 shadow-sm">
          {(['restaurant', 'event', 'portfolio'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab === 'restaurant' ? 'مطعم' : tab === 'event' ? 'فعالية' : 'معرض أعمال'}
            </button>
          ))}
        </div>

        {/* Morphing Preview Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            key={activeTab + "-text"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 text-right order-2 lg:order-1"
          >
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${useCaseDetails[activeTab].accent} text-white shadow-sm`}>
              {useCaseDetails[activeTab].tag}
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900">{useCaseDetails[activeTab].title}</h3>
            <p className="text-slate-600 leading-relaxed font-medium text-lg">{useCaseDetails[activeTab].desc}</p>
            <ul className="space-y-4 pt-2">
              <li className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                <ShieldCheck size={20} className={useCaseDetails[activeTab].colorText} /> قوالب مصممة باحترافية وسهلة التعديل
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-700 font-semibold">
                <BarChart3 size={20} className={useCaseDetails[activeTab].colorText} /> إحصائيات مخصصة وحقيقية تهم تخصصك فقط
              </li>
            </ul>
            <div className="pt-6">
              <Link to="/register">
                <Button className="gap-2 font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md">
                  ابدأ إنشاء كود QR هذا <ArrowLeft size={16} />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Morphing UI mock preview */}
          <motion.div 
             key={activeTab + "-visual"}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4 }}
             className="border border-slate-200 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden order-1 lg:order-2"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${useCaseDetails[activeTab].accent} opacity-10 blur-3xl`} />
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-8">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${useCaseDetails[activeTab].accent} flex items-center justify-center text-white shadow-md`}>
                  <QrCode size={18} />
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-extrabold text-slate-900">لوحة تحكم QRify</h4>
                  <p className="text-xs text-slate-500 font-medium">نمط: {useCaseDetails[activeTab].title}</p>
                </div>
              </div>
              <span className="text-[10px] bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full font-bold">نشط</span>
            </div>

            <div className="space-y-5 text-right relative z-10">
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                <div className="text-xs text-slate-500 font-bold">محتوى الكود الذكي المعروض</div>
                <div className="font-mono text-sm break-all bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-sm text-slate-700">
                  {useCaseDetails[activeTab].preview}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="text-xs text-slate-500 font-bold">مقياس الحساب</div>
                  <div className="text-xl font-black mt-1 text-slate-900">
                    {activeTab === 'restaurant' ? 'زيارات المنيو' : activeTab === 'event' ? 'المسجلين' : 'النقرات'}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="text-xs text-slate-500 font-bold">النمو والمعدل</div>
                  <div className={`text-xl font-black mt-1 bg-gradient-to-r ${useCaseDetails[activeTab].accent} bg-clip-text text-transparent`}>
                    +24.8%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200/60 bg-white">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">ميزات قوية لنمو أعمالك</h2>
          <p className="text-slate-600 font-medium text-lg">
            كل ما تحتاجه لإدارة، تتبع، وتخصيص رموز QR الخاصة بك في مكان واحد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Sparkles className="text-blue-600" />} 
            title="تخصيص متقدم" 
            desc="غير الألوان، أضف شعارك، واختر أشكال العيون والنقاط لتناسب هويتك البصرية." 
          />
          <FeatureCard 
            icon={<BarChart3 className="text-blue-600" />} 
            title="تحليلات تفصيلية" 
            desc="تتبع عمليات المسح، المواقع الجغرافية، أنواع الأجهزة، والمنصات في الوقت الفعلي." 
          />
          <FeatureCard 
            icon={<Layers className="text-blue-600" />} 
            title="رموز ديناميكية" 
            desc="قم بتحديث رابط الوجهة أو محتوى الرمز في أي وقت دون الحاجة لإعادة طباعته." 
          />
          <FeatureCard 
            icon={<Smartphone className="text-blue-600" />} 
            title="صفحات هبوط ذكية" 
            desc="أنشئ صفحات هبوط احترافية محسنة للموبايل في دقائق دون الحاجة لكتابة كود." 
          />
          <FeatureCard 
            icon={<Zap className="text-blue-600" />} 
            title="تصدير عالي الجودة" 
            desc="حمل رموزك بصيغ PNG، SVG، أو PDF بدقة عالية جاهزة للطباعة الاحترافية." 
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-blue-600" />} 
            title="أمان وموثوقية" 
            desc="بنية تحتية قوية تضمن عمل الرموز الخاصة بك دائماً وبشكل آمن وموثوق." 
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200/60 bg-slate-50 relative">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">باقات تناسب جميع احتياجاتك</h2>
          <p className="text-slate-600 font-medium text-lg">
            اختر الباقة المناسبة لك، من الاستخدام الشخصي البسيط إلى الشركات والمؤسسات الكبرى.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Free Tier */}
          <PricingCard 
            title="الباقة المجانية"
            price="0$"
            duration="مجاناً للأبد"
            description="مثالية للاستخدام الشخصي السريع والمحدود."
            features={[
              "توليد 5 رموز QR ديناميكية",
              "روابط ثابتة (Static QR)",
              "تحميل بصيغة PNG",
              "إحصائيات أساسية (عدد المسحات)"
            ]}
            buttonText="ابدأ مجاناً"
          />

          {/* Pro Tier (Recommended) */}
          <div className="relative transform md:-translate-y-4">
            <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">الأكثر طلباً واختياراً</span>
            </div>
            <PricingCard 
              title="الباقة المتوسطة (Pro)"
              price="9$"
              duration="شهرياً"
              description="للمحترفين وأصحاب المشاريع الذين يبحثون عن التميز والاحترافية."
              features={[
                "توليد عدد لامحدود من الرموز",
                "أدوات التخصيص الكاملة (ألوان وأشكال)",
                "إضافة الشعار الخاص بك (Logo)",
                "إحصائيات متقدمة وتقارير",
                "تحميل بصيغ PNG, SVG بجودة عالية",
                "بدون إعلانات"
              ]}
              buttonText="اشترك الآن"
              isHighlighted={true}
            />
          </div>

          {/* Premium Tier */}
          <PricingCard 
            title="باقة البريميوم"
            price="29$"
            duration="شهرياً"
            description="للمؤسسات الكبرى والوكالات التي تدير عدد ضخم من الحملات."
            features={[
              "كل مميزات باقة Pro",
              "توليد رموز QR ضخمة عبر API",
              "تحكم كامل بنظام إدارة الفريق",
              "إمكانية استخدام Domain خاص",
              "دعم فني ذو أولوية 24/7",
              "تكامل مع Google Analytics و Pixel"
            ]}
            buttonText="تواصل معنا"
          />
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] bg-slate-900 p-10 sm:p-16 text-center shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              جاهز للارتقاء بأعمالك؟
            </h2>
            <p className="text-slate-300 font-medium text-lg sm:text-xl">
              انضم لآلاف الشركات والأفراد الذين يعتمدون على QRify لإدارة رموزهم الذكية.
            </p>
            <div className="pt-4 flex justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto font-bold gap-2 bg-white text-slate-900 hover:bg-slate-50 hover:scale-105 transition-all shadow-xl">
                  ابدأ مجاناً الآن <ArrowLeft size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white py-12 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 font-medium">
          <div className="flex items-center gap-2.5 font-black text-slate-900 text-xl">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
              <img src="/logo.png" alt="QRify Logo" className="w-full h-full object-cover" />
            </div>
            <span>QRify</span>
          </div>
          <p>© 2026 QRify. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="border border-slate-200 bg-white p-8 rounded-3xl hover:border-blue-200 transition-all duration-300 text-right shadow-sm hover:shadow-xl hover:shadow-blue-500/5 group"
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
        <div className="group-hover:brightness-0 group-hover:invert transition-all">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
};

const PricingCard = ({ title, price, duration, description, features, buttonText, isHighlighted = false }: {
  title: string, price: string, duration: string, description: string, features: string[], buttonText: string, isHighlighted?: boolean
}) => {
  return (
    <div className={`p-8 rounded-[2rem] border transition-all duration-300 flex flex-col h-full bg-white
      ${isHighlighted 
        ? 'border-blue-500 shadow-2xl shadow-blue-500/20 relative z-0 ring-4 ring-blue-50 dark:ring-blue-900/20' 
        : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300'}`}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
      </div>
      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-4xl font-black text-slate-900">{price}</span>
        <span className="text-slate-500 text-sm font-bold">/ {duration}</span>
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
            <ShieldCheck size={18} className={isHighlighted ? "text-blue-500 shrink-0" : "text-slate-400 shrink-0"} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/register" className="mt-auto">
        <Button 
          className={`w-full font-bold py-6 shadow-sm ${
            isHighlighted 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 shadow-lg' 
              : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

// SVG Lock Icon for the locked state of the trial QR code
const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

