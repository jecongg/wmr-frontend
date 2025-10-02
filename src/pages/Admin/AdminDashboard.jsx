import React from 'react';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { useFirebase } from '../../js/context/FirebaseDataProvider';
import { useEffect } from 'react';


export default function AdminDashboard() {
    const { logout } = useFirebaseAuth();
    const { currentUser } = useFirebase();

    const clickLogout = () => {
        logout();
    }

    useEffect(() => {
        console.log(currentUser.username);
    })

    return (
        <>
            <div className='p-4'>
                <h1 className='text-2xl font-bold'>
                    {currentUser.username}
                </h1>
            </div>
            {/* <button onClick={() => logout()}>Logout</button> */}
        </>
    );
};

