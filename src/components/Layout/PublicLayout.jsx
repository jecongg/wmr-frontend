import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthStatus, selectRedirectTarget } from '../../redux/slices/authSlice'; // Sesuaikan path

export default function PublicLayout() {
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);
    const redirectTarget = useSelector(selectRedirectTarget); // Kita butuh ini untuk tahu ke mana harus redirect

    if (authStatus === 'loading' || authStatus === 'idle') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    // Jika pengecekan selesai dan TERNYATA ADA USER,
    // jangan tampilkan halaman login/register. Langsung redirect ke dashboard mereka.
    if (user) {
        return <Navigate to={redirectTarget || '/'} replace />;
    }

    // Jika tidak ada user, tampilkan halaman publik (Login, Register, Landing Page)
    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
}