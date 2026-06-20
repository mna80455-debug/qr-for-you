import { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const SmartSuggestion = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-accent/5 border border-accent/20 p-6 flex items-start gap-4 mb-8 text-right font-body">
      <div className="p-3 bg-accent/10 text-accent rounded-2xl shrink-0 shadow-sm">
        <Lightbulb size={22} className="stroke-[2.5]" />
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="text-base font-extrabold text-textDark flex items-center gap-2">
          اقتراح ذكي من المنصة 🚀
        </h3>
        <p className="text-textMuted text-sm font-semibold">
          نلاحظ أنك تشارك العديد من روابط السيرة الذاتية ومعارض الأعمال — نقترح إضافة وسوم تتبع (UTM) لتتمكن من معرفة مصادر الزيارات والشركات التي قامت بالمسح.
        </p>
        <div className="mt-4 flex gap-3 justify-start">
          <Button size="sm" onClick={() => setVisible(false)} className="font-bold">تجربة الآن</Button>
          <Button size="sm" variant="ghost" onClick={() => setVisible(false)} className="font-bold">ليس الآن</Button>
        </div>
      </div>
      <button 
        onClick={() => setVisible(false)}
        className="absolute top-4 left-4 text-textMuted hover:text-textDark transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};
