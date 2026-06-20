import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserProfile, type UseCase } from '../context/UserProfileContext';
import { Button } from '../components/ui/Button';
import { QrCode, Globe, Users, Utensils, Calendar, User } from 'lucide-react';

const USE_CASES: { id: UseCase; label: string; icon: any; desc: string; color: string }[] = [
  { 
    id: 'business', 
    label: 'رابط موقع إلكتروني', 
    icon: Globe, 
    desc: 'إنشاء رمز لتوجيه المستخدمين لموقعك أو متجرك.',
    color: 'border-blue-200 bg-blue-50/50 hover:border-blue-500 text-blue-600'
  },
  { 
    id: 'attendance', 
    label: 'تسجيل الحضور والانصراف', 
    icon: Users, 
    desc: 'إدارة وتتبع حضور الطلاب أو الموظفين بمسحة كود.',
    color: 'border-green-200 bg-green-50/50 hover:border-green-500 text-green-600'
  },
  { 
    id: 'restaurant', 
    label: 'منيو ومطاعم', 
    icon: Utensils, 
    desc: 'عرض قوائم الطعام والطلبات الرقمية لعملائك.',
    color: 'border-orange-200 bg-orange-50/50 hover:border-orange-500 text-orange-600'
  },
  { 
    id: 'events', 
    label: 'فعاليات ومؤتمرات', 
    icon: Calendar, 
    desc: 'بطاقات دخول ذكية وتذاكر وتتبع الحضور للفعاليات.',
    color: 'border-purple-200 bg-purple-50/50 hover:border-purple-500 text-purple-600'
  },
  { 
    id: 'portfolio', 
    label: 'بورتفوليو شخصي', 
    icon: User, 
    desc: 'عرض السيرة الذاتية وروابط التواصل والأعمال.',
    color: 'border-pink-200 bg-pink-50/50 hover:border-pink-500 text-pink-600'
  },
];

export const OnboardingPage = () => {
  const { user } = useAuth();
  const { profile, setProfile } = useUserProfile();
  const [selected, setSelected] = useState<UseCase | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!user || !selected) return;
    setLoading(true);
    try {
      await setProfile({ ...profile!, useCase: selected });
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 font-body" dir="rtl">
      <div className="w-full max-w-3xl space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex bg-accent/10 text-accent p-3.5 rounded-2xl border border-accent/25">
            <QrCode size={32} className="stroke-[2.5]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-textDark">مرحباً بك في كيو آري فاي 👋</h1>
          <p className="text-textMuted font-medium text-base max-w-lg mx-auto">
            ما هو غرضك الأساسي من استخدام رموز الـ QR؟ سنقوم بتهيئة وإعداد لوحة التحكم الخاصة بك وتعديل التصميم بناءً على اختيارك.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-right">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            const isSelected = selected === uc.id;
            return (
              <button
                key={uc.id}
                onClick={() => setSelected(uc.id)}
                className={`p-6 rounded-2xl border text-right transition-all duration-300 flex flex-col gap-4 shadow-sm hover:shadow-md ${
                  isSelected 
                    ? 'border-accent bg-accent/5 ring-1 ring-accent' 
                    : uc.color
                }`}
              >
                <div className={`p-2.5 rounded-xl bg-white border inline-block self-start shadow-sm`}>
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-textDark">{uc.label}</h3>
                  <p className="text-xs text-textMuted leading-relaxed font-semibold">{uc.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4 flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selected || loading}
            className="w-full max-w-md font-bold h-11"
          >
            {loading ? 'جاري تهيئة منصتك...' : 'تأكيد وحفظ الإعدادات'}
          </Button>
        </div>
      </div>
    </div>
  );
};
