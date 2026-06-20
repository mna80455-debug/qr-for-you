import { useState, useEffect } from 'react';
import { Utensils, QrCode, Plus, Check, Star, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

interface MenuItem {
  name: string;
  price: string;
  desc: string;
}

interface Feedback {
  customer: string;
  rating: number;
  comment: string;
}

export const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Fetch menu items and feedback from Firestore
  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    const fetchMenuData = async () => {
      try {
        const menuQuery = query(collection(db, 'restaurant_menus'), where('userId', '==', user.uid));
        const menuSnap = await getDocs(menuQuery);
        const fetchedItems: MenuItem[] = [];
        menuSnap.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedItems.push({
            name: data.name,
            price: data.price,
            desc: data.desc
          });
        });
        setItems(fetchedItems);

        // Fetch feedback (can be mock or real from db)
        const feedbackQuery = query(collection(db, 'restaurant_feedback'), where('userId', '==', user.uid));
        const feedbackSnap = await getDocs(feedbackQuery);
        const fetchedFeedback: Feedback[] = [];
        feedbackSnap.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedFeedback.push({
            customer: data.customer,
            rating: data.rating,
            comment: data.comment
          });
        });

        // Default mock feedback if none exists in db yet, to give feedback context
        if (fetchedFeedback.length === 0) {
          setFeedbacks([
            { customer: 'محمود ع.', rating: 5, comment: 'الأكل رائع جداً والخدمة سريعة!' },
            { customer: 'نهى أ.', rating: 4, comment: 'تجربة ممتازة، البرجر لذيذ للغاية.' },
          ]);
        } else {
          setFeedbacks(fetchedFeedback);
        }
      } catch (err) {
        console.error("Error fetching restaurant menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [user]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice || !user || !db) return;

    const newItem = { name: newName, price: newPrice, desc: newDesc };

    try {
      // Optimistic state update
      setItems([...items, newItem]);
      
      // Reset inputs
      setNewName('');
      setNewPrice('');
      setNewDesc('');

      // Save to Firestore
      await addDoc(collection(db, 'restaurant_menus'), {
        ...newItem,
        userId: user.uid,
        createdAt: new Date()
      });
    } catch (err) {
      console.error("Error saving menu item:", err);
    }
  };

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
        <h2 className="text-2xl font-bold text-textDark dark:text-white">إدارة قائمة الطعام والطلبات</h2>
        <p className="text-textMuted dark:text-gray-400 mt-1">أنشئ منيو تفاعلي لزبائنك وراقب آراءهم وتعليقاتهم الفورية.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Menu Items List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="dark:text-white">قائمة الأطباق والمشروبات المعروضة ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border dark:divide-gray-800">
                {items.map((item, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-start gap-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-textDark dark:text-white">{item.name}</div>
                      <div className="text-xs text-textMuted dark:text-gray-400 leading-relaxed">{item.desc}</div>
                    </div>
                    <span className="text-xs font-black text-accent bg-accent/10 px-3 py-1.5 rounded-xl shrink-0">
                      {item.price}
                    </span>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-textMuted dark:text-gray-400 text-center py-12 text-sm font-semibold">
                    لا توجد أطباق مضافة في المنيو الخاص بك بعد. أضف طبقك الأول الآن للبدء!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Feedback section */}
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4 flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <MessageSquare size={18} className="text-accent" />
                <span>تقييمات وآراء العملاء</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {feedbacks.map((f, idx) => (
                <div key={idx} className="bg-neutral-50 dark:bg-neutral-800/50 border border-border dark:border-gray-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-textDark dark:text-white">{f.customer}</span>
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: f.rating }).map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-textMuted dark:text-gray-400 leading-relaxed font-semibold">{f.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Add Menu Item form */}
        <div className="space-y-6">
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Plus size={18} className="text-accent" />
                <span>إضافة طبق جديد للمنيو</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={addItem} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">اسم الطبق / المشروب</label>
                  <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="بيتزا بيبروني" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">السعر</label>
                  <Input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="١٤٠ ج.م" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">الوصف</label>
                  <textarea 
                    value={newDesc} 
                    onChange={e => setNewDesc(e.target.value)} 
                    placeholder="مكونات الطبق وتفاصيله السريعة..."
                    className="w-full min-h-[80px] border border-border dark:border-gray-800 dark:bg-neutral-800 rounded-xl p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-white"
                  />
                </div>
                <Button type="submit" className="w-full font-bold mt-2 gap-1.5">
                  <Check size={16} /> إضافة الطبق الآن
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5 dark:bg-accent/5">
            <CardHeader>
              <CardTitle className="text-accent">روابط المنيو السريع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0">
              <Button className="w-full justify-start gap-2.5 font-bold" variant="secondary" size="md">
                <QrCode size={16} /> كود طاولة مطعم (منيو رقمي)
              </Button>
              <Button className="w-full justify-start gap-2.5 font-bold" variant="secondary" size="md">
                <Utensils size={16} /> كود استلام الفاتورة
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
