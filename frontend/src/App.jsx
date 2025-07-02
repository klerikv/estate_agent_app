import { useState } from 'react'
import './App.css'
import LoginForm from './components/LoginForm.jsx'
import Dashboard from './components/Dashboard.jsx';
import UserListings from './components/UserListings.jsx';
import AddListingForm from './components/AddListingForm.jsx';
import EditListingPage from './components/EditListingPage.jsx';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/dashboard' element={<Dashboard />} />
          
          <Route path='/listings' 
            element={localStorage.getItem('user') 
              ? <UserListings />
              : <Navigate to = '/login' />
            } />
            
          <Route path='/add-listing' 
            element={localStorage.getItem('user') 
              ? <AddListingForm />
              : <Navigate to = '/login' />
            } />

            <Route path='/edit-listing' 
            element={localStorage.getItem('user') 
              ? <EditListingPage />
              : <Navigate to = '/login' replace/>
            } />
        </Routes>
      </BrowserRouter>      
      
      <ToastContainer 
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
