import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Home, QrCode, History, BarChart3, Settings, 
  Users, Shield, Sparkles, Bot, CreditCard, Layers 
} from 'lucide-react';

export const Sidebar = ({ useCase: _ }: { useCase: string | null }) => {
  const location = useLocation();
  const { t, language } = useLanguage();

  const isRtl = language === 'ar';

  return (
    <div 
      className={`w-64 bg-white dark:bg-neutral-900 h-screen flex flex-col hidden md:flex font-body border-neutral-200 dark:border-neutral-800 ${
        isRtl ? 'border-l' : 'border-r'
      }`}
    >
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden p-1">
          <img src="/logo.png" alt="QRify Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t('logo')}</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <SidebarItem 
          icon={<Home size={18} />} 
          label={t('home')} 
          to="/dashboard" 
          active={location.pathname === '/dashboard'}
        />
        <SidebarItem 
          icon={<QrCode size={18} />} 
          label={t('generate')} 
          to="/dashboard/generate" 
          active={location.pathname === '/dashboard/generate'}
        />
        <SidebarItem 
          icon={<History size={18} />} 
          label={t('history')} 
          to="/dashboard/history" 
          active={location.pathname === '/dashboard/history'}
        />
        <SidebarItem 
          icon={<BarChart3 size={18} />} 
          label={t('analytics')} 
          to="/dashboard/analytics" 
          active={location.pathname === '/dashboard/analytics'}
        />
        <SidebarItem 
          icon={<Users size={18} />} 
          label={t('team')} 
          to="/dashboard/team" 
          active={location.pathname === '/dashboard/team'}
        />
        <SidebarItem 
          icon={<Bot size={18} />} 
          label={t('ai_assistant')} 
          to="/dashboard/ai" 
          active={location.pathname === '/dashboard/ai'}
        />
        <SidebarItem 
          icon={<Layers size={18} />} 
          label={t('enterprise')} 
          to="/dashboard/enterprise" 
          active={location.pathname === '/dashboard/enterprise'}
        />
        <SidebarItem 
          icon={<CreditCard size={18} />} 
          label={t('billing')} 
          to="/dashboard/billing" 
          active={location.pathname === '/dashboard/billing'}
        />
        <SidebarItem 
          icon={<Shield size={18} />} 
          label={t('security')} 
          to="/dashboard/security" 
          active={location.pathname === '/dashboard/security'}
        />
        <SidebarItem 
          icon={<Sparkles size={18} />} 
          label={t('insights')} 
          to="/dashboard/insights" 
          active={location.pathname === '/dashboard/insights'}
        />
      </nav>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <SidebarItem 
          icon={<Settings size={18} />} 
          label={t('settings')} 
          to="/dashboard/settings" 
          active={location.pathname === '/dashboard/settings'}
        />
      </div>
    </div>
  );
};

const SidebarItem = ({ 
  icon, 
  label, 
  to, 
  active 
}: { 
  icon: React.ReactNode, 
  label: string, 
  to: string, 
  active: boolean 
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      active 
        ? 'bg-accent/10 text-accent border border-accent/10' 
        : 'text-textMuted dark:text-gray-400 hover:text-textDark dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-transparent'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);
