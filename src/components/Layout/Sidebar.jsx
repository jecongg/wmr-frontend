import React, { useState } from 'react';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';


const Logo = ({ isCollapsed }) => (
    <div className={`flex items-center gap-3 h-20 px-4 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
        <span className={`text-md font-bold text-white transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'} `}>
            Wisma Musik Rhapsody
        </span>
    </div>
);



const Sidebar = ({ menus, activeComponent, setActiveComponent, onLogout, isCollapsed, setIsCollapsed}) => {
    // const [isCollapsed, setIsCollapsed] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleSidebar = () => {
        // setIsCollapsed(!isCollapsed);
        setIsCollapsed(!isCollapsed); 
        if (!isCollapsed) {
            setOpenDropdown(null);
        }
    };

    const handleMenuClick = (menu) => {
        if (menu.submenu) {
            if (isCollapsed) return; 
            setOpenDropdown(openDropdown === menu.name ? null : menu.name);
        } else {
            setActiveComponent(menu.component);
            setOpenDropdown(null); 
        }
    };
    
    const ToggleButton = () => (
         <button 
            onClick={toggleSidebar} 
            className="absolute -right-4 top-20 bg-gray-700 hover:bg-pink-600 text-white rounded-full p-2 z-10 transition-colors"
            aria-label="Toggle Sidebar"
        >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} />
        </button>
    );

    const logout = async() => {
        try{
            await signOut(auth);
        }catch(error){
            console.error("Logout failed:", error);
        }
    }


    return (
        <>
        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden">
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h10"/>
            </svg>
        </button>

        <aside id="logo-sidebar" class={`fixed top-0 left-0 flex flex-col h-screen bg-black text-gray-300 transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-20' : 'w-64'}`} aria-label="Sidebar">
            <ToggleButton />
            <div class="h-full px-3 py-4 overflow-y-auto bg-black text-white space-y-2 border-e border-default">
                <a href="" class="flex items-center ps-2.5 mb-5 disabled">
                    <img src="/public/logo rhapsody Gold.png" className='w-10 h-10 mr-4' alt="" />
                    <span class={`self-center text-lg text-heading font-semibold ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Wisma Musik Rapsodi</span>
                </a>
                {menus.map((menu) => {
                    const IconComponent = menu.icon;
                    const isDropdownOpen = openDropdown === menu.name;
                    const isParentActive = menu.submenu && menu.submenu.some(sub => sub.component === activeComponent);
                    
                    return (
                        <div key={menu.name}>
                            <button
                                onClick={() => handleMenuClick(menu)}
                                title={isCollapsed ? menu.name : ''}
                                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
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
            </div>
            <div onClick={() => onLogout()} className='px-3 py-4 bg-black text-white border-e border-default transition-transform -translate-x-full sm:translate-x-0'>
                <button  class="w-full flex items-center px-2 py-1.5 text-body rounded-md hover:bg-gray-300 hover:text-fg-brand group">
                    <svg class="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/></svg>
                    <span class="flex-1 ms-3 whitespace-nowrap">Log Out</span>
                </button>
            </div>
        </aside>

        </>
    );
};

export default Sidebar;