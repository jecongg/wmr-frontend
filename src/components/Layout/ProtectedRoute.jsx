import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthStatus, selectRedirectTarget } from '../../redux/slices/authSlice'; // Sesuaikan path

const ProtectedRoute = ({ allowedRoles }) => {
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);
    const redirectTarget = useSelector(selectRedirectTarget);
    const location = useLocation();
    

    if (authStatus === 'loading' || authStatus === 'idle') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                <p className="text-gray-600">Memuat...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.some(role => user.role === role)) {
        return <Navigate to={redirectTarget || '/'} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;