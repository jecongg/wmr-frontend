import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar'; // Asumsi Sidebar.jsx ada di folder yang sama

// --- Ikon untuk Menu di Sidebar ---
import { 
    HomeIcon, 
    CalendarDaysIcon, 
    DocumentTextIcon, 
    MegaphoneIcon, 
    CheckBadgeIcon 
} from '@heroicons/react/24/outline';
import TeacherAttendancePage from './TeacherAttendance';

// --- Komponen Placeholder untuk Halaman Lain ---
// Ini hanya contoh, nantinya Anda akan membuat file komponen penuh untuk ini
const SchedulePage = () => <div className="p-8"><h1 className="text-2xl font-bold">Halaman Jadwal Mengajar</h1><p>Konten kalender penuh akan ada di sini...</p></div>;
const ReportsPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Halaman Laporan Belajar</h1><p>Formulir dan daftar laporan akan ada di sini...</p></div>;
const AttendancePage = () => <div className="p-8"><h1 className="text-2xl font-bold">Halaman Absensi Siswa</h1><p>Konten untuk mengelola absensi akan ada di sini...</p></div>;
const AnnouncementsPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Halaman Pengumuman</h1><p>Formulir untuk membuat pengumuman baru akan ada di sini...</p></div>;


// --- DUMMY DATA ---
// Data ini nantinya akan Anda dapatkan dari API atau state management

// Data untuk Sidebar
const dummyUser = {
    displayName: 'Clara Wijaya',
    photoURL: 'https://placehold.co/100x100/FFF/333?text=CW' 
    // Ganti dengan user.photoURL asli
};

// Data untuk Konten Dashboard
const todaySchedule = [
    { 
        id: 1, 
        time: '10:00 - 11:00', 
        student: 'Budi Santoso', 
        lesson: 'Piano - Grade 2', 
        type: 'online', 
    },
    { 
        id: 2, 
        time: '13:00 - 14:00', 
        student: 'Citra Lestari', 
        lesson: 'Vokal - Pop', 
        type: 'offline', 
    },
];

const recentAnnouncements = [
    { id: 201, date: '20 Okt 2025', title: 'Jadwal Les Minggu Depan: Libur Hari Raya' },
    { id: 202, date: '15 Okt 2025', title: 'Materi Baru: Ebook Teori Musik Dasar' },
];


// --- Komponen Utama ---
export default function TeacherDashboard() {
    // State untuk melacak komponen/halaman mana yang sedang aktif
    const [activeComponent, setActiveComponent] = useState('dashboard');

    // Daftar menu yang akan dikirim ke Sidebar
    const menus = [
        { name: 'Dashboard', component: 'dashboard', icon: HomeIcon },
        { name: 'Jadwal Mengajar', component: 'schedule', icon: CalendarDaysIcon },
        { name: 'Laporan Belajar', component: 'reports', icon: DocumentTextIcon },
        { name: 'Absensi Siswa', component: 'attendance', icon: CheckBadgeIcon },
        { name: 'Pengumuman', component: 'announcements', icon: MegaphoneIcon },
    ];

    // --- KONTEN DASHBOARD (SEKARANG ADA DI SINI) ---
    // Ini adalah fungsi yang me-render isi dari halaman dashboard
    const RenderDashboardContent = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Kolom Utama: Jadwal Hari Ini */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
                <div className="flex items-center space-x-3 mb-5">
                    <IconCalendar className="w-8 h-8 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Jadwal Anda Hari Ini</h2>
                </div>

                {todaySchedule.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {todaySchedule.map((item) => (
                            <li key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-3 sm:mb-0">
                                    <p className="text-lg font-semibold text-indigo-700">{item.time}</p>
                                    <p className="text-xl font-medium text-gray-900">{item.student}</p>
                                    <p className="text-md text-gray-600">{item.lesson}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {item.type === 'online' ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            <IconVideo className="w-5 h-5 mr-2" /> Online
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            <IconUser className="w-5 h-5 mr-2" /> Offline
                                        </span>
                                    )}
                                    <button className="text-sm inline-flex items-center px-4 py-2 border border-gray-300 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                        Detail
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">Tidak ada jadwal mengajar hari ini.</p>
                )}
            </div>

            {/* Kolom Samping: Pengumuman Terkini */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
                <div className="flex items-center space-x-3 mb-5">
                    <IconBell className="w-8 h-8 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Pengumuman</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                    {recentAnnouncements.map(ann => (
                        <li key={ann.id} className="py-3">
                            <p className="text-md font-medium text-gray-900">{ann.title}</p>
                            <p className="text-xs text-gray-500">{ann.date}</p>
                        </li>
                    ))}
                </ul>
                <button className="w-full mt-4 text-sm inline-flex justify-center items-center px-4 py-2 border border-transparent font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200">
                    Lihat Semua Pengumuman
                </button>
            </div>
        </div>
    );
    // --- AKHIR KONTEN DASHBOARD ---


    // Fungsi untuk me-render komponen yang aktif
    const renderContent = () => {
        switch (activeComponent) {
            case 'dashboard':
                // Memanggil fungsi internal di atas
                return <RenderDashboardContent />; 
            case 'schedule':
                return <SchedulePage />;
            case 'reports':
                return <ReportsPage />;
            case 'attendance':
                return <TeacherAttendancePage />;
            case 'announcements':
                return <AnnouncementsPage />;
            default:
                return <RenderDashboardContent />;
        }
    };
    
    // Cari nama menu yang sedang aktif untuk ditampilkan di header
    const activeMenuName = menus.find(menu => menu.component === activeComponent)?.name || 'Dashboard';

    return (
        <div className="flex h-screen bg-slate-100">
            {/* 1. Sidebar */}
            <Sidebar 
                user={dummyUser}
                menus={menus}
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
            />

            {/* 2. Area Konten Utama */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Header di dalam konten */}
                <header className="bg-white shadow-sm z-10">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-semibold text-gray-800">{activeMenuName}</h1>
                    </div>
                </header>

                {/* Konten yang bisa di-scroll */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}


// --- KOMPONEN IKON SVG (Pengganti React-Icons) ---
// Ditempatkan di sini agar rapi dan self-contained

const IconCalendar = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25m10.5-2.25v2.25m-10.5 0L6.75 21h10.5l.75-15.75M21 21H3M3 5.25h18M3 5.25a2.25 2.25 0 00-2.25 2.25v11.25a2.25 2.25 0 002.25 2.25h18a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H3z" />
    </svg>
);
const IconBell = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.071 23.848 23.848 0 005.455 1.31m5.714 0a23.842 23.842 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);
const IconVideo = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
);
const IconUser = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);