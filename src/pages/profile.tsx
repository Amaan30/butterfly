import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const Profile: React.FC = () => {
        const {user} = useAuth();
        const logout = useAuth().logout;
        const Navigate = useNavigate(); //useNavigate is a hook from react-router-dom for navigation
        
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
                Navigate('/profile');
        }

  return (
    <div id='ProfilePage' className='bg-gray-300 w-full min-h-screen'>
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
            <img src='/images/defaultUserWhite.png' alt="Profile Picture" className="w-full h-full object-cover" />
          </div>
          <span className='px-2'>{user?.username}</span>
        </div>

        
        <button className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent' onClick={handleLogoutButton}> Logout </button>
        
      </div>
      <div id="profileContainer" className='flex justify-center bg-blue-100 h-screen w-screen'>
        <div id="loginCard" className='flex flex-col items-center justify-center bg-white p-10 m-10 w-2/3 rounded-lg shadow-lg'>
                <div id="profileDiv1" className='flex'>
                        <div id="profilePic" className='w-64 h-64 bg-contain rounded-full overflow-hidden mx-2 border-2 border-gray-700'>
                                <img src={user?.profilePicture} alt="" className='' />
                        </div>  
                        <div id="ProfileMainDetails" className='flex flex-col justify-center items-start border-2 border-gray-700 rounded-lg p-4 ml-auto'>
                                <div id="name">{user?.name}</div>
                                <div id="username">{user?.username}</div>
                                <div id="email">{user?.email}</div>
                                <div id="bio">{user?.bio}</div>
                        </div>                      
                </div>
                <div id="profileDiv2"></div>
        </div>
      </div>
      
    </div>
  )
}

export default Profile;