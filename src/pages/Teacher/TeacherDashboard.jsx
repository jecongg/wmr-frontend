import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { selectUser } from '../../redux/slices/authSlice';
import { fetchAnnouncements, selectAllAnnouncements } from '../../redux/slices/announcementSlice';
import api from '../../js/services/api';

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


const TeacherDashboardHome = ({onStudentClick }) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const announcements = useSelector(selectAllAnnouncements);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchAnnouncements());
        const fetchTodaySchedules = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const response = await api.get(`/api/attendance/teacher/schedule?date=${today}`); 
                console.log(response.data);
                setSchedules(response.data);
            } catch (error) {
                console.error("Gagal memuat jadwal hari ini:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTodaySchedules();

        // const fetchAnnouncements = async () => {
        //     try {
        //         await dispatch(fetchAnnouncements());
        //     } catch (error) {
        //         console.error("Gagal memuat pengumuman:", error);
        //     }
        // }
    }, [dispatch]);

    const recentAnnouncements = announcements.slice(0, 2);

    const handleScheduleClick = (student) => {
        const studentId = student._id || student.id;
        if (studentId) {
            onStudentClick(studentId);
        } else {
            console.warn("ID murid tidak ditemukan pada jadwal ini.");
        }
    };
    


    // const formatted = date.toLocaleString("id-ID", {
    //     timeZone: "Asia/Jakarta",
    //     year: "numeric",
    //     month: "2-digit",
    //     day: "2-digit",
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     second: "2-digit",
    // });

    return (
        <>
            <div className='my-3 mb-6'>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h2>
                <h2 className="text-lg font-medium text-gray-800 mb-2">Welcome Back, {user.name}....</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5">Jadwal Anda Hari Ini</h2>
                    {loading ? <p>Memuat jadwal...</p> : (
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
                
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5">Pengumuman Terbaru</h2>
                    {announcements.length > 0 ? (
                        <ul className="divide-y divide-gray-200 ">
                            {announcements.map(ann => (
                                <div key={ann._id} className="p-3 shadow-lg rounded-md">
                                    <p className="font-medium text-gray-900 mb-2">{ann.content}</p>
                                    <p className="text-xs text-gray-500">{new Date(ann.createdAt).toLocaleString("id-ID", {
                                        timeZone: "Asia/Jakarta",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}</p>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Tidak ada pengumuman baru.</p>
                    )}
                </div>
            </div>
        </>
    );
};


export default function TeacherDashboard() {
    console.log('%c TEACHER DASHBOARD IS RENDERING! ', 'background: #222; color: #bada55');
    
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
        <div className="flex h-screen bg-slate-100">

            <Sidebar 
                user={user}
                menus={menus}
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
                onLogout={logout}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* <header className="bg-white shadow-sm z-10">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-semibold text-gray-800">{activeMenuName}</h1>
                    </div>
                </header> */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}