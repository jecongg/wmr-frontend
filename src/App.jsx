import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from "react-router";
import LoginPage from './pages/Login/LoginPage';


function App() {
  const [count, setCount] = useState()

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<LoginPage />}>
      </Route>
    )
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
