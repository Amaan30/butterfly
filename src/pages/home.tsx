import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import axios from '../api/axios';
import { User } from '../types/user';

const Home: React.FC = () => {
  
  //MouseEvent is a built-in TypeScript interface for mouse events like button clicks
  //HTMLButtonElement is a built-in TypeScript interface for button elements

  const {user} = useAuth();
  const [userData, setUserData] = useState<User | null>(null);

  //fetching userdata
  //const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/users/${user?._id}`);
        setUserData(response.data);
      } catch(error){
        console.error("failed to fetch user data", error);
      }
    }
    if(user?._id) fetchUserData();
  }, [user]);
  
  const logout = useAuth().logout;

  function handleLogoutButton(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    try{
      logout();
    }
    catch(err){
      console.error('Error logging out:', err);
    }
  }

  return (
    <div id='HomeMainContainer' className='bg-gray-400 w-full min-h-screen'>
      <div id="navbar" className='bg-indigo-950 w-full h-16 flex items-center text-white fixed z-50 top-0 left-0'>
        <a href="/home" className='mx-2 p-5 font-bold transform scale-y-150 text-1xl'>Butterfly.</a>
        <a href="/home" className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent hidden lg:block'>Dashboard</a>
        <a href="/home" className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent hidden lg:block'>option 1</a>
        <a href="/home" className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent hidden lg:block'>option 2</a>
        <a href="/home" className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent hidden lg:block'>option 3</a>
        <input 
          type="text"
          placeholder='🔍 Search'
          className='mx-2 p-2 rounded border-2 border-gray-700 bg-gray-900 w-1/4 ml-auto hidden md:flex' 
        />

        <div id="notification" className='w-9 h-9 bg-contain rounded-full overflow-hidden mx-2 md:ml-auto'>
          <img src='/images/notif-bell-512.png' alt="notif bell" className="w-full h-full object-cover" />
        </div>

        <div id="profilePicComponent" className='w-9 h-9 bg-contain rounded-full overflow-hidden mx-2'>
          <img src='/images/defaultUserWhite.png' alt="Profile Picture" className="w-full h-full object-cover" />
          <p>{user?.username}</p>
        </div>

        <button className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent' onClick={handleLogoutButton}> Logout </button>
        
      </div>
      
      <div id="mainPage" className='flex w-full mt-16'>
        <div id="feed-component" className='mx-4 p-4 m-4 flex-1 bg-amber-300 '>
          a
        </div>
        <div id="friendlist-component" className='mx-4 p-4 m-4 w-96 h-fit bg-amber-600 ml-auto hidden lg:block'>
          <p>Friends</p>
          
        </div>
      </div>
    </div>
  )
}

export default Home
