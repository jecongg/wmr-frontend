import { useState } from 'react'
// import './App.css'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from "react-router";
import LoginPage from './pages/Login/LoginPage';
import AdminDashboard from './pages/Admin/AdminPage';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/Student/StudentDashboard';
import PublicLayout from './components/Layout/PublicLayout';
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout';
import { FirebaseDataProvider } from './js/context/FirebaseDataProvider';
import AdminPage from './pages/Admin/AdminPage';


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />}/>
          <Route path='/login' element={<LoginPage />}/>
        </Route>
        <Route element={<AuthenticatedLayout />}>
          <Route path='/admin' element={<AdminPage/>} />
          {/* <Route path='/admin/guru' element={<TeacherForm/>} />   */}
          {/* <Route path='/student' element={<StudentDashboard/>}/> */}
        </Route>
      </>
    )
  )

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
