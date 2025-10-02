import { FirebaseDataProvider } from "../../js/context/FirebaseDataProvider";
import { Outlet, Navigate } from 'react-router-dom';
import { useFirebaseAuth } from "../../js/hooks/useFirebaseAuth";


const Container = () => {
    const { user, authloading } = useFirebaseAuth();
    
    if (authloading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '20px', color: '#666' }}>Loading...</p>
                <style>
                    {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
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
    )
}

export default function AuthenticatedLayout() {
    return (
        <FirebaseDataProvider>
            <Container />
        </FirebaseDataProvider>
    )
}