import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthStatus, selectRedirectTarget } from '../../redux/slices/authSlice'; // Sesuaikan path

// Komponen ini memastikan hanya user yang BELUM LOGIN yang bisa mengakses
// halaman seperti Login dan Register.
export default function GuestRoute() {
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);
    const redirectTarget = useSelector(selectRedirectTarget);

    if (authStatus === 'loading' || authStatus === 'idle') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    // Jika sudah ada user, jangan tampilkan halaman login/register.
    // Langsung arahkan ke dashboard mereka.
    if (user) {
        return <Navigate to={redirectTarget || '/'} replace />;
    }

    // Jika tidak ada user, tampilkan halaman tamu (Login, Register).
    return <Outlet />;
}