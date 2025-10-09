import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"; // Rampingkan import
import LoginPage from './pages/Login/LoginPage';
// import AdminDashboard from './pages/Admin/AdminPage'; // Ini duplikat, bisa dihapus
import LandingPage from './pages/LandingPage'; // Sesuaikan path jika perlu
// import StudentDashboard from './pages/Student/StudentDashboard'; // Sesuaikan path jika perlu
import PublicLayout from './components/Layout/PublicLayout';
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout';
// import { FirebaseDataProvider } from './js/context/FirebaseDataProvider'; // Ini biasanya membungkus RouterProvider, bukan di sini
import AdminPage from './pages/Admin/AdminPage';
import RegisterTeacher from './pages/RegisterTeacher'; // Sesuaikan path jika perlu


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Rute-rute ini dapat diakses oleh siapa saja (tidak perlu login) */}
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />}/>
          <Route path='/login' element={<LoginPage />}/>
          
          {/* --- TAMBAHKAN ROUTE BARU DI SINI --- */}
          {/* Ini adalah halaman yang akan diakses guru dari link di email */}
          <Route path='/register-teacher' element={<RegisterTeacher />} />

        </Route>

        {/* Rute-rute ini hanya bisa diakses setelah login */}
        <Route element={<AuthenticatedLayout />}>
          <Route path='/admin' element={<AdminPage/>} />
          {/* Rute untuk murid, jika diperlukan nanti */}
          {/* <Route path='/student' element={<StudentDashboard/>}/> */}
        </Route>
      </>
    )
  )

  return (
    // Jika Anda menggunakan context, biasanya diletakkan di sini,
    // membungkus RouterProvider agar semua route bisa mengakses context.
    // <FirebaseDataProvider>
    //   <RouterProvider router={router} />
    // </FirebaseDataProvider>
    
    // Jika tidak, ini sudah benar
    <RouterProvider router={router} />
  )
}

export default App;