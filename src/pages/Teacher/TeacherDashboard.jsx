import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { selectUser } from '../../redux/slices/authSlice';
import { fetchAnnouncements, selectAllAnnouncements, selectAnnouncementsPagination } from '../../redux/slices/announcementSlice';
import api from '../../js/services/api';
import { useWebSocketEvent } from '../../js/hooks/useWebSocket';
import { useToast } from '../../js/context/ToastContext';

import Sidebar from '../../components/Layout/Sidebar';
import { 
    HomeIcon, 
    DocumentTextIcon, 
    FolderIcon, 
    ClockIcon, 
    SpeakerWaveIcon,
    UserGroupIcon 
} from '@heroicons/react/24/outline';


import TeacherLessonReport from './TeacherLessonReport';
import TeacherModules from './TeacherModule';
import TeacherReschedule from './TeacherReschedule';
import TeacherAnnouncements from './TeacherAnnouncements';
import TeacherStudents from './TeacherStudents';
import TeacherStudentDetail from './TeacherStudentDetail';
import { MegaphoneIcon } from 'lucide-react';
import { fetchScheduleforToday, selectScheduleStatus, selectTodaySchedule } from '../../redux/slices/attendanceSlice';


const TeacherDashboardHome = ({onStudentClick }) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const announcements = useSelector(selectAllAnnouncements);
    const pagination = useSelector(selectAnnouncementsPagination);
    const schedules = useSelector(selectTodaySchedule);
    const scheduleStatus = useSelector(selectScheduleStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const { showToast } = useToast();

    // const fetchTodaySchedulesManual = async () => {
    //     try {
    //         const today = new Date().toISOString().split('T')[0];
    //         const response = await api.get(`/api/attendance/teacher/schedule?date=${today}`); 
    //     } catch (error) {
    //         console.error("Gagal memuat jadwal hari ini:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useWebSocketEvent('student-assigned', (data) => {
        showToast(data.message || 'Murid baru telah di-assign kepada Anda!', 'success');
        dispatch(fetchScheduleforToday());
    });

    useWebSocketEvent('assignment-updated', (data) => {
        showToast(data.message || 'Assignment telah diupdate', 'info');
        dispatch(fetchScheduleforToday());
    });

    useWebSocketEvent('assignment-removed', (data) => {
        showToast(data.message || 'Assignment telah dihapus', 'warning');
        dispatch(fetchScheduleforToday());
    });

    useWebSocketEvent('reschedule-approved', (data) => {
        showToast(data.message || 'Jadwal telah disetujui', 'success');
        dispatch(fetchScheduleforToday());
    });

    useWebSocketEvent('reschedule-rejected', (data) => {
        showToast(data.message || 'Jadwal telah ditolak', 'info');
        dispatch(fetchScheduleforToday());
    });

    useWebSocketEvent('new-announcement', () => {
        dispatch(fetchAnnouncements({ page: currentPage, limit: 5 }));
    });
    useWebSocketEvent('announcement-deleted', ({ id }) => {
        dispatch(fetchAnnouncements({ page: currentPage, limit: 5 })); 
    });

    useEffect(() => {
        dispatch(fetchAnnouncements({ page: currentPage, limit: 5 }));
        dispatch(fetchScheduleforToday());
        console.log("Fetching today's schedule");
        console.log(schedules);
    }, [dispatch, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    const handleScheduleClick = (student) => {
        const studentId = student._id || student.id;
        if (studentId) {
            onStudentClick(studentId);
        } else {
            console.warn("ID murid tidak ditemukan pada jadwal ini.");
        }
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
        <>
        <title>Dashboard | Wisma Musik Rapsodi</title>
            <div className='my-3 mb-6'>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h2>
                <h2 className="text-lg font-medium text-gray-800 mb-2">Welcome Back, {user.name}....</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5">Jadwal Anda Hari Ini</h2>
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
                                        <p>Murid: {schedule.students.map(s => s.name).join(', ')}</p>
                                        {schedule.isRescheduled && (
                                            <p className="text-sm text-amber-600 mt-1">
                                                ⚠️ Jadwal pengganti (dipindahkan ke hari ini)
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 py-4">Tidak ada jadwal mengajar hari ini.</p>
                        )
                    )}
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <MegaphoneIcon className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Pengumuman</h3>
                        </div>
                    </div>
                    {announcements.length > 0 ? (
                        <ul className="divide-y divide-gray-200 space-y-3">
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
                    
                    {/* Pagination */}
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
            </div>
        </>
    );
};


export default function TeacherDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const { logout } = useFirebaseAuth();
    const user = useSelector(selectUser);

    const getActiveComponentFromPath = () => {
        const path = location.pathname;
        if (path.includes('/students')) return 'students';
        if (path.includes('/student-detail')) return 'student-detail';
        if (path.includes('/reschedule')) return 'reschedule';
        return 'dashboard';
    };
    const [isCollapsed, setIsCollapsed] = useState(false);


    const [activeComponent, setActiveComponent] = useState(getActiveComponentFromPath());

    useEffect(() => {
        const pathMap = {
            'dashboard': '/teacher/dashboard',
            'students': '/teacher/students',
            'student-detail': '/teacher/student-detail',
            'reschedule': '/teacher/reschedule',
        };

        const newPath = pathMap[activeComponent] ;        
        if (location.pathname !== newPath) {
            navigate(newPath, { replace: true });
        }
    }, [activeComponent, navigate]);

    useEffect(() => {
        setActiveComponent(getActiveComponentFromPath());
    }, [location.pathname]);

    const menus = [
        { name: 'Dashboard', component: 'dashboard', icon: HomeIcon },
        { name : 'Murid Saya', component: 'students', icon: UserGroupIcon }, 
        // { name: 'Buat Laporan Les', component: 'lesson-report', icon: DocumentTextIcon },
        // { name: 'Modul Belajar', component: 'modules', icon: FolderIcon },
        { name: 'Persetujuan Jadwal', component: 'reschedule', icon: ClockIcon },
        // { name: 'Buat Pengumuman', component: 'announcements', icon: SpeakerWaveIcon },
    ];

    const showStudentDetail = (studentId) => {
        // console.log(studentId);
        setSelectedStudentId(studentId);
        setActiveComponent('student-detail');
    };

    const renderContent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <TeacherDashboardHome onStudentClick={showStudentDetail} />;
            case 'student-detail':
                return <TeacherStudentDetail 
                    studentId={selectedStudentId} 
                    onBackClick={() => setActiveComponent('students')} 
                />;    
            case 'students':
                return <TeacherStudents onStudentClick={showStudentDetail} />;
            // case 'lesson-report':
            //     return <TeacherLessonReport />;
            // case 'modules':
            //     return <TeacherModules />;
            case 'reschedule':
                return <TeacherReschedule />;
            case 'announcements':
                return <TeacherAnnouncements />;
            default:
                return <TeacherDashboardHome onStudentClick={showStudentDetail} />;
        }
    };
    
    let activeMenuName = menus.find(menu => menu.component === activeComponent)?.name || 'Dashboard';
    if(activeComponent === 'student-detail') {
        activeMenuName = 'Detail Murid';
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Memuat data pengguna...</p>
            </div>
        );
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