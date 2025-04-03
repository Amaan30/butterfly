import React, { useState } from 'react';

//importing tailwind css
//import '../../styles/index.css';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Signup: React.FC = () => {

  const navigate = useNavigate();

  const auth = useAuth();

  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const [userData, setUserData] = useState({
    username: "", 
    password: "", 
    name: "", 
    email: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${API_URL}api/users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log(data);
      console.log('Token exists:', !!data.token);
      console.log('User object exists:', !!data.user);

      if (response.ok) {
        console.log('User created:', data);

        // cookie
        await auth.login(userData.username, userData.password);
        navigate("/home");
        alert("welcome 🎉");

      } else {
        setError(data.message || 'Error creating user');
      }
    } catch (error) {
      setError("an error occured during signup");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if(_loading){
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        <p className='text-blue-500'>Loading...</p>
      </div>
    );
  }
  if(_error) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        <p className='text-red-500'>{_error}</p>
      </div>
    );
  }
  
  return (
    
    <div id="signupContainer" className="flex justify-center bg-blue-100 h-screen w-screen">
      <div id="SignupCard" className="flex flex-col items-center justify-center bg-white p-10 m-10 w-2/3 rounded-lg shadow-lg">
        <p className='text-3xl p-10'>Sign-up</p>
        <form onSubmit={handlesubmit} action="" className='flex flex-col w-9/10 md:w-2/3 lg:w-1/2'>
          <input className='border-2 border-gray-300 p-2 m-2 rounded-lg '
            placeholder='Full Name'
            type="text" 
            name="name" 
            value={userData.name}
            onChange={handleChange}
          />
          
          <input 
            className='border-2 border-gray-300 p-2 m-2 rounded-lg'
            placeholder='Email'
            type="email" 
            name="email" 
            value={userData.email} 
            onChange={handleChange}
          />
          
          <input 
            className='border-2 border-gray-300 p-2 m-2 rounded-lg'
            placeholder='Username'
            type="text" 
            name="username" 
            value={userData.username}
            onChange={handleChange}
          />
          
          <input 
            className='border-2 border-gray-300 p-2 m-2 rounded-lg'
            placeholder='Password'
            type="password" 
            name="password" 
            value={userData.password}
            onChange={handleChange}
          />
          
          <div id="line" className='h-0.5 bg-black m-5'></div>

          <input 
            className='bg-blue-500 text-white p-2 m-2 mt-10 rounded-lg'
            type="submit" name="" id="" 
          />
          <a 
            href="/login"
            className='text-blue-500 text-center hover:underline hover:text-red-400'
          >
            Already a user? Log in.
          </a>
        </form>
      </div>
    </div>
  )
}

export default Signup
