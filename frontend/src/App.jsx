import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import {Loader} from 'lucide-react';
import { Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const {authUser, isCheckingAuth, checkAuth} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  // console.log(`authUser : ${authUser}`);
  console.log({authUser});
  
  if(isCheckingAuth && !authUser){
    return (
      <div className='flex justify-center items-center h-screen'>
        {/* <h1 className='text-2xl font-bold'>Loading...</h1> */}
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div >
      <Navbar />
      <Routes>
        <Route path='/' element={ authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/signup' element={ authUser ? <Navigate to='/' /> : <SignUpPage />} />
        <Route path='/login' element={  authUser ? <Navigate to='/' /> : <LoginPage />} />
        <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App