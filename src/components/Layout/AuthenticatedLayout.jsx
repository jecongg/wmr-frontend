import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthStatus } from '../../redux/slices/authSlice'; // Sesuaikan path

export default function AuthenticatedLayout() {
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);
    
    if (authStatus === 'loading' || authStatus === 'idle') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
}