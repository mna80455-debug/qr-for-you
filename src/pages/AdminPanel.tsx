import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { QrCode, Users, BarChart3, Shield, ArrowLeft, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  useCase: string;
}

interface AdminQR {
  id: string;
  name: string;
  type: string;
  content: string;
  scansCount: number;
  userId: string;
  isArchived?: boolean;
}

export const AdminPanel = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [qrCodes, setQrCodes] = useState<AdminQR[]>([]);
  const [totalScans, setTotalScans] = useState(0);

  // Settings mock toggles
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    // If there is no user logged in, or we want to secure it (mock security check)
    // In production we would inspect a custom claim or document metadata
    const fetchData = async () => {
      setLoading(true);
      
      const mockUsers: AdminUser[] = [
        { id: '1', name: 'أحمد علي', email: 'ahmed@example.com', useCase: 'attendance' },
        { id: '2', name: 'منى جمال', email: 'mona@example.com', useCase: 'restaurant' },
        { id: '3', name: 'ياسين خالد', email: 'yassin@example.com', useCase: 'portfolio' },
        { id: '4', name: 'سليم عمر', email: 'salim@example.com', useCase: 'business' },
      ];

      const mockQRs: AdminQR[] = [
        { id: 'qr_1', name: 'منيو المشروبات', type: 'restaurant', content: 'https://menu.pdf', scansCount: 142, userId: '2' },
        { id: 'qr_2', name: 'تسجيل محاضرة شبكات', type: 'attendance', content: 'session_123', scansCount: 95, userId: '1' },
        { id: 'qr_3', name: 'بورتفوليو مبرمج', type: 'portfolio', content: 'https://myportfolio.com', scansCount: 204, userId: '3' },
      ];

      if (isFirebaseConfigured && db) {
        try {
          const userSnap = await getDocs(collection(db, 'users'));
          const fetchedUsers: AdminUser[] = [];
          userSnap.forEach(docSnap => {
            const data = docSnap.data();
            if (data.profile) {
              fetchedUsers.push({
                id: docSnap.id,
                name: data.profile.name || 'مستخدم',
                email: data.profile.email || '',
                useCase: data.profile.useCase || 'موقع ويب'
              });
            }
          });

          const qrSnap = await getDocs(collection(db, 'qrcodes'));
          const fetchedQRs: AdminQR[] = [];
          let sumScans = 0;
          qrSnap.forEach(docSnap => {
            const data = docSnap.data();
            sumScans += data.scansCount || 0;
            fetchedQRs.push({
              id: docSnap.id,
              name: data.name || 'كود QR',
              type: data.type || 'url',
              content: data.content || '',
              scansCount: data.scansCount || 0,
              userId: data.userId || '',
              isArchived: data.isArchived || false
            });
          });

          setUsers(fetchedUsers.length > 0 ? fetchedUsers : mockUsers);
          setQrCodes(fetchedQRs.length > 0 ? fetchedQRs : mockQRs);
          setTotalScans(sumScans > 0 ? sumScans : 441);
        } catch (err) {
          console.warn("Could not load admin stats from Firestore, falling back to mock data", err);
          setUsers(mockUsers);
          setQrCodes(mockQRs);
          setTotalScans(441);
        }
      } else {
        setUsers(mockUsers);
        setQrCodes(mockQRs);
        setTotalScans(441);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      if (isFirebaseConfigured && db) {
        await deleteDoc(doc(db, 'users', userId));
      }
      setUsers(users.filter(u => u.id !== userId));
      showSuccess(language === 'ar' ? 'تم حذف المستخدم بنجاح' : 'User deleted successfully');
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchiveQR = async (qrId: string) => {
    try {
      if (isFirebaseConfigured && db) {
        await updateDoc(doc(db, 'qrcodes', qrId), { isArchived: true });
      }
      setQrCodes(qrCodes.map(q => q.id === qrId ? { ...q, isArchived: true } : q));
      showSuccess(language === 'ar' ? 'تم أرشفة رمز QR بنجاح' : 'QR code archived successfully');
    } catch (err) {
      console.error(err);
    }
  };

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const isRtl = language === 'ar';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-textDark font-body">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-textDark p-6 sm:p-8 font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 text-white p-3 rounded-2xl shadow-sm">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black">{isRtl ? 'لوحة تحكم المشرف العام' : 'Global Admin Dashboard'}</h1>
              <p className="text-textMuted text-sm font-semibold mt-1">
                {isRtl ? 'إدارة المنصة، مراقبة الاستخدام، والتحكم بالرموز والمستخدمين' : 'Manage platform usage, QR codes, and registered accounts'}
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="secondary" className="gap-2 font-bold">
            <ArrowLeft size={16} className={isRtl ? '' : 'rotate-180'} />
            <span>{isRtl ? 'العودة للوحة التحكم' : 'Back to Dashboard'}</span>
          </Button>
        </div>

        {/* Success message banner */}
        {actionSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 animate-pulse">
            <CheckCircle size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <CardContent className="p-0 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                <Users size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-textMuted block">{isRtl ? 'إجمالي المستخدمين' : 'Total Users'}</span>
                <span className="text-2xl font-black text-textDark">{users.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-500 rounded-xl">
                <QrCode size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-textMuted block">{isRtl ? 'الرموز المنشأة' : 'Generated QRs'}</span>
                <span className="text-2xl font-black text-textDark">{qrCodes.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
                <BarChart3 size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-textMuted block">{isRtl ? 'إجمالي عمليات المسح' : 'Total Scans'}</span>
                <span className="text-2xl font-black text-textDark">{totalScans}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0 flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                <Shield size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-textMuted block">{isRtl ? 'حالة المنصة' : 'Platform Status'}</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                  {isRtl ? 'نشط ومستقر' : 'Active & Stable'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic lists grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* User management list */}
          <Card className="border border-border">
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <CardTitle>{isRtl ? 'إدارة المستخدمين النشطين' : 'Manage Active Users'}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {users.map(u => (
                  <div key={u.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-textDark">{u.name}</div>
                      <div className="text-xs text-textMuted mt-0.5">{u.email}</div>
                      <span className="text-[10px] bg-accent/10 text-accent font-bold px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                        {u.useCase === 'attendance' ? (isRtl ? 'حضور وانصراف' : 'Attendance') :
                         u.useCase === 'restaurant' ? (isRtl ? 'منيو مطعم' : 'Restaurant Menu') :
                         u.useCase === 'portfolio' ? (isRtl ? 'معرض أعمال' : 'Portfolio') :
                         (isRtl ? 'توجيه روابط' : 'Website Redirect')}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl border border-transparent hover:border-red-100 transition-colors"
                      title={isRtl ? 'حذف المستخدم' : 'Delete user'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QR management list */}
          <Card className="border border-border">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle>{isRtl ? 'رموز الـ QR المنشأة على المنصة' : 'Platform QR Codes'}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {qrCodes.map(q => (
                  <div key={q.id} className="p-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-textDark flex items-center gap-2">
                        <span>{q.name}</span>
                        {q.isArchived && (
                          <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-bold">
                            {isRtl ? 'مؤرشف' : 'Archived'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-textMuted font-mono mt-0.5 truncate max-w-xs">{q.content}</div>
                      <div className="text-[10px] text-textMuted mt-1">
                        {isRtl ? 'إجمالي المسحات: ' : 'Total scans: '}
                        <span className="font-bold text-textDark">{q.scansCount}</span>
                      </div>
                    </div>
                    {!q.isArchived && (
                      <button 
                        onClick={() => handleArchiveQR(q.id)}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 text-xs font-bold transition-all"
                      >
                        {isRtl ? 'أرشفة الرمز' : 'Archive'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Global Configuration Controls */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle>{isRtl ? 'إعدادات وخيارات النظام العامة' : 'Global System Operations'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
              <div className="space-y-1">
                <h3 className="font-bold text-amber-700 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>{isRtl ? 'وضع الصيانة والترقية للمنصة' : 'System Maintenance Mode'}</span>
                </h3>
                <p className="text-xs text-amber-600 font-semibold leading-relaxed">
                  {isRtl ? 'تفعيل هذا الوضع يمنع المستخدمين العاديين من إنشاء أو تعديل الرموز مؤقتاً لتمرير التحديثات الكبيرة.' : 'Activating this prevents ordinary users from modifying their settings or creating codes.'}
                </p>
              </div>
              <Button 
                onClick={() => {
                  setMaintenanceMode(!maintenanceMode);
                  showSuccess(
                    !maintenanceMode 
                      ? (isRtl ? 'تم تفعيل وضع الصيانة العام بنجاح' : 'System maintenance activated')
                      : (isRtl ? 'تم إلغاء وضع الصيانة العام بنجاح' : 'System maintenance deactivated')
                  );
                }}
                className={`font-bold shrink-0 ${maintenanceMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-neutral-800 hover:bg-neutral-900 text-white'}`}
              >
                {maintenanceMode 
                  ? (isRtl ? 'إيقاف وضع الصيانة' : 'Deactivate Maintenance')
                  : (isRtl ? 'تفعيل وضع الصيانة' : 'Activate Maintenance')}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
