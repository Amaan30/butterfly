import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/protectedRoute';

//importing pages
import Home from './pages/home';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Landing from './pages/landing';
import Profile from './pages/profile';



const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected routes for any authenticated user */} 
        <Route element={<ProtectedRoute/>}>
          <Route path="/home" element={<Home />} />
          <Route path="/:usernameProfile" element={<Profile/>} />
        </Route>

        {/* Protected Routes for users with specific roles*/}
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
};

export default App;