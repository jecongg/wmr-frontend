import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux'; // Import Provider dari react-redux
import { store } from './redux/store';

// Import Hooks & Layouts
import { useFirebaseAuth } from "./js/hooks/useFirebaseAuth";
import PublicLayout from './components/Layout/PublicLayout';
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterTeacher from './pages/RegisterTeacher';
import AdminPage from './pages/Admin/AdminPage';

// Komponen Wrapper untuk memanggil hook
const AppWrapper = () => {
  // Panggil hook di sini! Ini akan membuat listener auth aktif secara global.
  // Hook ini akan mengisi Redux store di background.
  useFirebaseAuth();
  return <RouterProvider router={router} />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Rute Publik: Hanya untuk user yang BELUM login */}
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register-teacher' element={<RegisterTeacher />} />
      </Route>

      {/* Rute Terproteksi: Hanya untuk user yang SUDAH login */}
      <Route element={<AuthenticatedLayout />}>
        <Route path='/admin' element={<AdminPage />} />
        {/* <Route path='/student' element={<StudentDashboard/>}/> */}
      </Route>
    </>
  )
);

function App() {
  return (
    // Sediakan Redux store untuk seluruh aplikasi
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;