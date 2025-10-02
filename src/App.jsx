import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from "react-router";
import LoginPage from './pages/Login/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/Student/StudentDashboard';
import PublicLayout from './components/Layout/PublicLayout';
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout';
import { FirebaseDataProvider } from './js/context/FirebaseDataProvider';


function App() {
  const [count, setCount] = useState()

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />}/>
        <Route path='/login' element={<LoginPage />}/>
      </Route>
      <Route element={<AuthenticatedLayout />}>
        <Route path='/admin' element={ <AdminDashboard/> }/>
        <Route path='/student' element={<StudentDashboard/>}/>
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
