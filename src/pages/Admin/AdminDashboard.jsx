import React, { useContext } from 'react';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { FirebaseDataContext } from '../../js/context/FirebaseDataProvider';

export default function AdminDashboard() {
    const { logout } = useFirebaseAuth();
    const { currentUser } = useContext(FirebaseDataContext);

    const clickLogout = () => {
        logout();
    }
    if (!currentUser) {
        return (
            <div className='p-4 flex justify-center items-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2'></div>
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='p-4'>
                <h1 className='text-2xl font-bold mb-4'>
                    Welcome, {currentUser.displayName}!
                </h1>

                <button 
                    onClick={clickLogout}
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                >
                    Logout
                </button>
            </div>
        </>
    );
};

