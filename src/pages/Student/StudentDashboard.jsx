import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar'; // Asumsi Sidebar.jsx ada di folder yang sama

// --- Ikon untuk Menu di Sidebar ---
import { 
    HomeIcon, 
    MusicalNoteIcon, 
    CalendarDaysIcon, 
    MegaphoneIcon 
} from '@heroicons/react/24/outline';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import StudentAttendanceHistory from '../../components/Student/StudentAttendanceHistory';

// --- Komponen Placeholder untuk Halaman Lain ---
const MyClassPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Halaman Kelas Saya</h1><p>Konten detail kelas, materi, dan riwayat laporan akan ada di sini...</p></div>;
const ReschedulePage = () => <div className="p-8"><h1 className="text-2xl font-bold">Halaman Ganti Jadwal</h1><p>Formulir untuk mengajukan pergantian jadwal les akan ada di sini...</p></div>;
const AllAnnouncementsPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Halaman Semua Pengumuman</h1><p>Daftar semua pengumuman yang pernah ada akan ada di sini...</p></div>;


// --- DUMMY DATA ---
// Data ini nantinya akan Anda dapatkan dari API atau state management

// Data untuk Sidebar
const dummyUser = {
    displayName: 'Budi Santoso',
    photoURL: 'https://placehold.co/100x100/EEE/333?text=BS' 
    // Ganti dengan user.photoURL asli
};

// Data untuk Konten Dashboard
const recentAnnouncements = [
    { id: 201, date: '20 Okt 2025', title: 'Jadwal Les Minggu Depan: Libur Hari Raya', teacher: 'Clara' },
    { id: 202, date: '15 Okt 2025', title: 'Materi Baru: Ebook Teori Musik Dasar', teacher: 'Clara' },
];

const recentReports = [
    { 
        id: 102, 
        date: '21 Okt 2025', 
        title: 'Review: Skala Mayor & Minor', 
        lesson: 'Piano - Grade 2', 
        teacher: 'Clara',
        snippet: 'Budi sudah mulai lancar memainkan skala mayor, namun perlu latihan lagi untuk tempo...' 
    },
    { 
        id: 101, 
        date: '14 Okt 2025', 
        title: 'Latihan: Posisi Jari & Akor Dasar', 
        lesson: 'Piano - Grade 2', 
        teacher: 'Clara',
        snippet: 'Posisi jari sudah benar, pekerjaan rumah selanjutnya adalah menghafal akor C, G, Am, F...' 
    },
];


// --- Komponen Utama ---
export default function StudentDashboard() {
    // State untuk melacak komponen/halaman mana yang sedang aktif
    const [activeComponent, setActiveComponent] = useState('dashboard');

    const { logout } = useFirebaseAuth();


    // Daftar menu yang akan dikirim ke Sidebar
    const menus = [
        { name: 'Dashboard', component: 'dashboard', icon: HomeIcon },
        { name: 'Kelas Saya', component: 'my-class', icon: MusicalNoteIcon },
        { name: 'Ganti Jadwal', component: 'reschedule', icon: CalendarDaysIcon },
        { name: 'Pengumuman', component: 'announcements', icon: MegaphoneIcon },
        { name: 'Riwayat Absensi', component: 'attendance-history', icon: CalendarDaysIcon },
    ];

    // --- KONTEN DASHBOARD (DIGABUNG DI SINI) ---
    // Ini adalah fungsi yang me-render isi dari halaman dashboard siswa
    const RenderDashboardContent = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Kolom Utama: Laporan Belajar Terkini */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
                <div className="flex items-center space-x-3 mb-5">
                    <IconDocumentText className="w-8 h-8 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Laporan Belajar Terkini</h2>
                </div>

                {recentReports.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {recentReports.map((report) => (
                            <li key={report.id} className="py-4">
                                <p className="text-sm text-gray-500">{report.date} - {report.lesson}</p>
                                <p className="text-lg font-semibold text-indigo-700">{report.title}</p>
                                <p className="text-md text-gray-700 mt-1">{report.snippet}</p>
                                <button className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-800">
                                    Lihat Laporan Lengkap →
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">Belum ada laporan belajar yang dipublikasikan.</p>
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
                            <p className="text-xs text-gray-500">{ann.date} - oleh Guru {ann.teacher}</p>
                        </li>
                    ))}
                </ul>
                <button 
                    onClick={() => setActiveComponent('announcements')}
                    className="w-full mt-4 text-sm inline-flex justify-center items-center px-4 py-2 border border-transparent font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200">
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
            case 'my-class':
                return <MyClassPage />;
            case 'reschedule':
                return <ReschedulePage />;
            case 'announcements':
                return <AllAnnouncementsPage />;
            case 'attendance-history':
                return <StudentAttendanceHistory />;
            default:
                return <RenderDashboardContent />;
        }
    };
    
    // Cari nama menu yang sedang aktif untuk ditampilkan di header
    const activeMenuName = menus.find(menu => menu.component === activeComponent)?.name || 'Dashboard';

    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar 
                user={dummyUser}
                menus={menus}
                activeComponent={activeComponent}
                onLogout={logout}
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

const IconDocumentText = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);
const IconBell = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 5.071 23.848 23.848 0 005.455 1.31m5.714 0a23.842 23.842 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);