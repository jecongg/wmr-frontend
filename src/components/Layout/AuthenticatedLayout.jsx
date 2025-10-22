import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthStatus } from '../../redux/slices/authSlice'; // Sesuaikan path

export default function AuthenticatedLayout() {
    // Baca status otentikasi langsung dari Redux store
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);
    
    // Tampilkan loading spinner saat Firebase sedang memeriksa sesi...
    if (authStatus === 'loading' || authStatus === 'idle') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                {/* Anda bisa menggunakan komponen spinner yang lebih bagus */}
                <p>Loading...</p>
            </div>
        );
    }
    
    // Jika pengecekan selesai dan TIDAK ADA user, tendang ke halaman login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Jika ada user, tampilkan konten halaman yang diproteksi
    return (
        <div>
            {/* Di sini bisa Anda tambahkan Navbar, Sidebar, dll untuk user yang sudah login */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}