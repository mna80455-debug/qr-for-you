import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Plus, Shield, Check, Trash2, Mail, Bell, Activity } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  status: 'active' | 'pending';
}

interface Workspace {
  id: string;
  name: string;
  type: 'personal' | 'team';
}

export const TeamWorkspace = () => {
  const { language } = useLanguage();
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'personal', name: 'مساحة العمل الشخصية', type: 'personal' },
    { id: 'team_1', name: 'فريق تسويق QR Universe', type: 'team' },
  ]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('personal');
  
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 'm1', name: 'أحمد علي', email: 'ahmed@company.com', role: 'Owner', status: 'active' },
    { id: 'm2', name: 'منى جمال', email: 'mona@company.com', role: 'Admin', status: 'active' },
    { id: 'm3', name: 'سليم خالد', email: 'salim@company.com', role: 'Editor', status: 'active' },
    { id: 'm4', name: 'رانيا عمر', email: 'rania@company.com', role: 'Viewer', status: 'pending' },
  ]);

  const [activities] = useState([
    { user: 'منى جمال', action: 'أنشأت رمز QR جديد (منيو المطعم)', time: 'منذ ١٠ دقائق' },
    { user: 'سليم خالد', action: 'حدث رابط بورتفوليو مبرمج', time: 'منذ ساعة' },
    { user: 'أحمد علي', action: 'قام بتصدير إحصائيات المسح', time: 'منذ ساعتين' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Invite member by email
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newInvite: TeamMember = {
      id: `m_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending'
    };

    setMembers([...members, newInvite]);
    setInviteEmail('');
    setSuccessMsg(language === 'ar' ? 'تم إرسال دعوة الانضمام للفريق بنجاح!' : 'Invitation sent successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleCreateWorkspace = () => {
    const name = prompt(language === 'ar' ? 'أدخل اسم مساحة العمل الجديدة:' : 'Enter new workspace name:');
    if (!name) return;

    const newWs: Workspace = {
      id: `team_${Date.now()}`,
      name,
      type: 'team'
    };
    setWorkspaces([...workspaces, newWs]);
    setActiveWorkspaceId(newWs.id);
  };

  const isRtl = language === 'ar';
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  return (
    <div className="space-y-8 text-right font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Workspace selector header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border dark:border-gray-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-textDark dark:text-white flex items-center gap-2">
            <Users className="text-accent" size={24} />
            <span>{isRtl ? 'مساحات العمل والتعاون الجماعي' : 'Workspaces & Team Collaboration'}</span>
          </h2>
          <p className="text-textMuted dark:text-gray-400 mt-1">
            {isRtl ? 'قم بتبديل مساحات العمل ودعوة أعضاء فريقك لإدارة وتتبع رموز الـ QR معاً.' : 'Switch workspaces, invite team members, and manage roles for shared QR codes.'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={activeWorkspaceId}
            onChange={e => setActiveWorkspaceId(e.target.value)}
            className="h-10 rounded-btn border border-border dark:border-gray-800 bg-white dark:bg-neutral-850 px-3 text-xs font-bold text-textDark dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {workspaces.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} {w.type === 'personal' ? `(${isRtl ? 'شخصية' : 'Personal'})` : ''}
              </option>
            ))}
          </select>
          <Button onClick={handleCreateWorkspace} className="gap-1.5 text-xs font-bold">
            <Plus size={14} /> {isRtl ? 'مساحة جديدة' : 'New Workspace'}
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Workspace split */}
      {activeWorkspace?.type === 'personal' ? (
        // Personal Workspace details
        <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 p-8 text-center max-w-lg mx-auto space-y-4">
          <div className="bg-accent/10 text-accent w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Shield size={24} />
          </div>
          <h3 className="font-bold dark:text-white">{isRtl ? 'مساحة العمل الشخصية' : 'Personal Workspace'}</h3>
          <p className="text-xs text-textMuted dark:text-gray-400 leading-relaxed font-semibold">
            {isRtl 
              ? 'مساحة العمل هذه خاصة بك وحدك. الرموز المنشأة هنا لن تظهر لأي مستخدم آخر. لتمكين مشاركة الأكواد وتوزيع الصلاحيات، قم بالانتقال لمساحة عمل جماعية بالمنسدل بالأعلى.' 
              : 'This workspace is private. Codes generated here are hidden from other users. Switch to a Team Workspace to share codes.'}
          </p>
          <Button onClick={() => setActiveWorkspaceId('team_1')} variant="secondary" className="font-bold text-xs">{isRtl ? 'الذهاب لمساحة الفريق' : 'Go to Team Workspace'}</Button>
        </Card>
      ) : (
        // Team Workspace active layout
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Member manager panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
              <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
                <CardTitle className="dark:text-white">{isRtl ? 'أعضاء الفريق والصلاحيات' : 'Team Members & Roles'}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border dark:divide-neutral-800">
                  {members.map((m) => (
                    <div key={m.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-colors">
                      <div className="text-right">
                        <div className="text-sm font-bold text-textDark dark:text-white flex items-center gap-2">
                          <span>{m.name}</span>
                          {m.status === 'pending' && (
                            <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-bold">
                              {isRtl ? 'بانتظار قبول الدعوة' : 'Pending Invite'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-textMuted dark:text-gray-400 mt-0.5">{m.email}</div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-neutral-100 dark:bg-neutral-800 text-textDark dark:text-white px-2.5 py-1 rounded-xl font-bold border border-transparent dark:border-gray-700">
                          {m.role}
                        </span>
                        {m.role !== 'Owner' && (
                          <button 
                            onClick={() => handleRemoveMember(m.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Activity feed */}
            <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
              <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Activity size={18} className="text-accent" />
                  <span>{isRtl ? 'سجل العمليات الأخير للفريق' : 'Team Activity Feed'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {activities.map((a, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 text-xs font-semibold text-textMuted dark:text-gray-400">
                    <div className="flex gap-2">
                      <span className="text-textDark dark:text-white font-bold">{a.user}</span>
                      <span>{a.action}</span>
                    </div>
                    <span className="shrink-0 font-normal">{a.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Invitation sidebar */}
          <div className="space-y-6">
            <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
              <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Mail size={18} className="text-accent" />
                  <span>{isRtl ? 'دعوة عضو جديد' : 'Invite Member'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{isRtl ? 'البريد الإلكتروني للزميل' : 'Email Address'}</label>
                    <Input 
                      type="email" 
                      value={inviteEmail} 
                      onChange={e => setInviteEmail(e.target.value)} 
                      placeholder="teammate@company.com" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{isRtl ? 'دور الصلاحيات' : 'Role Level'}</label>
                    <select
                      value={inviteRole}
                      onChange={e => setInviteRole(e.target.value as any)}
                      className="w-full h-10 rounded-btn border border-border dark:border-gray-800 bg-white dark:bg-neutral-850 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-white"
                    >
                      <option value="Admin">{isRtl ? 'مشرف (Admin)' : 'Admin'}</option>
                      <option value="Editor">{isRtl ? 'محرر (Editor)' : 'Editor'}</option>
                      <option value="Viewer">{isRtl ? 'قارئ (Viewer)' : 'Viewer'}</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full font-bold mt-2 gap-1.5">
                    {isRtl ? 'إرسال دعوة الانضمام' : 'Send Invite'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5 dark:bg-accent/5">
              <CardHeader>
                <CardTitle className="text-accent flex items-center gap-1.5">
                  <Bell size={16} />
                  <span>{isRtl ? 'دعوات انضمام بانتظارك' : 'Pending Workspace Invites'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-xs leading-relaxed space-y-3">
                <div className="bg-white dark:bg-neutral-850 p-3 rounded-xl border border-border dark:border-gray-700 flex justify-between items-center gap-2">
                  <div>
                    <span className="font-bold block dark:text-white">فريق مبيعات الفعالية</span>
                    <span className="text-[10px] text-textMuted dark:text-gray-400">من: sales@qrcampaigns.com</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button size="sm" className="px-2.5 py-1 text-[10px] font-bold h-7">{isRtl ? 'قبول' : 'Accept'}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      )}

    </div>
  );
};
