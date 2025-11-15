import React, { useState } from 'react';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';


const Logo = ({ isCollapsed }) => (
    <div className={`flex items-center gap-3 h-20 px-4 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
        <img src="/public/logo rhapsody Gold.png" className='w-10 h-10' alt="" />
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


    return (
        <div className={`fixed top-0 left-0 flex flex-col h-screen bg-black text-gray-300 transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            
            <ToggleButton />
            
            <Logo isCollapsed={isCollapsed} />

            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
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
            </nav>

            <div className="px-3 py-4 border-t border-gray-800">
                <button className="flex items-center w-full p-3 border border-gray-700 rounded-lg hover:bg-gray-800">
                    <HelpCircle className={`flex-shrink-0 w-6 h-6 ${isCollapsed ? 'mx-auto' : ''}`} />
                    {!isCollapsed && (
                        <>
                            <span className="ml-4 font-medium">Support</span>
                            <ChevronRight className="w-5 h-5 ml-auto" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;