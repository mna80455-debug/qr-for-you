import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { db, storage, isFirebaseConfigured } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { 
  Globe, AlignLeft, FileText, Image as ImageIcon, Mail, 
  Phone, MessageSquare, Wifi, MapPin, Contact2, Share2, 
  Calendar, Users, Sparkles, Upload, Check, Trash 
} from 'lucide-react';

type QRType = 
  | 'url' | 'text' | 'pdf' | 'image' | 'email' | 'phone' 
  | 'sms' | 'wifi' | 'location' | 'vcard' | 'social' 
  | 'event' | 'attendance';

export const QRGenerator = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [qrName, setQrName] = useState('كود QR جديد');
  const [type, setType] = useState<QRType>('url');
  const [mode, setMode] = useState<'static' | 'dynamic'>('dynamic');
  
  // Customization
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [logo, setLogo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [qrId, setQrId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // QR Fields State
  const [urlField, setUrlField] = useState('https://example.com');
  const [textField, setTextField] = useState('مرحباً بك في عالم الـ QR');
  const [wifiSsid, setWifiSsid] = useState('My-Network');
  const [wifiPass, setWifiPass] = useState('secret123');
  const [wifiSec, setWifiSec] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [smsPhone, setSmsPhone] = useState('+201234567890');
  const [smsMsg, setSmsMsg] = useState('مرحباً، أود الاستفسار عن...');
  const [emailTo, setEmailTo] = useState('info@example.com');
  const [emailSub, setEmailSub] = useState('استفسار عام');
  const [emailBody, setEmailBody] = useState('مرحباً، أريد معرفة المزيد...');
  const [phoneField, setPhoneField] = useState('+201234567890');
  const [locLat, setLocLat] = useState('30.0444');
  const [locLng, setLocLng] = useState('31.2357');
  const [vFirstName, setVFirstName] = useState('');
  const [vLastName, setVLastName] = useState('');
  const [vOrg, setVOrg] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [socPlatform, setSocPlatform] = useState('github');
  const [socUser, setSocUser] = useState('my-profile');
  const [evName, setEvName] = useState('حفل التخرج');
  const [evLoc, setEvLoc] = useState('قاعة المؤتمرات');

  const qrRef = useRef<HTMLDivElement>(null);

  // Handle PDF & Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Direct preview local read
    const reader = new FileReader();
    reader.onload = () => {
      // In dynamic mode, we store file URL, locally we show it as text
      setUrlField(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (isFirebaseConfigured && storage && user) {
      setUploading(true);
      try {
        const fileRef = ref(storage, `qrs/${user.uid}/${Date.now()}_${file.name}`);
        const snap = await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(snap.ref);
        setUrlField(downloadUrl);
      } catch (err) {
        console.error("Storage upload failed, using mock path:", err);
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Construct standard QR code payload strings (for static mode)
  const getQRContent = () => {
    switch (type) {
      case 'url':
      case 'pdf':
      case 'image':
        return urlField;
      case 'text':
        return textField;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiSec};P:${wifiPass};;`;
      case 'sms':
        return `SMSTO:${smsPhone}:${smsMsg}`;
      case 'email':
        return `MATMSG:TO:${emailTo};SUB:${emailSub};BODY:${emailBody};;`;
      case 'phone':
        return `TEL:${phoneField}`;
      case 'location':
        return `geo:${locLat},${locLng}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName}\nORG:${vOrg}\nTEL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
      case 'social':
        return socPlatform === 'github' 
          ? `https://github.com/${socUser}`
          : `https://linkedin.com/in/${socUser}`;
      case 'event':
        return `EVENT:Name=${evName};Location=${evLoc}`;
      case 'attendance':
        return `ATTENDANCE:SessionId=${Date.now()}`;
      default:
        return 'https://qrify.app';
    }
  };

  // Save QR to Firestore (Dynamic Mode)
  const saveQRCode = async () => {
    if (!user) return;
    setSaveSuccess(false);
    try {
      let finalContent = getQRContent();
      let docId = '';

      if (mode === 'dynamic' && isFirebaseConfigured && db) {
        // Create dynamic short mapping first
        const docRef = await addDoc(collection(db, 'qrcodes'), {
          userId: user.uid,
          name: qrName,
          type,
          mode: 'dynamic',
          content: finalContent,
          fgColor,
          bgColor,
          logoUrl: logo,
          scansCount: 0,
          isArchived: false,
          isFavorite: false,
          createdAt: new Date()
        });
        docId = docRef.id;
        setQrId(docId);
      } else {
        // Demo mode fallback / Static QR code mock
        docId = 'demo_' + Math.random().toString(36).substring(7);
        setQrId(docId);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Firestore save failed:", err);
    }
  };

  // Download Formats
  const downloadPNG = async () => {
    if (!qrRef.current) return;
    const canvas = await html2canvas(qrRef.current, { backgroundColor: null });
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${qrName}.png`;
    a.click();
  };

  const downloadSVG = () => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${qrName}.svg`;
    a.click();
  };

  const downloadPDF = async () => {
    if (!qrRef.current) return;
    const canvas = await html2canvas(qrRef.current, { backgroundColor: null });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFontSize(22);
    pdf.text(qrName, 105, 40, { align: 'center' });
    pdf.addImage(imgData, 'PNG', 55, 60, 100, 100);
    pdf.save(`${qrName}.pdf`);
  };

  const getEncodedValue = () => {
    if (mode === 'dynamic' && qrId) {
      return `${window.location.origin}/qr/${qrId}`;
    }
    return getQRContent();
  };

  const qrTypesList: { id: QRType; label: string; icon: any }[] = [
    { id: 'url', label: 'رابط ويب', icon: Globe },
    { id: 'text', label: 'نص عادي', icon: AlignLeft },
    { id: 'pdf', label: 'ملف PDF', icon: FileText },
    { id: 'image', label: 'صورة', icon: ImageIcon },
    { id: 'email', label: 'بريد إلكتروني', icon: Mail },
    { id: 'phone', label: 'رقم هاتف', icon: Phone },
    { id: 'sms', label: 'رسالة قصيرة', icon: MessageSquare },
    { id: 'wifi', label: 'شبكة WiFi', icon: Wifi },
    { id: 'location', label: 'موقع جغرافي', icon: MapPin },
    { id: 'vcard', label: 'بطاقة جهة اتصال', icon: Contact2 },
    { id: 'social', label: 'وسائل التواصل', icon: Share2 },
    { id: 'event', label: 'فعاليات', icon: Calendar },
    { id: 'attendance', label: 'تسجيل الحضور', icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-body">
      
      {/* Types and Inputs sidebar */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Step 1: QR Type Selection */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle>{language === 'ar' ? 'اختر نوع رمز الـ QR' : 'Select QR Type'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {qrTypesList.map((qt) => {
                const Icon = qt.icon;
                const isSelected = type === qt.id;
                return (
                  <button
                    key={qt.id}
                    onClick={() => setType(qt.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                      isSelected 
                        ? 'border-accent bg-accent/5 text-accent shadow-sm' 
                        : 'border-border bg-white text-textMuted hover:text-textDark hover:bg-neutral-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{qt.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Settings & Configurations */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle>{language === 'ar' ? 'بيانات وإعدادات المحتوى' : 'Content Settings'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Mode selector */}
            <div className="flex items-center gap-4 bg-neutral-50 p-2.5 rounded-xl border border-border">
              <span className="text-xs font-bold text-textMuted px-2">{language === 'ar' ? 'نوع الـ QR:' : 'Mode:'}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('dynamic')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'dynamic' 
                      ? 'bg-accent text-white shadow-sm' 
                      : 'bg-white text-textMuted border border-border'
                  }`}
                >
                  {language === 'ar' ? 'ديناميكي (مطور وقابل للتتبع والتعديل)' : 'Dynamic (Editable & Trackable)'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('static')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'static' 
                      ? 'bg-accent text-white shadow-sm' 
                      : 'bg-white text-textMuted border border-border'
                  }`}
                >
                  {language === 'ar' ? 'ثابت (مبشر ومباشر)' : 'Static (Direct)'}
                </button>
              </div>
            </div>

            {/* QR Code Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-textDark/80">{language === 'ar' ? 'اسم الكود لتمييزه' : 'QR Name'}</label>
              <Input value={qrName} onChange={e => setQrName(e.target.value)} />
            </div>

            {/* Dynamic Inputs depending on type selection */}
            {type === 'url' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-textDark/80">رابط الموقع (URL)</label>
                <Input value={urlField} onChange={e => setUrlField(e.target.value)} />
              </div>
            )}

            {type === 'text' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-textDark/80">النص المعروض</label>
                <textarea 
                  value={textField} 
                  onChange={e => setTextField(e.target.value)}
                  className="w-full min-h-[100px] border border-border rounded-xl p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
            )}

            {(type === 'pdf' || type === 'image') && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-textDark/80">{type === 'pdf' ? 'رفع ملف PDF' : 'رفع صورة'}</label>
                <div className="border border-dashed border-border rounded-xl p-8 text-center bg-neutral-50/50 hover:bg-neutral-50 transition-colors relative">
                  <input 
                    type="file" 
                    accept={type === 'pdf' ? '.pdf' : 'image/*'} 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-textMuted" size={32} />
                    <span className="text-sm font-semibold">{uploading ? 'جاري الرفع للـ Cloud...' : 'اسحب الملف هنا أو اضغط للاختيار'}</span>
                    <span className="text-xs text-textMuted">الحد الأقصى للملفات: ٥ ميجا</span>
                  </div>
                </div>
                {urlField.startsWith('http') && (
                  <div className="text-xs font-mono bg-white p-2.5 rounded border border-border truncate">{urlField}</div>
                )}
              </div>
            )}

            {type === 'wifi' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">اسم الشبكة (SSID)</label>
                  <Input value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textDark/80">الرقم السري</label>
                    <Input type="password" value={wifiPass} onChange={e => setWifiPass(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textDark/80">نوع التشفير</label>
                    <select 
                      value={wifiSec} 
                      onChange={e => setWifiSec(e.target.value as any)}
                      className="w-full h-10 rounded-btn border border-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">بدون تشفير (مفتوحة)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {type === 'sms' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">رقم الهاتف المستلم</label>
                  <Input value={smsPhone} onChange={e => setSmsPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">الرسالة التلقائية</label>
                  <Input value={smsMsg} onChange={e => setSmsMsg(e.target.value)} />
                </div>
              </div>
            )}

            {type === 'email' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">المرسل إليه (Email)</label>
                  <Input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">موضوع الرسالة</label>
                  <Input value={emailSub} onChange={e => setEmailSub(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">محتوى الإيميل</label>
                  <textarea 
                    value={emailBody} 
                    onChange={e => setEmailBody(e.target.value)}
                    className="w-full min-h-[80px] border border-border rounded-xl p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </div>
              </div>
            )}

            {type === 'phone' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-textDark/80">رقم الهاتف</label>
                <Input value={phoneField} onChange={e => setPhoneField(e.target.value)} />
              </div>
            )}

            {type === 'location' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">خط العرض (Latitude)</label>
                  <Input value={locLat} onChange={e => setLocLat(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">خط الطول (Longitude)</label>
                  <Input value={locLng} onChange={e => setLocLng(e.target.value)} />
                </div>
              </div>
            )}

            {type === 'vcard' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textDark/80">الاسم الأول</label>
                    <Input value={vFirstName} onChange={e => setVFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textDark/80">العائلة</label>
                    <Input value={vLastName} onChange={e => setVLastName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">الشركة / المنظمة</label>
                  <Input value={vOrg} onChange={e => setVOrg(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textDark/80">رقم الهاتف</label>
                    <Input value={vPhone} onChange={e => setVPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textDark/80">البريد الإلكتروني</label>
                    <Input type="email" value={vEmail} onChange={e => setVEmail(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {type === 'social' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">المنصة</label>
                  <select 
                    value={socPlatform} 
                    onChange={e => setSocPlatform(e.target.value)}
                    className="w-full h-10 rounded-btn border border-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">X / Twitter</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">اسم الحساب (Username)</label>
                  <Input value={socUser} onChange={e => setSocUser(e.target.value)} />
                </div>
              </div>
            )}

            {type === 'event' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">اسم الفعالية</label>
                  <Input value={evName} onChange={e => setEvName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80">مكان الفعالية</label>
                  <Input value={evLoc} onChange={e => setEvLoc(e.target.value)} />
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Custom Logo and Design Card */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle>{language === 'ar' ? 'تخصيص التصميم والألوان' : 'Design Customization'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-textDark/80">لون الكود</label>
                <div className="flex gap-2">
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-10 w-10 rounded-xl cursor-pointer border border-border bg-white" />
                  <Input value={fgColor} onChange={e => setFgColor(e.target.value)} className="flex-1 font-mono text-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-textDark/80">لون الخلفية</label>
                <div className="flex gap-2">
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-10 w-10 rounded-xl cursor-pointer border border-border bg-white" />
                  <Input value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 font-mono text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <label className="text-xs font-bold text-textDark/80 flex items-center gap-2">
                <Upload size={14} /> {language === 'ar' ? 'إضافة شعار (Logo) في منتصف الـ QR' : 'Logo Overlay'}
              </label>
              <div className="flex items-center gap-4">
                <div className="relative border border-border rounded-xl px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <span className="text-xs font-bold text-textDark/80">{language === 'ar' ? 'رفع شعار' : 'Upload logo'}</span>
                </div>
                {logo && (
                  <button 
                    onClick={() => setLogo(null)}
                    className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"
                  >
                    <Trash size={14} /> {language === 'ar' ? 'حذف الشعار' : 'Remove logo'}
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* QR Code Renders and Downloads column */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Real-time preview */}
        <Card className="border border-border bg-white shadow-card flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 opacity-30 pointer-events-none" />
          
          <div 
            ref={qrRef} 
            className="p-5 rounded-2xl transition-all duration-300 border border-border shadow-md bg-white relative z-10 flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <div className="relative">
              <QRCode 
                value={getEncodedValue() || ' '}
                fgColor={fgColor}
                bgColor="transparent"
                size={220}
              />
              {logo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-xl p-1 border border-border shadow-md flex items-center justify-center overflow-hidden">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain rounded" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-3 w-full relative z-10">
            {mode === 'dynamic' && !qrId ? (
              <Button onClick={saveQRCode} className="w-full font-bold h-11 gap-2">
                <Sparkles size={16} /> {language === 'ar' ? 'حفظ وتأمين كود الـ QR' : 'Secure and Save QR'}
              </Button>
            ) : (
              <div className="flex gap-2">
                {saveSuccess ? (
                  <div className="w-full bg-green-50 border border-green-200 text-green-700 text-center py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <Check size={16} /> {language === 'ar' ? 'تم الحفظ والربط بنجاح!' : 'Saved successfully!'}
                  </div>
                ) : (
                  <Button onClick={saveQRCode} className="w-full font-bold h-11 gap-2">
                    {language === 'ar' ? 'تحديث / حفظ الكود' : 'Update / Save Code'}
                  </Button>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" size="sm" onClick={downloadPNG} className="text-xs font-bold">
                PNG
              </Button>
              <Button variant="secondary" size="sm" onClick={downloadSVG} className="text-xs font-bold">
                SVG
              </Button>
              <Button variant="secondary" size="sm" onClick={downloadPDF} className="text-xs font-bold">
                PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Dynamic Scan Target card details for dynamic code */}
        {mode === 'dynamic' && qrId && (
          <Card className="border border-border">
            <CardContent className="p-5 space-y-3">
              <div className="text-xs font-bold text-textMuted uppercase">{language === 'ar' ? 'رابط إعادة التوجيه الفعلي' : 'Short Link Target'}</div>
              <div className="text-xs font-mono bg-neutral-50 p-2.5 rounded border border-border break-all">{getEncodedValue()}</div>
              <p className="text-[10px] text-textMuted">{language === 'ar' ? 'يمكنك تحديث المحتوى في أي وقت دون تغيير الرمز المطبوع.' : 'You can modify the destination URL at any time without reprinting.'}</p>
            </CardContent>
          </Card>
        )}

      </div>

    </div>
  );
};
