import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, TrendingUp, AlertCircle, Award, Target, HelpCircle, Eye } from 'lucide-react';

interface InsightMessage {
  type: 'success' | 'warning' | 'info';
  title: string;
  desc: string;
}

export const SmartInsights = () => {
  const { language } = useLanguage();

  const [insights] = useState<InsightMessage[]>([
    {
      type: 'success',
      title: language === 'ar' ? 'نمو مسح منيو المطعم 📈' : 'Restaurant Menu Scan Surge! 📈',
      desc: language === 'ar' 
        ? 'حصل كود منيو المشروبات الخاص بك على زيادة في الزيارات بنسبة ٣٥٪ هذا الأسبوع مقارنة بالأسبوع الماضي، وتتركز أغلب المسحات بين الساعة ٧م و ٩م.' 
        : 'Your Drinks Menu QR code got a 35% bump in scans this week. Most activity occurs daily between 7 PM and 9 PM.'
    },
    {
      type: 'warning',
      title: language === 'ar' ? 'تنبيه التباين لرمز حضور محاضرة شبكات ⚠️' : 'Low Contrast Alert: Lecture Attendance QR ⚠️',
      desc: language === 'ar' 
        ? 'الرمز يعاني من تباين ألوان منخفض (٦٨/١٠٠). ننصح بتعديل لون الكود للأسود أو الكحلي لرفع كفاءة استجابة كاميرات الهواتف الذكية بنسبة ٢٥٪.' 
        : 'This QR has a contrast score of 68/100. Recommended to adjust dots to black or deep indigo to boost scanning speed by 25%.'
    },
    {
      type: 'info',
      title: language === 'ar' ? 'فرصة تفاعل عبر الجوال 📱' : 'Mobile User Interaction Opportunity 📱',
      desc: language === 'ar' 
        ? 'نسبة ٨٥٪ من ماسحي أكوادك يستخدمون هواتف iPhone. تأكد من أن الروابط النهائية متجاوبة تماماً مع شاشات الهواتف الجوالة لتفادي فقدان الزوار.' 
        : '85% of your code scanners use iOS. Ensure target websites are highly optimized for mobile devices to prevent drop-offs.'
    }
  ]);

  const isRtl = language === 'ar';

  return (
    <div className="space-y-8 text-right font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-textDark dark:text-white flex items-center gap-2">
          <Sparkles className="text-accent" size={24} />
          <span>{isRtl ? 'محرك النصائح والاقتراحات الذكية' : 'Smart Insights Engine'}</span>
        </h2>
        <p className="text-textMuted dark:text-gray-400 mt-1">
          {isRtl ? 'تحليل مسحات الرموز لتقديم إحصائيات متقدمة وتوصيات لزيادة نسب التفاعل.' : 'Automated scannability diagnostics, engagement tracking, and optimization recommendations.'}
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
          <CardContent className="p-0 flex items-center gap-4 text-right">
            <div className="p-3 bg-green-50 text-green-500 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs text-textMuted dark:text-gray-400 font-bold">{isRtl ? 'معدل نمو المنصة الأسبوعي' : 'Weekly Scan Growth'}</p>
              <p className="text-xl font-black text-textDark dark:text-white mt-0.5">+٢٨.٤%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
          <CardContent className="p-0 flex items-center gap-4 text-right">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs text-textMuted dark:text-gray-400 font-bold">{isRtl ? 'الحملة الأكثر كفاءة' : 'Best Performing Campaign'}</p>
              <p className="text-sm font-black text-textDark dark:text-white mt-1">منيو المشروبات (١٤٢ مسحة)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
          <CardContent className="p-0 flex items-center gap-4 text-right">
            <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
              <Target size={20} />
            </div>
            <div>
              <p className="text-xs text-textMuted dark:text-gray-400 font-bold">{isRtl ? 'متوسط درجة جاهزية المسح' : 'Average Scannability Score'}</p>
              <p className="text-xl font-black text-green-650 mt-0.5">٩٢ / ١٠٠</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Advisory cards list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-textMuted dark:text-gray-400 uppercase tracking-wider mb-2">{isRtl ? 'التوصيات الحالية وملاحظات الترقية' : 'Actionable Recommendations'}</h3>
          
          {insights.map((ins, idx) => (
            <Card key={idx} className={`border p-6 rounded-2xl ${
              ins.type === 'success' ? 'border-green-200 bg-green-50/20 dark:bg-green-950/10' :
              ins.type === 'warning' ? 'border-amber-200 bg-amber-50/20 dark:bg-amber-950/10' :
              'border-blue-200 bg-blue-50/20 dark:bg-blue-950/10'
            }`}>
              <div className="flex gap-4 items-start text-right">
                {ins.type === 'success' && <TrendingUp className="text-green-600 shrink-0 mt-1" size={20} />}
                {ins.type === 'warning' && <AlertCircle className="text-amber-600 shrink-0 mt-1" size={20} />}
                {ins.type === 'info' && <Eye className="text-blue-600 shrink-0 mt-1" size={20} />}
                
                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm text-textDark dark:text-white">{ins.title}</h4>
                  <p className="text-xs text-textMuted dark:text-gray-400 leading-relaxed font-semibold">{ins.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Diagnostic scannability helper sidebar */}
        <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
          <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
            <CardTitle className="flex items-center gap-1.5 dark:text-white">
              <HelpCircle size={16} className="text-accent" />
              <span>{isRtl ? 'دليل كفاءة رموز الـ QR' : 'Scannability Best Practices'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs font-bold leading-relaxed text-textMuted dark:text-gray-400 text-right">
            <div className="space-y-1">
              <span className="text-textDark dark:text-white font-bold block">1. {isRtl ? 'التباين المرتفع' : 'High Color Contrast'}</span>
              <p className="font-semibold text-[11px] leading-relaxed">{isRtl ? 'احرص على ألا تقل درجة التباين بين لون الكود والخلفية عن ٧٠ درجة لتسهيل قراءته بالكاميرات الضعيفة.' : 'Keep contrast score above 70 to ensure scanners read easily.'}</p>
            </div>
            
            <div className="space-y-1 border-t border-border dark:border-gray-800 pt-4">
              <span className="text-textDark dark:text-white font-bold block">2. {isRtl ? 'حجم الشعار المناسب' : 'Ideal Logo Sizes'}</span>
              <p className="font-semibold text-[11px] leading-relaxed">{isRtl ? 'لا ترفع حجم الشعار المدمج عن ٢٠٪ من المساحة الكلية للـ QR، وتأكد من تفعيل جدار حماية الشعار بالاستوديو.' : 'Do not exceed 20% width size ratio for center logo overlays.'}</p>
            </div>
            
            <div className="space-y-1 border-t border-border dark:border-gray-800 pt-4">
              <span className="text-textDark dark:text-white font-bold block">3. {isRtl ? 'عزل الكود بهامش كافٍ' : 'Silent Zone Borders'}</span>
              <p className="font-semibold text-[11px] leading-relaxed">{isRtl ? 'اترك هامشاً فارغاً (Quiet Zone) حول الرمز لضمان عدم اختلاطه بالخلفيات المطبوعة من حوله.' : 'Provide a margin buffer around the QR code boundary.'}</p>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
};
