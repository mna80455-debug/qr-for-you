import { useState, useEffect } from 'react';
import { Users, FileSpreadsheet, QrCode, Clock, Plus, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';

interface StudentRecord {
  name: string;
  email: string;
  time: string;
  sessionName: string;
}

export const AttendanceDashboard = () => {
  const { user } = useAuth();
  const [sessionName, setSessionName] = useState('حضور المحاضرة الأولى');
  const [activeSession, setActiveSession] = useState(false);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch checked-in students from Firestore
  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      try {
        const q = query(
          collection(db, 'attendance_records'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedRecords: StudentRecord[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedRecords.push({
            name: data.name,
            email: data.email,
            time: data.time,
            sessionName: data.sessionName || sessionName
          });
        });
        setStudents(fetchedRecords);
      } catch (err) {
        console.error("Error loading attendance records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  // Add a student (simulates scanning and checking in)
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newStudentName || !newStudentEmail || !user || !db) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    // Prevent duplicate attendance check
    const duplicate = students.some(
      s => s.email.toLowerCase() === newStudentEmail.toLowerCase() && s.sessionName === sessionName
    );
    if (duplicate) {
      setError('هذا البريد الإلكتروني مسجل حضور بالفعل في هذه الجلسة.');
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const newRecord: StudentRecord = {
      name: newStudentName,
      email: newStudentEmail,
      time: timeString,
      sessionName: sessionName
    };

    try {
      // Optimistic update
      setStudents([...students, newRecord]);
      setNewStudentName('');
      setNewStudentEmail('');

      // Save to Firestore
      await addDoc(collection(db, 'attendance_records'), {
        ...newRecord,
        userId: user.uid,
        createdAt: new Date()
      });
    } catch (err) {
      console.error("Error saving attendance record:", err);
      setError('حدث خطأ أثناء تسجيل الحضور في قاعدة البيانات.');
    }
  };

  // Export to Excel using SheetJS
  const exportToExcel = () => {
    const currentSessionStudents = students.filter(s => s.sessionName === sessionName);
    
    const dataToExport = currentSessionStudents.map((s, idx) => ({
      'م': idx + 1,
      'اسم الطالب': s.name,
      'البريد الإلكتروني': s.email,
      'وقت تسجيل الحضور': s.time,
      'الجلسة / المحاضرة': s.sessionName
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'كشف الحضور');
    XLSX.writeFile(workbook, `${sessionName}_Attendance.xlsx`);
  };

  const currentSessionStudents = students.filter(s => s.sessionName === sessionName);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right font-body">
      <div className="flex justify-between items-center border-b border-border dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-textDark dark:text-white">إدارة الحضور والانصراف الذكي</h2>
          <p className="text-textMuted dark:text-gray-400 mt-1">تتبع الطلاب والمحاضرات وصدر تقارير إكسل فورية.</p>
        </div>
        {!activeSession ? (
          <Button onClick={() => setActiveSession(true)} className="gap-2 font-bold">
            <Plus size={16} /> بدء جلسة حضور جديدة
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => setActiveSession(false)} className="gap-2 font-bold text-red-500 border-red-100 hover:bg-red-50 dark:hover:bg-red-950/20">
            إنهاء الجلسة الحالية
          </Button>
        )}
      </div>

      {activeSession && (
        <Card className="border-accent/20 bg-accent/5 dark:bg-accent/5 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="space-y-1 text-right">
              <h3 className="font-bold text-accent">كود الحضور نشط الآن 🟢</h3>
              <p className="text-xs text-textMuted dark:text-gray-400">شارك الرمز مع الطلاب ليقوموا بمسحه وتسجيل حضورهم ذاتياً.</p>
            </div>
            <div className="flex gap-2">
              <Input 
                value={sessionName} 
                onChange={e => setSessionName(e.target.value)} 
                className="max-w-xs text-xs" 
              />
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Checked-in Students List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="text-right flex items-center gap-2 dark:text-white">
                <Users size={18} className="text-accent" />
                <span>قائمة الحاضرين في ({sessionName}) ({currentSessionStudents.length})</span>
              </CardTitle>
              <Button variant="secondary" size="sm" onClick={exportToExcel} className="gap-1.5 font-bold">
                <FileSpreadsheet size={14} /> تصدير Excel
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border dark:divide-gray-800">
                {currentSessionStudents.map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <div className="text-right">
                      <div className="text-sm font-bold text-textDark dark:text-white">{student.name}</div>
                      <div className="text-xs text-textMuted dark:text-gray-400">{student.email}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-textMuted dark:text-gray-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                      <Clock size={12} />
                      <span>{student.time}</span>
                    </div>
                  </div>
                ))}
                {currentSessionStudents.length === 0 && (
                  <div className="text-textMuted dark:text-gray-400 text-center py-12 text-sm font-semibold">
                    بانتظار تسجيل أول طالب حضوره في هذه الجلسة...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manual check in / scanning simulation form */}
        <div className="space-y-6">
          <Card className="border border-border dark:border-gray-800 bg-white dark:bg-neutral-900">
            <CardHeader className="border-b border-border dark:border-gray-800 pb-4">
              <CardTitle className="text-right flex items-center gap-2 dark:text-white">
                <QrCode size={18} className="text-accent" />
                <span>محاكاة مسح الطالب للرمز</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCheckIn} className="space-y-4">
                {error && (
                  <div className="text-red-600 text-xs bg-red-50 border border-red-100 p-3.5 rounded-xl font-bold flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">اسم الطالب</label>
                  <Input 
                    value={newStudentName} 
                    onChange={e => setNewStudentName(e.target.value)} 
                    placeholder="محمد أحمد" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-textDark/80 dark:text-gray-300">البريد الإلكتروني</label>
                  <Input 
                    type="email" 
                    value={newStudentEmail} 
                    onChange={e => setNewStudentEmail(e.target.value)} 
                    placeholder="student@university.edu" 
                  />
                </div>
                <Button type="submit" disabled={!activeSession} className="w-full font-bold mt-2 gap-1.5">
                  <Check size={16} /> تسجيل الحضور يدوياً
                </Button>
                {!activeSession && (
                  <p className="text-[10px] text-center text-textMuted dark:text-gray-400 font-semibold">يجب تفعيل جلسة الحضور أولاً للتمكن من تسجيل الحاضرين.</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
