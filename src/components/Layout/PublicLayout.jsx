import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectAuthStatus, selectRedirectTarget } from '../../redux/slices/authSlice'; // Sesuaikan path

export default function PublicLayout() {
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

    if (user) {
        return <Navigate to={redirectTarget || '/'} replace />;
    }

    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
}