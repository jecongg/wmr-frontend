import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Import Layouts & Routes
import RootLayout from './components/Layout/RootLayout'; // <-- Import RootLayout
import ProtectedRoute from './components/Layout/ProtectedRoute'; 
import GuestRoute from './components/Layout/GuestRoute';      

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import RegisterTeacher from "./pages/RegisterTeacher";
import RegisterStudent from "./pages/Student/RegisterStudent";
import AdminPage from "./pages/Admin/AdminPage";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import { ToastProvider } from "./js/context/ToastContext";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}> 
      
      <Route index element={<LandingPage />} />

      <Route element={<GuestRoute />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register-teacher' element={<RegisterTeacher />} />
        <Route path='/register-student' element={<RegisterStudent />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
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

    </Route> 
  )
);

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  );
}

export default App;