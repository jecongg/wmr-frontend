import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { selectUser, selectAuthStatus } from '../../redux/slices/authSlice';
import { fetchTeachers, selectTeachersStatus } from '../../redux/slices/teacherSlice';
import { fetchStudents, selectStudentsStatus } from '../../redux/slices/studentSlice';
import { MdDashboard, MdSettings, MdWork } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { UserGroupIcon } from "@heroicons/react/24/outline";

import Sidebar from '../../components/Layout/Sidebar';
import TeacherManagement from '../../components/Admin/TeacherManagement';
import StudentManagement from '../../components/Admin/StudentManagement';
import Dashboard from '../../components/Admin/Dashboard';
import AssignMuridGuru from '../../components/Admin/AssignMuridGuru';

const menus = [
    { name: 'Dashboard', path: '/admin', icon: MdDashboard, component: 'dashboard' },
    { name: 'Guru', path: '/admin/guru', icon: FaChalkboardTeacher, component: 'teachers' },
    { name: 'Murid', path: '/admin/murid', icon: PiStudent, component: 'students' },
    { 
        name: 'Other', 
        icon: MdSettings, 
        component: 'other', 
        submenu: [
            { name: 'Assign Murid ke Guru', path: '/admin/other/assign', icon: UserGroupIcon, component: 'assign' },
            { name: 'Sub Menu 2', path: '/admin/other/submenu2', icon: MdWork, component: 'submenu2' },
        ]
    },
];

export default function AdminPage() {
    const dispatch = useDispatch();
    const { logout } = useFirebaseAuth();
    
    const user = useSelector(selectUser);
    const authStatus = useSelector(selectAuthStatus);
    const teachersStatus = useSelector(selectTeachersStatus);
    const studentsStatus = useSelector(selectStudentsStatus);

    const [activeComponent, setActiveComponent] = useState('dashboard');

    useEffect(() => {
        if (user && user.role === 'admin') {
            if (teachersStatus === 'idle') {
                console.log('Fetching teachers data...');
                dispatch(fetchTeachers());
            }
            if (studentsStatus === 'idle') {
                console.log('Fetching students data...');
                dispatch(fetchStudents());
            }
        }
    }, [user, dispatch, teachersStatus, studentsStatus]);

    if (authStatus === 'loading' || !user) {
        return (
            <div className='p-4 flex justify-center items-center h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2'></div>
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    const isLoadingData = teachersStatus === 'loading' || studentsStatus === 'loading';
    
    if (isLoadingData) {
        return (
            <div className='p-4 flex justify-center items-center h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2'></div>
                    <p>Loading data guru dan murid...</p>
                </div>
            </div>
        );
    }

    const renderActiveComponent = () => {
        switch(activeComponent) {
            case 'dashboard':
                return <Dashboard user={user} />;
            case 'teachers':
                return <TeacherManagement />;
            case 'students':
                return <StudentManagement />;
            case 'assign':
                return <AssignMuridGuru />;
            default:
                return <Dashboard user={user} />;
        }
    };

    return (
        <div className='flex'>
          <Sidebar 
            user={user} 
            menus={menus} 
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
            onLogout={logout} 
          />
          <main className='flex-1 bg-gray-100 min-h-screen overflow-y-auto'>
            {renderActiveComponent()}
          </main>
        </div>
    );
};