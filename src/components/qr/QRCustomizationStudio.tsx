import { useState, useEffect, useRef } from 'react';
import qrcode from 'qrcode-generator';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { 
  Sparkles, Upload, Download, Undo, Redo, ZoomIn, ZoomOut, 
  Check, AlertTriangle, Save, Trash, Smartphone, Monitor, Users,
  Globe, MessageCircle, Send, FileText, Video, Music, FileImage, 
  MapPin, Calendar as CalendarIcon, Link2, Apple, Play, Contact, 
  Building2, ShoppingBag, Coins, CreditCard
} from 'lucide-react';

const Facebook = ({ size = 24, ...props }: { size?: number; [key: string]: any }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Instagram = ({ size = 24, ...props }: { size?: number; [key: string]: any }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Linkedin = ({ size = 24, ...props }: { size?: number; [key: string]: any }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Youtube = ({ size = 24, ...props }: { size?: number; [key: string]: any }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
    <polygon points="10 15 15 12 10 9"/>
  </svg>
);

const Twitter = ({ size = 24, ...props }: { size?: number; [key: string]: any }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

interface QRTemplate {
  id?: string;
  name: string;
  fgColor: string;
  bgColor: string;
  gradientType: 'none' | 'linear' | 'radial';
  gradColor1: string;
  gradColor2: string;
  gradAngle: number;
  dotStyle: 'square' | 'rounded' | 'circle' | 'diamond' | 'star' | 'classy' | 'extra-rounded' | 'modern-pixel';
  eyeStyle: 'square' | 'rounded' | 'circle' | 'diamond' | 'leaf' | 'modern' | 'minimal';
  eyeColor: string;
  logo: string | null;
  logoSize: number;
  frameType: 'none' | 'classic' | 'speech-bubble' | 'minimal-border' | 'business-card';
  frameText: string;
  frameColor: string;
  ctaTextSize: number;
}

const PRESETS = [
  { name: 'غروب الشمس', color1: '#FF416C', color2: '#FF4B2B' },
  { name: 'نسيم المحيط', color1: '#00c6ff', color2: '#0072ff' },
  { name: 'الغابة الخضراء', color1: '#11998e', color2: '#38ef7d' },
  { name: 'اللافندر الملكي', color1: '#8A2387', color2: '#E94057' },
  { name: 'الذهب الأسود', color1: '#000000', color2: '#434343' },
];

const DEFAULT_TEMPLATES: QRTemplate[] = [
  {
    name: 'Corporate Clean',
    fgColor: '#1E3A8A',
    bgColor: '#FFFFFF',
    gradientType: 'none',
    gradColor1: '#1E3A8A',
    gradColor2: '#3B82F6',
    gradAngle: 90,
    dotStyle: 'square',
    eyeStyle: 'square',
    eyeColor: '#1E3A8A',
    logo: null,
    logoSize: 18,
    frameType: 'none',
    frameText: 'SCAN ME',
    frameColor: '#1E3A8A',
    ctaTextSize: 14
  },
  {
    name: 'Modern Startup',
    fgColor: '#6366F1',
    bgColor: '#FFFFFF',
    gradientType: 'linear',
    gradColor1: '#6366F1',
    gradColor2: '#EC4899',
    gradAngle: 45,
    dotStyle: 'rounded',
    eyeStyle: 'rounded',
    eyeColor: '#6366F1',
    logo: null,
    logoSize: 20,
    frameType: 'classic',
    frameText: 'VISIT WEBSITE',
    frameColor: '#6366F1',
    ctaTextSize: 13
  },
  {
    name: 'Restaurant Menu',
    fgColor: '#D97706',
    bgColor: '#FFFBEB',
    gradientType: 'none',
    gradColor1: '#D97706',
    gradColor2: '#F59E0B',
    gradAngle: 90,
    dotStyle: 'classy',
    eyeStyle: 'leaf',
    eyeColor: '#92400E',
    logo: null,
    logoSize: 22,
    frameType: 'speech-bubble',
    frameText: 'VIEW MENU',
    frameColor: '#D97706',
    ctaTextSize: 13
  },
  {
    name: 'Event Ticket',
    fgColor: '#8B5CF6',
    bgColor: '#FFFFFF',
    gradientType: 'linear',
    gradColor1: '#8B5CF6',
    gradColor2: '#6D28D9',
    gradAngle: 135,
    dotStyle: 'circle',
    eyeStyle: 'circle',
    eyeColor: '#6D28D9',
    logo: null,
    logoSize: 18,
    frameType: 'classic',
    frameText: 'JOIN EVENT',
    frameColor: '#8B5CF6',
    ctaTextSize: 14
  }
];

export const QRCustomizationStudio = () => {
  const { language } = useLanguage();
  
  // Customization States
  const [qrName, setQrName] = useState('كود استوديو مخصص');
  const [content, setContent] = useState('https://qrify-app-eight.vercel.app');
  
  const [qrSubType, setQrSubType] = useState<string>('url');
  
  // social states
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [tgUsername, setTgUsername] = useState('');
  const [fbUrl, setFbUrl] = useState('');
  const [igUsername, setIgUsername] = useState('');
  const [liUrl, setLiUrl] = useState('');
  const [ytUrl, setYtUrl] = useState('');
  const [ttUsername, setTtUsername] = useState('');
  const [xUsername, setXUsername] = useState('');
  const [xText, setXText] = useState('');

  // files states
  const [fileUrl, setFileUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // productivity states
  const [gformsUrl, setGformsUrl] = useState('');
  const [mapsLat, setMapsLat] = useState('30.0444');
  const [mapsLng, setMapsLng] = useState('31.2357');
  const [calTitle, setCalTitle] = useState('');
  const [calStart, setCalStart] = useState('');
  const [calEnd, setCalEnd] = useState('');
  const [calLocation, setCalLocation] = useState('');
  const [calDesc, setCalDesc] = useState('');
  const [meetUrl, setMeetUrl] = useState('');
  const [meetPlatform, setMeetPlatform] = useState('zoom');

  // mobile apps states
  const [appUrl, setAppUrl] = useState('');
  const [appStoreUrl, setAppStoreUrl] = useState('');
  const [playStoreUrl, setPlayStoreUrl] = useState('');

  // business states
  const [vcName, setVcName] = useState('');
  const [vcPhone, setVcPhone] = useState('');
  const [vcEmail, setVcEmail] = useState('');
  const [vcOrg, setVcOrg] = useState('');
  const [vcTitle, setVcTitle] = useState('');
  const [vcUrl, setVcUrl] = useState('');

  const [cpName, setCpName] = useState('');
  const [cpDesc, setCpDesc] = useState('');
  const [cpWebsite, setCpWebsite] = useState('');
  const [cpPhone, setCpPhone] = useState('');

  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodUrl, setProdUrl] = useState('');

  // finance states
  const [cryptoType, setCryptoType] = useState('BTC');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');

  const [paymentType, setPaymentType] = useState('paypal');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('USD');

  useEffect(() => {
    let newContent = '';
    switch (qrSubType) {
      case 'whatsapp':
        if (waPhone) {
          newContent = `https://wa.me/${waPhone.replace(/\+/g, '')}${waMessage ? `?text=${encodeURIComponent(waMessage)}` : ''}`;
        } else {
          newContent = 'https://wa.me/';
        }
        break;
      case 'telegram':
        newContent = tgUsername ? `https://t.me/${tgUsername}` : 'https://t.me/';
        break;
      case 'facebook':
        newContent = fbUrl || 'https://facebook.com';
        break;
      case 'instagram':
        newContent = igUsername ? `https://instagram.com/${igUsername}` : 'https://instagram.com/';
        break;
      case 'linkedin':
        newContent = liUrl || 'https://linkedin.com';
        break;
      case 'youtube':
        newContent = ytUrl || 'https://youtube.com';
        break;
      case 'tiktok':
        newContent = ttUsername ? `https://www.tiktok.com/@${ttUsername}` : 'https://tiktok.com/';
        break;
      case 'twitter':
        if (xUsername) {
          if (xText) {
            newContent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}&via=${xUsername}`;
          } else {
            newContent = `https://x.com/${xUsername}`;
          }
        } else {
          newContent = 'https://x.com/';
        }
        break;
      case 'pdf':
      case 'video':
      case 'audio':
      case 'image':
        newContent = fileUrl || `https://qruniverse.s3.amazonaws.com/uploads/sample.${qrSubType}`;
        break;
      case 'gforms':
        newContent = gformsUrl || 'https://docs.google.com/forms';
        break;
      case 'gmaps':
        newContent = `https://www.google.com/maps/search/?api=1&query=${mapsLat || '0'},${mapsLng || '0'}`;
        break;
      case 'calendar':
        if (calTitle) {
          const startStr = calStart ? calStart.replace(/[-:]/g, '') : '';
          const endStr = calEnd ? calEnd.replace(/[-:]/g, '') : '';
          newContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${calTitle}\nDTSTART:${startStr}\nDTEND:${endStr}\nLOCATION:${calLocation}\nDESCRIPTION:${calDesc}\nEND:VEVENT\nEND:VCALENDAR`;
        } else {
          newContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR';
        }
        break;
      case 'meeting':
        newContent = meetUrl || 'https://zoom.us/j/0000000000';
        break;
      case 'appdownload':
        newContent = appUrl || 'https://qruniverse.app/download';
        break;
      case 'appstore':
        newContent = appStoreUrl || 'https://apps.apple.com';
        break;
      case 'playstore':
        newContent = playStoreUrl || 'https://play.google.com';
        break;
      case 'vcard':
        if (vcName) {
          newContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcName}\nTEL;TYPE=CELL:${vcPhone}\nEMAIL:${vcEmail}\nORG:${vcOrg}\nTITLE:${vcTitle}\nURL:${vcUrl}\nEND:VCARD`;
        } else {
          newContent = 'BEGIN:VCARD\nVERSION:3.0\nEND:VCARD';
        }
        break;
      case 'company':
        newContent = `Company: ${cpName}\nDescription: ${cpDesc}\nWebsite: ${cpWebsite}\nPhone: ${cpPhone}`;
        break;
      case 'product':
        newContent = `Product: ${prodName}\nSKU: ${prodSku}\nPrice: ${prodPrice}\nDescription: ${prodDesc}\nLink: ${prodUrl}`;
        break;
      case 'crypto':
        if (cryptoAddress) {
          if (cryptoType === 'BTC') {
            newContent = `bitcoin:${cryptoAddress}${cryptoAmount ? `?amount=${cryptoAmount}` : ''}`;
          } else if (cryptoType === 'ETH') {
            newContent = `ethereum:${cryptoAddress}${cryptoAmount ? `?value=${cryptoAmount}` : ''}`;
          } else {
            newContent = `${cryptoType.toLowerCase()}:${cryptoAddress}${cryptoAmount ? `?amount=${cryptoAmount}` : ''}`;
          }
        } else {
          newContent = `${cryptoType.toLowerCase()}:address`;
        }
        break;
      case 'payment':
        if (paymentAccount) {
          if (paymentType === 'paypal') {
            newContent = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${paymentAccount}&amount=${paymentAmount}&currency_code=${paymentCurrency}`;
          } else if (paymentType === 'upi') {
            newContent = `upi://pay?pa=${paymentAccount}&am=${paymentAmount}&cu=${paymentCurrency}`;
          } else {
            newContent = `iban:${paymentAccount}?amount=${paymentAmount}`;
          }
        } else {
          newContent = 'payment:details';
        }
        break;
      default:
        break;
    }
    
    if (qrSubType !== 'url' && newContent) {
      setContent(newContent);
    }
  }, [
    qrSubType, waPhone, waMessage, tgUsername, fbUrl, igUsername, liUrl, ytUrl, ttUsername, xUsername, xText,
    fileUrl, gformsUrl, mapsLat, mapsLng, calTitle, calStart, calEnd, calLocation, calDesc, meetUrl, meetPlatform,
    appUrl, appStoreUrl, playStoreUrl, vcName, vcPhone, vcEmail, vcOrg, vcTitle, vcUrl, cpName, cpDesc, cpWebsite, cpPhone,
    prodName, prodSku, prodPrice, prodDesc, prodUrl, cryptoType, cryptoAddress, cryptoAmount,
    paymentType, paymentAccount, paymentAmount, paymentCurrency
  ]);
  const [activeCategory, setActiveCategory] = useState('social');

  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(10);
    let progress = 10;
    const interval = setInterval(() => {
      progress += 30;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(null);
        const randomId = Math.floor(Math.random() * 1000000);
        setFileUrl(`https://firebasestorage.googleapis.com/v0/b/qruniverse.appspot.com/o/uploads%2Ffile_${randomId}.${type}?alt=media`);
      } else {
        setUploadProgress(progress);
      }
    }, 300);
  };

  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [gradientType, setGradientType] = useState<'none' | 'linear' | 'radial'>('none');
  const [gradColor1, setGradColor1] = useState('#6366F1');
  const [gradColor2, setGradColor2] = useState('#EC4899');
  const [gradAngle, setGradAngle] = useState(90);

  const [dotStyle, setDotStyle] = useState<'square' | 'rounded' | 'circle' | 'diamond' | 'star' | 'classy' | 'extra-rounded' | 'modern-pixel'>('square');
  const [eyeStyle, setEyeStyle] = useState<'square' | 'rounded' | 'circle' | 'diamond' | 'leaf' | 'modern' | 'minimal'>('square');
  const [eyeColor, setEyeColor] = useState('#0F172A');

  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(18);
  const [protectLogoBackground, setProtectLogoBackground] = useState(true);

  // Frames & Borders
  const [frameType, setFrameType] = useState<'none' | 'classic' | 'speech-bubble' | 'minimal-border' | 'business-card'>('none');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [frameColor, setFrameColor] = useState('#6366F1');
  const [ctaTextSize, setCtaTextSize] = useState(14);

  // Studio UX States
  const [savedColors, setSavedColors] = useState<string[]>(['#0F172A', '#6366F1', '#10B981', '#F59E0B', '#EC4899']);
  const [customTemplates, setCustomTemplates] = useState<QRTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'templates' | 'content' | 'colors' | 'shapes' | 'logo' | 'frame'>('templates');
  const [zoom, setZoom] = useState(100);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [history, setHistory] = useState<Omit<QRTemplate, 'name'>[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Push design settings to Undo/Redo history
  const saveToHistory = (settings: Omit<QRTemplate, 'name'>) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(settings);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const getSettingsObj = (): Omit<QRTemplate, 'name'> => ({
    fgColor, bgColor, gradientType, gradColor1, gradColor2, gradAngle,
    dotStyle, eyeStyle, eyeColor, logo, logoSize, frameType, frameText,
    frameColor, ctaTextSize
  });

  const loadSettingsObj = (settings: Omit<QRTemplate, 'name'>) => {
    setFgColor(settings.fgColor);
    setBgColor(settings.bgColor);
    setGradientType(settings.gradientType);
    setGradColor1(settings.gradColor1);
    setGradColor2(settings.gradColor2);
    setGradAngle(settings.gradAngle);
    setDotStyle(settings.dotStyle);
    setEyeStyle(settings.eyeStyle);
    setEyeColor(settings.eyeColor);
    setLogo(settings.logo);
    setLogoSize(settings.logoSize);
    setFrameType(settings.frameType);
    setFrameText(settings.frameText);
    setFrameColor(settings.frameColor);
    setCtaTextSize(settings.ctaTextSize);
  };

  // Trigger undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      loadSettingsObj(history[prevIndex]);
    }
  };

  // Trigger redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      loadSettingsObj(history[nextIndex]);
    }
  };

  // Load Custom Templates on startup
  useEffect(() => {
    const saved = localStorage.getItem('qr_custom_templates');
    if (saved) {
      setCustomTemplates(JSON.parse(saved));
    }
    // Initialize history
    const initial = getSettingsObj();
    setHistory([initial]);
    setHistoryIndex(0);
  }, []);

  // Recalculate and Draw QR code on Canvas
  useEffect(() => {
    drawQR();
  }, [
    content, fgColor, bgColor, gradientType, gradColor1, gradColor2, gradAngle,
    dotStyle, eyeStyle, eyeColor, logo, logoSize, protectLogoBackground,
    frameType, frameText, frameColor, ctaTextSize
  ]);

  const drawQR = (scaleMultiplier = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use High Correction level 'Q' to protect readability with overlay logos
    const qr = qrcode(0, 'Q');
    qr.addData(content || ' ');
    qr.make();

    const moduleCount = qr.getModuleCount();
    
    // Core Layout Metrics
    const qrBaseSize = 300 * scaleMultiplier;
    const padding = 20 * scaleMultiplier;
    
    let canvasWidth = qrBaseSize + padding * 2;
    let canvasHeight = qrBaseSize + padding * 2;
    let qrOffsetY = padding;

    // Adjust Canvas bounds if a Frame is active
    if (frameType === 'classic' || frameType === 'speech-bubble') {
      canvasHeight += 80 * scaleMultiplier;
      if (frameType === 'speech-bubble') {
        qrOffsetY += 65 * scaleMultiplier;
      }
    } else if (frameType === 'minimal-border') {
      canvasWidth += 16 * scaleMultiplier;
      canvasHeight += 16 * scaleMultiplier;
    } else if (frameType === 'business-card') {
      canvasHeight += 120 * scaleMultiplier;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 1. Draw Canvas background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Draw Decorative Frames underneath/around QR code
    if (frameType !== 'none') {
      ctx.save();
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 6 * scaleMultiplier;
      ctx.lineJoin = 'round';

      if (frameType === 'classic') {
        // Rounded border card
        ctx.strokeRect(8 * scaleMultiplier, 8 * scaleMultiplier, canvasWidth - 16 * scaleMultiplier, canvasHeight - 16 * scaleMultiplier);
        
        // Draw footer label background
        ctx.fillStyle = frameColor;
        ctx.fillRect(8 * scaleMultiplier, canvasHeight - 68 * scaleMultiplier, canvasWidth - 16 * scaleMultiplier, 60 * scaleMultiplier);

        // Draw CTA label text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `black ${ctaTextSize * scaleMultiplier}px Cairo, Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(frameText, canvasWidth / 2, canvasHeight - 38 * scaleMultiplier);

      } else if (frameType === 'speech-bubble') {
        // Speech Bubble card border
        ctx.strokeRect(8 * scaleMultiplier, 8 * scaleMultiplier, canvasWidth - 16 * scaleMultiplier, canvasHeight - 16 * scaleMultiplier);
        
        // Header bubble background
        ctx.fillStyle = frameColor;
        ctx.fillRect(8 * scaleMultiplier, 8 * scaleMultiplier, canvasWidth - 16 * scaleMultiplier, 60 * scaleMultiplier);
        
        // Pointer pointing down
        ctx.beginPath();
        ctx.moveTo(canvasWidth / 2 - 12 * scaleMultiplier, 68 * scaleMultiplier);
        ctx.lineTo(canvasWidth / 2 + 12 * scaleMultiplier, 68 * scaleMultiplier);
        ctx.lineTo(canvasWidth / 2, 80 * scaleMultiplier);
        ctx.closePath();
        ctx.fill();

        // CTA Text in header bubble
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${ctaTextSize * scaleMultiplier}px Cairo, Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(frameText, canvasWidth / 2, 38 * scaleMultiplier);

      } else if (frameType === 'minimal-border') {
        // Clean double borders
        ctx.lineWidth = 2 * scaleMultiplier;
        ctx.strokeRect(4 * scaleMultiplier, 4 * scaleMultiplier, canvasWidth - 8 * scaleMultiplier, canvasHeight - 8 * scaleMultiplier);
        ctx.lineWidth = 4 * scaleMultiplier;
        ctx.strokeRect(10 * scaleMultiplier, 10 * scaleMultiplier, canvasWidth - 20 * scaleMultiplier, canvasHeight - 20 * scaleMultiplier);

      } else if (frameType === 'business-card') {
        // Card styling
        ctx.strokeRect(8 * scaleMultiplier, 8 * scaleMultiplier, canvasWidth - 16 * scaleMultiplier, canvasHeight - 16 * scaleMultiplier);
        ctx.fillStyle = frameColor;
        ctx.fillRect(8 * scaleMultiplier, canvasHeight - 110 * scaleMultiplier, canvasWidth - 16 * scaleMultiplier, 4 * scaleMultiplier);
        
        ctx.fillStyle = '#64748B';
        ctx.font = `bold ${10 * scaleMultiplier}px Cairo, Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('QR CODE POWERED', canvasWidth / 2, canvasHeight - 80 * scaleMultiplier);

        ctx.fillStyle = fgColor;
        ctx.font = `black ${ctaTextSize * scaleMultiplier}px Cairo, Inter, sans-serif`;
        ctx.fillText(frameText, canvasWidth / 2, canvasHeight - 40 * scaleMultiplier);
      }
      ctx.restore();
    }

    // 3. Render QR Code Modules
    const cellSize = qrBaseSize / moduleCount;
    const qrOffsetX = (canvasWidth - qrBaseSize) / 2;

    // Helper: Checks if cell is within the three standard Corner Finding Eyes (7x7 zones)
    const isEyeZone = (r: number, c: number) => {
      if (r < 7 && c < 7) return 'top-left';
      if (r < 7 && c >= moduleCount - 7) return 'top-right';
      if (r >= moduleCount - 7 && c < 7) return 'bottom-left';
      return null;
    };

    // Helper: Checks if cell is inside the center logo protection zone
    const isLogoProtectedZone = (r: number, c: number) => {
      if (!logo || !protectLogoBackground) return false;
      const centerLimit = Math.floor(moduleCount * (logoSize / 100)) / 2;
      const mid = Math.floor(moduleCount / 2);
      return (
        r >= mid - centerLimit - 1 &&
        r <= mid + centerLimit + 1 &&
        c >= mid - centerLimit - 1 &&
        c <= mid + centerLimit + 1
      );
    };

    // Establish Gradient Color settings
    let qrStyle: string | CanvasGradient = fgColor;
    if (gradientType === 'linear') {
      const grad = ctx.createLinearGradient(
        qrOffsetX, qrOffsetY,
        qrOffsetX + qrBaseSize, qrOffsetY + qrBaseSize
      );
      grad.addColorStop(0, gradColor1);
      grad.addColorStop(1, gradColor2);
      qrStyle = grad;
    } else if (gradientType === 'radial') {
      const grad = ctx.createRadialGradient(
        qrOffsetX + qrBaseSize / 2, qrOffsetY + qrBaseSize / 2, 10,
        qrOffsetX + qrBaseSize / 2, qrOffsetY + qrBaseSize / 2, qrBaseSize / 1.5
      );
      grad.addColorStop(0, gradColor1);
      grad.addColorStop(1, gradColor2);
      qrStyle = grad;
    }

    // Draw normal data dots
    ctx.fillStyle = qrStyle;
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qr.isDark(r, c)) {
          if (isEyeZone(r, c) || isLogoProtectedZone(r, c)) {
            continue; // Skip eyes and logo center modules
          }

          const cx = qrOffsetX + c * cellSize;
          const cy = qrOffsetY + r * cellSize;

          ctx.save();
          ctx.fillStyle = qrStyle;

          if (dotStyle === 'square') {
            ctx.fillRect(cx, cy, cellSize + 0.5, cellSize + 0.5);
          } else if (dotStyle === 'rounded') {
            ctx.beginPath();
            ctx.arc(cx + cellSize / 2, cy + cellSize / 2, cellSize * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else if (dotStyle === 'circle') {
            ctx.beginPath();
            ctx.arc(cx + cellSize / 2, cy + cellSize / 2, cellSize * 0.35, 0, Math.PI * 2);
            ctx.fill();
          } else if (dotStyle === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(cx + cellSize / 2, cy);
            ctx.lineTo(cx + cellSize, cy + cellSize / 2);
            ctx.lineTo(cx + cellSize / 2, cy + cellSize);
            ctx.lineTo(cx, cy + cellSize / 2);
            ctx.closePath();
            ctx.fill();
          } else if (dotStyle === 'star') {
            drawStar(ctx, cx + cellSize / 2, cy + cellSize / 2, 5, cellSize * 0.5, cellSize * 0.25);
          } else if (dotStyle === 'classy') {
            // Elegant circles with small gaps
            ctx.beginPath();
            ctx.arc(cx + cellSize / 2, cy + cellSize / 2, cellSize * 0.32, 0, Math.PI * 2);
            ctx.fill();
          } else if (dotStyle === 'extra-rounded') {
            ctx.beginPath();
            ctx.roundRect?.(cx + 0.5, cy + 0.5, cellSize - 1, cellSize - 1, cellSize * 0.45);
            ctx.fill();
          } else if (dotStyle === 'modern-pixel') {
            // Smaller technical pixels
            ctx.fillRect(cx + cellSize * 0.15, cy + cellSize * 0.15, cellSize * 0.7, cellSize * 0.7);
          }

          ctx.restore();
        }
      }
    }

    // 4. Render Corner Eyes (Three 7x7 outer/inner structures)
    const drawEye = (x: number, y: number) => {
      ctx.save();
      ctx.fillStyle = eyeColor;
      ctx.strokeStyle = eyeColor;
      ctx.lineWidth = cellSize;

      const eyeWidth = cellSize * 7;
      const eyeCoreOffset = cellSize * 2;
      const eyeCoreWidth = cellSize * 3;

      if (eyeStyle === 'square') {
        // Outer box border
        ctx.strokeRect(x + cellSize / 2, y + cellSize / 2, eyeWidth - cellSize, eyeWidth - cellSize);
        // Inner core
        ctx.fillRect(x + eyeCoreOffset, y + eyeCoreOffset, eyeCoreWidth, eyeCoreWidth);
      } else if (eyeStyle === 'rounded') {
        // Rounded corners eye
        ctx.beginPath();
        ctx.roundRect?.(x + cellSize / 2, y + cellSize / 2, eyeWidth - cellSize, eyeWidth - cellSize, cellSize * 1.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.roundRect?.(x + eyeCoreOffset, y + eyeCoreOffset, eyeCoreWidth, eyeCoreWidth, cellSize * 0.6);
        ctx.fill();
      } else if (eyeStyle === 'circle') {
        // Full circular eyes
        ctx.beginPath();
        ctx.arc(x + eyeWidth / 2, y + eyeWidth / 2, (eyeWidth - cellSize) / 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x + eyeWidth / 2, y + eyeWidth / 2, eyeCoreWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (eyeStyle === 'diamond') {
        // Rotated diamond eyes
        ctx.save();
        ctx.translate(x + eyeWidth / 2, y + eyeWidth / 2);
        ctx.rotate(Math.PI / 4);
        ctx.strokeRect(-eyeWidth / 2.8, -eyeWidth / 2.8, eyeWidth / 1.4, eyeWidth / 1.4);
        ctx.fillRect(-eyeCoreWidth / 2, -eyeCoreWidth / 2, eyeCoreWidth, eyeCoreWidth);
        ctx.restore();
      } else if (eyeStyle === 'leaf') {
        // Organic leaf eye shape (curved opposite corners)
        ctx.beginPath();
        ctx.moveTo(x + cellSize / 2, y + eyeWidth / 2);
        ctx.bezierCurveTo(x + cellSize / 2, y + cellSize / 2, x + eyeWidth / 2, y + cellSize / 2, x + eyeWidth - cellSize / 2, y + cellSize / 2);
        ctx.bezierCurveTo(x + eyeWidth - cellSize / 2, y + eyeWidth / 2, x + eyeWidth - cellSize / 2, y + eyeWidth - cellSize / 2, x + eyeWidth - cellSize / 2, y + eyeWidth - cellSize / 2);
        ctx.bezierCurveTo(x + eyeWidth / 2, y + eyeWidth - cellSize / 2, x + cellSize / 2, y + eyeWidth - cellSize / 2, x + cellSize / 2, y + eyeWidth - cellSize / 2);
        ctx.closePath();
        ctx.stroke();

        ctx.fillRect(x + eyeCoreOffset, y + eyeCoreOffset, eyeCoreWidth, eyeCoreWidth);
      } else if (eyeStyle === 'modern') {
        // Fluid modern corners
        ctx.beginPath();
        ctx.roundRect?.(x + cellSize / 2, y + cellSize / 2, eyeWidth - cellSize, eyeWidth - cellSize, [cellSize * 2, cellSize * 0.4, cellSize * 2, cellSize * 0.4]);
        ctx.stroke();

        ctx.beginPath();
        ctx.roundRect?.(x + eyeCoreOffset, y + eyeCoreOffset, eyeCoreWidth, eyeCoreWidth, [cellSize * 0.8, cellSize * 0.2, cellSize * 0.8, cellSize * 0.2]);
        ctx.fill();
      } else if (eyeStyle === 'minimal') {
        // Thin borders, small dot core
        ctx.lineWidth = 1.5 * scaleMultiplier;
        ctx.strokeRect(x + cellSize / 2, y + cellSize / 2, eyeWidth - cellSize, eyeWidth - cellSize);
        ctx.beginPath();
        ctx.arc(x + eyeWidth / 2, y + eyeWidth / 2, cellSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const eyeSize = cellSize * 7;
    // Draw top-left
    drawEye(qrOffsetX, qrOffsetY);
    // Draw top-right
    drawEye(qrOffsetX + qrBaseSize - eyeSize, qrOffsetY);
    // Draw bottom-left
    drawEye(qrOffsetX, qrOffsetY + qrBaseSize - eyeSize);

    // 5. Draw Centered Logo Image Overlay
    if (logo) {
      const img = new Image();
      img.src = logo;
      img.onload = () => {
        const logoTargetSize = qrBaseSize * (logoSize / 100);
        const lx = qrOffsetX + (qrBaseSize - logoTargetSize) / 2;
        const ly = qrOffsetY + (qrBaseSize - logoTargetSize) / 2;

        ctx.save();
        if (protectLogoBackground) {
          ctx.fillStyle = bgColor;
          // Clean background square underneath the logo
          ctx.beginPath();
          ctx.roundRect?.(
            lx - 6 * scaleMultiplier, 
            ly - 6 * scaleMultiplier, 
            logoTargetSize + 12 * scaleMultiplier, 
            logoTargetSize + 12 * scaleMultiplier, 
            8 * scaleMultiplier
          );
          ctx.fill();
        }

        ctx.drawImage(img, lx, ly, logoTargetSize, logoTargetSize);
        ctx.restore();
      };
    }
  };

  // Helper function to draw a 5-point star path
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  // Handle Logo Upload and trigger preview
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const prev = getSettingsObj();
      setLogo(reader.result as string);
      saveToHistory({ ...prev, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // Color Saver
  const saveFavoriteColor = (color: string) => {
    if (!savedColors.includes(color)) {
      setSavedColors([...savedColors, color]);
    }
  };

  // Preset Load
  const applyPreset = (preset: { color1: string; color2: string }) => {
    const prev = getSettingsObj();
    setGradientType('linear');
    setGradColor1(preset.color1);
    setGradColor2(preset.color2);
    saveToHistory({ ...prev, gradientType: 'linear', gradColor1: preset.color1, gradColor2: preset.color2 });
  };

  // Load custom or default template
  const applyTemplate = (template: QRTemplate) => {
    const prev = getSettingsObj();
    loadSettingsObj(template);
    saveToHistory({ ...prev, ...template });
  };

  // Save Current Design as Custom Template in localStorage
  const saveDesignTemplate = () => {
    const templateName = prompt(language === 'ar' ? 'أدخل اسم النموذج لحفظه:' : 'Enter template name:');
    if (!templateName) return;

    const newTemplate: QRTemplate = {
      id: 'template_' + Date.now(),
      name: templateName,
      ...getSettingsObj()
    };

    const updated = [...customTemplates, newTemplate];
    setCustomTemplates(updated);
    localStorage.setItem('qr_custom_templates', JSON.stringify(updated));
  };

  const deleteTemplate = (id: string | undefined) => {
    if (!id) return;
    const updated = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updated);
    localStorage.setItem('qr_custom_templates', JSON.stringify(updated));
  };

  // Smart Design Validation Score Calculation (0-100)
  const getScannabilityReport = () => {
    let score = 100;
    const warnings: string[] = [];

    // Helper: Simple YIQ luminance formula to check colors contrast
    const hexToYiq = (hex: string) => {
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000;
    };

    const bgLuminance = hexToYiq(bgColor);
    
    // Check contrast for solid or gradients
    let fgLuminance = hexToYiq(fgColor);
    if (gradientType !== 'none') {
      const avgYiq = (hexToYiq(gradColor1) + hexToYiq(gradColor2)) / 2;
      fgLuminance = avgYiq;
    }

    const contrastDiff = Math.abs(bgLuminance - fgLuminance);

    if (contrastDiff < 80) {
      score -= 40;
      warnings.push(
        language === 'ar' 
          ? 'تباين الألوان ضعيف جداً! قد يواجه بعض القراء صعوبة في مسح الرمز.' 
          : 'Low color contrast! Some scanners may struggle to read the QR code.'
      );
    } else if (contrastDiff < 130) {
      score -= 15;
      warnings.push(
        language === 'ar' 
          ? 'تباين الألوان متوسط، ننصح بجعل لون الكود أغمق ولون الخلفية أفتح.' 
          : 'Moderate contrast. Recommended to use darker foreground or lighter background.'
      );
    }

    // Check logo size ratio
    if (logo) {
      if (logoSize > 25) {
        score -= 25;
        warnings.push(
          language === 'ar' 
            ? 'حجم الشعار كبير جداً! قد يغطي على تفاصيل مشفرة مهمة في الرمز.' 
            : 'Logo size is too large! It may cover critical encoded elements.'
        );
      } else if (logoSize > 20) {
        score -= 10;
        warnings.push(
          language === 'ar' 
            ? 'حجم الشعار متوسط، احرص على تجربة مسح الرمز قبل طباعته.' 
            : 'Moderate logo size. Make sure to test scan before printing.'
        );
      }
    }

    // Invert colors safety check
    if (fgLuminance > bgLuminance) {
      score -= 20;
      warnings.push(
        language === 'ar' 
          ? 'الرمز مقلوب (الخلفية أغمق من الكود). بعض قارئات رموز QR القديمة لا تدعم هذا النمط.' 
          : 'Inverted colors (background darker than foreground). Some older scanner apps do not support this.'
      );
    }

    return { score: Math.max(score, 0), warnings };
  };

  const validationReport = getScannabilityReport();

  // Export File Formats
  const triggerExport = (format: 'png' | 'svg' | 'pdf' | 'high-res') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === 'png') {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${qrName}.png`;
      a.click();
    } else if (format === 'high-res') {
      // Create high-res canvas at 4x scale
      const tempCanvas = document.createElement('canvas');
      // Override ref temporarily to draw at 4x
      const oldCanvasRef = canvasRef.current;
      (canvasRef as any).current = tempCanvas;
      
      drawQR(4); // Render at 4x multiplier
      
      const url = tempCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${qrName}_Print_Ready.png`;
      a.click();

      // Restore original canvas rendering
      (canvasRef as any).current = oldCanvasRef;
      drawQR();
    } else if (format === 'svg') {
      // Export vector mockup
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <image href="${canvas.toDataURL()}" width="100%" height="100%" />
      </svg>`;
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${qrName}.svg`;
      a.click();
    } else if (format === 'pdf') {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(20);
      pdf.text(qrName, 105, 40, { align: 'center' });
      pdf.addImage(imgData, 'PNG', 55, 60, 100, 100 * (canvas.height / canvas.width));
      pdf.save(`${qrName}.pdf`);
    }
  };

  const tabList = [
    { id: 'templates', label: language === 'ar' ? 'النماذج الجاهزة' : 'Design Templates' },
    { id: 'content', label: language === 'ar' ? 'المحتوى' : 'QR Destination' },
    { id: 'colors', label: language === 'ar' ? 'الألوان والتدرجات' : 'Colors & Gradients' },
    { id: 'shapes', label: language === 'ar' ? 'شكل الكود والأعين' : 'Dots & Eyes' },
    { id: 'logo', label: language === 'ar' ? 'الشعار' : 'Logo Upload' },
    { id: 'frame', label: language === 'ar' ? 'الإطارات والـ CTA' : 'Frames & CTA' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right font-body min-h-[600px]">
      
      {/* 1. Left Column: Customization Panel (Col Span 7) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Customization Navigation tabs */}
        <div className="flex overflow-x-auto gap-2 bg-neutral-100 dark:bg-neutral-900 p-2 rounded-2xl border border-border dark:border-gray-800 scrollbar-none">
          {tabList.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === t.id 
                  ? 'bg-white dark:bg-neutral-800 text-accent shadow-sm' 
                  : 'text-textMuted dark:text-gray-400 hover:text-textDark dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Templates Panel */}
        {activeTab === 'templates' && (
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle>{language === 'ar' ? 'اختر نموذج تصميم جاهز' : 'Choose a Design Template'}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-3">
                <h4 className="text-xs font-black text-textMuted dark:text-gray-400 uppercase">{language === 'ar' ? 'النماذج الأساسية' : 'Default Presets'}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DEFAULT_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyTemplate(tmpl)}
                      className="p-4 rounded-xl border border-border dark:border-gray-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:border-accent hover:bg-neutral-50 transition-all flex flex-col items-center gap-2 text-center"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ background: tmpl.gradientType !== 'none' ? `linear-gradient(${tmpl.gradAngle}deg, ${tmpl.gradColor1}, ${tmpl.gradColor2})` : tmpl.fgColor }}>
                        <Sparkles size={16} />
                      </div>
                      <span className="text-[11px] font-bold text-textDark dark:text-white">{tmpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-border dark:border-gray-800 pt-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-textMuted dark:text-gray-400 uppercase">{language === 'ar' ? 'نماذجي المحفوظة' : 'My Saved Templates'}</h4>
                  <Button size="sm" onClick={saveDesignTemplate} className="text-xs gap-1 font-bold">
                    <Save size={12} /> {language === 'ar' ? 'حفظ التصميم الحالي' : 'Save Design'}
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {customTemplates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className="p-3.5 rounded-xl border border-border dark:border-gray-800 bg-white dark:bg-neutral-850 flex justify-between items-center gap-2"
                    >
                      <button
                        onClick={() => applyTemplate(tmpl)}
                        className="flex-1 flex items-center gap-2 text-right"
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tmpl.fgColor }} />
                        <span className="text-[11px] font-bold text-textDark dark:text-white truncate max-w-[100px]">{tmpl.name}</span>
                      </button>
                      <button
                        onClick={() => deleteTemplate(tmpl.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))}
                  {customTemplates.length === 0 && (
                    <div className="col-span-full text-center text-xs text-textMuted dark:text-gray-500 py-6 font-semibold">
                      {language === 'ar' ? 'لا توجد نماذج محفوظة بعد.' : 'No saved templates yet.'}
                    </div>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        )}

        {/* Tab 2: QR Code Content Target */}
        {activeTab === 'content' && (() => {
          const categoriesList = [
            { id: 'social', title: language === 'ar' ? 'شبكات وتواصل' : 'Web & Social', icon: Globe },
            { id: 'files', title: language === 'ar' ? 'ملفات ووسائط' : 'Files & Media', icon: FileText },
            { id: 'productivity', title: language === 'ar' ? 'الإنتاجية والعمل' : 'Productivity', icon: CalendarIcon },
            { id: 'apps', title: language === 'ar' ? 'تطبيقات الجوال' : 'Mobile Apps', icon: Smartphone },
            { id: 'business', title: language === 'ar' ? 'الأعمال وبطاقات' : 'Business & vCard', icon: Contact },
            { id: 'finance', title: language === 'ar' ? 'المالية والدفع' : 'Finance & Crypto', icon: CreditCard }
          ];

          const getSubTypesList = (catId: string) => {
            switch (catId) {
              case 'social':
                return [
                  { id: 'url', label: language === 'ar' ? 'رابط موقع ويب' : 'Website URL', icon: Globe },
                  { id: 'whatsapp', label: language === 'ar' ? 'واتساب' : 'WhatsApp', icon: MessageCircle },
                  { id: 'telegram', label: language === 'ar' ? 'تليجرام' : 'Telegram', icon: Send },
                  { id: 'facebook', label: language === 'ar' ? 'فيسبوك' : 'Facebook', icon: Facebook },
                  { id: 'instagram', label: language === 'ar' ? 'انستغرام' : 'Instagram', icon: Instagram },
                  { id: 'linkedin', label: language === 'ar' ? 'لينكد إن' : 'LinkedIn', icon: Linkedin },
                  { id: 'youtube', label: language === 'ar' ? 'يوتيوب' : 'YouTube', icon: Youtube },
                  { id: 'tiktok', label: language === 'ar' ? 'تيك توك' : 'TikTok', icon: Music },
                  { id: 'twitter', label: language === 'ar' ? 'منصة إكس' : 'X (Twitter)', icon: Twitter }
                ];
              case 'files':
                return [
                  { id: 'pdf', label: language === 'ar' ? 'ملف PDF' : 'PDF Document', icon: FileText },
                  { id: 'video', label: language === 'ar' ? 'ملف فيديو' : 'Video File', icon: Video },
                  { id: 'audio', label: language === 'ar' ? 'ملف صوتي MP3' : 'Audio Track', icon: Music },
                  { id: 'image', label: language === 'ar' ? 'ملف صورة' : 'Image File', icon: FileImage }
                ];
              case 'productivity':
                return [
                  { id: 'gforms', label: language === 'ar' ? 'نماذج جوجل' : 'Google Forms', icon: FileText },
                  { id: 'gmaps', label: language === 'ar' ? 'خريطة جوجل' : 'Google Maps', icon: MapPin },
                  { id: 'calendar', label: language === 'ar' ? 'حدث تقويم' : 'Calendar Event', icon: CalendarIcon },
                  { id: 'meeting', label: language === 'ar' ? 'دعوة اجتماع' : 'Meeting Invite', icon: Users }
                ];
              case 'apps':
                return [
                  { id: 'appdownload', label: language === 'ar' ? 'رابط تحميل التطبيق' : 'App Download URL', icon: Link2 },
                  { id: 'appstore', label: language === 'ar' ? 'متجر آبل App Store' : 'Apple App Store', icon: Apple },
                  { id: 'playstore', label: language === 'ar' ? 'متجر جوجل Play Store' : 'Google Play Store', icon: Play }
                ];
              case 'business':
                return [
                  { id: 'vcard', label: language === 'ar' ? 'بطاقة اتصال vCard' : 'Digital Business Card', icon: Contact },
                  { id: 'company', label: language === 'ar' ? 'ملف الشركة' : 'Company Profile', icon: Building2 },
                  { id: 'product', label: language === 'ar' ? 'معلومات المنتج' : 'Product Information', icon: ShoppingBag }
                ];
              case 'finance':
                return [
                  { id: 'crypto', label: language === 'ar' ? 'عملة مشفرة' : 'Crypto Wallet', icon: Coins },
                  { id: 'payment', label: language === 'ar' ? 'طلب دفع مالي' : 'Payment Request', icon: CreditCard }
                ];
              default:
                return [];
            }
          };

          const renderSubTypeForm = () => {
            const labelClass = "text-xs font-bold text-textDark/80 dark:text-gray-300";
            const inputClass = "w-full";
            switch (qrSubType) {
              case 'url':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط الموقع الإلكتروني' : 'Website URL'}</label>
                      <Input type="url" value={content} onChange={e => setContent(e.target.value)} placeholder="https://example.com" className={inputClass} />
                    </div>
                    <p className="text-[10px] text-textMuted dark:text-gray-400">
                      {language === 'ar' ? 'أدخل أي رابط ويب صالح يبدأ بـ http:// أو https://' : 'Enter any valid website link starting with http:// or https://'}
                    </p>
                  </div>
                );
              case 'whatsapp':
                return (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رقم الهاتف (مع رمز الدولة، بدون + أو أصفار)' : 'Phone Number (with Country Code, no + or 00)'}</label>
                      <Input type="tel" value={waPhone} onChange={e => setWaPhone(e.target.value)} placeholder="966500000000" className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'الرسالة الافتراضية (تظهر عند المسح)' : 'Default Message (appears when scanned)'}</label>
                      <Input value={waMessage} onChange={e => setWaMessage(e.target.value)} placeholder={language === 'ar' ? 'مرحباً، أود الاستفسار عن...' : 'Hello, I want to inquire about...'} className={inputClass} />
                    </div>
                  </div>
                );
              case 'telegram':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'اسم المستخدم (بدون @)' : 'Telegram Username (without @)'}</label>
                      <Input value={tgUsername} onChange={e => setTgUsername(e.target.value)} placeholder="my_username" className={inputClass} />
                    </div>
                  </div>
                );
              case 'facebook':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط حساب أو صفحة الفيسبوك' : 'Facebook URL'}</label>
                      <Input type="url" value={fbUrl} onChange={e => setFbUrl(e.target.value)} placeholder="https://facebook.com/username" className={inputClass} />
                    </div>
                  </div>
                );
              case 'instagram':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'اسم مستخدم انستغرام (بدون @)' : 'Instagram Username (without @)'}</label>
                      <Input value={igUsername} onChange={e => setIgUsername(e.target.value)} placeholder="my_brand" className={inputClass} />
                    </div>
                  </div>
                );
              case 'linkedin':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط الملف الشخصي على لينكد إن' : 'LinkedIn Profile URL'}</label>
                      <Input type="url" value={liUrl} onChange={e => setLiUrl(e.target.value)} placeholder="https://linkedin.com/in/username" className={inputClass} />
                    </div>
                  </div>
                );
              case 'youtube':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط القناة أو الفيديو على يوتيوب' : 'YouTube URL'}</label>
                      <Input type="url" value={ytUrl} onChange={e => setYtUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className={inputClass} />
                    </div>
                  </div>
                );
              case 'tiktok':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'اسم مستخدم تيك توك (بدون @)' : 'TikTok Username (without @)'}</label>
                      <Input value={ttUsername} onChange={e => setTtUsername(e.target.value)} placeholder="brand_tiktok" className={inputClass} />
                    </div>
                  </div>
                );
              case 'twitter':
                return (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'اسم المستخدم على منصة إكس (تويتر) (بدون @)' : 'X/Twitter Username (without @)'}</label>
                      <Input value={xUsername} onChange={e => setXUsername(e.target.value)} placeholder="my_x_handle" className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'نص التغريدة الافتراضي (اختياري)' : 'Default Tweet Text (Optional)'}</label>
                      <Input value={xText} onChange={e => setXText(e.target.value)} placeholder={language === 'ar' ? 'اكتب تغريدة جاهزة للنشر عند المسح' : 'Write a tweet that users can post when scanned'} className={inputClass} />
                    </div>
                  </div>
                );
              case 'pdf':
              case 'video':
              case 'audio':
              case 'image':
                return (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className={labelClass}>
                        {language === 'ar' 
                          ? `رفع ملف ${qrSubType.toUpperCase()}` 
                          : `Upload ${qrSubType.toUpperCase()} File`}
                      </label>
                      <div className="border border-dashed border-border dark:border-gray-800 rounded-xl p-5 text-center bg-neutral-50/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/10 transition-all relative">
                        <input 
                          type="file" 
                          accept={
                            qrSubType === 'pdf' ? '.pdf' :
                            qrSubType === 'video' ? 'video/*' :
                            qrSubType === 'audio' ? 'audio/*' :
                            'image/*'
                          }
                          onChange={e => handleFileUploadMock(e, qrSubType)} 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-1.5">
                          <Upload className="text-textMuted" size={24} />
                          <span className="text-xs font-bold">{language === 'ar' ? 'اسحب الملف هنا أو اضغط للاختيار' : 'Drag file here or click to select'}</span>
                          <span className="text-[10px] text-textMuted">{language === 'ar' ? 'الحد الأقصى للملف: 20 ميغابايت' : 'Maximum file size: 20MB'}</span>
                        </div>
                      </div>
                    </div>

                    {uploadProgress !== null && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{language === 'ar' ? 'جاري الرفع والتشغيل...' : 'Uploading file...'}</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-accent h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط الملف (المرفوع أو عنوان خارجي مباشر)' : 'File URL (Uploaded or direct external link)'}</label>
                      <Input type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://example.com/file.ext" className={inputClass} />
                    </div>
                  </div>
                );
              case 'gforms':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط نموذج جوجل (Google Forms)' : 'Google Forms URL'}</label>
                      <Input type="url" value={gformsUrl} onChange={e => setGformsUrl(e.target.value)} placeholder="https://docs.google.com/forms/d/..." className={inputClass} />
                    </div>
                  </div>
                );
              case 'gmaps':
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'خط العرض (Latitude)' : 'Latitude'}</label>
                        <Input type="number" step="any" value={mapsLat} onChange={e => setMapsLat(e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'خط الطول (Longitude)' : 'Longitude'}</label>
                        <Input type="number" step="any" value={mapsLng} onChange={e => setMapsLng(e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <p className="text-[10px] text-textMuted dark:text-gray-400">
                      {language === 'ar' 
                        ? 'يمكنك الحصول عليها من خرائط جوجل بالضغط بالزر الأيمن على أي موقع ونسخ الإحداثيات.' 
                        : 'Get coordinates from Google Maps by right-clicking any location and copying.'}
                    </p>
                  </div>
                );
              case 'calendar':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'عنوان الفعالية' : 'Event Title'}</label>
                      <Input value={calTitle} onChange={e => setCalTitle(e.target.value)} placeholder={language === 'ar' ? 'حفل إطلاق المنتج الجديد' : 'New Product Launch Party'} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'تاريخ البدء' : 'Start Date/Time'}</label>
                        <Input type="datetime-local" value={calStart} onChange={e => setCalStart(e.target.value)} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'تاريخ الانتهاء' : 'End Date/Time'}</label>
                        <Input type="datetime-local" value={calEnd} onChange={e => setCalEnd(e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'الموقع الجغرافي للفعالية' : 'Event Location'}</label>
                      <Input value={calLocation} onChange={e => setCalLocation(e.target.value)} placeholder={language === 'ar' ? 'قاعة المؤتمرات، الطابق الثاني' : 'Conference Hall, 2nd Floor'} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'الوصف والتفاصيل' : 'Description'}</label>
                      <textarea 
                        value={calDesc} 
                        onChange={e => setCalDesc(e.target.value)} 
                        placeholder={language === 'ar' ? 'يرجى إحضار بطاقة الدخول المطبوعة...' : 'Please bring your invitation ticket...'} 
                        className="w-full rounded-xl border border-border dark:border-gray-800 bg-neutral-50/20 dark:bg-neutral-850 p-2.5 text-xs text-right dark:text-white dark:focus:border-accent"
                        rows={2}
                      />
                    </div>
                  </div>
                );
              case 'meeting':
                return (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'منصة الاجتماع' : 'Meeting Platform'}</label>
                      <select 
                        value={meetPlatform} 
                        onChange={e => setMeetPlatform(e.target.value)}
                        className="w-full rounded-xl border border-border dark:border-gray-800 bg-white dark:bg-neutral-850 p-2.5 text-xs dark:text-white dark:focus:border-accent"
                      >
                        <option value="zoom">Zoom</option>
                        <option value="teams">Microsoft Teams</option>
                        <option value="meet">Google Meet</option>
                        <option value="webex">Cisco Webex</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط دعوة الاجتماع' : 'Meeting Invitation URL'}</label>
                      <Input type="url" value={meetUrl} onChange={e => setMeetUrl(e.target.value)} placeholder="https://zoom.us/j/..." className={inputClass} />
                    </div>
                  </div>
                );
              case 'appdownload':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط صفحة تحميل التطبيق العام' : 'Universal App Download Link'}</label>
                      <Input type="url" value={appUrl} onChange={e => setAppUrl(e.target.value)} placeholder="https://mycompany.com/download" className={inputClass} />
                    </div>
                  </div>
                );
              case 'appstore':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط تطبيق متجر آبل (App Store URL)' : 'Apple App Store Link'}</label>
                      <Input type="url" value={appStoreUrl} onChange={e => setAppStoreUrl(e.target.value)} placeholder="https://apps.apple.com/app/id..." className={inputClass} />
                    </div>
                  </div>
                );
              case 'playstore':
                return (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'رابط تطبيق متجر جوجل (Google Play Store URL)' : 'Google Play Store Link'}</label>
                      <Input type="url" value={playStoreUrl} onChange={e => setPlayStoreUrl(e.target.value)} placeholder="https://play.google.com/store/apps/details?id=..." className={inputClass} />
                    </div>
                  </div>
                );
              case 'vcard':
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                        <Input value={vcName} onChange={e => setVcName(e.target.value)} placeholder={language === 'ar' ? 'أحمد محمد' : 'John Doe'} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'رقم الجوال' : 'Phone Number'}</label>
                        <Input type="tel" value={vcPhone} onChange={e => setVcPhone(e.target.value)} placeholder="+966500000000" className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                        <Input type="email" value={vcEmail} onChange={e => setVcEmail(e.target.value)} placeholder="example@email.com" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}</label>
                        <Input type="url" value={vcUrl} onChange={e => setVcUrl(e.target.value)} placeholder="https://..." className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'اسم الشركة / المنظمة' : 'Company/Organization'}</label>
                        <Input value={vcOrg} onChange={e => setVcOrg(e.target.value)} placeholder={language === 'ar' ? 'الشركة العالمية للبرمجيات' : 'Global Software Inc.'} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}</label>
                        <Input value={vcTitle} onChange={e => setVcTitle(e.target.value)} placeholder={language === 'ar' ? 'مهندس برمجيات أول' : 'Senior Software Engineer'} className={inputClass} />
                      </div>
                    </div>
                  </div>
                );
              case 'company':
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'اسم الشركة' : 'Company Name'}</label>
                        <Input value={cpName} onChange={e => setCpName(e.target.value)} placeholder={language === 'ar' ? 'ريادة المستقبل' : 'Future Pioneers Ltd'} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'رقم هاتف الشركة' : 'Corporate Phone'}</label>
                        <Input type="tel" value={cpPhone} onChange={e => setCpPhone(e.target.value)} placeholder="+966110000000" className={inputClass} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'الموقع الإلكتروني للشركة' : 'Corporate Website'}</label>
                      <Input type="url" value={cpWebsite} onChange={e => setCpWebsite(e.target.value)} placeholder="https://mycompany.com" className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'وصف مختصر عن الشركة' : 'Company Description'}</label>
                      <textarea 
                        value={cpDesc} 
                        onChange={e => setCpDesc(e.target.value)} 
                        placeholder={language === 'ar' ? 'شركة رائدة في مجال تقديم الحلول التقنية المستدامة...' : 'A leading provider of sustainable technology solutions...'} 
                        className="w-full rounded-xl border border-border dark:border-gray-800 bg-neutral-50/20 dark:bg-neutral-850 p-2.5 text-xs text-right dark:text-white dark:focus:border-accent"
                        rows={3}
                      />
                    </div>
                  </div>
                );
              case 'product':
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2 space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'اسم المنتج' : 'Product Name'}</label>
                        <Input value={prodName} onChange={e => setProdName(e.target.value)} placeholder={language === 'ar' ? 'ساعة ذكية رياضية' : 'Smart Sports Watch'} className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'السعر والعملة' : 'Price & Currency'}</label>
                        <Input value={prodPrice} onChange={e => setProdPrice(e.target.value)} placeholder="199 USD" className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'رقم المنتج (SKU)' : 'Product SKU/Code'}</label>
                        <Input value={prodSku} onChange={e => setProdSku(e.target.value)} placeholder="SW-9988-X" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'رابط الشراء أو الطلب' : 'Buy/Order Link'}</label>
                        <Input type="url" value={prodUrl} onChange={e => setProdUrl(e.target.value)} placeholder="https://store.com/buy" className={inputClass} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'مواصفات وتفاصيل المنتج' : 'Product Specifications'}</label>
                      <textarea 
                        value={prodDesc} 
                        onChange={e => setProdDesc(e.target.value)} 
                        placeholder={language === 'ar' ? 'ساعة مقاومة للماء مع مستشعر ضربات القلب وتتبع اللياقة...' : 'Waterproof sports watch with heart rate sensor and fitness tracking...'} 
                        className="w-full rounded-xl border border-border dark:border-gray-800 bg-neutral-50/20 dark:bg-neutral-850 p-2.5 text-xs text-right dark:text-white dark:focus:border-accent"
                        rows={3}
                      />
                    </div>
                  </div>
                );
              case 'crypto':
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'الرمز والعملة' : 'Crypto Asset'}</label>
                        <select 
                          value={cryptoType} 
                          onChange={e => setCryptoType(e.target.value)}
                          className="w-full rounded-xl border border-border dark:border-gray-800 bg-white dark:bg-neutral-850 p-2.5 text-xs dark:text-white dark:focus:border-accent"
                        >
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="SOL">Solana (SOL)</option>
                          <option value="USDT">Tether (USDT)</option>
                          <option value="LTC">Litecoin (LTC)</option>
                          <option value="DOGE">Dogecoin (DOGE)</option>
                        </select>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'القيمة المطلوبة (اختياري)' : 'Requested Amount (Optional)'}</label>
                        <Input type="number" step="any" value={cryptoAmount} onChange={e => setCryptoAmount(e.target.value)} placeholder="0.05" className={inputClass} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>{language === 'ar' ? 'عنوان المحفظة (Wallet Address)' : 'Wallet Destination Address'}</label>
                      <Input value={cryptoAddress} onChange={e => setCryptoAddress(e.target.value)} placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" className={inputClass} />
                    </div>
                  </div>
                );
              case 'payment':
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'قناة الدفع' : 'Payment Type'}</label>
                        <select 
                          value={paymentType} 
                          onChange={e => setPaymentType(e.target.value)}
                          className="w-full rounded-xl border border-border dark:border-gray-800 bg-white dark:bg-neutral-850 p-2.5 text-xs dark:text-white dark:focus:border-accent"
                        >
                          <option value="paypal">PayPal</option>
                          <option value="upi">UPI (India)</option>
                          <option value="bank">Bank Wire (IBAN)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'المبلغ المطلوب' : 'Amount'}</label>
                        <Input type="number" step="any" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder="50.00" className={inputClass} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>{language === 'ar' ? 'العملة' : 'Currency'}</label>
                        <Input value={paymentCurrency} onChange={e => setPaymentCurrency(e.target.value)} placeholder="USD" className={inputClass} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>
                        {paymentType === 'paypal' ? (language === 'ar' ? 'حساب الباي بال (بريد إلكتروني)' : 'PayPal Email Address') :
                         paymentType === 'upi' ? (language === 'ar' ? 'معرف الدفع UPI ID' : 'UPI ID Address') :
                         (language === 'ar' ? 'رقم الحساب الدولي IBAN' : 'International IBAN Account')}
                      </label>
                      <Input value={paymentAccount} onChange={e => setPaymentAccount(e.target.value)} placeholder={paymentType === 'paypal' ? 'merchant@paypal.com' : paymentType === 'upi' ? 'payee@okaxis' : 'US893704004902049204'} className={inputClass} />
                    </div>
                  </div>
                );
              default:
                return null;
            }
          };

          return (
            <div className="space-y-6">
              
              {/* Project name input */}
              <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-textDark/80 dark:text-gray-300 block uppercase">
                      {language === 'ar' ? 'اسم كود الـ QR والملف المميز' : 'Project Filename / QR Name'}
                    </label>
                    <Input value={qrName} onChange={e => setQrName(e.target.value)} className="font-semibold text-sm" />
                  </div>
                </CardContent>
              </Card>

              {/* Step 1: Category Selector */}
              <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
                <CardHeader className="border-b border-border dark:border-gray-800 pb-3">
                  <CardTitle className="text-sm font-black flex items-center gap-2">
                    <span className="bg-accent/15 text-accent p-1.5 rounded-lg text-xs font-bold">1</span>
                    <span>{language === 'ar' ? 'اختر نوع الفئة والمحتوى للرمز' : 'Select Destination Category'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Categories Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categoriesList.map((cat) => {
                      const CatIcon = cat.icon;
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setActiveCategory(cat.id);
                            const firstSub = getSubTypesList(cat.id)[0];
                            if (firstSub) {
                              setQrSubType(firstSub.id);
                            }
                          }}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all text-right ${
                            isActive 
                              ? 'bg-accent/5 text-accent border-accent shadow-sm' 
                              : 'bg-neutral-50/50 hover:bg-neutral-50 border-border dark:bg-neutral-800/10 dark:border-gray-800 dark:hover:bg-neutral-850'
                          }`}
                        >
                          <CatIcon size={16} className={isActive ? 'text-accent' : 'text-textMuted'} />
                          <span className="truncate">{cat.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Subtypes selector based on active category */}
                  <div className="space-y-2.5 pt-4 border-t border-border dark:border-gray-800">
                    <h4 className="text-[11px] font-black text-textMuted dark:text-gray-400 uppercase">
                      {language === 'ar' ? 'خيارات المحتوى المتاحة' : 'Available Destinations'}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {getSubTypesList(activeCategory).map((sub) => {
                        const SubIcon = sub.icon;
                        const isSelected = qrSubType === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => setQrSubType(sub.id)}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center gap-2 transition-all ${
                              isSelected
                                ? 'bg-accent text-white border-accent shadow-md scale-[1.02]'
                                : 'bg-white hover:border-accent border-border dark:bg-neutral-850 dark:border-gray-800 dark:hover:border-gray-700'
                            }`}
                          >
                            <SubIcon size={18} className={isSelected ? 'text-white' : 'text-accent'} />
                            <span className="text-[11px] font-bold truncate max-w-full">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Dynamic Form Fields */}
              <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
                <CardHeader className="border-b border-border dark:border-gray-800 pb-3">
                  <CardTitle className="text-sm font-black flex items-center gap-2">
                    <span className="bg-accent/15 text-accent p-1.5 rounded-lg text-xs font-bold">2</span>
                    <span>{language === 'ar' ? 'املأ تفاصيل الوجهة والمحتوى' : 'Enter Destination Details'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {renderSubTypeForm()}
                  
                  {/* Small indicator showing compiled target content */}
                  <div className="mt-6 pt-4 border-t border-border dark:border-gray-800 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-textMuted uppercase">
                      <span>{language === 'ar' ? 'المحتوى المشفر النهائي (الرمز المولد)' : 'Compiled QR Payload'}</span>
                      <span className="font-mono text-accent">RAW</span>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800/80 p-2.5 rounded-lg border border-border dark:border-gray-800 text-[10px] font-mono break-all text-left truncate max-h-[60px] overflow-y-auto">
                      {content}
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          );
        })()}

        {/* Tab 3: Colors & Gradients builder */}
        {activeTab === 'colors' && (
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle>{language === 'ar' ? 'لوحة الألوان والتدرجات' : 'Colors & Gradients Studio'}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Type selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'نمط تعبئة لون الكود:' : 'QR Color Fill Style:'}</label>
                <div className="flex gap-2">
                  {(['none', 'linear', 'radial'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        const prev = getSettingsObj();
                        setGradientType(t);
                        saveToHistory({ ...prev, gradientType: t });
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        gradientType === t 
                          ? 'bg-accent text-white border-accent shadow-sm' 
                          : 'bg-white dark:bg-neutral-800 text-textMuted border-border dark:border-gray-750'
                      }`}
                    >
                      {t === 'none' ? (language === 'ar' ? 'لون موحد' : 'Solid Color') :
                       t === 'linear' ? (language === 'ar' ? 'تدرج خطي' : 'Linear') :
                       (language === 'ar' ? 'تدرج دائري' : 'Radial')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gradient presets */}
              {gradientType !== 'none' && (
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'تدرجات جاهزة سريعة' : 'Preset Gradients'}</label>
                  <div className="flex flex-wrap gap-2.5">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyPreset(p)}
                        className="w-8 h-8 rounded-full border border-white dark:border-gray-800 shadow-sm transition-transform hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${p.color1}, ${p.color2})` }}
                        title={p.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border dark:border-gray-800">
                {gradientType === 'none' ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'لون الكود' : 'QR Color'}</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={fgColor} 
                        onChange={e => {
                          const prev = getSettingsObj();
                          setFgColor(e.target.value);
                          saveToHistory({ ...prev, fgColor: e.target.value });
                        }} 
                        className="h-10 w-10 rounded-xl cursor-pointer border border-border dark:border-gray-850 bg-white" 
                      />
                      <Input value={fgColor} onChange={e => {
                        const prev = getSettingsObj();
                        setFgColor(e.target.value);
                        saveToHistory({ ...prev, fgColor: e.target.value });
                      }} className="font-mono text-xs" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'بداية التدرج' : 'Gradient Start'}</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={gradColor1} 
                          onChange={e => {
                            const prev = getSettingsObj();
                            setGradColor1(e.target.value);
                            saveToHistory({ ...prev, gradColor1: e.target.value });
                          }} 
                          className="h-10 w-10 rounded-xl cursor-pointer border border-border bg-white" 
                        />
                        <Input value={gradColor1} onChange={e => {
                          const prev = getSettingsObj();
                          setGradColor1(e.target.value);
                          saveToHistory({ ...prev, gradColor1: e.target.value });
                        }} className="font-mono text-xs" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'نهاية التدرج' : 'Gradient End'}</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={gradColor2} 
                          onChange={e => {
                            const prev = getSettingsObj();
                            setGradColor2(e.target.value);
                            saveToHistory({ ...prev, gradColor2: e.target.value });
                          }} 
                          className="h-10 w-10 rounded-xl cursor-pointer border border-border bg-white" 
                        />
                        <Input value={gradColor2} onChange={e => {
                          const prev = getSettingsObj();
                          setGradColor2(e.target.value);
                          saveToHistory({ ...prev, gradColor2: e.target.value });
                        }} className="font-mono text-xs" />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'لون الخلفية' : 'Background Color'}</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={e => {
                        const prev = getSettingsObj();
                        setBgColor(e.target.value);
                        saveToHistory({ ...prev, bgColor: e.target.value });
                      }} 
                      className="h-10 w-10 rounded-xl cursor-pointer border border-border bg-white" 
                    />
                    <Input value={bgColor} onChange={e => {
                      const prev = getSettingsObj();
                      setBgColor(e.target.value);
                      saveToHistory({ ...prev, bgColor: e.target.value });
                    }} className="font-mono text-xs" />
                  </div>
                </div>
              </div>

              {/* Saved Colors list */}
              <div className="space-y-2 pt-4 border-t border-border dark:border-gray-800">
                <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'ألواني المفضلة' : 'My Saved Colors'}</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {savedColors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const prev = getSettingsObj();
                        setFgColor(c);
                        saveToHistory({ ...prev, fgColor: c });
                      }}
                      className="w-7 h-7 rounded-lg border border-border dark:border-gray-700 shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <button
                    onClick={() => saveFavoriteColor(fgColor)}
                    className="h-7 px-3 border border-dashed border-border dark:border-gray-700 rounded-lg text-[10px] font-bold hover:bg-neutral-50"
                  >
                    + {language === 'ar' ? 'حفظ الحالي' : 'Save Current'}
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>
        )}

        {/* Tab 4: QR Shapes & Corners customization */}
        {activeTab === 'shapes' && (
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle>{language === 'ar' ? 'تصميم شكل النقاط والأعين' : 'Data Dots & Eyes Styles'}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Dot shapes selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'شكل نقاط البيانات (Dots):' : 'Data Dots Style:'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['square', 'rounded', 'circle', 'diamond', 'star', 'classy', 'extra-rounded', 'modern-pixel'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        const prev = getSettingsObj();
                        setDotStyle(s);
                        saveToHistory({ ...prev, dotStyle: s });
                      }}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all truncate text-center ${
                        dotStyle === s 
                          ? 'bg-accent text-white border-accent shadow-sm' 
                          : 'bg-white dark:bg-neutral-800 text-textMuted border-border dark:border-gray-750'
                      }`}
                    >
                      {s === 'square' ? (language === 'ar' ? 'مربع' : 'Square') :
                       s === 'rounded' ? (language === 'ar' ? 'شبه دائري' : 'Rounded') :
                       s === 'circle' ? (language === 'ar' ? 'دائري كامل' : 'Circle') :
                       s === 'diamond' ? (language === 'ar' ? 'معين' : 'Diamond') :
                       s === 'star' ? (language === 'ar' ? 'نجمة' : 'Star') :
                       s === 'classy' ? (language === 'ar' ? 'كلاسيكي' : 'Classy') :
                       s === 'extra-rounded' ? (language === 'ar' ? 'فائق الاستدارة' : 'Extra Rounded') :
                       (language === 'ar' ? 'بكسل حديث' : 'Modern Pixel')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eye shapes selection */}
              <div className="space-y-3 border-t border-border dark:border-gray-800 pt-6">
                <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'شكل الأعين الجانبية (Eyes):' : 'Corner Eyes Style:'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['square', 'rounded', 'circle', 'diamond', 'leaf', 'modern', 'minimal'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        const prev = getSettingsObj();
                        setEyeStyle(s);
                        saveToHistory({ ...prev, eyeStyle: s });
                      }}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all truncate text-center ${
                        eyeStyle === s 
                          ? 'bg-accent text-white border-accent shadow-sm' 
                          : 'bg-white dark:bg-neutral-800 text-textMuted border-border dark:border-gray-750'
                      }`}
                    >
                      {s === 'square' ? (language === 'ar' ? 'مربع كلاسيكي' : 'Classic Square') :
                       s === 'rounded' ? (language === 'ar' ? 'مربع دائري' : 'Rounded Square') :
                       s === 'circle' ? (language === 'ar' ? 'دائري' : 'Circle') :
                       s === 'diamond' ? (language === 'ar' ? 'معين' : 'Diamond') :
                       s === 'leaf' ? (language === 'ar' ? 'شكل ورقة' : 'Leaf') :
                       s === 'modern' ? (language === 'ar' ? 'عصري متدرج' : 'Modern Smooth') :
                       (language === 'ar' ? 'بسيط رقيق' : 'Minimalist')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Separate Eye color selection */}
              <div className="space-y-2 border-t border-border dark:border-gray-800 pt-6">
                <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'لون الأعين (مستقل عن لون النقاط):' : 'Eye Specific Color:'}</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={eyeColor} 
                    onChange={e => {
                      const prev = getSettingsObj();
                      setEyeColor(e.target.value);
                      saveToHistory({ ...prev, eyeColor: e.target.value });
                    }} 
                    className="h-10 w-10 rounded-xl cursor-pointer border border-border bg-white" 
                  />
                  <Input value={eyeColor} onChange={e => {
                    const prev = getSettingsObj();
                    setEyeColor(e.target.value);
                    saveToHistory({ ...prev, eyeColor: e.target.value });
                  }} className="font-mono text-xs" />
                </div>
              </div>

            </CardContent>
          </Card>
        )}

        {/* Tab 5: Logo integration overlay options */}
        {activeTab === 'logo' && (
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle>{language === 'ar' ? 'إضافة الشعار المخصص (Logo)' : 'Custom Logo Overlay'}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-4">
                <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'رفع ملف الشعار (PNG, SVG, JPG)' : 'Upload Logo File'}</label>
                <div className="border border-dashed border-border dark:border-gray-800 rounded-xl p-8 text-center bg-neutral-50/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/10 transition-all relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-textMuted" size={32} />
                    <span className="text-sm font-semibold">{language === 'ar' ? 'اسحب ملف الشعار هنا أو اضغط للاختيار' : 'Drag file here or click to upload'}</span>
                    <span className="text-xs text-textMuted">{language === 'ar' ? 'سيتم وضع الشعار تلقائياً في المنتصف' : 'Logo will be centered automatically'}</span>
                  </div>
                </div>

                {logo && (
                  <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl border border-border dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <img src={logo} alt="Logo Preview" className="w-10 h-10 object-contain rounded-lg border bg-white p-1" />
                      <span className="text-xs font-bold text-textDark dark:text-white">{language === 'ar' ? 'تم رفع الشعار بنجاح' : 'Logo uploaded'}</span>
                    </div>
                    <button
                      onClick={() => {
                        const prev = getSettingsObj();
                        setLogo(null);
                        saveToHistory({ ...prev, logo: null });
                      }}
                      className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"
                    >
                      <Trash size={12} /> {language === 'ar' ? 'حذف الشعار' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>

              {logo && (
                <>
                  {/* Logo size slider */}
                  <div className="space-y-2 border-t border-border dark:border-gray-800 pt-6">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'حجم الشعار (من كود الـ QR):' : 'Logo Size (%):'}</span>
                      <span className="text-accent">{logoSize}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="30" 
                      value={logoSize} 
                      onChange={e => {
                        const prev = getSettingsObj();
                        setLogoSize(Number(e.target.value));
                        saveToHistory({ ...prev, logoSize: Number(e.target.value) });
                      }}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-accent" 
                    />
                    <p className="text-[10px] text-textMuted dark:text-gray-400">
                      {language === 'ar' 
                        ? 'تنبيه: حجم الشعار الأكبر من 22% قد يمنع مسح الرمز بشكل سريع.' 
                        : 'Warning: Sizes larger than 22% might impact code scannability.'}
                    </p>
                  </div>

                  {/* Logo background protection */}
                  <div className="flex items-center justify-between border-t border-border dark:border-gray-800 pt-6">
                    <div className="space-y-0.5 text-right">
                      <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'حماية خلفية الشعار' : 'Protect Logo Background'}</label>
                      <p className="text-[10px] text-textMuted dark:text-gray-400">
                        {language === 'ar' ? 'توليد خلفية معزولة خلف الشعار لحمايته من تداخل النقاط.' : 'Creates a buffer zone behind the logo for clarity.'}
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={protectLogoBackground} 
                      onChange={e => setProtectLogoBackground(e.target.checked)}
                      className="w-4 h-4 rounded text-accent focus:ring-accent accent-accent cursor-pointer"
                    />
                  </div>
                </>
              )}

            </CardContent>
          </Card>
        )}

        {/* Tab 6: Frames, Labels, & Call to Actions */}
        {activeTab === 'frame' && (
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle>{language === 'ar' ? 'الإطارات والملصقات الترويجية (CTA)' : 'Decorative Frames & CTA'}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Frame selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'اختر نمط الإطار:' : 'Select Frame Category:'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['none', 'classic', 'speech-bubble', 'minimal-border', 'business-card'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        const prev = getSettingsObj();
                        setFrameType(f);
                        saveToHistory({ ...prev, frameType: f });
                      }}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all text-center truncate ${
                        frameType === f 
                          ? 'bg-accent text-white border-accent shadow-sm' 
                          : 'bg-white dark:bg-neutral-800 text-textMuted border-border dark:border-gray-750'
                      }`}
                    >
                      {f === 'none' ? (language === 'ar' ? 'بدون إطار' : 'No Frame') :
                       f === 'classic' ? (language === 'ar' ? 'ملصق كلاسيكي سفلي' : 'Bottom Classic') :
                       f === 'speech-bubble' ? (language === 'ar' ? 'فقاعة حديثة علوية' : 'Top Speech Bubble') :
                       f === 'minimal-border' ? (language === 'ar' ? 'إطار مزدوج نحيف' : 'Double Border') :
                       (language === 'ar' ? 'كارت تعريفي شخصي' : 'Business Card')}
                    </button>
                  ))}
                </div>
              </div>

              {frameType !== 'none' && (
                <>
                  {/* CTA Text editing */}
                  <div className="space-y-2 border-t border-border dark:border-gray-800 pt-6">
                    <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'نص الملصق (CTA Text):' : 'Call-To-Action Text:'}</label>
                    <Input 
                      value={frameText} 
                      onChange={e => {
                        const prev = getSettingsObj();
                        setFrameText(e.target.value.toUpperCase());
                        saveToHistory({ ...prev, frameText: e.target.value.toUpperCase() });
                      }} 
                      placeholder="SCAN ME" 
                    />
                  </div>

                  {/* Frame Color */}
                  <div className="space-y-2 border-t border-border dark:border-gray-800 pt-6">
                    <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'لون الإطار:' : 'Frame Color:'}</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={frameColor} 
                        onChange={e => {
                          const prev = getSettingsObj();
                          setFrameColor(e.target.value);
                          saveToHistory({ ...prev, frameColor: e.target.value });
                        }} 
                        className="h-10 w-10 rounded-xl cursor-pointer border border-border bg-white" 
                      />
                      <Input value={frameColor} onChange={e => {
                        const prev = getSettingsObj();
                        setFrameColor(e.target.value);
                        saveToHistory({ ...prev, frameColor: e.target.value });
                      }} className="font-mono text-xs" />
                    </div>
                  </div>

                  {/* Font size */}
                  <div className="space-y-2 border-t border-border dark:border-gray-800 pt-6">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-textDark/80 dark:text-gray-300">{language === 'ar' ? 'حجم خط النص:' : 'Text Font Size:'}</span>
                      <span className="text-accent">{ctaTextSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="20" 
                      value={ctaTextSize} 
                      onChange={e => {
                        const prev = getSettingsObj();
                        setCtaTextSize(Number(e.target.value));
                        saveToHistory({ ...prev, ctaTextSize: Number(e.target.value) });
                      }}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-accent" 
                    />
                  </div>
                </>
              )}

            </CardContent>
          </Card>
        )}

      </div>

      {/* 2. Right Column: Studio Live Preview & Actions (Col Span 5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Undo/Redo & Zoom Quick Actions */}
        <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-border dark:border-gray-800 p-3.5 rounded-2xl shadow-sm">
          <div className="flex gap-1.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-textDark dark:text-white disabled:opacity-35"
              title={language === 'ar' ? 'تراجع' : 'Undo'}
            >
              <Undo size={16} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-textDark dark:text-white disabled:opacity-35"
              title={language === 'ar' ? 'إعادة' : 'Redo'}
            >
              <Redo size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setZoom(Math.max(zoom - 10, 50))} 
              className="p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-textDark dark:text-white"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-bold text-textMuted dark:text-gray-400 w-12 text-center">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(zoom + 10, 150))} 
              className="p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-textDark dark:text-white"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Desktop/Mobile Device frame simulation selector */}
          <div className="flex gap-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded-lg transition-all ${
                previewMode === 'desktop' ? 'bg-accent/10 text-accent' : 'text-textMuted dark:text-gray-400 hover:text-textDark'
              }`}
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded-lg transition-all ${
                previewMode === 'mobile' ? 'bg-accent/10 text-accent' : 'text-textMuted dark:text-gray-400 hover:text-textDark'
              }`}
            >
              <Smartphone size={16} />
            </button>
          </div>
        </div>

        {/* Live Canvas Canvas Wrapper with Zoom styling */}
        <Card className="border border-border dark:border-gray-800 bg-neutral-50/50 dark:bg-neutral-900/50 shadow-card flex flex-col items-center justify-center p-8 min-h-[360px] overflow-hidden relative">
          
          <div 
            className="transition-transform duration-200 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {previewMode === 'mobile' ? (
              // Simulated Mobile Phone frame mockup
              <div className="w-[280px] h-[480px] border-4 border-neutral-800 bg-black rounded-[32px] p-4 flex flex-col items-center justify-between relative shadow-lg">
                <div className="w-24 h-4 bg-neutral-800 rounded-full mb-4 shrink-0" />
                <div className="flex-1 bg-white rounded-2xl w-full flex items-center justify-center p-3 overflow-hidden">
                  <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="w-8 h-8 rounded-full border border-neutral-800 mt-4 shrink-0" />
              </div>
            ) : (
              // Desktop standard frame mockup
              <div className="p-4 bg-white dark:bg-neutral-850 rounded-2xl border border-border dark:border-gray-800 shadow-md">
                <canvas ref={canvasRef} className="max-w-full h-auto" />
              </div>
            )}
          </div>

        </Card>

        {/* Smart Design Validation & Contrast warnings */}
        <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
          <CardHeader className="border-b border-border dark:border-gray-800 pb-3 flex flex-row items-center justify-between">
            <span className="text-xs font-black text-textMuted dark:text-gray-400 uppercase">{language === 'ar' ? 'فحص جاهزية المسح الذكي' : 'Scannability Validation'}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-textMuted">{language === 'ar' ? 'الدرجة:' : 'Score:'}</span>
              <span className={`text-sm font-black px-2.5 py-0.5 rounded-full ${
                validationReport.score >= 80 ? 'bg-green-50 text-green-600 border border-green-100' :
                validationReport.score >= 60 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {validationReport.score} / 100
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {validationReport.warnings.map((w, idx) => (
              <div key={idx} className="flex gap-2 text-xs font-bold text-amber-700 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl text-right">
                <AlertTriangle size={14} className="shrink-0 text-amber-600 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
            {validationReport.warnings.length === 0 && (
              <div className="text-xs font-bold text-green-700 bg-green-50/50 border border-green-100 p-3 rounded-xl text-center flex items-center justify-center gap-1.5">
                <Check size={14} />
                <span>{language === 'ar' ? 'تصميم ممتاز! الرمز يتمتع بتباين مرتفع وقابلية مسح عالية.' : 'Perfect design! High contrast and ideal scan viability.'}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export and Print actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => triggerExport('png')} className="font-bold gap-1.5 h-11 justify-center">
            <Download size={16} /> PNG
          </Button>
          <Button onClick={() => triggerExport('svg')} variant="secondary" className="font-bold gap-1.5 h-11 justify-center">
            <Download size={16} /> SVG
          </Button>
          <Button onClick={() => triggerExport('pdf')} variant="secondary" className="font-bold gap-1.5 h-11 justify-center col-span-2 sm:col-span-1">
            <Download size={16} /> PDF
          </Button>
          <Button onClick={() => triggerExport('high-res')} variant="secondary" className="font-bold gap-1.5 h-11 justify-center col-span-2 sm:col-span-1 text-accent border-accent/20 hover:bg-accent/5">
            <Sparkles size={16} /> {language === 'ar' ? 'طباعة عالية الدقة' : 'Print High-Res'}
          </Button>
        </div>

      </div>

    </div>
  );
};
