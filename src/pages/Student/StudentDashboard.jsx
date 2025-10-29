import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Hook dan State Management
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { selectUser } from '../../redux/slices/authSlice';
import { fetchAnnouncements, selectAllAnnouncements } from '../../redux/slices/announcementSlice';

// Komponen Layout dan Ikon
import Sidebar from '../../components/Layout/Sidebar';
import { 
    HomeIcon, 
    DocumentMagnifyingGlassIcon, 
    FolderIcon, 
    SpeakerWaveIcon, 
    CalendarDaysIcon 
} from '@heroicons/react/24/outline';

// Komponen Fitur (pastikan path import ini benar)
import StudentReportHistory from './StudentReportHistory';
import StudentModules from './StudentModules';
import StudentReschedule from './StudentReschedule';
import StudentAnnouncements from './StudentAnnouncements';
import api from '../../js/services/api';

// --- Komponen Internal untuk Halaman Utama Dashboard ---
const StudentDashboardHome = () => {
    const dispatch = useDispatch();
    const announcements = useSelector(selectAllAnnouncements);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchAnnouncements());

        const fetchRecentReports = async () => {
            try {
                const response = await api.get('/api/records/student/history');
                setReports(response.data.slice(0, 3)); 
            } catch (error) {
                console.error("Gagal memuat laporan terkini:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentReports();
    }, [dispatch]);

    const recentAnnouncements = announcements.slice(0, 2);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">Laporan Belajar Terkini</h2>
                {loading ? <p>Memuat laporan...</p> : (
                    reports.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {reports.map((report) => (
                                <li key={report._id} className="py-4">
                                    <p className="text-sm text-gray-500">
                                        {new Date(report.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - oleh Guru {report.teacher?.name}
                                    </p>
                                    <p className="text-lg font-semibold text-indigo-700 mt-1">
                                        Materi: {report.materialsCovered || 'Tidak ada judul materi'}
                                    </p>
                                    <p className="text-md text-gray-700 mt-1 truncate">
                                        {report.report || 'Tidak ada catatan laporan.'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Belum ada laporan belajar yang dipublikasikan.</p>
                    )
                )}
            </div>
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">Pengumuman</h2>
                {recentAnnouncements.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {recentAnnouncements.map(ann => (
                            <li key={ann._id} className="py-3">
                                <p className="text-md font-medium text-gray-900">{ann.title}</p>
                                <p className="text-xs text-gray-500">{new Date(ann.createdAt).toLocaleDateString('id-ID')} - oleh {ann.createdBy?.name}</p>
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


// --- Komponen Utama Halaman Dashboard Murid ---
export default function StudentDashboard() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const { logout }  = useFirebaseAuth();
    const user = useSelector(selectUser);

    const menus = [
        { name: 'Dashboard', component: 'dashboard', icon: HomeIcon },
        { name: 'Riwayat Laporan', component: 'report-history', icon: DocumentMagnifyingGlassIcon },
        { name: 'Modul Belajar', component: 'modules', icon: FolderIcon },
        { name: 'Ajukan Ganti Jadwal', component: 'reschedule', icon: CalendarDaysIcon },
        { name: 'Semua Pengumuman', component: 'announcements', icon: SpeakerWaveIcon },
    ];

    // =============================================================
    // =========== INI ADALAH BAGIAN YANG DIPERBAIKI ===============
    // =============================================================
    const renderContent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <StudentDashboardHome />; // Render komponen ANAK, bukan diri sendiri
            case 'report-history':
                return <StudentReportHistory />;
            case 'modules':
                return <StudentModules />;
            case 'reschedule':
                return <StudentReschedule />;
            case 'announcements':
                return <StudentAnnouncements />;
            default:
                return <StudentDashboardHome />; // Default ke komponen anak
        }
    };
    // =============================================================
    // =============================================================
    
    const activeMenuName = menus.find(menu => menu.component === activeComponent)?.name || 'Dashboard';

    if (!user) {
        return <div>Memuat data pengguna...</div>;
    }

    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar 
                user={user}
                menus={menus}
                activeComponent={activeComponent}
                onLogout={logout}
                setActiveComponent={setActiveComponent}
            />
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