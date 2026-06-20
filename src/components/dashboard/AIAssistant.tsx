import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, Send, Bot, User, HelpCircle, 
  Palette, Quote, LineChart, CheckCircle2 
} from 'lucide-react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
  suggestions?: {
    qrType?: string;
    colors?: string[];
    style?: string;
    cta?: string;
  };
}

export const AIAssistant = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: isRtl 
        ? 'مرحباً! أنا مساعدك الذكي لتصميم وتحسين رموز الـ QR. كيف يمكنني مساعدتك اليوم؟ يمكنك اختصار الوقت بالضغط على أحد الأسئلة السريعة بالأسفل.'
        : 'Hello! I am your AI Design & Performance assistant. How can I help you today? You can select a quick action below to get started.',
    }
  ]);

  const [kpisInput, setKpisInput] = useState({ clicks: 120, bounce: 40 });
  const [performanceReport, setPerformanceReport] = useState<string | null>(null);

  // Custom quick prompts triggers
  const handleQuickAction = (actionType: 'recommend' | 'design' | 'cta' | 'industry') => {
    let userText = '';
    let aiResponse: ChatMessage = { sender: 'ai', text: '' };

    if (actionType === 'recommend') {
      userText = isRtl ? 'اقترح لي نوع كود QR مناسب لمشروعي' : 'Recommend the best QR type for my project';
      aiResponse = {
        sender: 'ai',
        text: isRtl 
          ? 'لتحديد النوع المناسب، أنصح بـ **الكود الديناميكي (Dynamic QR)** إن كنت ترغب في تحديث الرابط لاحقاً دون إعادة طباعة الكود وتتبع عدد المسحات. للمواقع الإلكترونية استخدم نوع **URL**، ولبيانات الاتصال استخدم **vCard**، ولمشاركة الملفات الكبيرة استخدم **PDF Uploader**.'
          : 'To choose the best configuration: Use **Dynamic QR** if you plan to update the destination URL later or need scan analytics. Choose **URL type** for websites, **vCard** for contact information sharing, and **PDF Uploader** for menu or booklet downloads.',
        suggestions: {
          qrType: 'Dynamic URL / PDF',
          cta: 'SCAN ME'
        }
      };
    } else if (actionType === 'design') {
      userText = isRtl ? 'اقترح ألوان وتنسيقات جذابة للكود' : 'Suggest color palettes and visual styling';
      aiResponse = {
        sender: 'ai',
        text: isRtl 
          ? 'أنصحك باستخدام تباين لوني عالٍ (على الأقل 70% فرق تباين). إليك لوحة ألوان مقترحة لعلامتك التجارية مع أنماط الأعين والنقاط الدائرية لضمان سرعة مسح فائقة.'
          : 'I recommend using a contrast ratio of at least 70%. Here is a professional styling recommendation to elevate visual appeal while maximizing scan viability.',
        suggestions: {
          colors: ['#6366F1', '#EC4899', '#FFFFFF'],
          style: 'Rounded dots + Smooth Modern eyes'
        }
      };
    } else if (actionType === 'cta') {
      userText = isRtl ? 'ولد لي نصوص تسويقية جذابة (CTA)' : 'Generate engaging Call-To-Actions (CTA)';
      aiResponse = {
        sender: 'ai',
        text: isRtl
          ? 'إليك قائمة بنصوص الحث على اتخاذ إجراء (CTA) المخصصة حسب هدف الحملة:'
          : 'Here are context-specific CTA recommendations generated for your campaign:',
        options: isRtl 
          ? ['امسح للمشاهدة 🎥', 'تصفح قائمة الطعام 🍔', 'احصل على تذكرتك 🎟️', 'حمّل التطبيق الآن 📱']
          : ['Scan to Watch 🎥', 'View Menu 🍔', 'Get Your Ticket 🎟️', 'Download App 📱']
      };
    } else {
      userText = isRtl ? 'توصيات التنسيق حسب نوع النشاط' : 'Show industry-based recommendations';
      aiResponse = {
        sender: 'ai',
        text: isRtl
          ? 'تنسيق الأكواد الموصى به حسب مجال عملك:\n\n* **المطاعم:** ألوان دافئة (أحمر/برتقالي) + نقاط دائرية (Classy) + إطار فقاعة علوية.\n* **التعليم:** أزرق كحلي/أخضر + نقاط مربعة كلاسيكية + بدون شعار لزيادة الحجم.\n* **معارض الأعمال:** تدرج وردي وبنفسجي + أعين Leaf دائرية + إطار كارت تعريفي شخصي.'
          : 'Recommended styling defaults classified by industry:\n\n* **Restaurant:** Warm palettes (Amber/Crimson) + Classy rounded dots + top speech bubble frames.\n* **Education:** Navy blue/Green + square patterns + high error correction.\n* **Portfolio:** Indigo-Pink gradient + Leaf corner eyes + Business Card style frame.'
      };
    }

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userText },
      aiResponse
    ]);
  };

  // Chat message submit handler
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      let replyText = isRtl
        ? 'بناءً على طلبك، أقترح تفعيل ميزة التوجيه الديناميكي لسهولة الإدارة ومراقبة التحليلات. تأكد دائماً من وجود مسافة أمان حول الشعار بمعدل 6 بكسل لتفادي مشاكل القراءة.'
        : 'Based on your query, I suggest enabling dynamic link parameters. Always verify a 6px buffer border exists around uploaded logos to secure high scan tolerance.';
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('menu') || lower.includes('مطعم') || lower.includes('طعام')) {
        replyText = isRtl 
          ? 'لمنيو المطاعم، استخدم تدرج اللون البرتقالي والأصفر. أضف شعار المطعم بالمنتصف بحجم 18% مع زر CTA: تصفح المنيو.'
          : 'For restaurants: Use orange/amber gradients. Place restaurant logo in center at 18% size with CTA: VIEW MENU.';
      } else if (lower.includes('color') || lower.includes('ألوان') || lower.includes('لون')) {
        replyText = isRtl
          ? 'أنصح باستخدام خلفية بيضاء نقية مع كود بلون داكن (مثل الكحلي أو البنفسجي) وتجنب الألوان الفاتحة كالليموني أو الأصفر على خلفية بيضاء.'
          : 'Avoid light colors like yellow on white backgrounds. Use deep indigo, charcoal, or dark green to maintain safe contrast ratios.';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    }, 800);
  };

  // Perform mock AI diagnostic analysis
  const runDiagnostics = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Math.round((kpisInput.clicks / 150) * 100);
    const diagnosis = isRtl 
      ? `تحليل الأداء الذكي 📊:\n\n* **معدل الارتداد:** ${kpisInput.bounce}٪ (مرتفع نسبياً، قد يعني أن صفحة الوجهة ليست متوافقة مع الجوال).\n* **معدل إتمام التحويل:** ${rate}٪.\n* **التوصية:** قم بتبسيط تصميم الكود وتكبير نصوص CTA بمقدار 2px لزيادة معدل المسح بنسبة 18٪ في ساعات الذروة.`
      : `AI Scan Performance Diagnosis 📊:\n\n* **Bounce Rate:** ${kpisInput.bounce}% (high, check if landing page is mobile responsive).\n* **Conversion Success:** ${rate}%.\n* **AI Advice:** Boost CTA font size by 2px and test with Leaf eyes to increase scan rate by 18% during peak hours.`;
    
    setPerformanceReport(diagnosis);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. Left Column: Chat Assistant Interface (Col Span 7) */}
      <div className="lg:col-span-7 space-y-6 flex flex-col h-[600px]">
        
        <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
            <CardTitle className="text-base font-black flex items-center gap-2 dark:text-white">
              <Bot className="text-accent" size={20} />
              <span>{isRtl ? 'المستشار الذكي للمنصة' : 'Integrated AI Assistant'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 flex-1 overflow-y-auto space-y-4 flex flex-col justify-end">
            <div className="space-y-4 overflow-y-auto max-h-[380px] pr-2">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${
                    m.sender === 'user' 
                      ? 'mr-auto flex-row-reverse text-left' 
                      : 'ml-auto text-right'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    m.sender === 'user' ? 'bg-accent text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-accent'
                  }`}>
                    {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-semibold ${
                      m.sender === 'user' 
                        ? 'bg-accent text-white rounded-tl-none' 
                        : 'bg-neutral-50 dark:bg-neutral-850 dark:text-gray-300 rounded-tr-none border border-border dark:border-gray-800'
                    }`}>
                      {m.text}
                    </div>

                    {m.options && (
                      <div className="flex flex-wrap gap-2 pt-1.5 justify-end">
                        {m.options.map((opt, i) => (
                          <button 
                            key={i} 
                            onClick={() => setInput(opt)}
                            className="bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-accent text-[10px] font-bold py-1.5 px-3 rounded-lg border border-border dark:border-gray-750"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {m.suggestions && (
                      <div className="bg-neutral-50/50 dark:bg-neutral-800/25 p-3 rounded-xl border border-border dark:border-gray-800 text-[10px] space-y-1 text-right">
                        {m.suggestions.qrType && <div>🚀 <strong>{isRtl ? 'النوع المقترح:' : 'Suggested Type:'}</strong> {m.suggestions.qrType}</div>}
                        {m.suggestions.colors && <div>🎨 <strong>{isRtl ? 'لوحة الألوان:' : 'Color stops:'}</strong> {m.suggestions.colors.join(', ')}</div>}
                        {m.suggestions.style && <div>⚙️ <strong>{isRtl ? 'نمط النقاط:' : 'Dots style:'}</strong> {m.suggestions.style}</div>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Chat entry form */}
          <div className="p-4 border-t border-border dark:border-gray-800 bg-neutral-50/50 dark:bg-neutral-900">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder={isRtl ? 'اسأل المساعد الذكي عن تنسيقات الأكواد...' : 'Ask AI about palettes, scannability check...'} 
                className="flex-1 text-xs"
              />
              <Button type="submit" size="sm" className="px-3">
                <Send size={14} />
              </Button>
            </form>
          </div>
        </Card>

      </div>

      {/* 2. Right Column: Quick Tools & Diagnostics (Col Span 5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Quick prompt templates */}
        <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
          <CardHeader className="border-b border-border dark:border-gray-800 pb-3">
            <CardTitle className="text-sm font-black flex items-center gap-1.5 dark:text-white">
              <Sparkles size={16} className="text-accent" />
              <span>{isRtl ? 'إجراءات سريعة بمساعدة الذكاء الاصطناعي' : 'Quick AI Assistants'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <button 
              onClick={() => handleQuickAction('recommend')} 
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border dark:border-gray-850 hover:border-accent bg-neutral-50/50 dark:bg-neutral-850 text-right text-xs font-bold transition-all"
            >
              <HelpCircle className="text-accent" size={16} />
              <span>{isRtl ? 'تحديد النوع الأفضل لمشروعي' : 'Recommend QR Destination Type'}</span>
            </button>
            
            <button 
              onClick={() => handleQuickAction('design')} 
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border dark:border-gray-850 hover:border-accent bg-neutral-50/50 dark:bg-neutral-850 text-right text-xs font-bold transition-all"
            >
              <Palette className="text-accent" size={16} />
              <span>{isRtl ? 'توليد لوحة ألوان وأنماط مطابقة' : 'Generate Matching Design Palette'}</span>
            </button>
            
            <button 
              onClick={() => handleQuickAction('cta')} 
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border dark:border-gray-850 hover:border-accent bg-neutral-50/50 dark:bg-neutral-850 text-right text-xs font-bold transition-all"
            >
              <Quote className="text-accent" size={16} />
              <span>{isRtl ? 'كتابة نصوص CTA دعائية جذابة' : 'Generate Promotional CTA copy'}</span>
            </button>

            <button 
              onClick={() => handleQuickAction('industry')} 
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border dark:border-gray-850 hover:border-accent bg-neutral-50/50 dark:bg-neutral-850 text-right text-xs font-bold transition-all"
            >
              <Sparkles className="text-accent" size={16} />
              <span>{isRtl ? 'التوصية بالتنسيق طبقاً لنشاط عملي' : 'Match Style by Industry Defaults'}</span>
            </button>
          </CardContent>
        </Card>

        {/* AI Performance diagnosis inputs */}
        <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
          <CardHeader className="border-b border-border dark:border-gray-800 pb-3">
            <CardTitle className="text-sm font-black flex items-center gap-1.5 dark:text-white">
              <LineChart size={16} className="text-accent" />
              <span>{isRtl ? 'محلل الأداء التنبؤي للأكواد' : 'Predictive Performance Analyzer'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={runDiagnostics} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-textMuted dark:text-gray-400 block">{isRtl ? 'عدد النقرات الكلي' : 'Total Clicks'}</label>
                  <Input 
                    type="number" 
                    value={kpisInput.clicks} 
                    onChange={e => setKpisInput({ ...kpisInput, clicks: Number(e.target.value) })}
                    className="text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-textMuted dark:text-gray-400 block">{isRtl ? 'معدل الارتداد (٪)' : 'Bounce Rate (%)'}</label>
                  <Input 
                    type="number" 
                    value={kpisInput.bounce} 
                    onChange={e => setKpisInput({ ...kpisInput, bounce: Number(e.target.value) })}
                    className="text-xs h-9"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full text-xs font-bold py-2 shadow-sm">
                {isRtl ? 'تشغيل التحليل التنبؤي' : 'Run Diagnostics & Predict'}
              </Button>
            </form>

            {performanceReport && (
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl text-xs font-bold leading-relaxed space-y-2">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>{isRtl ? 'تم إعداد التوصيات الأوتوماتيكية' : 'Auto Recommendations Ready'}</span>
                </div>
                <p className="whitespace-pre-line font-semibold">{performanceReport}</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
};
