import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Upload, FileSpreadsheet, Key, Webhook, Play, Plus, 
  Trash2, Copy, Check, Eye, EyeOff, Terminal,
  Download, RefreshCw, Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import QRCode from 'react-qr-code';

interface BulkQRItem {
  id: string;
  content: string;
  label: string;
  status: 'pending' | 'generating' | 'ready';
  pngData?: string;
}

interface ApiKey {
  id: string;
  label: string;
  key: string;
  createdAt: string;
  status: 'active' | 'revoked';
  usage: number;
}

interface WebhookSub {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

export const EnterprisePortal = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const [activeTab, setActiveTab] = useState<'bulk' | 'api' | 'webhooks'>('bulk');

  // --- Bulk QR State ---
  const [bulkItems, setBulkItems] = useState<BulkQRItem[]>([]);
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const bulkRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // --- API Keys State ---
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', label: 'Production Website', key: 'qr_live_a8f92bd87c6b54a2b901', createdAt: '2026-05-15', status: 'active', usage: 1450 },
    { id: '2', label: 'Mobile App Staging', key: 'qr_test_89d7821ef9a04cd8213b', createdAt: '2026-06-01', status: 'active', usage: 230 }
  ]);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [showKeyId, setShowKeyId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // --- Webhooks State ---
  const [webhooks, setWebhooks] = useState<WebhookSub[]>([
    { id: '1', url: 'https://api.mycompany.com/qr-webhook', events: ['scan_events', 'attendance_events'], active: true, createdAt: '2026-05-20' }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState<string[]>(['scan_events']);
  const [webhookLogs, setWebhookLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);

  // --- CSV/Excel File Parser ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Parse rows as array of arrays
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        const items: BulkQRItem[] = [];
        jsonData.forEach((row, index) => {
          // Skip headers or empty first cells
          if (index === 0 && (String(row[0]).toLowerCase().includes('url') || String(row[0]).toLowerCase().includes('content'))) {
            return;
          }
          if (row[0]) {
            const content = String(row[0]).trim();
            const label = row[1] ? String(row[1]).trim() : `QR Code ${index + 1}`;
            items.push({
              id: `bulk_${Date.now()}_${index}`,
              content,
              label,
              status: 'pending'
            });
          }
        });

        setBulkItems(items);
      } catch (err) {
        alert(isRtl ? 'فشل قراءة الملف. تأكد من أنه ملف CSV أو Excel صحيح.' : 'Failed to parse file. Make sure it is a valid CSV or Excel sheet.');
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // --- Generate Bulk PNG Data ---
  const generateBulkQRs = async () => {
    if (bulkItems.length === 0) return;
    setIsGeneratingBulk(true);

    // Set generating status
    setBulkItems(prev => prev.map(item => ({ ...item, status: 'generating' })));

    // Small delay to allow react to render SVGs
    setTimeout(() => {
      const updated = bulkItems.map(item => {
        const container = bulkRefs.current[item.id];
        if (container) {
          const svg = container.querySelector('svg');
          if (svg) {
            // Serialize SVG
            const svgString = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            
            return {
              ...item,
              status: 'ready' as const,
              pngData: url // We can use the Blob URL directly for SVG download in ZIP, or draw to canvas for PNG
            };
          }
        }
        return { ...item, status: 'ready' as const };
      });
      setBulkItems(updated);
      setIsGeneratingBulk(false);
    }, 1500);
  };

  // --- Download Zip ---
  const downloadBatchZip = async () => {
    const readyItems = bulkItems.filter(item => item.status === 'ready');
    if (readyItems.length === 0) return;

    const zip = new JSZip();

    for (const item of readyItems) {
      const container = bulkRefs.current[item.id];
      if (container) {
        const svg = container.querySelector('svg');
        if (svg) {
          // We will draw it on a Canvas to get PNG binary data
          const pngDataUrl = await convertSvgToPngDataUrl(svg);
          if (pngDataUrl) {
            const base64Data = pngDataUrl.split(',')[1];
            // Sanitize filename
            const filename = item.label.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            zip.file(`${filename}.png`, base64Data, { base64: true });
          }
        }
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const blobUrl = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `qruniverse_batch_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    });
  };

  // Helper to convert SVG element to PNG data URL
  const convertSvgToPngDataUrl = (svgElement: SVGElement): Promise<string> => {
    return new Promise((resolve) => {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const DOMURL = window.URL || window.webkitURL || window;
      const blobURL = DOMURL.createObjectURL(svgBlob);
      
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const context = canvas.getContext('2d');
        if (context) {
          // Fill background with white
          context.fillStyle = '#FFFFFF';
          context.fillRect(0, 0, 300, 300);
          context.drawImage(image, 0, 0, 300, 300);
          const png = canvas.toDataURL('image/png');
          DOMURL.revokeObjectURL(blobURL);
          resolve(png);
        } else {
          resolve('');
        }
      };
      image.src = blobURL;
    });
  };

  // --- API Key Handlers ---
  const generateApiKey = () => {
    if (!newKeyLabel.trim()) return;
    
    const randomHex = Array.from({ length: 20 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const newKey: ApiKey = {
      id: String(Date.now()),
      label: newKeyLabel,
      key: `qr_live_${randomHex}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      usage: 0
    };

    setApiKeys(prev => [newKey, ...prev]);
    setNewKeyLabel('');
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // --- Webhooks Handlers ---
  const addWebhook = () => {
    if (!newWebhookUrl.trim()) return;
    const newHook: WebhookSub = {
      id: String(Date.now()),
      url: newWebhookUrl,
      events: [...webhookEvents],
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setWebhooks(prev => [...prev, newHook]);
    setNewWebhookUrl('');
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const toggleWebhookActive = (id: string) => {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
  };

  const handleWebhookEventChange = (event: string) => {
    if (webhookEvents.includes(event)) {
      setWebhookEvents(prev => prev.filter(e => e !== event));
    } else {
      setWebhookEvents(prev => [...prev, event]);
    }
  };

  const triggerTestPayload = (hook: WebhookSub) => {
    setTestingWebhookId(hook.id);
    setShowConsole(true);
    
    // Simulate web requests logs
    setWebhookLogs(prev => [
      `[${new Date().toLocaleTimeString()}] POST ${hook.url} ...`,
      ...prev
    ]);

    setTimeout(() => {
      const mockPayload = {
        event: hook.events[0] || 'scan_events',
        timestamp: Math.floor(Date.now() / 1000),
        webhook_id: hook.id,
        data: {
          qr_id: 'qr_demo_7811',
          scan_count: 1042,
          location: { country: 'Egypt', city: 'Cairo' },
          device: { os: 'iOS', browser: 'Safari' }
        }
      };

      setWebhookLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Response: 200 OK`,
        `Payload Sent:\n${JSON.stringify(mockPayload, null, 2)}`,
        ...prev
      ]);
      setTestingWebhookId(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 text-right font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-black text-textDark dark:text-white flex items-center gap-2.5">
          <Layers className="text-accent" size={30} />
          <span>{isRtl ? 'لوحة أدوات المؤسسات والربط المطور' : 'Enterprise & Developer Tools Portal'}</span>
        </h1>
        <p className="text-textMuted dark:text-neutral-400 mt-1 font-semibold text-sm">
          {isRtl 
            ? 'توليد دفعات رموز QR، إدارة مفاتيح API، وربط أحداث المسح مع خوادمك عبر الويب هوكس.' 
            : 'Generate bulk QR codes, manage secure API credentials, and sync scan events with your servers.'}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-border dark:border-gray-800 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bulk')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'bulk'
              ? 'border-accent text-accent'
              : 'border-transparent text-textMuted dark:text-neutral-400 hover:text-textDark dark:hover:text-white'
          }`}
        >
          <FileSpreadsheet size={16} />
          <span>{isRtl ? 'توليد الدفعات (CSV/Excel)' : 'Bulk QR Generator'}</span>
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'api'
              ? 'border-accent text-accent'
              : 'border-transparent text-textMuted dark:text-neutral-400 hover:text-textDark dark:hover:text-white'
          }`}
        >
          <Key size={16} />
          <span>{isRtl ? 'مفاتيح المطورين (API Keys)' : 'API Key Manager'}</span>
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'webhooks'
              ? 'border-accent text-accent'
              : 'border-transparent text-textMuted dark:text-neutral-400 hover:text-textDark dark:hover:text-white'
          }`}
        >
          <Webhook size={16} />
          <span>{isRtl ? 'ربط الخوادم (Webhooks)' : 'Webhook Subscriptions'}</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">

        {/* Tab 1: Bulk Generator */}
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Uploader Card */}
              <Card className="lg:col-span-1 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
                <CardHeader className="border-b border-border dark:border-gray-800 pb-3">
                  <CardTitle className="text-sm font-black dark:text-white">
                    {isRtl ? 'رفع ملف القائمة' : 'Upload Data Sheet'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  
                  {/* CSV Template Download */}
                  <div className="bg-neutral-50 dark:bg-neutral-850 p-4 rounded-xl text-xs space-y-2.5">
                    <p className="font-semibold text-textMuted dark:text-neutral-400">
                      {isRtl 
                        ? 'يرجى رفع ملف يحتوي على الروابط في العمود الأول والأسماء/العناوين في العمود الثاني.'
                        : 'Upload a sheet file. Column 1 must contain the URLs/Texts. Column 2 can contain names.'}
                    </p>
                    <a 
                      href="data:text/csv;charset=utf-8,URL,Label%0Ahttps://google.com,Google%0Ahttps://github.com,GitHub" 
                      download="qruniverse_template.csv"
                      className="text-accent hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <Download size={12} />
                      <span>{isRtl ? 'تحميل ملف نموذجي (CSV)' : 'Download template'}</span>
                    </a>
                  </div>

                  {/* File Input */}
                  <label className="border-2 border-dashed border-border dark:border-neutral-800 hover:border-accent dark:hover:border-accent rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-neutral-50/50 dark:bg-neutral-900">
                    <input 
                      type="file" 
                      accept=".csv, .xlsx, .xls" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                    <Upload className="text-accent" size={30} />
                    <div className="text-center space-y-1">
                      <span className="text-xs font-bold dark:text-white block">
                        {isRtl ? 'اسحب ملف البيانات هنا أو تصفح' : 'Drag file here or browse'}
                      </span>
                      <span className="text-[10px] text-textMuted dark:text-neutral-400 block font-semibold">
                        CSV, XLSX, XLS
                      </span>
                    </div>
                  </label>

                  {/* File Info */}
                  {fileDetails && (
                    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-850 rounded-xl text-xs font-semibold">
                      <div className="truncate max-w-[150px] font-bold dark:text-white">{fileDetails.name}</div>
                      <div className="text-textMuted dark:text-neutral-400">{fileDetails.size}</div>
                    </div>
                  )}

                  {bulkItems.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <Button 
                        onClick={generateBulkQRs} 
                        disabled={isGeneratingBulk}
                        className="w-full text-xs font-bold gap-2"
                      >
                        {isGeneratingBulk ? (
                          <>
                            <RefreshCw className="animate-spin" size={14} />
                            <span>{isRtl ? 'جاري التوليد...' : 'Generating Batch...'}</span>
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            <span>{isRtl ? `توليد ${bulkItems.length} كود QR` : `Generate ${bulkItems.length} QR Codes`}</span>
                          </>
                        )}
                      </Button>

                      {bulkItems.some(i => i.status === 'ready') && (
                        <Button 
                          variant="outline"
                          onClick={downloadBatchZip}
                          className="w-full text-xs font-bold gap-2 border-accent text-accent hover:bg-accent/5"
                        >
                          <Download size={14} />
                          <span>{isRtl ? 'تحميل الحزمة المضغوطة (ZIP)' : 'Download Zip Archive'}</span>
                        </Button>
                      )}
                    </div>
                  )}

                </CardContent>
              </Card>

              {/* Preview Grid List */}
              <Card className="lg:col-span-2 border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
                <CardHeader className="border-b border-border dark:border-gray-800 pb-3 flex justify-between items-center">
                  <span className="bg-neutral-50 dark:bg-neutral-800 px-3 py-1 rounded-full text-[10px] font-black dark:text-neutral-300">
                    {isRtl ? `مكتشف: ${bulkItems.length} عنصر` : `Parsed: ${bulkItems.length} items`}
                  </span>
                  <CardTitle className="text-sm font-black dark:text-white">
                    {isRtl ? 'معاينة أكواد الدفعة الحالية' : 'Parsed Batch Preview'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {bulkItems.length === 0 ? (
                    <div className="py-16 text-center text-textMuted dark:text-neutral-500 space-y-2.5">
                      <FileSpreadsheet className="mx-auto text-neutral-300" size={48} />
                      <p className="text-xs font-semibold">
                        {isRtl ? 'لا توجد بيانات مرفوعة حالياً. ابدأ برفع ملف القائمة بالجانب.' : 'No data sheets uploaded. Please upload a file to preview list.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-2">
                      {bulkItems.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-3.5 border border-border dark:border-gray-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between gap-3 text-right"
                        >
                          {/* Left: QR Code render (hidden or tiny preview) */}
                          <div 
                            ref={el => { bulkRefs.current[item.id] = el }}
                            className="bg-white p-1.5 rounded-lg border border-neutral-200 shrink-0"
                          >
                            <QRCode 
                              value={item.content} 
                              size={48} 
                              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            />
                          </div>

                          {/* Right: Info */}
                          <div className="flex-1 space-y-1 truncate pr-2">
                            <h4 className="text-xs font-bold text-textDark dark:text-white truncate">{item.label}</h4>
                            <p className="text-[10px] text-textMuted dark:text-neutral-400 font-mono truncate">{item.content}</p>
                            <div className="pt-1">
                              {item.status === 'pending' && (
                                <span className="bg-neutral-100 dark:bg-neutral-850 text-textMuted text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                                  {isRtl ? 'معلق' : 'Pending'}
                                </span>
                              )}
                              {item.status === 'generating' && (
                                <span className="bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                                  {isRtl ? 'جاري الإنشاء' : 'Generating'}
                                </span>
                              )}
                              {item.status === 'ready' && (
                                <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                                  {isRtl ? 'جاهز للتحميل' : 'Ready'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        )}

        {/* Tab 2: API Credentials */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            
            {/* Generate API Key Form */}
            <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
              <CardContent className="p-6 flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 space-y-1 w-full">
                  <label className="text-xs font-bold text-textDark dark:text-neutral-300 block">{isRtl ? 'اسم مفتاح الـ API الجديد' : 'New API Key Label'}</label>
                  <Input 
                    placeholder={isRtl ? 'مثال: نظام ERP الداخلي' : 'e.g. Corporate Intranet Sync'} 
                    value={newKeyLabel}
                    onChange={e => setNewKeyLabel(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <Button 
                  onClick={generateApiKey} 
                  className="text-xs font-bold gap-1.5 h-10 w-full sm:w-auto"
                >
                  <Plus size={14} />
                  <span>{isRtl ? 'توليد مفتاح API' : 'Generate Key'}</span>
                </Button>
              </CardContent>
            </Card>

            {/* API Keys Table */}
            <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
              <CardHeader className="border-b border-border dark:border-gray-800 pb-3">
                <CardTitle className="text-sm font-black dark:text-white">
                  {isRtl ? 'مفاتيح الـ API النشطة للشركة' : 'Active Client API Keys'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-border dark:border-gray-800 text-textMuted dark:text-neutral-400 font-bold pb-2">
                        <th className="pb-3 text-right">{isRtl ? 'الاسم' : 'Label'}</th>
                        <th className="pb-3 text-right">{isRtl ? 'المفتاح' : 'Credentials Key'}</th>
                        <th className="pb-3 text-right">{isRtl ? 'تاريخ التوليد' : 'Created At'}</th>
                        <th className="pb-3 text-right">{isRtl ? 'الاستخدام (مسحة)' : 'Usage (Hits)'}</th>
                        <th className="pb-3 text-right">{isRtl ? 'الحالة' : 'Status'}</th>
                        <th className="pb-3 text-left">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiKeys.map((k) => (
                        <tr key={k.id} className="border-b border-border/40 dark:border-gray-800/40 hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50 transition-colors font-semibold">
                          <td className="py-4 font-bold dark:text-white">{k.label}</td>
                          <td className="py-4 font-mono text-[10.5px]">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => copyToClipboard(k.key, k.id)}
                                className="text-neutral-400 hover:text-textDark dark:hover:text-white"
                              >
                                {copiedKeyId === k.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                              </button>
                              <button 
                                onClick={() => setShowKeyId(showKeyId === k.id ? null : k.id)}
                                className="text-neutral-400 hover:text-textDark dark:hover:text-white"
                              >
                                {showKeyId === k.id ? <EyeOff size={12} /> : <Eye size={12} />}
                              </button>
                              <span>
                                {showKeyId === k.id ? k.key : '••••••••••••••••••••' + k.key.substring(k.key.length - 4)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-textMuted dark:text-neutral-400">{k.createdAt}</td>
                          <td className="py-4 font-bold text-accent">{k.usage.toLocaleString()}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              k.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                                : 'bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400'
                            }`}>
                              {k.status === 'active' ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'ملغي' : 'Revoked')}
                            </span>
                          </td>
                          <td className="py-4 text-left">
                            {k.status === 'active' && (
                              <button 
                                onClick={() => revokeApiKey(k.id)}
                                className="text-red-500 hover:text-red-600 font-bold transition-colors"
                              >
                                {isRtl ? 'إلغاء الصلاحية' : 'Revoke'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

          </div>
        )}

        {/* Tab 3: Webhooks Subscriptions */}
        {activeTab === 'webhooks' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Webhook Form (Col Span 5) */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
                  <CardHeader className="border-b border-border dark:border-gray-800 pb-3">
                    <CardTitle className="text-sm font-black dark:text-white">
                      {isRtl ? 'إعداد اشتراك ويب هوك جديد' : 'New Webhook Registration'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4 text-right">
                    
                    {/* URL Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-textDark dark:text-neutral-300 block">{isRtl ? 'عنوان URL الوجهة' : 'Payload URL'}</label>
                      <Input 
                        placeholder="https://api.mycompany.com/webhook" 
                        value={newWebhookUrl}
                        onChange={e => setNewWebhookUrl(e.target.value)}
                        className="text-xs"
                      />
                    </div>

                    {/* Events checkboxes */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-textDark dark:text-neutral-300 block">{isRtl ? 'الأحداث المشتركة' : 'Events Trigger'}</label>
                      <div className="space-y-1.5">
                        {[
                          { id: 'scan_events', label: isRtl ? 'أحداث المسح (Scan Logs)' : 'Scan Logs' },
                          { id: 'attendance_events', label: isRtl ? 'أحداث الحضور والغياب' : 'Attendance Check-in' },
                          { id: 'subscription_events', label: isRtl ? 'أحداث الدفع والاشتراكات' : 'Subscription/Billing' },
                        ].map((evt) => (
                          <label key={evt.id} className="flex items-center justify-between p-2 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-border/30">
                            <span className="text-xs font-semibold text-textDark dark:text-neutral-300">{evt.label}</span>
                            <input 
                              type="checkbox" 
                              checked={webhookEvents.includes(evt.id)}
                              onChange={() => handleWebhookEventChange(evt.id)}
                              className="rounded border-neutral-300 dark:border-neutral-700 text-accent focus:ring-accent"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={addWebhook} 
                      className="w-full text-xs font-bold gap-1.5 h-10 mt-2 shadow-md shadow-accent/15"
                    >
                      <Plus size={14} />
                      <span>{isRtl ? 'إضافة ويب هوك' : 'Add Webhook'}</span>
                    </Button>

                  </CardContent>
                </Card>
              </div>

              {/* Webhook List & Live Console (Col Span 7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Hooks List */}
                <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
                  <CardHeader className="border-b border-border dark:border-gray-800 pb-3">
                    <CardTitle className="text-sm font-black dark:text-white">
                      {isRtl ? 'عناوين الويب هوك النشطة' : 'Registered Webhooks'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {webhooks.length === 0 ? (
                      <div className="py-12 text-center text-textMuted dark:text-neutral-500">
                        {isRtl ? 'لا توجد ويب هوك مضافة حالياً.' : 'No registered webhooks found.'}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {webhooks.map((w) => (
                          <div 
                            key={w.id}
                            className="p-4 border border-border dark:border-gray-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-right">
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => deleteWebhook(w.id)}
                                  className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <button
                                  onClick={() => toggleWebhookActive(w.id)}
                                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all ${
                                    w.active 
                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                                      : 'bg-neutral-50 text-textMuted border-border dark:bg-neutral-850 dark:border-neutral-805'
                                  }`}
                                >
                                  {w.active ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'معطل' : 'Disabled')}
                                </button>
                                <button
                                  onClick={() => triggerTestPayload(w)}
                                  disabled={testingWebhookId === w.id}
                                  className="bg-accent/10 hover:bg-accent text-accent hover:text-white px-2.5 py-1 rounded-xl text-[10px] font-black transition-all border border-accent/10 flex items-center gap-1 shrink-0"
                                >
                                  <Play size={10} />
                                  <span>{testingWebhookId === w.id ? (isRtl ? 'جاري الفحص...' : 'Testing...') : (isRtl ? 'فحص تجريبي' : 'Test Payload')}</span>
                                </button>
                              </div>
                              <div className="flex-1 min-w-0 pr-2">
                                <h4 className="text-xs font-mono font-bold text-textDark dark:text-white truncate text-left sm:text-right" dir="ltr">{w.url}</h4>
                                <div className="flex flex-wrap gap-1.5 pt-1.5 justify-end">
                                  {w.events.map(e => (
                                    <span key={e} className="bg-neutral-200 dark:bg-neutral-800 text-textMuted dark:text-neutral-300 text-[8px] font-bold px-2 py-0.5 rounded">
                                      {e}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Console Logger */}
                {showConsole && (
                  <Card className="border border-neutral-800 bg-neutral-950 text-neutral-300 overflow-hidden shadow-2xl">
                    <CardHeader className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
                      <button 
                        onClick={() => setShowConsole(false)}
                        className="text-neutral-500 hover:text-neutral-200 text-xs font-bold"
                      >
                        {isRtl ? 'إغلاق الكونسول' : 'Close Terminal'}
                      </button>
                      <CardTitle className="text-xs font-black flex items-center gap-1.5 text-accent">
                        <Terminal size={14} />
                        <span>{isRtl ? 'أداة تتبع اختبار الويب هوك' : 'Live Request Log Console'}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="font-mono text-[10.5px] max-h-56 overflow-y-auto space-y-3 text-left" dir="ltr">
                        {webhookLogs.length === 0 ? (
                          <div className="text-neutral-600 italic">No request payloads generated yet. Click "Test Payload" above.</div>
                        ) : (
                          webhookLogs.map((log, i) => (
                            <pre key={i} className="whitespace-pre-wrap bg-neutral-900 p-2.5 rounded border border-neutral-850 break-words font-medium">
                              {log}
                            </pre>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
export default EnterprisePortal;
