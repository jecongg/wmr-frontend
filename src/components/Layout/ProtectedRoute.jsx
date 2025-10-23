import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthStatus, selectRedirectTarget } from '../../redux/slices/authSlice'; // Sesuaikan path

// Komponen ini sekarang menerima prop 'allowedRoles'
const ProtectedRoute = ({ allowedRoles }) => {
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);
    const redirectTarget = useSelector(selectRedirectTarget);
    
    // 1. Tampilkan loading spinner saat status belum jelas
    if (authStatus === 'loading' || authStatus === 'idle') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }
    
    // 2. Jika tidak ada user sama sekali, tendang ke halaman login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. [KUNCI OTORISASI] Periksa apakah peran user diizinkan untuk mengakses rute ini
    // Array.some() akan return true jika setidaknya satu peran cocok
    if (allowedRoles && !allowedRoles.some(role => user.role === role)) {
        // Jika peran tidak cocok, tendang user ke halaman dashboard mereka sendiri (atau halaman "Unauthorized")
        // Ini mencegah guru mengakses halaman admin, dan sebaliknya.
        return <Navigate to={redirectTarget || '/'} replace />;
    }

    // 4. Jika user ada DAN perannya cocok, izinkan akses
    return <Outlet />;
}

export default ProtectedRoute;