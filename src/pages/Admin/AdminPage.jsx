import React, { useState } from 'react';
// [KUNCI PERBAIKAN] Import useSelector untuk mengambil data dari Redux
import { useSelector } from 'react-redux';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
// [KUNCI PERBAIKAN] Import selector dari authSlice
import { selectUser, selectAuthStatus } from '../../redux/slices/authSlice'; // Sesuaikan path

import Sidebar from '../../components/Layout/Sidebar';
import TeacherManagement from '../../components/Admin/TeacherManagement';
import StudentManagement from '../../components/Admin/StudentManagement';
import Dashboard from '../../components/Admin/Dashboard';

const menus = [
    { name: 'Dashboard', path: '/admin', icon: 'home', component: 'dashboard' },
    { name: 'Guru', path: '/admin/guru', icon: 'users', component: 'teachers' },
    { name: 'Murid', path: '/admin/murid', icon: 'users', component: 'students' },
];

export default function AdminPage() {
    // Panggil hook hanya untuk mendapatkan fungsi logout
    const { logout } = useFirebaseAuth();
    
    // [DIHAPUS] Kode lama yang menyebabkan error:
    // const { currentUser } = useContext(FirebaseDataContext);

    // [DIGANTI] Ambil data user dan status otentikasi langsung dari Redux store
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);

    const [activeComponent, setActiveComponent] = useState('dashboard');

    // [KUNCI PERBAIKAN] Tangani state loading dengan benar menggunakan status dari Redux
    // AuthenticatedLayout sudah melindungi halaman ini, tapi check ini adalah
    // lapisan pengaman tambahan untuk mencegah error render sesaat.
    if (authStatus === 'loading' || !user) {
        return (
            <div className='p-4 flex justify-center items-center h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2'></div>
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    const renderActiveComponent = () => {
        switch(activeComponent) {
            case 'dashboard':
                // [DIGANTI] Gunakan 'user' dari Redux, bukan 'currentUser'
                return <Dashboard user={user} />;
            case 'teachers':
                return <TeacherManagement />;
            case 'students':
                return <StudentManagement />;
            default:
                // [DIGANTI] Gunakan 'user' dari Redux, bukan 'currentUser'
                return <Dashboard user={user} />;
        }
    };

    return (
        <div className='flex'>
          <Sidebar 
            // [DIGANTI] Gunakan 'user' dari Redux, bukan 'currentUser'
            user={user} 
            menus={menus} 
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
            // Tambahkan fungsi logout ke sidebar agar bisa digunakan
            onLogout={logout} 
          />
          <main className='flex-1 bg-gray-100 min-h-screen overflow-y-auto'>
            {renderActiveComponent()}
          </main>
        </div>
    );
};