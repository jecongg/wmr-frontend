import { useState } from 'react'
// import './App.css'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from "react-router";
import LoginPage from './pages/Login/LoginPage';
import LandingPage from './pages/LandingPage';


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route index element={<LandingPage />}>
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
