import { useState, useEffect } from 'react';
import { QrCode, Plus, Check, Users, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';

interface Guest {
  id?: string;
  name: string;
  email: string;
  checkedIn: boolean;
  time?: string;
}

export const EventDashboard = () => {
  const { user } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch guests from Firestore
  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    const fetchGuests = async () => {
      try {
        const q = query(collection(db, 'event_guests'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedGuests: Guest[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedGuests.push({
            id: docSnap.id,
            name: data.name,
            email: data.email,
            checkedIn: data.checkedIn || false,
            time: data.time
          });
        });
        setGuests(fetchedGuests);
      } catch (err) {
        console.error("Error loading guests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [user]);

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newName || !newEmail || !user || !db) return;

    if (guests.some(g => g.email.toLowerCase() === newEmail.toLowerCase())) {
      setError('هذا الضيف مسجل بالفعل في الفعالية.');
      return;
    }

    const newGuest: Omit<Guest, 'id'> = { name: newName, email: newEmail, checkedIn: false };

    try {
      // Save to Firestore first to get the ID
      const docRef = await addDoc(collection(db, 'event_guests'), {
        ...newGuest,
        userId: user.uid,
        createdAt: new Date()
      });

      // Update state
      setGuests([...guests, { id: docRef.id, ...newGuest }]);
      setNewName('');
      setNewEmail('');
    } catch (err) {
      console.error("Error saving guest:", err);
      setError('حدث خطأ أثناء إضافة الضيف.');
    }
  };

  const toggleCheckIn = async (guestId: string | undefined, currentCheckedIn: boolean) => {
    if (!guestId || !user || !db) return;

    const newCheckedState = !currentCheckedIn;
    const now = new Date();
    const timeString = newCheckedState 
      ? now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) 
      : undefined;

    try {
      // Optimistic update
      setGuests(guests.map(g => {
        if (g.id === guestId) {
          return { ...g, checkedIn: newCheckedState, time: timeString };
        }
        return g;
      }));

      // Update Firestore document
      const docRef = doc(db, 'event_guests', guestId);
      await updateDoc(docRef, {
        checkedIn: newCheckedState,
        time: timeString || null
      });
    } catch (err) {
      console.error("Error updating check-in status:", err);
    }
  };

  const checkedInCount = guests.filter(g => g.checkedIn).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right font-body">
      <div>
        <h2 className="text-2xl font-bold text-textDark dark:text-white">إدارة بطاقات وتذاكر الفعاليات</h2>
        <p className="text-textMuted dark:text-gray-400 mt-1">تتبع تسجيل حضور المدعوين في الحفل وتوليد تذاكر الدخول الإلكترونية.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Guest list checklist */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="flex flex-row justify-between items-center border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="dark:text-white">قائمة المدعوين ({checkedInCount} / {guests.length} حاضر)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border dark:divide-gray-800">
                {guests.map((g, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <div className="text-right">
                      <div className="text-sm font-bold text-textDark dark:text-white flex items-center gap-2">
                        <span>{g.name}</span>
                        {g.checkedIn && <span className="text-[10px] bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full font-bold">تم الدخول</span>}
                      </div>
                      <div className="text-xs text-textMuted dark:text-gray-400">{g.email}</div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {g.time && <span className="text-xs text-textMuted dark:text-gray-400 font-semibold">{g.time}</span>}
                      <button
                        onClick={() => toggleCheckIn(g.id, g.checkedIn)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                          g.checkedIn 
                            ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50' 
                            : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50'
                        }`}
                      >
                        {g.checkedIn ? 'إلغاء الحضور' : 'تسجيل دخول'}
                      </button>
                    </div>
                  </div>
                ))}

                {guests.length === 0 && (
                  <div className="text-textMuted dark:text-gray-400 text-center py-12 text-sm font-semibold">
                    لا يوجد مدعوون مضافون في قائمتك بعد. أضف مدعواً جديداً لبدء تتبع الحضور!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add guest / Simulate Ticket Scan form */}
        <div className="space-y-6">
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Plus size={18} className="text-accent" />
                <span>دعوة ضيف جديد</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={addGuest} className="space-y-4">
                {error && (
                  <div className="text-red-600 text-xs bg-red-50 border border-red-100 p-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                    <ShieldAlert size={14} />
                    <span>{error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">اسم المدعو</label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="عبدالرحمن عمر" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">البريد الإلكتروني</label>
                  <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="guest@example.com" required />
                </div>
                <Button type="submit" className="w-full font-bold mt-2 gap-1.5">
                  <Check size={16} /> إضافة لقائمة الدعوات
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5 dark:bg-accent/5">
            <CardHeader>
              <CardTitle className="text-accent text-right">أدوات الفعالية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0">
              <Button className="w-full justify-start gap-2.5 font-bold" variant="secondary" size="md">
                <QrCode size={16} /> تذكرة دخول QR ذكية
              </Button>
              <Button className="w-full justify-start gap-2.5 font-bold" variant="secondary" size="md">
                <Users size={16} /> تصدير بطاقات الدعوة
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
