import React, { useState } from 'react';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';


const Sidebar = ({ user, menus, activeComponent, setActiveComponent }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout } = useFirebaseAuth();
    
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        logout();
    } 

    return (
        <div className={`flex flex-shrink-0 h-screen bg-white transition-all duration-300 ${isCollapsed ? 'w-30' : 'w-72'}`}>
            <div className="flex flex-col w-full">
                
                {/* Header Sidebar */}
                <div className={`flex items-center justify-between h-24 px-5 bg-yellow-400 ${isCollapsed ? 'py-4' : 'pt-4'}`}>
                    {!isCollapsed && (
                        <div className='flex flex-col items-start'>
                            <div className='rounded-full overflow-hidden w-12 h-12 mb-2 border-2 border-white shadow-sm'>
                                <img src={user.photoURL} alt="User" />
                            </div>
                            <span className="text-lg font-bold text-white mt-1 whitespace-nowrap">{user.displayName}</span>
                        </div>
                    )}
                     {isCollapsed && (
                         <div className='rounded-full overflow-hidden w-10 h-10 border-2 border-white shadow-sm'>
                            <img src={user.photoURL} alt="User" />
                        </div>
                     )}
                    <button onClick={toggleSidebar} className="text-white focus:outline-none self-start pt-2">
                        {isCollapsed ? <ChevronDoubleRightIcon className="w-6 h-6" /> : <ChevronDoubleLeftIcon className="w-6 h-6" />}
                    </button>
                </div>

                {/* Navigasi Menu */}
                <nav className="flex-1 px-3 py-4 space-y-2">
                    {menus.map((menu) => {
                        // Ambil komponen Ikon dari prop 'icon'
                        const IconComponent = menu.icon; 
                        
                        return (
                            <button 
                                key={menu.name} 
                                onClick={() => setActiveComponent && setActiveComponent(menu.component)}
                                title={isCollapsed ? menu.name : ''} // Tooltip saat sidebar kecil
                                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                                    activeComponent === menu.component 
                                        ? 'bg-yellow-300 text-gray-900 font-semibold' 
                                        : 'text-gray-700 hover:bg-yellow-200'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                {IconComponent && <IconComponent className={`w-6 h-6 text-gray-600 ${!isCollapsed ? 'mr-4' : ''}`} />}
                                {!isCollapsed && <span className="whitespace-nowrap">{menu.name}</span>}  
                            </button>
                        );
                    })}
                </nav>

                {/* Bagian Bawah: Pengaturan & Logout */}
                <div className="px-3 py-4 border-t border-gray-200">
                    <button 
                        title={isCollapsed ? 'Pengaturan' : ''}
                        className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <Cog6ToothIcon className={`w-6 h-6 text-gray-500 ${!isCollapsed ? 'mr-4' : ''}`} />
                        {!isCollapsed && 'Pengaturan'}
                    </button>
                    <button 
                        onClick={() => handleLogout()}
                        title={isCollapsed ? 'Logout' : ''}
                        className={`w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-100 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <ArrowLeftOnRectangleIcon className={`w-6 h-6 text-red-500 ${!isCollapsed ? 'mr-4' : ''}`} />
                        {!isCollapsed && 'Logout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;