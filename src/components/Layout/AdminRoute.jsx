import { Outlet, Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';

const AdminRoute = () => {
    const { user, authloading } = useFirebaseAuth();

    if (authloading) {
        return <div className='w-full h-screen flex items-center justify-center'>Loading...</div>;
    }

    if (user && user.role === 'admin') {
        return <Outlet />;
    }

    if (user) {
        return <Navigate to="/" replace />; // Arahkan ke landing page
    }
    
    // Jika tidak ada user sama sekali, tendang ke login
    return <Navigate to="/login" replace />;
};

export default AdminRoute;