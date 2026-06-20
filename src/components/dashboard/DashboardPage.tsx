import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../context/UserProfileContext';
import { Sidebar } from './Sidebar';
import { QRCustomizationStudio } from '../qr/QRCustomizationStudio';
import { AttendanceDashboard } from './AttendanceDashboard';
import { PortfolioDashboard } from './PortfolioDashboard';
import { RestaurantDashboard } from './RestaurantDashboard';
import { EventDashboard } from './EventDashboard';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { TeamWorkspace } from './TeamWorkspace';
import { SecuritySettings } from './SecuritySettings';
import { SmartInsights } from './SmartInsights';
import { SmartSuggestion } from './SmartSuggestion';
import { AIAssistant } from './AIAssistant';
import { BillingPanel } from './BillingPanel';
import { EnterprisePortal } from './EnterprisePortal';
import { PWAPrompt } from '../ui/PWAPrompt';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Globe, Users, Utensils, Calendar, User, Plus, ShieldAlert, ArrowUp, ArrowDown, X, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardPage = () => {
  const { profile } = useUserProfile();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Set default view based on user profile setting
  const [activeUseCase, setActiveUseCase] = useState<string>('business');

  // Stats State
  const [stats, setStats] = useState({ totalQRs: 0, totalScans: 0, activeQRs: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);

  // Widget Layout order state (Stats, AI Suggestions, Use Case details panel)
  const [widgetOrder, setWidgetOrder] = useState<string[]>(['stats', 'suggestion', 'usecase_panel']);

  useEffect(() => {
    if (profile?.useCase) {
      setActiveUseCase(profile.useCase);
      // Auto-arrange default widget layouts based on Use Case selection
      if (profile.useCase === 'attendance' || profile.useCase === 'restaurant') {
        setWidgetOrder(['usecase_panel', 'stats', 'suggestion']);
      } else {
        setWidgetOrder(['stats', 'suggestion', 'usecase_panel']);
      }

      // Check onboarding
      if (!localStorage.getItem('qrify_onboarding_seen_v1')) {
        setTimeout(() => setShowOnboarding(true), 1000);
      }
    }
  }, [profile]);

  const dismissOnboarding = () => {
    localStorage.setItem('qrify_onboarding_seen_v1', 'true');
    setShowOnboarding(false);
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(prev => prev + 1);
    } else {
      dismissOnboarding();
    }
  };

  // Fetch real statistics
  useEffect(() => {
    if (!user || !db) {
      setLoadingStats(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const q = query(collection(db, 'qrcodes'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        let total = 0;
        let scans = 0;
        let active = 0;

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          total++;
          scans += data.scansCount || 0;
          if (!data.isArchived) {
            active++;
          }
        });

        setStats({ totalQRs: total, totalScans: scans, activeQRs: active });
      } catch (err) {
        console.error("Error loading user QR statistics:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  const useCasesList = [
    { id: 'business', label: t('business'), icon: Globe, color: '#3B82F6', hoverBg: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400', activeClass: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50' },
    { id: 'attendance', label: t('attendance'), icon: Users, color: '#10B981', hoverBg: 'hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/30 dark:hover:text-green-400', activeClass: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50' },
    { id: 'portfolio', label: t('portfolio'), icon: User, color: '#EC4899', hoverBg: 'hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/30 dark:hover:text-pink-400', activeClass: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/50' },
    { id: 'restaurant', label: t('restaurant'), icon: Utensils, color: '#F59E0B', hoverBg: 'hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/30 dark:hover:text-orange-400', activeClass: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/50' },
    { id: 'events', label: t('events'), icon: Calendar, color: '#8B5CF6', hoverBg: 'hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/30 dark:hover:text-purple-400', activeClass: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50' },
  ];

  // Dynamic Accent Color update based on "Memory Theme"
  useEffect(() => {
    const selected = useCasesList.find(uc => uc.id === activeUseCase);
    if (selected) {
      document.documentElement.style.setProperty('--accent-color', selected.color);
    }
  }, [activeUseCase]);

  const renderDashboardContent = () => {
    switch (activeUseCase) {
      case 'attendance':
        return <AttendanceDashboard />;
      case 'portfolio':
        return <PortfolioDashboard />;
      case 'restaurant':
        return <RestaurantDashboard />;
      case 'events':
        return <EventDashboard />;
      default:
        return (
          <div className="space-y-6 text-right">
            <h2 className="text-2xl font-bold text-textDark dark:text-white">
              {language === 'ar' ? 'توجيه الروابط والمواقع الإلكترونية' : 'Link & Website Redirections'}
            </h2>
            <p className="text-textMuted dark:text-gray-400">
              {language === 'ar' 
                ? 'قم بتعديل وتوجيه كود الـ QR الخاص بك لأي رابط موقع ويب، متجر أو وسائل تواصل اجتماعي.' 
                : 'Modify and route your QR code to any target destination, storefront, or social media link.'}
            </p>
            <Card className="p-8 text-center space-y-4 max-w-lg mx-auto border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
              <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Globe size={24} />
              </div>
              <h3 className="font-bold dark:text-white">{language === 'ar' ? 'رابط التوجيه الافتراضي' : 'Default Redirect Target'}</h3>
              <p className="text-xs font-mono bg-neutral-50 dark:bg-neutral-800 p-2.5 rounded border border-border dark:border-gray-700 dark:text-gray-300">
                https://mywebsite.com/home
              </p>
              <Button onClick={() => navigate('/dashboard/generate')}>{language === 'ar' ? 'تعديل الرابط الآن' : 'Edit Link Now'}</Button>
            </Card>
          </div>
        );
    }
  };

  const isRtl = language === 'ar';

  // Widget layout handlers
  const moveWidgetUp = (idx: number) => {
    if (idx === 0) return;
    const newOrder = [...widgetOrder];
    const temp = newOrder[idx - 1];
    newOrder[idx - 1] = newOrder[idx];
    newOrder[idx] = temp;
    setWidgetOrder(newOrder);
  };

  const moveWidgetDown = (idx: number) => {
    if (idx === widgetOrder.length - 1) return;
    const newOrder = [...widgetOrder];
    const temp = newOrder[idx + 1];
    newOrder[idx + 1] = newOrder[idx];
    newOrder[idx] = temp;
    setWidgetOrder(newOrder);
  };

  return (
    <div className="flex h-screen bg-background dark:bg-neutral-950 text-textDark dark:text-white overflow-hidden font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      <Sidebar useCase={profile?.useCase || null} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
          
          {/* Guided Onboarding Overlay */}
          <AnimatePresence>
            {showOnboarding && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                >
                  <button onClick={dismissOnboarding} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                  
                  <div className="flex flex-col items-center text-center space-y-5">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center rounded-2xl">
                      {onboardingStep === 1 ? <Sparkles size={32} /> : onboardingStep === 2 ? <Plus size={32} /> : <ArrowUp size={32} />}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {onboardingStep === 1 ? 'مرحباً بك في لوحة تحكمك الذكية! 👋' : onboardingStep === 2 ? 'أنشئ رمزك الأول 🚀' : 'رتب واجهتك كما تحب 🛠️'}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed">
                        {onboardingStep === 1 
                          ? 'هنا يمكنك متابعة إحصائياتك وإدارة رموز الاستجابة السريعة الخاصة بك. لقد قمنا بتخصيص الواجهة لتناسب مجال عملك.' 
                          : onboardingStep === 2 
                          ? 'انقر على زر التوليد في أعلى الشاشة للبدء في تصميم أول رمز لك واختيار الألوان والأشكال.' 
                          : 'يمكنك إعادة ترتيب مكونات لوحة التحكم عن طريق أزرار التحريك لأعلى ولأسفل في كل صندوق.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {[1, 2, 3].map(step => (
                        <div key={step} className={`h-2 rounded-full transition-all ${step === onboardingStep ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
                      ))}
                    </div>

                    <Button onClick={nextOnboardingStep} className="w-full mt-4">
                      {onboardingStep < 3 ? 'التالي' : 'ابدأ الآن'}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <Routes>
            <Route path="/" element={
              <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border dark:border-gray-800 pb-6">
                  <div>
                    <h1 className="text-3xl font-black text-textDark dark:text-white">{t('logo')}</h1>
                    <p className="text-textMuted dark:text-gray-400 text-sm font-semibold mt-1">
                      {language === 'ar' 
                        ? `أهلاً بك، ${profile?.name || 'المستخدم التجريبي'} 👋 لوحة تحكمك الذكية جاهزة.` 
                        : `Welcome, ${profile?.name || 'Demo User'} 👋 Your smart dashboard is ready.`}
                    </p>
                  </div>
                  <Link to="/dashboard/generate">
                    <Button className="gap-2 font-bold shadow-sm">
                      <Plus size={18} /> {t('generate')}
                    </Button>
                  </Link>
                </div>

                {/* Adaptive Smart Widgets Layout */}
                <div className="space-y-8">
                  {widgetOrder.map((widgetId, index) => {
                    const isFirst = index === 0;
                    const isLast = index === widgetOrder.length - 1;

                    const widgetHeaderControls = (titleAr: string, titleEn: string) => (
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100 dark:border-neutral-800">
                        <span className="text-[11px] font-black text-textMuted dark:text-neutral-400 uppercase tracking-wider">
                          {isRtl ? titleAr : titleEn}
                        </span>
                        <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 p-0.5 rounded-lg shadow-sm">
                          <button
                            onClick={() => moveWidgetUp(index)}
                            disabled={isFirst}
                            className="p-1 text-neutral-400 hover:text-accent disabled:opacity-25 transition-colors"
                            title={isRtl ? 'تحريك لأعلى' : 'Move Up'}
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            onClick={() => moveWidgetDown(index)}
                            disabled={isLast}
                            className="p-1 text-neutral-400 hover:text-accent disabled:opacity-25 transition-colors"
                            title={isRtl ? 'تحريك لأسفل' : 'Move Down'}
                          >
                            <ArrowDown size={11} />
                          </button>
                        </div>
                      </div>
                    );

                    if (widgetId === 'stats') {
                      return (
                        <div key="stats" className="space-y-3 relative">
                          {widgetHeaderControls('إحصائيات الأداء السريعة', 'Performance Metrics')}
                          {!loadingStats && stats.totalQRs === 0 ? (
                            <div className="bg-slate-50 dark:bg-neutral-900 border border-dashed border-slate-300 dark:border-neutral-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4">
                              <div className="w-14 h-14 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm flex items-center justify-center text-slate-400">
                                <Info size={24} />
                              </div>
                              <div>
                                <h4 className="text-slate-900 dark:text-white font-bold mb-1">لا توجد إحصائيات حتى الآن</h4>
                                <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">قم بإنشاء رمز الاستجابة السريعة الأول الخاص بك لتبدأ في جمع بيانات المسح والزيارات.</p>
                              </div>
                              <Link to="/dashboard/generate">
                                <Button size="sm" variant="secondary" className="mt-2 gap-2"><Plus size={16} /> أنشئ رمزاً الآن</Button>
                              </Link>
                            </div>
                          ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow transition-shadow">
                              <CardContent className="p-0 flex flex-col gap-1">
                                <span className="text-xs font-bold text-textMuted dark:text-gray-400 uppercase">{t('totalQRs')}</span>
                                <span className="text-3xl font-black text-textDark dark:text-white">
                                  {loadingStats ? '...' : stats.totalQRs}
                                </span>
                              </CardContent>
                            </Card>
                            <Card className="p-6 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow transition-shadow">
                              <CardContent className="p-0 flex flex-col gap-1">
                                <span className="text-xs font-bold text-textMuted dark:text-gray-400 uppercase">{t('totalScans')}</span>
                                <span className="text-3xl font-black text-textDark dark:text-white">
                                  {loadingStats ? '...' : stats.totalScans}
                                </span>
                              </CardContent>
                            </Card>
                            <Card className="p-6 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow transition-shadow">
                              <CardContent className="p-0 flex flex-col gap-1">
                                <span className="text-xs font-bold text-textMuted dark:text-gray-400 uppercase">{t('activeQRs')}</span>
                                <span className="text-3xl font-black text-textDark dark:text-white">
                                  {loadingStats ? '...' : stats.activeQRs}
                                </span>
                              </CardContent>
                            </Card>
                          </div>
                          )}
                        </div>
                      );
                    }

                    if (widgetId === 'suggestion') {
                      return (
                        <div key="suggestion" className="space-y-3">
                          {widgetHeaderControls('اقتراح المنصة الذكي', 'AI Quick Insights')}
                          <SmartSuggestion />
                        </div>
                      );
                    }

                    if (widgetId === 'usecase_panel') {
                      return (
                        <div key="usecase_panel" className="space-y-3">
                          {widgetHeaderControls('مساحة العمل المتكيفة حسب نوع المشروع', 'Project Adaptive Workspace')}
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                            
                            {/* Usecase Switcher (Memory Theme Sidebar) */}
                            <div className="lg:col-span-1 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 rounded-2xl p-4 space-y-2 shadow-sm text-right">
                              <div className="text-xs font-bold text-textMuted dark:text-gray-400 uppercase px-3.5 pb-3 border-b border-border dark:border-gray-800 mb-2">
                                {t('memoryTheme')}
                              </div>
                              {useCasesList.map((uc) => {
                                const Icon = uc.icon;
                                const isActive = activeUseCase === uc.id;
                                return (
                                  <button
                                    key={uc.id}
                                    onClick={() => setActiveUseCase(uc.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all border border-transparent ${
                                      isActive 
                                        ? uc.activeClass 
                                        : `text-textMuted dark:text-gray-400 ${uc.hoverBg}`
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Icon size={16} />
                                      <span>{uc.label}</span>
                                    </div>
                                    <span 
                                      className="w-2.5 h-2.5 rounded-full" 
                                      style={{ backgroundColor: uc.color }}
                                    />
                                  </button>
                                );
                              })}
                            </div>

                            {/* Adapted Dashboard Panel */}
                            <div className="lg:col-span-3 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-sm">
                              {renderDashboardContent()}
                            </div>

                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            } />

            <Route path="/generate" element={
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-black text-textDark dark:text-white">{t('generate')}</h1>
                  <p className="text-textMuted dark:text-gray-400 mt-1">
                    {language === 'ar' ? 'توليد أكواد QR ذكية مع خيارات تعديل الألوان والتصاميم فورياً.' : 'Generate intelligent QR codes with instant color and design styling.'}
                  </p>
                </div>
                <QRCustomizationStudio />
              </div>
            } />
            
            <Route path="/history" element={
              <div className="p-16 text-center border border-dashed border-border dark:border-gray-800 bg-white/50 dark:bg-neutral-900/50 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-slate-400 mb-2">
                  <Globe size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{language === 'ar' ? 'السجل فارغ حالياً' : 'History is currently empty'}</h3>
                <p className="text-slate-500 font-medium max-w-sm">{language === 'ar' ? 'جميع الأكواد التي تقوم بإنشائها ستظهر هنا لتتمكن من إدارتها وتحميلها لاحقاً.' : 'All QR codes you generate will appear here for you to manage and download later.'}</p>
                <Link to="/dashboard/generate">
                  <Button className="mt-4 gap-2 shadow-sm"><Plus size={18} /> {language === 'ar' ? 'إنشاء رمز جديد' : 'Create New QR'}</Button>
                </Link>
              </div>
            } />
            
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/team" element={<TeamWorkspace />} />
            <Route path="/security" element={<SecuritySettings />} />
            <Route path="/insights" element={<SmartInsights />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/enterprise" element={<EnterprisePortal />} />
            <Route path="/billing" element={<BillingPanel />} />
            
            <Route path="/settings" element={
              <div className="space-y-6 text-right">
                <h1 className="text-3xl font-black text-textDark dark:text-white">{t('settings')}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Account Card */}
                  <Card className="p-6 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-textMuted dark:text-gray-400 block">{t('name')}</label>
                      <div className="font-bold text-textDark dark:text-white text-base">{profile?.name}</div>
                    </div>
                    <div className="space-y-1 border-t border-border dark:border-gray-800 pt-4">
                      <label className="text-xs font-bold text-textMuted dark:text-gray-400 block">{t('email')}</label>
                      <div className="font-bold text-textDark dark:text-white text-base">{profile?.email}</div>
                    </div>
                    <div className="space-y-1 border-t border-border dark:border-gray-800 pt-4">
                      <label className="text-xs font-bold text-textMuted dark:text-gray-400 block">{language === 'ar' ? 'نمط الاستخدام الحالي' : 'Current Use Case'}</label>
                      <div className="font-bold text-textDark dark:text-white text-base">
                        {profile?.useCase === 'attendance' ? t('attendance') : profile?.useCase === 'portfolio' ? t('portfolio') : profile?.useCase === 'restaurant' ? t('restaurant') : profile?.useCase === 'events' ? t('events') : t('business')}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border dark:border-gray-800">
                      <Button variant="secondary" className="w-full text-red-500 border-red-100 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => { logout(); window.location.href = '/login'; }}>
                        {t('logout')}
                      </Button>
                    </div>
                  </Card>

                  {/* Preferences Card */}
                  <Card className="p-6 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 space-y-6">
                    {/* Language Switcher */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-textMuted dark:text-gray-400 block">{t('language')}</label>
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => setLanguage('ar')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            language === 'ar' 
                              ? 'bg-accent text-white border-accent shadow-sm' 
                              : 'bg-white dark:bg-neutral-800 text-textMuted border-border dark:border-gray-700'
                          }`}
                        >
                          العربية (Arabic)
                        </button>
                        <button
                          onClick={() => setLanguage('en')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            language === 'en' 
                              ? 'bg-accent text-white border-accent shadow-sm' 
                              : 'bg-white dark:bg-neutral-800 text-textMuted border-border dark:border-gray-700'
                          }`}
                        >
                          English (الأجنبية)
                        </button>
                      </div>
                    </div>

                    {/* Theme Switcher */}
                    <div className="space-y-3 border-t border-border dark:border-gray-800 pt-4">
                      <label className="text-xs font-bold text-textMuted dark:text-gray-400 block">{t('theme')}</label>
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => setTheme('light')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            theme === 'light' 
                              ? 'bg-accent text-white border-accent shadow-sm' 
                              : 'bg-white dark:bg-neutral-800 text-textMuted border-border dark:border-gray-700'
                          }`}
                        >
                          {language === 'ar' ? 'نهاري / مضيء' : 'Light Mode'}
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            theme === 'dark' 
                              ? 'bg-accent text-white border-accent shadow-sm' 
                              : 'bg-white dark:bg-neutral-800 text-textMuted border-border dark:border-gray-700'
                          }`}
                        >
                          {language === 'ar' ? 'ليلي / معتم' : 'Dark Mode'}
                        </button>
                      </div>
                    </div>

                    {/* Admin Backdoor */}
                    <div className="space-y-3 border-t border-border dark:border-gray-800 pt-4">
                      <label className="text-xs font-bold text-textMuted dark:text-gray-400 block flex items-center gap-1.5">
                        <ShieldAlert size={14} className="text-red-500" />
                        <span>{language === 'ar' ? 'التحكم الإداري للنظام' : 'Platform Administration'}</span>
                      </label>
                      <Link to="/admin" className="block">
                        <Button variant="secondary" className="w-full text-xs font-bold border-red-200 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                          {t('admin')}
                        </Button>
                      </Link>
                    </div>

                  </Card>

                </div>
              </div>
            } />
          </Routes>
          <PWAPrompt />
        </div>
      </main>
    </div>
  );
};
export default DashboardPage;
