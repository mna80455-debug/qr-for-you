import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc, addDoc, collection, increment, serverTimestamp } from 'firebase/firestore';

export const QRRedirectHandler = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processScan = async () => {
      if (!id || !db) {
        setError('كود QR غير صالح');
        return;
      }

      try {
        const qrDocRef = doc(db, 'qrcodes', id);
        const qrSnap = await getDoc(qrDocRef);

        if (!qrSnap.exists()) {
          setError('رمز الـ QR هذا غير مسجل أو تم حذفه.');
          return;
        }

        const qrData = qrSnap.data();
        if (qrData.isArchived) {
          setError('رمز الـ QR هذا تم أرشفته ولا يمكن مسحه حالياً.');
          return;
        }

        const destination = qrData.content || 'https://qrify.app';

        // 1. Gather browser/device data
        const ua = navigator.userAgent;
        let device = 'Desktop';
        if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
          device = 'Mobile';
        } else if (/Tablet|iPad/i.test(ua)) {
          device = 'Tablet';
        }

        let browser = 'Unknown';
        if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
        else if (ua.indexOf('Safari') > -1) browser = 'Safari';
        else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (ua.indexOf('Edge') > -1) browser = 'Edge';

        let country = 'Egypt';
        let city = 'Cairo';

        try {
          // Fetch location data from a free public API
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            country = geoData.country_name || country;
            city = geoData.city || city;
          }
        } catch (e) {
          console.warn("Geolocation API failed, falling back to defaults", e);
        }

        // 2. Write analytics event in background
        await addDoc(collection(db, 'analytics'), {
          qrId: id,
          timestamp: serverTimestamp() || new Date(),
          device,
          browser,
          country,
          city
        });

        // 3. Increment scansCount in the QR code doc
        await updateDoc(qrDocRef, {
          scansCount: increment(1)
        });

        // 4. Perform final redirect
        window.location.href = destination.startsWith('http') ? destination : `https://${destination}`;

      } catch (err) {
        console.error("Error processing QR scan:", err);
        setError('حدث خطأ أثناء معالجة مسح الكود.');
      }
    };

    processScan();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-body" dir="rtl">
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-2xl max-w-md shadow-sm space-y-4">
          <h1 className="text-xl font-bold">خطأ في مسح الرمز</h1>
          <p className="text-sm font-semibold">{error}</p>
          <a href="/" className="inline-block mt-4 text-accent hover:underline font-bold">العودة للرئيسية</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6 font-body" dir="rtl">
      <div className="space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mx-auto"></div>
        <h2 className="text-lg font-bold text-textDark">جاري توجيهك بأمان...</h2>
        <p className="text-textMuted text-xs font-semibold">تحليل المسح وتتبع الإحصائيات الذكية للمنشئ</p>
      </div>
    </div>
  );
};
