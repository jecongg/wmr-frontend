import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
// ... import lainnya
import PublicLayout from './components/Layout/PublicLayout';
// import AuthenticatedLayout from './components/Layout/AuthenticatedLayout'; // Kita ganti dengan yang lebih spesifik
import AdminPage from './pages/Admin/AdminPage';
import RegisterTeacher from './pages/RegisterTeacher';
import AdminRoute from "./components/Layout/AdminRoute"; // <-- IMPORT BARU

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Rute Publik */}
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/register-teacher' element={<RegisterTeacher />} />
        </Route>

        {/* Rute yang dilindungi hanya untuk Admin */}
        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<AdminPage />} />
          {/* <Route path='/admin/settings' element={<AdminSettings />} /> */}
        </Route>
        
        {/* Nanti Anda bisa menambahkan TeacherRoute dan StudentRoute di sini */}
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default App;