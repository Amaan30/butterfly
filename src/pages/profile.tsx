import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';



const Profile: React.FC = () => {
        const {username_profile} = useParams();
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
            <img src={user?.profilePicture} alt="Profile Picture" className="w-full h-full object-cover" />
          </div>
          <span className='px-2'>{user?.username}</span>
        </div>

        
        <button className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent' onClick={handleLogoutButton}> Logout </button>
        
      </div>
      <div id="profileContainer" className='flex justify-center bg-blue-100 h-auto w-screen'>
        <div id="profileCard" className='flex flex-col items-center justify-center bg-white p-10 my-10 w-full rounded-lg shadow-lg'>
          <div id="profilePic" className='w-32 h-32 bg-contain rounded-full overflow-hidden mb-5'>
            <img src={user?.profilePicture} alt="Profile Picture" className="w-full h-full object-cover" />
          </div>
          <h1 className='text-2xl font-bold'>{user?.name}</h1>
          <p className='text-gray-600'>Bio: {user?.bio}</p>
          <div id="profileStats" className='flex space-x-4 mt-5'>
            <span className='text-gray-600'>Followers: 100</span>
            <span className='text-gray-600'>Following: 50</span>
          </div>
          <div id="userContentDetails" className='flex flex-col items-center mt-10 w-5/6'>
            <p className='font-bold m-2'>Posts</p>
            <p id='line' className='w-full h-1 bg-black my-2'></p>
            <div id="postsContainer" className='border-2 bg-amber-100 p-5 w-full inline-grid gap-4 '>
              <div id="postExample1" className='bg-indigo-300 border-2 w-48 aspect-square'>
                <div id="postImage" className='w-full h-full bg-contain rounded-lg overflow-hidden mb-5'>
                  <img src='/images/Default-pfp.jpg' alt="Post 1" className="w-full h-full object-cover" />
                </div>
              </div>
              <div id="postExample2" className='bg-indigo-300 border-2 w-48 aspect-square'>
                <div id="postImage" className='w-full h-full bg-contain rounded-lg overflow-hidden mb-5'>
                  <img src='/images/Default-pfp.jpg' alt="Post 2" className="w-full h-full object-cover" />
                </div>
              </div>
              <div id="postExample3" className='bg-indigo-300 border-2 w-48 aspect-square'>
                <div id="postImage" className='w-full h-full bg-contain rounded-lg overflow-hidden mb-5'>
                  <img src='/images/Default-pfp.jpg' alt="Post 3" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;