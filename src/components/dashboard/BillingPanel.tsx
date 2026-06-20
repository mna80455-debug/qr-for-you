import React, { useState } from 'react';
import { useUserProfile } from '../../context/UserProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Check, CreditCard, Lock, Printer, 
  Calendar, RefreshCw, Star, ShieldCheck
} from 'lucide-react';
import { doc, collection, setDoc, addDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

export const BillingPanel = () => {
  const { profile, setProfile } = useUserProfile();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRtl = language === 'ar';

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise' | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // Mock Invoices
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-001', date: '2026-05-11', plan: 'Pro', amount: 15.00, status: 'paid' },
    { id: 'INV-2026-002', date: '2026-06-11', plan: 'Pro', amount: 15.00, status: 'paid' },
  ]);

  const plans = {
    free: {
      id: 'free',
      name: isRtl ? 'الخطة المجانية' : 'Free Starter',
      price: 0,
      features: isRtl ? [
        'أكواد QR ثابتة غير محدودة',
        '3 أكواد QR ديناميكية',
        '100 مسحة شهرياً',
        'تحليلات أساسية فقط',
      ] : [
        'Unlimited Static QRs',
        '3 Dynamic QRs',
        '100 Scans / Month',
        'Basic Analytics',
      ],
    },
    pro: {
      id: 'pro',
      name: isRtl ? 'الخطة الاحترافية (Pro)' : 'Professional (Pro)',
      price: billingCycle === 'monthly' ? 15 : 10,
      features: isRtl ? [
        'أكواد QR ثابتة غير محدودة',
        '50 كود QR ديناميكي',
        '50,000 مسحة شهرياً',
        'تحليلات جغرافية وزمنية متقدمة',
        'مستشار التصاميم بالذكاء الاصطناعي',
        'تخصيص كامل للألوان والأعين',
        'إزالة شعار المنصة',
      ] : [
        'Unlimited Static QRs',
        '50 Dynamic QRs',
        '50,000 Scans / Month',
        'Advanced Geo & Time Analytics',
        'AI Design & CTA Recommendation',
        'Full Corner Eyes & Dots Customization',
        'Remove QR Universe Branding',
      ],
    },
    enterprise: {
      id: 'enterprise',
      name: isRtl ? 'خطة المؤسسات (Enterprise)' : 'Enterprise Suite',
      price: billingCycle === 'monthly' ? 49 : 35,
      features: isRtl ? [
        'كل مزايا الخطة الاحترافية',
        'أكواد QR ديناميكية غير محدودة',
        'عمليات مسح غير محدودة',
        'توليد دفعات أكواد QR من ملفات CSV',
        'نظام عمل ومساحات جماعية للفرق',
        'لوحات تحكم متكيفة وذكية',
        'إشعارات وربط Webhooks مخصص',
        'صلاحيات الوصول لـ API المنصة',
      ] : [
        'All Pro Features',
        'Unlimited Dynamic QRs',
        'Unlimited Scans',
        'Bulk QR Code Generation from CSV',
        'Team Workspace & Collaborators',
        'Smart Adaptive Use Cases',
        'Webhook Subscriptions',
        'Platform REST API Access',
      ],
    },
  };

  const handlePlanSelect = (planKey: 'free' | 'pro' | 'enterprise') => {
    if (planKey === 'free' || planKey === profile?.plan) {
      if (planKey === 'free' && profile?.plan !== 'free') {
        // Confirm downgrade
        const confirmDowngrade = window.confirm(
          isRtl 
            ? 'هل أنت متأكد من رغبتك في إلغاء الاشتراك والعودة للخطة المجانية؟ ستفقد الوصول لبعض المزايا المتقدمة.'
            : 'Are you sure you want to cancel subscription and downgrade to Free plan? You will lose access to premium features.'
        );
        if (confirmDowngrade) {
          updateSubscription('free', 'monthly');
        }
      }
      return;
    }
    setSelectedPlan(planKey);
    setCardDetails({ number: '', expiry: '', cvc: '', name: profile?.name || '' });
    setCardErrors({});
    setCheckoutStep('form');
    setShowCheckout(true);
  };

  const validateCard = () => {
    const errors: Record<string, string> = {};
    const num = cardDetails.number.replace(/\s+/g, '');
    if (num.length !== 16 || !/^\d+$/.test(num)) {
      errors.number = isRtl ? 'رقم البطاقة يجب أن يتكون من 16 رقم' : 'Card number must be 16 digits';
    }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = isRtl ? 'التاريخ غير صالح (MM/YY)' : 'Invalid date (MM/YY)';
    } else {
      const [month] = cardDetails.expiry.split('/').map(Number);
      if (month < 1 || month > 12) {
        errors.expiry = isRtl ? 'الشهر غير صالح' : 'Invalid month';
      }
    }
    if (cardDetails.cvc.length !== 3 || !/^\d+$/.test(cardDetails.cvc)) {
      errors.cvc = isRtl ? 'رمز التحقق (CVC) يتكون من 3 أرقام' : 'CVC must be 3 digits';
    }
    if (!cardDetails.name.trim()) {
      errors.name = isRtl ? 'اسم صاحب البطاقة مطلوب' : 'Cardholder name is required';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCard() || !selectedPlan) return;

    setCheckoutStep('processing');

    // Simulate payment processing delay
    setTimeout(async () => {
      await updateSubscription(selectedPlan, billingCycle);
      
      // Add a mock invoice
      const newInv = {
        id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        plan: selectedPlan.toUpperCase(),
        amount: plans[selectedPlan].price,
        status: 'paid',
      };
      setInvoices(prev => [newInv, ...prev]);
      
      setCheckoutStep('success');
    }, 2000);
  };

  const updateSubscription = async (plan: 'free' | 'pro' | 'enterprise', cycle: 'monthly' | 'yearly') => {
    if (!profile) return;
    
    const updated = {
      ...profile,
      plan,
      billingCycle: cycle,
      subscriptionActive: true,
    };
    
    // Save to global user profile context (which writes to firestore & localStorage)
    await setProfile(updated);

    // Save record to "payments" & "subscriptions" collection in Firestore if configured
    if (isFirebaseConfigured && db && user) {
      try {
        await setDoc(doc(db, 'subscriptions', user.uid), {
          userId: user.uid,
          plan,
          billingCycle: cycle,
          status: 'active',
          updatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + (cycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
        });

        if (plan !== 'free') {
          await addDoc(collection(db, 'payments'), {
            userId: user.uid,
            plan,
            amount: plans[plan].price,
            date: new Date().toISOString(),
            status: 'success'
          });
        }
      } catch (err) {
        console.warn("Could not save billing records to Firestore:", err);
      }
    }
  };

  const handlePrintReceipt = (invoice: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt ${invoice.id}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; direction: ${isRtl ? 'rtl' : 'ltr'}; }
              .invoice-box { max-width: 800px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); padding: 30px; border-radius: 10px; }
              .invoice-box table { width: 100%; line-height: inherit; text-align: left; }
              .invoice-box table td { padding: 5px; vertical-align: top; }
              .invoice-box table tr td:nth-child(2) { text-align: right; }
              .invoice-header { display: flex; justify-content: space-between; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 20px; }
              .invoice-title { font-size: 24px; font-weight: bold; color: #6366f1; }
              .invoice-details { margin-bottom: 30px; display: flex; justify-content: space-between; }
              .invoice-items { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .invoice-items th { background: #f4f4f5; text-align: left; padding: 10px; border: 1px solid #e4e4e7; }
              .invoice-items td { padding: 10px; border: 1px solid #e4e4e7; }
              .total { font-weight: bold; font-size: 16px; text-align: right; }
            </style>
          </head>
          <body>
            <div class="invoice-box">
              <div class="invoice-header">
                <div>
                  <div class="invoice-title">QR Universe</div>
                  <div>${isRtl ? 'منصة ذكية متكاملة لأكواد الاستجابة السريعة' : 'Intelligent SaaS QR Code Platform'}</div>
                </div>
                <div style="text-align: right;">
                  <strong>${isRtl ? 'إيصال دفع' : 'RECEIPT'}</strong><br/>
                  # ${invoice.id}
                </div>
              </div>
              <div class="invoice-details">
                <div>
                  <strong>${isRtl ? 'مقدم الخدمة:' : 'Billed By:'}</strong><br/>
                  QR Universe Inc.<br/>
                  100 Pine Street, San Francisco, CA<br/>
                  support@qruniverse.com
                </div>
                <div style="text-align: right;">
                  <strong>${isRtl ? 'العميل:' : 'Billed To:'}</strong><br/>
                  ${profile?.name || 'Customer'}<br/>
                  ${profile?.email || ''}<br/>
                  ${isRtl ? 'تاريخ الدفع:' : 'Date:'} ${invoice.date}
                </div>
              </div>
              <table class="invoice-items">
                <thead>
                  <tr>
                    <th>${isRtl ? 'الوصف' : 'Description'}</th>
                    <th style="text-align: right;">${isRtl ? 'السعر' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>QR Universe Plan - ${invoice.plan} Subscription (${billingCycle === 'monthly' ? (isRtl ? 'شهري' : 'Monthly') : (isRtl ? 'سنوي' : 'Yearly')})</td>
                    <td style="text-align: right;">$${invoice.amount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td class="total">${isRtl ? 'الإجمالي الكلي:' : 'Total Billed:'}</td>
                    <td style="text-align: right; font-weight: bold;">$${invoice.amount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #a1a1aa;">
                ${isRtl ? 'شكراً لتعاملك معنا!' : 'Thank you for your business!'}
              </div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getActivePlanLabel = () => {
    const plan = profile?.plan || 'free';
    if (plan === 'free') return plans.free.name;
    if (plan === 'pro') return plans.pro.name;
    return plans.enterprise.name;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardDetails({ ...cardDetails, expiry: formatted });
  };

  return (
    <div className="space-y-8 text-right font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Current Subscription Summary */}
      <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="bg-gradient-to-l from-accent/20 via-transparent to-transparent p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-accent/15 text-accent text-xs font-black px-3 py-1 rounded-full uppercase">
                {profile?.plan || 'free'}
              </span>
              <h2 className="text-xl font-black text-textDark dark:text-white">
                {isRtl ? 'حالة اشتراكك الحالي' : 'Current Subscription Status'}
              </h2>
            </div>
            <p className="text-sm text-textMuted dark:text-neutral-400 font-semibold">
              {isRtl 
                ? `أنت مشترك حالياً في: ${getActivePlanLabel()}` 
                : `You are currently subscribed to: ${getActivePlanLabel()}`}
              {profile?.plan !== 'free' && ` (${profile?.billingCycle === 'monthly' ? (isRtl ? 'دورة شهرية' : 'Monthly billing') : (isRtl ? 'دورة سنوية' : 'Yearly billing')})`}
            </p>
          </div>
          {profile?.plan !== 'free' && (
            <Button 
              variant="outline"
              onClick={() => handlePlanSelect('free')}
              className="text-xs font-bold text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              {isRtl ? 'إلغاء الاشتراك' : 'Cancel Subscription'}
            </Button>
          )}
        </div>
      </Card>

      {/* Toggle Billing Cycle */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl flex gap-1 w-64 shadow-inner">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-neutral-900 text-textDark dark:text-white shadow-md'
                : 'text-textMuted dark:text-neutral-400 hover:text-textDark dark:hover:text-white'
            }`}
          >
            {isRtl ? 'دفع شهري' : 'Monthly Billing'}
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-accent text-white shadow-md'
                : 'text-textMuted dark:text-neutral-400 hover:text-textDark dark:hover:text-white'
            }`}
          >
            <span>{isRtl ? 'دفع سنوي' : 'Yearly Billing'}</span>
            <span className="bg-white/20 text-[9px] font-black px-1.5 py-0.5 rounded">
              -33%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Matrix Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Free Plan */}
        <Card className={`border p-6 sm:p-8 flex flex-col justify-between transition-all bg-white dark:bg-neutral-900 ${
          profile?.plan === 'free' 
            ? 'border-neutral-300 dark:border-neutral-700 ring-2 ring-neutral-200 dark:ring-neutral-800' 
            : 'border-border dark:border-gray-800'
        }`}>
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black dark:text-white">{plans.free.name}</h3>
              <p className="text-xs text-textMuted dark:text-neutral-400 font-semibold">
                {isRtl ? 'مثالي للمشاريع الشخصية والتجريبية' : 'Best for personal use & prototyping'}
              </p>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-textDark dark:text-white">$0</span>
              <span className="text-xs text-textMuted dark:text-neutral-400">/{isRtl ? 'شهرياً' : 'month'}</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-border dark:border-gray-800 text-xs font-semibold text-textDark dark:text-neutral-300">
              {plans.free.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8">
            <Button
              variant={profile?.plan === 'free' ? 'secondary' : 'outline'}
              disabled={profile?.plan === 'free'}
              onClick={() => handlePlanSelect('free')}
              className="w-full text-xs font-bold"
            >
              {profile?.plan === 'free' ? (isRtl ? 'اشتراكك الحالي' : 'Current Plan') : (isRtl ? 'العودة للمجاني' : 'Downgrade')}
            </Button>
          </div>
        </Card>

        {/* Pro Plan */}
        <Card className={`border p-6 sm:p-8 flex flex-col justify-between transition-all bg-white dark:bg-neutral-900 relative ${
          profile?.plan === 'pro' 
            ? 'border-accent ring-2 ring-accent/20' 
            : 'border-border dark:border-gray-800'
        }`}>
          <div className="absolute top-4 left-4 bg-accent text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm">
            <Star size={8} fill="white" />
            <span>{isRtl ? 'الأكثر شعبية' : 'Popular'}</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black dark:text-white">{plans.pro.name}</h3>
              <p className="text-xs text-textMuted dark:text-neutral-400 font-semibold">
                {isRtl ? 'للمصممين والمسوقين والمشروعات الناشئة' : 'For creators, builders & growing businesses'}
              </p>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-accent">${plans.pro.price}</span>
              <span className="text-xs text-textMuted dark:text-neutral-400">/{isRtl ? 'شهرياً' : 'month'}</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-border dark:border-gray-800 text-xs font-semibold text-textDark dark:text-neutral-300">
              {plans.pro.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8">
            <Button
              variant={profile?.plan === 'pro' ? 'secondary' : 'primary'}
              disabled={profile?.plan === 'pro'}
              onClick={() => handlePlanSelect('pro')}
              className="w-full text-xs font-bold shadow-md shadow-accent/10"
            >
              {profile?.plan === 'pro' ? (isRtl ? 'اشتراكك الحالي' : 'Current Plan') : (isRtl ? 'ترقية الآن' : 'Upgrade to Pro')}
            </Button>
          </div>
        </Card>

        {/* Enterprise Plan */}
        <Card className={`border p-6 sm:p-8 flex flex-col justify-between transition-all bg-white dark:bg-neutral-900 ${
          profile?.plan === 'enterprise' 
            ? 'border-indigo-600 ring-2 ring-indigo-500/20' 
            : 'border-border dark:border-gray-800'
        }`}>
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black dark:text-white">{plans.enterprise.name}</h3>
              <p className="text-xs text-textMuted dark:text-neutral-400 font-semibold">
                {isRtl ? 'للشركات والمؤسسات والفرق الكبيرة' : 'For brands, agencies & API integration'}
              </p>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-textDark dark:text-white">${plans.enterprise.price}</span>
              <span className="text-xs text-textMuted dark:text-neutral-400">/{isRtl ? 'شهرياً' : 'month'}</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-border dark:border-gray-800 text-xs font-semibold text-textDark dark:text-neutral-300">
              {plans.enterprise.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8">
            <Button
              variant={profile?.plan === 'enterprise' ? 'secondary' : 'outline'}
              disabled={profile?.plan === 'enterprise'}
              onClick={() => handlePlanSelect('enterprise')}
              className="w-full text-xs font-bold"
            >
              {profile?.plan === 'enterprise' ? (isRtl ? 'اشتراكك الحالي' : 'Current Plan') : (isRtl ? 'شراء الترقية' : 'Buy Enterprise')}
            </Button>
          </div>
        </Card>

      </div>

      {/* Invoice History Section */}
      <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
        <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
          <CardTitle className="text-base font-black flex items-center gap-2 dark:text-white">
            <Calendar size={18} className="text-accent" />
            <span>{isRtl ? 'تاريخ الفواتير والمدفوعات' : 'Payment & Invoice History'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-border dark:border-gray-800 text-textMuted dark:text-neutral-400 pb-3 font-bold">
                  <th className="pb-3 text-right">{isRtl ? 'رقم الفاتورة' : 'Invoice ID'}</th>
                  <th className="pb-3 text-right">{isRtl ? 'التاريخ' : 'Date'}</th>
                  <th className="pb-3 text-right">{isRtl ? 'الخطة' : 'Plan'}</th>
                  <th className="pb-3 text-right">{isRtl ? 'المبلغ' : 'Amount'}</th>
                  <th className="pb-3 text-right">{isRtl ? 'الحالة' : 'Status'}</th>
                  <th className="pb-3 text-left">{isRtl ? 'الخيارات' : 'Options'}</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/50 dark:border-gray-800/50 hover:bg-neutral-50/50 dark:hover:bg-neutral-850/50 transition-colors font-semibold">
                    <td className="py-4 font-mono">{inv.id}</td>
                    <td className="py-4 text-textMuted dark:text-neutral-400">{inv.date}</td>
                    <td className="py-4">
                      <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-black text-[10px]">
                        {inv.plan}
                      </span>
                    </td>
                    <td className="py-4 font-bold">${inv.amount.toFixed(2)}</td>
                    <td className="py-4">
                      <span className="text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {isRtl ? 'مدفوعة' : 'Paid'}
                      </span>
                    </td>
                    <td className="py-4 text-left">
                      <button 
                        onClick={() => handlePrintReceipt(inv)}
                        className="text-accent hover:text-accent-hover font-bold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Printer size={13} />
                        <span>{isRtl ? 'طباعة إيصال' : 'Print Receipt'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Simulated Stripe Checkout Overlay Modal */}
      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-md bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 shadow-2xl overflow-hidden animate-zoom-in text-right">
            
            <CardHeader className="bg-neutral-50 dark:bg-neutral-850 border-b border-border dark:border-gray-800 p-6 flex items-center justify-between">
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <CardTitle className="text-base font-black flex items-center gap-2 dark:text-white">
                <CreditCard className="text-accent" size={20} />
                <span>{isRtl ? 'إتمام الدفع الآمن (Stripe)' : 'Secure Stripe Checkout'}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {checkoutStep === 'form' && (
                <form onSubmit={handlePay} className="space-y-4">
                  {/* Summary of billing */}
                  <div className="bg-accent/5 border border-accent/10 p-4 rounded-xl space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-textDark dark:text-white">
                      <span>{plans[selectedPlan].name}</span>
                      <span>
                        ${plans[selectedPlan].price} / {billingCycle === 'monthly' ? (isRtl ? 'شهري' : 'Month') : (isRtl ? 'سنوي' : 'Year')}
                      </span>
                    </div>
                    <p className="text-[10px] text-textMuted dark:text-neutral-400 font-semibold leading-relaxed">
                      {isRtl 
                        ? `سيتم تحصيل مبلغ $${plans[selectedPlan].price} وتجديد الاشتراك تلقائياً حسب الدورة المختارة.`
                        : `You will be billed $${plans[selectedPlan].price} instantly. Subscription auto-renews at the end of cycle.`}
                    </p>
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-textDark dark:text-neutral-300 block">{isRtl ? 'اسم صاحب البطاقة' : 'Cardholder Name'}</label>
                    <Input 
                      placeholder="Jane Doe" 
                      value={cardDetails.name}
                      onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="text-xs h-10"
                    />
                    {cardErrors.name && <p className="text-[10px] text-red-500 font-bold">{cardErrors.name}</p>}
                  </div>

                  {/* Card Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-textDark dark:text-neutral-300 block">{isRtl ? 'رقم بطاقة الائتمان' : 'Card Number'}</label>
                    <div className="relative">
                      <Input 
                        placeholder="4242 4242 4242 4242" 
                        value={cardDetails.number}
                        onChange={handleCardNumberChange}
                        className="text-xs h-10 pl-10"
                      />
                      <CreditCard className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                    </div>
                    {cardErrors.number && <p className="text-[10px] text-red-500 font-bold">{cardErrors.number}</p>}
                  </div>

                  {/* Expiry & CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-textDark dark:text-neutral-300 block">{isRtl ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                      <Input 
                        placeholder="MM/YY" 
                        value={cardDetails.expiry}
                        onChange={handleExpiryChange}
                        className="text-xs h-10 text-center"
                      />
                      {cardErrors.expiry && <p className="text-[10px] text-red-500 font-bold">{cardErrors.expiry}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-textDark dark:text-neutral-300 block">{isRtl ? 'رمز التحقق (CVC)' : 'CVC Code'}</label>
                      <Input 
                        placeholder="123" 
                        value={cardDetails.cvc}
                        onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                        className="text-xs h-10 text-center"
                      />
                      {cardErrors.cvc && <p className="text-[10px] text-red-500 font-bold">{cardErrors.cvc}</p>}
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-1.5 text-textMuted dark:text-neutral-400 text-[10px] font-bold pt-2 border-t border-border dark:border-gray-800">
                    <Lock size={12} className="text-emerald-500" />
                    <span>{isRtl ? 'تشفير 256-بت آمن ومتوافق مع PCI' : 'Secure 256-bit SSL encrypted & PCI compliant'}</span>
                  </div>

                  {/* Checkout Actions */}
                  <div className="flex gap-2.5 pt-3">
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 text-xs font-bold"
                    >
                      {isRtl ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 text-xs font-bold shadow-md shadow-accent/20"
                    >
                      {isRtl ? `دفع $${plans[selectedPlan].price}` : `Pay $${plans[selectedPlan].price}`}
                    </Button>
                  </div>
                </form>
              )}

              {checkoutStep === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                  <RefreshCw className="w-10 h-10 text-accent animate-spin" />
                  <div>
                    <h4 className="font-black dark:text-white">{isRtl ? 'جاري معالجة عمليتك...' : 'Processing Transaction...'}</h4>
                    <p className="text-xs text-textMuted dark:text-neutral-400 mt-1 font-semibold">
                      {isRtl ? 'برجاء عدم إغلاق الصفحة أو الضغط على زر التحديث' : 'Please do not close this window or refresh.'}
                    </p>
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center shadow-inner scale-up border border-emerald-100 dark:border-emerald-900/50">
                    <ShieldCheck size={36} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-textDark dark:text-white">{isRtl ? 'تم الاشتراك بنجاح! 🎉' : 'Subscription Upgraded! 🎉'}</h4>
                    <p className="text-xs text-textMuted dark:text-neutral-400 font-semibold max-w-xs leading-relaxed">
                      {isRtl 
                        ? `لقد تمت ترقية حسابك إلى خطة ${plans[selectedPlan].name} بنجاح. استمتع بجميع المزايا المتقدمة الآن.` 
                        : `Your account is now activated under ${plans[selectedPlan].name}. You have instant access to all premium features.`}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowCheckout(false)}
                    className="w-full text-xs font-bold mt-4"
                  >
                    {isRtl ? 'الذهاب للوحة التحكم' : 'Return to Dashboard'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden printable receipt target */}
      <div id="printable-receipt" className="hidden" />
    </div>
  );
};

// Simple Close Icon missing in React Lucide Imports
const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
