import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

const translations = {
  ar: {
    logo: 'QRify',
    home: 'الرئيسية',
    generate: 'إنشاء رمز QR',
    history: 'السجل',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    admin: 'لوحة التحكم للمشرف',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب جديد',
    welcome: 'أهلاً بك',
    onboardingTitle: 'ما هو غرضك الأساسي من استخدام رموز الـ QR؟',
    onboardingSub: 'سنقوم بتهيئة وإعداد لوحة التحكم وتعديل ألوان وتصميم واجهتك بناءً على اختيارك.',
    confirmSettings: 'تأكيد وحفظ الإعدادات',
    totalQRs: 'إجمالي رموز الـ QR',
    totalScans: 'إجمالي عمليات المسح',
    activeQRs: 'الرموز النشطة',
    quickActions: 'إجراءات سريعة',
    createSessionQR: 'إنشاء رمز QR للجلسة',
    viewAttendanceSheet: 'عرض ورقة الحضور',
    exportToExcel: 'تصدير لملف Excel',
    noRecentSessions: 'لا توجد جلسات حديثة. أنشئ جلسة جديدة للبدء.',
    recentActivity: 'النشاط الأخير',
    dynamicScanLink: 'رابط رمز ذكي متكيف',
    customLogo: 'شعار مخصص',
    downloadPNG: 'تحميل PNG',
    downloadSVG: 'تحميل SVG',
    downloadPDF: 'تحميل PDF',
    static: 'ثابت (Static)',
    dynamic: 'ديناميكي (Dynamic)',
    qrType: 'نوع رمز الـ QR',
    qrSettings: 'إعدادات رمز الـ QR',
    contentUrl: 'المحتوى (رابط أو نص)',
    fgColor: 'لون الكود',
    bgColor: 'لون الخلفية',
    uploadLogo: 'رفع شعار مخصص',
    memoryTheme: 'ثيم الذاكرة الذكي (Memory)',
    attendance: 'حضور وانصراف',
    portfolio: 'معرض أعمال',
    restaurant: 'منيو مطعم',
    events: 'فعاليات',
    business: 'موقع ويب',
    notifications: 'الإشعارات',
    theme: 'المظهر',
    language: 'اللغة',
    team: 'فريق العمل',
    security: 'الحماية والأمان',
    insights: 'النصائح الذكية',
    ai_assistant: 'المساعد الذكي (AI)',
    billing: 'الفواتير والاشتراكات',
    enterprise: 'أدوات المؤسسات',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    welcomeBack: 'أهلاً بك مجدداً',
    registerDesc: 'ابدأ بإنشاء الـ QR الذكي الخاص بك بدقائق',
    loginDemo: 'تسجيل الدخول (عرض تجريبي)',
    registerDemo: 'إنشاء حساب (عرض تجريبي)',
    orUsing: 'أو عن طريق',
    googleSignIn: 'تسجيل بواسطة Google',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب بالفعل؟',
    tryNow: 'تجربة الآن',
    notNow: 'ليس الآن',
    smartSuggestion: 'اقتراح ذكي من المنصة 🚀',
  },
  en: {
    logo: 'QRify',
    home: 'Home',
    generate: 'Generate QR',
    history: 'History',
    analytics: 'Analytics',
    settings: 'Settings',
    admin: 'Admin Panel',
    logout: 'Logout',
    login: 'Login',
    register: 'Sign Up',
    welcome: 'Welcome',
    onboardingTitle: 'What will you use QR Codes for?',
    onboardingSub: 'We will configure your dashboard and dynamically adjust colors and designs based on your selection.',
    confirmSettings: 'Confirm Settings',
    totalQRs: 'Total QR Codes',
    totalScans: 'Total Scans',
    activeQRs: 'Active QRs',
    quickActions: 'Quick Actions',
    createSessionQR: 'Create Session QR',
    viewAttendanceSheet: 'View Attendance Sheet',
    exportToExcel: 'Export to Excel',
    noRecentSessions: 'No recent sessions found. Create one to get started.',
    recentActivity: 'Recent Activity',
    dynamicScanLink: 'Dynamic Scan Link',
    customLogo: 'Custom Logo',
    downloadPNG: 'Download PNG',
    downloadSVG: 'Download SVG',
    downloadPDF: 'Download PDF',
    static: 'Static',
    dynamic: 'Dynamic',
    qrType: 'QR Type',
    qrSettings: 'QR Settings',
    contentUrl: 'Content (URL or Text)',
    fgColor: 'QR Color',
    bgColor: 'Background Color',
    uploadLogo: 'Upload Custom Logo',
    memoryTheme: 'Memory Theme',
    attendance: 'Attendance',
    portfolio: 'Portfolio',
    restaurant: 'Restaurant Menu',
    events: 'Events',
    business: 'Website URL',
    notifications: 'Notifications',
    theme: 'Theme',
    language: 'Language',
    team: 'Team Workspace',
    security: 'Security',
    insights: 'Smart Insights',
    ai_assistant: 'AI Assistant',
    billing: 'Billing & Subscription',
    enterprise: 'Enterprise Tools',
    name: 'Full Name',
    email: 'Email Address',
    password: 'Password',
    welcomeBack: 'Welcome back',
    registerDesc: 'Start generating smart QR codes in minutes',
    loginDemo: 'Sign In (Demo)',
    registerDemo: 'Sign Up (Demo)',
    orUsing: 'Or using',
    googleSignIn: 'Sign in with Google',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    tryNow: 'Try Now',
    notNow: 'Not Now',
    smartSuggestion: 'Smart Suggestion 🚀',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (key) => key.toString(),
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    const storedLang = localStorage.getItem('qr_language') as Language;
    if (storedLang) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('qr_language', lang);
  };

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key] || key.toString();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
