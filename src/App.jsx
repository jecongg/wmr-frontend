import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Import Hooks & Layouts/Routes
import { useFirebaseAuth } from "./js/hooks/useFirebaseAuth";
import ProtectedRoute from './components/Layout/ProtectedRoute'; // Layout baru kita
import GuestRoute from './components/Layout/GuestRoute';       // Layout baru kita

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterTeacher from './pages/RegisterTeacher';
import AdminPage from './pages/Admin/AdminPage';
// import TeacherDashboard from './pages/Teacher/TeacherDashboard'; // Contoh halaman dashboard guru
import StudentDashboard from './pages/Student/StudentDashboard';

const AppInitializer = () => {
  useFirebaseAuth();
  return <RouterProvider router={router} />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* --- RUTE PUBLIK (Bisa diakses semua orang) --- */}
      {/* Landing page tidak dibungkus oleh layout otentikasi apa pun */}
      <Route index element={<LandingPage />} />

      {/* --- RUTE TAMU (Hanya untuk yang belum login) --- */}
      <Route element={<GuestRoute />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register-teacher' element={<RegisterTeacher />} />
      </Route>

      {/* --- RUTE TERPROTEKSI (Hanya untuk yang sudah login dengan peran tertentu) --- */}
      
      {/* Rute khusus Admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path='/admin' element={<AdminPage />} />
        {/* Tambahkan rute admin lainnya di sini, misal: <Route path="/admin/settings" ... /> */}
      </Route>

      {/* Rute khusus Guru */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        {/* <Route path='/teacher/dashboard' element={<TeacherDashboard />} /> */}
        {/* Tambahkan rute guru lainnya di sini, misal: <Route path="/teacher/schedule" ... /> */}
      </Route>

      {/* Rute khusus Murid */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        {/* <Route path='/student/dashboard' element={<StudentDashboard />} /> */}
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