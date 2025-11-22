import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { selectUser } from '../../redux/slices/authSlice';
import { fetchAnnouncements, selectAllAnnouncements, selectAnnouncementsPagination } from '../../redux/slices/announcementSlice';

import Sidebar from '../../components/Layout/Sidebar';
import { 
    HomeIcon, 
    DocumentMagnifyingGlassIcon, 
    FolderIcon, 
    SpeakerWaveIcon, 
    CalendarDaysIcon,
    ClipboardDocumentCheckIcon 
} from '@heroicons/react/24/outline';

import StudentReportHistory from './StudentReportHistory';
import StudentModules from './StudentModules';
import StudentReschedule from './StudentReschedule';
import StudentAnnouncements from './StudentAnnouncements';
import StudentAttendanceHistory from './StudentAttendanceHistory';
import api from '../../js/services/api';
import { useWebSocketEvent } from '../../js/hooks/useWebSocket';
import { useToast } from '../../js/context/ToastContext';
import { MegaphoneIcon, PlusIcon } from 'lucide-react';
import { fetchTodaySchedules, selectScheduleStatus, selectTodaySchedule } from '../../redux/slices/studentSlice';

const StudentDashboardHome = () => {
    const dispatch = useDispatch();
    const announcements = useSelector(selectAllAnnouncements);
    const pagination = useSelector(selectAnnouncementsPagination);
    const [reports, setReports] = useState([]);
    const schedules = useSelector(selectTodaySchedule);
    const scheduleStatus = useSelector(selectScheduleStatus);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { showToast } = useToast();

    // const fetchTodaySchedulesManual = async () => {
    //         try {
    //             const today = new Date().toISOString().split('T')[0];
    //             const response = await api.get(`/api/student/schedule?date=${today}`);
    //             console.log("Schedule response 2:", response.data);
    //         } catch (error) {
    //             console.error("Gagal memuat jadwal hari ini:", error);
    //         } finally {
    //             setLoadingSchedule(false);
    //         }
    //     };

    useWebSocketEvent('new-announcement', () => {
        dispatch(fetchAnnouncements({ page: currentPage, limit: 5 }));
    });

    useWebSocketEvent('announcement-deleted', () => {
        dispatch(fetchAnnouncements({ page: currentPage, limit: 5 })); 
    });

    useWebSocketEvent('reschedule-approved', (data) => {
        showToast(data.message || 'Jadwal telah disetujui', 'success');
        dispatch(fetchTodaySchedules());
    });

    useWebSocketEvent('reschedule-rejected', (data) => {
        showToast(data.message || 'Jadwal telah ditolak', 'info');
        dispatch(fetchTodaySchedules());
    });

    useWebSocketEvent('student-assigned', (data) => {
        showToast(data.message || 'Anda telah di-assign ke guru baru!', 'success');
        dispatch(fetchTodaySchedules());
    });

    useWebSocketEvent('assignment-updated', (data) => {
        showToast(data.message || 'Assignment Anda telah diupdate', 'info');
        dispatch(fetchTodaySchedules());
    });

    useWebSocketEvent('assignment-removed', (data) => {
        showToast(data.message || 'Assignment Anda telah dihapus', 'warning');
        dispatch(fetchTodaySchedules());
    });
    

    useEffect(() => {
        dispatch(fetchAnnouncements({ page: currentPage, limit: 5 }));

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
        // fetchTodaySchedulesManual();
        dispatch(fetchTodaySchedules());
    }, [dispatch, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    
    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <title>Student Dashboard | Wisma Musik Rapsodi</title>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">Jadwal Les Hari Ini</h2>
                {scheduleStatus === 'loading' ? <p>Memuat jadwal...</p> : (
                    schedules.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {schedules.map((schedule) => (
                                <div key={schedule.scheduleId} className="py-4 rounded-md p-5 mb-3 shadow-lg outline outline-black/5 relative">
                                    {schedule.isRescheduled && (
                                        <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                            Reschedule
                                        </span>
                                    )}
                                    <p className="font-semibold text-indigo-700">{schedule.time} - {schedule.lesson}</p>
                                    <p>Guru: {schedule.teacher.name}</p>
                                    {schedule.isRescheduled && (
                                        <p className="text-sm text-amber-600 mt-1">
                                            ⚠️ Jadwal pengganti (dipindahkan ke hari ini)
                                        </p>
                                    )}
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Tidak ada jadwal les hari ini.</p>
                    )
                )}
            </div>

            {/* Pengumuman */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <MegaphoneIcon className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Pengumuman</h3>
                    </div>
                </div>

                {announcements.length > 0 ? (
                    console.log(announcements) ||
                    <ul className="divide-y divide-gray-200">
                        {announcements.length > 0 ? (
                            <ul className="divide-y divide-gray-200 space-y-3 ">
                                {announcements.map(ann => (
                                    <div key={ann._id} className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                                {ann.content}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {formatDate(ann.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 py-4">Tidak ada pengumuman baru.</p>
                        )}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">Tidak ada pengumuman baru.</p>
                )}
                
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            ‹
                        </button>
                        <span className="text-sm text-gray-600">
                            {pagination.currentPage} dari {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.totalPages}
                            className={`px-3 py-1 rounded ${currentPage === pagination.totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>

            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
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
        </div>
    );
};


export default function StudentDashboard() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const { logout }  = useFirebaseAuth();
    const user = useSelector(selectUser);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menus = [
        { name: 'Dashboard', component: 'dashboard', icon: HomeIcon },
        // { name: 'Riwayat Laporan', component: 'report-history', icon: DocumentMagnifyingGlassIcon },
        { name: 'Riwayat Kehadiran', component: 'attendance-history', icon: ClipboardDocumentCheckIcon },
        { name: 'Modul Belajar', component: 'modules', icon: FolderIcon },
        { name: 'Ajukan Ganti Jadwal', component: 'reschedule', icon: CalendarDaysIcon },
    ];
    const renderContent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <StudentDashboardHome />;
            case 'report-history':
                return <StudentReportHistory />;
            case 'attendance-history':
                return <StudentAttendanceHistory />;
            case 'modules':
                return <StudentModules />;
            case 'reschedule':
                return <StudentReschedule />;
            case 'announcements':
                return <StudentAnnouncements />;
            default:
                return <StudentDashboardHome />;
        }
    };

    
    const activeMenuName = menus.find(menu => menu.component === activeComponent)?.name || 'Dashboard';

    if (!user) {
        return <div>Memuat data pengguna...</div>;
    }

    return (
        <div className='relative min-h-screen bg-gray-100'>
          <Sidebar 
            user={user} 
            menus={menus} 
            setIsCollapsed={setIsCollapsed} 
            isCollapsed={isCollapsed}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
            onLogout={logout} 
          />
          <main className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
            <div className='flex-1 p-4 md:p-6'>
                {renderContent()}
            </div>
          </main>
        </div>
    );
}