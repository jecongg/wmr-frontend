import React, { useEffect, useState } from 'react';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    HomeIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';


const Sidebar = ({user, menus, activeComponent, setActiveComponent}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout } = useFirebaseAuth();
    
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        logout();
    } 


    return (
        <div className={`flex h-screen bg-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'}`}>
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between h-30 px-5 bg-yellow-400">
                    <div className='flex flex-col'>
                        {!isCollapsed && (
                            <div className='rounded-full overflow-hidden w-15 h-15'>
                                <img src={user.photoURL} alt="" />
                            </div>
                        )}
                        {!isCollapsed && <span className="text-lg font-bold text-white mt-3">{user.displayName}</span>}
                    </div>
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        {isCollapsed ? <ChevronDoubleRightIcon className="w-6 h-6" /> : <ChevronDoubleLeftIcon className="w-6 h-6" />}
                    </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {menus.map((menu) => (
                        <button 
                            key={menu.name} 
                            onClick={() => setActiveComponent && setActiveComponent(menu.component)}
                            className={`w-full flex items-center px-4 py-2 text-left rounded-md transition-colors ${
                                activeComponent === menu.component 
                                    ? 'bg-yellow-300 text-gray-800' 
                                    : 'text-gray-700 hover:bg-yellow-200'
                            }`}
                        >
                            {menu.icon === 'home' && <HomeIcon className="w-6 h-6 mr-3 text-gray-500" />}
                            {menu.icon === 'users' && <UsersIcon className="w-6 h-6 mr-3 text-gray-500" />}
                            {!isCollapsed && menu.name}  
                        </button>
                    ))}
                </nav>
                <button className='px-2'>
                    <span className='flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-200 rounded-md'>
                        <Cog6ToothIcon className="w-6 h-6 mr-3 text-gray-500" />
                        {!isCollapsed && 'Pengaturan'}
                    </span>
                </button>
                <button className="px-2 py-4" onClick={() => handleLogout()}>
                    <span className='flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-200 rounded-md'>
                        <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3 text-gray-500" />
                        {!isCollapsed && 'Logout'}
                    </span>
                </button>
                {/* <div className="px-2 py-4">
                    <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-200 rounded-md">
                        <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3 text-gray-500" />
                        {!isCollapsed && 'Logout'}
                    </a>
                </div> */}
            </div>
        </div>
    );
};

export default Sidebar;