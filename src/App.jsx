import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Import Hooks & Layouts/Routes
import { useFirebaseAuth } from "./js/hooks/useFirebaseAuth";
import ProtectedRoute from './components/Layout/ProtectedRoute'; 
import GuestRoute from './components/Layout/GuestRoute';      

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterTeacher from './pages/RegisterTeacher';
import AdminPage from './pages/Admin/AdminPage';
import TeacherDashboard from './pages/Teacher/TeacherDashboard'; 
import TeacherStudentDetail from './pages/Teacher/TeacherStudentDetail';
import StudentDashboard from './pages/Student/StudentDashboard';
import RegisterStudent from "./pages/Student/RegisterStudent";

const AppInitializer = () => {
  useFirebaseAuth();
  return <RouterProvider router={router} />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* --- RUTE PUBLIK (Bisa diakses semua orang) --- */}
      <Route index element={<LandingPage />} />

      <Route element={<GuestRoute />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register-teacher' element={<RegisterTeacher />} />
        <Route path='/register-student' element={<RegisterStudent />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path='/admin' element={<AdminPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path='/teacher/*' element={<TeacherDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path='/student/dashboard' element={<StudentDashboard />} />
      </Route>
    </>
  )
);

function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}

export default App;