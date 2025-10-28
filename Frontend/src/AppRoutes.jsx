import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
// In AppRoutes.jsx
import Home from './pages/Home';



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
