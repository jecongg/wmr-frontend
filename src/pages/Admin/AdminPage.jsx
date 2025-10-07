import React, { useContext, useState } from 'react';
import { useFirebaseAuth } from '../../js/hooks/useFirebaseAuth';
import { FirebaseDataContext } from '../../js/context/FirebaseDataProvider';
import { useMemo, useSearchParams, usePathname } from "react"
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Layout/Sidebar';
import TeacherManagement from '../../components/Admin/TeacherManagement';
import StudentManagement from '../../components/Admin/StudentManagement';
import Dashboard from '../../components/Admin/Dashboard';

const menus = [
    { name: 'Dashboard', path: '/admin', icon: 'home', component: 'dashboard' },
    { name: 'Guru', path: '/admin/guru', icon: 'users', component: 'teachers' },
    { name: 'Murid', path: '/admin/murid', icon: 'users', component: 'students' },
]

export default function AdminPage() {
    const { logout } = useFirebaseAuth();
    const { currentUser } = useContext(FirebaseDataContext);
    const [activeComponent, setActiveComponent] = useState('dashboard');

    
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

    

    const renderActiveComponent = () => {
        switch(activeComponent) {
            case 'dashboard':
                return <Dashboard user={currentUser} />;
            case 'teachers':
                return <TeacherManagement />;
            case 'students':
                return <StudentManagement />;
            default:
                return <Dashboard user={currentUser} />;
        }
    };

    return (
        <>
        <div className='flex'>
          <Sidebar 
            user={currentUser} 
            menus={menus} 
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
          />
          <main className='flex-1 bg-gray-100 min-h-screen overflow-y-auto'>
            {renderActiveComponent()}
          </main>
        </div>
        </>
    );
};

// import { useState } from "react"
// import { TeachersSection } from "../../components/Admin/teachers-section"
// import { StudentsSection } from "../../components/Admin/teachers-section"
// import { SimpleSidebar } from "../../components/Layout/Sidebar"

// export function AdminDashboard() {
//   const [tab, setTab] = useState("teachers")

//   return (
//     <div className="mx-auto max-w-6xl p-6 md:p-10">
//       <div className="grid gap-6 md:grid-cols-[220px_1fr]">
//         <aside className="md:border-r pr-0 md:pr-4">
//           <SimpleSidebar selected={tab} onSelect={setTab} />
//         </aside>

//         <main className="grid gap-6">
//           <header className="grid gap-2">
//             <h1 className="text-2xl md:text-3xl font-semibold text-balance">Admin Dashboard</h1>
//             <p className="text-sm text-muted-foreground">
//               Manage teachers and students. Register new entries and review the lists.
//             </p>
//           </header>

//           {tab === "teachers" ? <TeachersSection /> : <StudentsSection />}
//         </main>
//       </div>
//     </div>
//   )
// }
