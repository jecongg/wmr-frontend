import React, { useEffect, useState } from 'react';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { ChevronDownIcon } from 'lucide-react';


const Sidebar = ({ user, menus, activeComponent, setActiveComponent }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout } = useFirebaseAuth();
    const dispatch = useDispatch();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const userData = useSelector(selectUser);

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        if (!isCollapsed) {
            setOpenDropdown(null);
        }
    };
    const handleMenuClick = (menu) => {
        if (menu.submenu) {
            setOpenDropdown(openDropdown === menu.name ? null : menu.name);
        } else {
            setActiveComponent(menu.component);
            setOpenDropdown(null);
        }
    };s


    const handleLogout = () => {
        logout();
    } 

    return (
        <div className={`flex flex-shrink-0 h-screen bg-white transition-all duration-300 ${isCollapsed ? 'w-30' : 'w-72'}`}>
            <div className="flex flex-col w-full">
                
                <div className={`flex items-center justify-between h-24 px-5 bg-yellow-400 ${isCollapsed ? 'py-4' : 'pt-2'}`}>
                    {!isCollapsed && (
                        <div className='flex flex-col items-start'>
                            <span className="text-lg font-bold text-white mt-1 whitespace-nowrap">Welcome,</span>
                            <span className="text-sm font-bold text-white mt-1 whitespace-nowrap"> {userData.name}</span>
                        </div>
                    )}
                     {isCollapsed && (
                         <div className='rounded-full overflow-hidden w-10 h-10 border-2 border-white shadow-sm'>
                            <span>{userData.name.slice(0,0)}</span>
                        </div>
                     )}
                    <button onClick={toggleSidebar} className="text-white focus:outline-none self-start pt-2">
                        {isCollapsed ? <ChevronDoubleRightIcon className="w-6 h-6" /> : <ChevronDoubleLeftIcon className="w-6 h-6" />}
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-2">
                    {menus.map((menu) => {
                        const IconComponent = menu.icon; 
                        const isDropdownOpen = openDropdown === menu.name;

                        return (
                            <div key={menu.name}>
                                <button 
                                    onClick={() => handleMenuClick(menu)}
                                    title={isCollapsed ? menu.name : ''}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                                        activeComponent === menu.component && !menu.submenu
                                            ? 'bg-yellow-300 text-gray-900 font-semibold' 
                                            : 'text-gray-700 hover:bg-yellow-200'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                >
                                    <div className='flex items-center'>
                                        {IconComponent && <IconComponent className={`w-6 h-6 text-gray-600 ${!isCollapsed ? 'mr-4' : ''}`} />}
                                        {!isCollapsed && <span className="whitespace-nowrap">{menu.name}</span>}
                                    </div>
                                    {!isCollapsed && menu.submenu && (
                                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    )}
                                </button>
                                {isDropdownOpen && !isCollapsed && (
                                    <div className="pl-8 pt-2 space-y-2">
                                        {menu.submenu.map((submenuItem) => {
                                            const SubMenuIcon = submenuItem.icon;
                                            return (
                                                <button
                                                    key={submenuItem.name}
                                                    onClick={() => setActiveComponent(submenuItem.component)}
                                                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors text-sm ${
                                                        activeComponent === submenuItem.component
                                                        ? 'bg-yellow-200 text-gray-900 font-semibold'
                                                        : 'text-gray-600 hover:bg-yellow-100'
                                                    }`}
                                                >
                                                    {SubMenuIcon && <SubMenuIcon className="w-5 h-5 mr-3" />}
                                                    <span>{submenuItem.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

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