import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
// Assuming `auth` and `signOut` are imported if you use the logout function
// import { auth } from './firebase-config';
// import { signOut } from 'firebase/auth';

const Sidebar = ({ menus, activeComponent, setActiveComponent, onLogout, isCollapsed, setIsCollapsed }) => {
    const [openDropdown, setOpenDropdown] = useState([]);
    

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        if (isCollapsed) { 
        } else { 
            setOpenDropdown([]);
        }
    };

    const handleMenuClick = (menu) => {
        if (menu.submenu) {
            if (isCollapsed) return;
            setOpenDropdown(prev => {
                if (prev.includes(menu.name)) {
                    return prev.filter(item => item !== menu.name);
                } else {
                    return [...prev, menu.name];
                }
            });       
        } else {
            setActiveComponent(menu.component);
            setOpenDropdown([]);
        }
    };

    const ToggleButton = () => (
        <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 bg-gray-700 hover:bg-pink-600 text-white rounded-full p-1.5 z-50 transition-colors"
            aria-label="Toggle Sidebar"
        >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} />
        </button>
    );

    return (
        <>
            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                </svg>
            </button>

            <aside id="logo-sidebar" className={`fixed top-0 left-0 h-screen flex flex-col bg-black text-gray-300 transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-20' : 'w-64'}`} aria-label="Sidebar">
                <ToggleButton />

                <div className={`flex items-center gap-3 h-20 px-4 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                    <img src="/public/logo rhapsody Gold.png" className='w-10 h-10 flex-shrink-0' alt="Logo" />
                    {/* <span className={`text-lg font-semibold text-white transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        Wisma Musik Rhapsody
                    </span> */}
                </div>

                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {menus.map((menu) => {
                        const IconComponent = menu.icon;
                        const isDropdownOpen = openDropdown.includes(menu.name);                        
                        const isParentActive = menu.submenu && menu.submenu.some(sub => sub.component === activeComponent);

                        return (
                            <div key={menu.name}>
                                <button
                                    onClick={() => handleMenuClick(menu)}
                                    title={isCollapsed ? menu.name : ''}
                                    className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 overflow-x-hidden ${
                                        (activeComponent === menu.component || isParentActive) && !isDropdownOpen
                                            ? 'bg-gray-800 text-white'
                                            : 'hover:bg-gray-800'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                >
                                    {IconComponent && <IconComponent className="w-6 h-6 flex-shrink-0" />}

                                    {!isCollapsed && (
                                        <span className="ml-4 font-medium whitespace-nowrap flex-1 text-left">
                                            {menu.name}
                                        </span>
                                    )}

                                    {menu.badge && !isCollapsed && (
                                        <span className="bg-red-600 text-white text-xs font-bold rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                                            {menu.badge}
                                        </span>
                                    )}

                                    {menu.submenu && !isCollapsed && (
                                        <ChevronDown
                                            className={`w-5 h-5 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </button>

                                {isDropdownOpen && !isCollapsed && (
                                    <div className="pl-8 pt-1 space-y-1">
                                        {menu.submenu.map((submenuItem) => {
                                            const SubMenuIcon = submenuItem.icon;
                                            return (
                                                <button
                                                    key={submenuItem.name}
                                                    onClick={() => setActiveComponent(submenuItem.component)}
                                                    className={`w-full flex items-center p-2 text-left rounded-lg transition-colors text-sm ${
                                                        activeComponent === submenuItem.component
                                                            ? 'bg-gray-700 text-white'
                                                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                                    }`}
                                                >
                                                    {SubMenuIcon && <SubMenuIcon className="w-5 h-5 mr-3 flex-shrink-0" />}
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

                <div className="px-3 py-4 border-t border-gray-800 overflow-x-hidden">
                    <button onClick={onLogout} className={`w-full flex items-center p-3 rounded-lg text-white transition-colors hover:bg-gray-800 overflow-x-hidden  ${isCollapsed ? 'justify-center' : ''}`}>
                        <svg className="shrink-0 w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                        </svg>
                        <span className={`flex-1 ms-4 font-medium whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                            Log Out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;