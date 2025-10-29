import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Hook dan State Management
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { selectUser } from '../../redux/slices/authSlice';
import { fetchAnnouncements, selectAllAnnouncements } from '../../redux/slices/announcementSlice';
import api from '../../js/services/api';

// Komponen Layout dan Ikon
import Sidebar from '../../components/Layout/Sidebar';
import { 
    HomeIcon, 
    DocumentTextIcon, 
    FolderIcon, 
    ClockIcon, 
    SpeakerWaveIcon 
} from '@heroicons/react/24/outline';

// Komponen Fitur (pastikan path import ini benar)
import TeacherLessonReport from './TeacherLessonReport';
import TeacherModules from './TeacherModule'; // Perhatikan nama file Anda, mungkin TeacherModules.jsx
import TeacherReschedule from './TeacherReschedule';
import TeacherAnnouncements from './TeacherAnnouncements';


// --- KOMPONEN UNTUK HALAMAN UTAMA DASHBOARD (DINAMIS) ---
const TeacherDashboardHome = () => {
    const dispatch = useDispatch();
    const announcements = useSelector(selectAllAnnouncements);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ambil pengumuman dari Redux
        dispatch(fetchAnnouncements());

        // Ambil jadwal hari ini dari API
        const fetchTodaySchedules = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                // Ganti endpoint ini jika Anda sudah punya endpoint jadwal yang lebih baik
                const response = await api.get(`/api/attendance/teacher/schedule?date=${today}`); 
                setSchedules(response.data);
            } catch (error) {
                console.error("Gagal memuat jadwal hari ini:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchTodaySchedules();
    }, [dispatch]);

    const recentAnnouncements = announcements.slice(0, 2);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">Jadwal Anda Hari Ini</h2>
                {loading ? <p>Memuat jadwal...</p> : (
                    schedules.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {schedules.map((schedule) => (
                                <li key={schedule.scheduleId} className="py-4">
                                    <p className="font-semibold text-indigo-700">{schedule.time} - {schedule.lesson}</p>
                                    <p>Murid: {schedule.students.map(s => s.name).join(', ')}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Tidak ada jadwal mengajar hari ini.</p>
                    )
                )}
            </div>
            
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">Pengumuman Terbaru</h2>
                {recentAnnouncements.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {recentAnnouncements.map(ann => (
                            <li key={ann._id} className="py-3">
                                <p className="font-medium text-gray-900">{ann.title}</p>
                                <p className="text-xs text-gray-500">Oleh: {ann.createdBy?.name}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">Tidak ada pengumuman baru.</p>
                )}
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA (LAYOUT) ---
export default function TeacherDashboard() {
    console.log('%c TEACHER DASHBOARD IS RENDERING! ', 'background: #222; color: #bada55');
    
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const { logout } = useFirebaseAuth();
    const user = useSelector(selectUser); // Mengambil data user dari Redux

    // Menu yang akan ditampilkan di Sidebar
    const menus = [
        { name: 'Dashboard', component: 'dashboard', icon: HomeIcon },
        { name: 'Buat Laporan Les', component: 'lesson-report', icon: DocumentTextIcon },
        { name: 'Modul Belajar', component: 'modules', icon: FolderIcon },
        { name: 'Persetujuan Jadwal', component: 'reschedule', icon: ClockIcon },
        { name: 'Buat Pengumuman', component: 'announcements', icon: SpeakerWaveIcon },
    ];

    // --- FUNGSI RENDER KONTEN YANG SUDAH DIPERBAIKI ---
    const renderContent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <TeacherDashboardHome />; // Render komponen anak, BUKAN diri sendiri
            case 'lesson-report':
                return <TeacherLessonReport />;
            case 'modules':
                return <TeacherModules />;
            case 'reschedule':
                return <TeacherReschedule />;
            case 'announcements':
                return <TeacherAnnouncements />;
            default:
                return <TeacherDashboardHome />; // Default ke halaman utama dashboard
        }
    };
    
    const activeMenuName = menus.find(menu => menu.component === activeComponent)?.name || 'Dashboard';

    // Menampilkan loading jika data user belum siap
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Memuat data pengguna...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-100">
            {/* 1. Sidebar */}
            <Sidebar 
                user={user} // Menggunakan data user asli dari Redux
                menus={menus}
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
                onLogout={logout}
            />

            {/* 2. Area Konten Utama */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-semibold text-gray-800">{activeMenuName}</h1>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}