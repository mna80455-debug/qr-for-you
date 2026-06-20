import { Globe, FileText, MapPin, QrCode, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export const PortfolioDashboard = () => {
  return (
    <div className="space-y-8 text-right font-body">
      <div>
        <h2 className="text-2xl font-bold text-textDark">لوحة تحكم البورتفوليو الشخصي</h2>
        <p className="text-textMuted mt-1">شارك سيرتك الذاتية ومشاريعك وروابطك بمسحة واحدة سريعة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Globe size={18} />} title="إجمالي الزيارات" value="١,٠٢٤ زيارة" />
        <StatsCard icon={<MapPin size={18} />} title="أعلى دولة" value="مصر" />
        <StatsCard icon={<QrCode size={18} />} title="الأكثر مسحاً" value="رابط معرض الأعمال" />
        <StatsCard icon={<FileText size={18} />} title="تحميل السيرة الذاتية" value="٨٩ مرة" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">أحدث التفاعلات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-textMuted/60 text-sm font-semibold py-8 text-center">
                لا توجد نقرات أو مسحات حديثة للروابط بعد.
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-accent text-right">أكواد الروابط النشطة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0">
              <Button className="w-full justify-start gap-2.5 font-bold" variant="secondary" size="md">
                <Globe size={16} /> كود موقع الويب
              </Button>
              <Button className="w-full justify-start gap-2.5 font-bold" variant="secondary" size="md">
                <QrCode size={16} /> كود الملف الشخصي
              </Button>
              <Button className="w-full justify-start gap-2.5 font-bold" variant="secondary" size="md">
                <LinkIcon size={16} /> كود LinkedIn
              </Button>
              <Button className="w-full justify-start gap-2.5 font-bold" variant="secondary" size="md">
                <FileText size={16} /> كود السيرة الذاتية PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <Card className="border border-border">
    <CardContent className="p-5 flex items-center gap-4 text-right">
      <div className="p-3 bg-accent/10 text-accent rounded-xl shadow-sm">{icon}</div>
      <div>
        <p className="text-xs text-textMuted font-bold">{title}</p>
        <p className="text-xl font-black text-textDark mt-0.5">{value}</p>
      </div>
    </CardContent>
  </Card>
);
