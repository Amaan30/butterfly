import React/*, { useEffect, useState }*/ from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
// import axios from '../api/axios';
// import { User } from '../types/user';
//import { useLocation } from 'react-router-dom';

const Home: React.FC = () => {
  
  const Navigate = useNavigate(); //useNavigate is a hook from react-router-dom for navigation
  //useLocation is a hook from react-router-dom for getting the current location object
  //useState is a hook from React for managing state in functional components
  //MouseEvent is a built-in TypeScript interface for mouse events like button clicks
  //HTMLButtonElement is a built-in TypeScript interface for button elements

  const {user} = useAuth();
  const username = user!.username;

  //const [userData, setUserData] = useState<User | null>(null);

  //const location = useLocation();

  //fetching userdata

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       if(!user?._id) return;
  //       const response = await axios.get(`/users/${user?._id}`);
  //       setUserData(response.data);
  //     } catch(error){
  //       console.error("failed to fetch user data", error);
  //     }
  //   }
  //   fetchUserData();
  // }, [user, location]);
  
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

  function handleProfileButton(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    e.preventDefault();
    Navigate(`/${username}`);
  }

  return (
    <div id='HomeMainContainer' className='bg-gray-300 w-full min-h-screen'>
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

        <div id="userProfile" className='mx-2 p-3 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent flex items-center' onClick={handleProfileButton}>
          <div id="profilePicComponent" className='w-9 h-9 bg-contain rounded-full overflow-hidden mx-2'>
            <img src={user?.profilePicture} alt="Profile Picture" className="w-full h-full object-cover" />
          </div>
          <span className='px-2'>{user?.username}</span>
        </div>

        
        <button className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent' onClick={handleLogoutButton}> Logout </button>
        
      </div>
      
      <div id="mainPage" className='flex w-full mt-16'>
        <div id="feed-component" className='mx-4 p-4 m-4 flex-1 bg-white '>
          a {user?.email}, {user?.username}
        </div>
        <div id="friendlist-component" className='mx-4 p-4 m-4 w-96 h-fit bg-white ml-auto hidden lg:block'>
          <p>Friends</p>
          
        </div>
      </div>
    </div>
  )
}

export default Home
