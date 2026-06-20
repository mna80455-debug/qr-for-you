import React, { useEffect, useRef, useState, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';
import { motion } from 'framer-motion';
import { Upload, Download, Palette, Type, LayoutTemplate, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/Button';

// Default options
const defaultOptions = {
  width: 300,
  height: 300,
  data: 'https://qrify.app',
  margin: 10,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'Q'
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 10,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#000000',
    type: 'rounded' as DotType
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'extra-rounded' as CornerSquareType
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'dot' as CornerDotType
  }
};

export const AdvancedQrGenerator = () => {
  const [url, setUrl] = useState('https://qrify.app');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // Customization State
  const [dotsColor, setDotsColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dotsType, setDotsType] = useState<DotType>('rounded');
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>('extra-rounded');
  
  const [activeTab, setActiveTab] = useState<'content' | 'colors' | 'shapes' | 'logo'>('content');

  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling>(new QRCodeStyling(defaultOptions as any));

  // Update QR Code when options change
  useEffect(() => {
    qrCode.current.update({
      data: url || 'https://qrify.app',
      dotsOptions: { color: dotsColor, type: dotsType },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: { color: dotsColor, type: cornerSquareType },
      cornersDotOptions: { color: dotsColor, type: cornerSquareType === 'extra-rounded' || cornerSquareType === 'dot' ? 'dot' : 'square' },
      image: logoUrl || undefined,
    });
  }, [url, dotsColor, bgColor, dotsType, cornerSquareType, logoUrl]);

  // Append QR to DOM
  useEffect(() => {
    if (ref.current) {
      qrCode.current.append(ref.current);
    }
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.svg'] },
    maxFiles: 1
  });

  const handleDownload = (extension: 'png' | 'svg') => {
    qrCode.current.download({
      name: `QRify-${Date.now()}`,
      extension
    });
  };

  const dotOptionsList = [
    { value: 'square', label: 'مربع' },
    { value: 'dots', label: 'منقط' },
    { value: 'rounded', label: 'دائري' },
    { value: 'extra-rounded', label: 'دائري ممتد' },
    { value: 'classy', label: 'كلاسيكي' },
    { value: 'classy-rounded', label: 'كلاسيكي دائري' },
  ];

  const cornerOptionsList = [
    { value: 'square', label: 'مربع' },
    { value: 'extra-rounded', label: 'دائري' },
    { value: 'dot', label: 'نقطة' },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row w-full max-w-6xl mx-auto my-12" dir="rtl">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-1/2 p-6 lg:p-10 border-b lg:border-b-0 lg:border-l border-slate-200 dark:border-neutral-800 flex flex-col h-full bg-slate-50/50 dark:bg-neutral-950/50">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">استوديو التخصيص 🎨</h2>
        
        {/* Customization Tabs */}
        <div className="flex bg-slate-200/50 dark:bg-neutral-800/50 p-1 rounded-xl mb-6">
          <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<Type size={16} />} label="المحتوى" />
          <TabButton active={activeTab === 'colors'} onClick={() => setActiveTab('colors')} icon={<Palette size={16} />} label="الألوان" />
          <TabButton active={activeTab === 'shapes'} onClick={() => setActiveTab('shapes')} icon={<LayoutTemplate size={16} />} label="الأشكال" />
          <TabButton active={activeTab === 'logo'} onClick={() => setActiveTab('logo')} icon={<ImageIcon size={16} />} label="الشعار" />
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto pr-2 pb-6 space-y-6">
          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">رابط الوجهة أو النص</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'colors' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <ColorPicker label="لون الرمز" value={dotsColor} onChange={setDotsColor} />
                <ColorPicker label="لون الخلفية" value={bgColor} onChange={setBgColor} />
              </div>
            </motion.div>
          )}

          {activeTab === 'shapes' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">نمط النقاط الأساسية (Data Pattern)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {dotOptionsList.map(opt => (
                    <SelectionButton 
                      key={opt.value} 
                      active={dotsType === opt.value} 
                      onClick={() => setDotsType(opt.value as DotType)}
                      label={opt.label}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">نمط العيون (Eye Frame)</label>
                <div className="grid grid-cols-3 gap-2">
                  {cornerOptionsList.map(opt => (
                    <SelectionButton 
                      key={opt.value} 
                      active={cornerSquareType === opt.value} 
                      onClick={() => setCornerSquareType(opt.value as CornerSquareType)}
                      label={opt.label}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'logo' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الشعار المركزي (Logo)</label>
              
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-slate-300 dark:border-neutral-700 hover:border-slate-400 dark:hover:border-neutral-600 hover:bg-slate-50 dark:hover:bg-neutral-800'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">اسحب الشعار وأفلته هنا</h4>
                <p className="text-xs text-slate-500">أو اضغط لتصفح ملفاتك (PNG, JPG, SVG)</p>
              </div>

              {logoUrl && (
                <div className="flex items-center justify-between bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 p-3 rounded-xl mt-4">
                  <div className="flex items-center gap-3">
                    <img src={logoUrl} alt="Logo Preview" className="w-10 h-10 object-contain rounded-lg bg-slate-50 dark:bg-neutral-900 p-1" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">تم تحميل الشعار</span>
                  </div>
                  <button onClick={() => setLogoUrl(null)} className="text-xs text-red-500 hover:text-red-700 font-bold px-3 py-1 bg-red-50 dark:bg-red-500/10 rounded-lg transition-colors">
                    إزالة
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Preview & Download Panel */}
      <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col items-center justify-center bg-white dark:bg-neutral-900 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-8 w-full max-w-[320px] aspect-square bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-3xl p-4 shadow-inner flex items-center justify-center relative overflow-hidden">
          {/* Real-time Generator Target Container */}
          <motion.div 
            key={activeTab} // subtle animation when switching tabs
            initial={{ scale: 0.98, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full flex items-center justify-center"
            ref={ref} 
          />
        </div>

        <div className="w-full max-w-[320px] space-y-3">
          <Button onClick={() => handleDownload('png')} className="w-full font-bold gap-2 text-base shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 py-6">
            <Download size={20} /> تصدير بصيغة PNG
          </Button>
          <Button onClick={() => handleDownload('svg')} variant="secondary" className="w-full font-bold gap-2 py-6 border-slate-300 dark:border-neutral-700">
            <Download size={20} /> تصدير بصيغة SVG
          </Button>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
      active 
        ? 'bg-white dark:bg-neutral-700 text-slate-900 dark:text-white shadow-sm' 
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-neutral-700/50'
    }`}
  >
    {icon} <span>{label}</span>
  </button>
);

const SelectionButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button
    onClick={onClick}
    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
      active
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
        : 'border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-neutral-700'
    }`}
  >
    {label}
  </button>
);

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{label}</label>
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-lg font-mono text-sm focus:ring-1 focus:ring-blue-500 outline-none uppercase"
        dir="ltr"
      />
    </div>
  </div>
);
