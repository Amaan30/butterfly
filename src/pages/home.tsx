import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FollowInfoResponse, PublicUserInfo } from '../types/user';

const Home: React.FC = () => {

  const Navigate = useNavigate(); //useNavigate is a hook from react-router-dom for navigation

  const {user} = useAuth();
  const username = user!.username;
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to manage search query
  
  const logout = useAuth().logout;
  const [followingInfo, setFollowingInfo] = useState<FollowInfoResponse | null>(null); // State to manage following info

  useEffect(() => {
    const fetchFollowerInfo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/users/getfollowing/${username}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
  
        if (response.ok) {
          setFollowingInfo(data);
        } else {
          console.error('Error fetching following info:', data.message);
        }
      } catch (error) {
        console.error('Error fetching follower info:', error);
      }
    };
  
    fetchFollowerInfo(); // <- Don't forget to call it!
  }, [username]); // <- dependency added
  

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

  function handleSearchQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchQuery(e.target.value);
  }
  console.log(searchQuery);
  

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
          value={searchQuery}
          onChange={handleSearchQueryChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("Search submitted:", searchQuery);
              Navigate(`/${searchQuery}`);
            }
          }}
        />

        <div id="notification" className='w-9 h-9 bg-contain rounded-full overflow-hidden mx-2 md:ml-auto'>
          <img src='/images/notif-bell-512.png' alt="notif bell" className="w-full h-full object-cover" />
        </div>

        <div id="userProfile" className='mx-2 p-3 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent flex items-center' onClick={handleProfileButton}>
          <div id="profilePicComponent" className='w-9 h-9 bg-contain rounded-full overflow-hidden mx-2'>
            <img src={`${import.meta.env.VITE_API_URL.replace(/\/$/, '')}${user?.profilePicture || '/images/Default-pfp.jpg'}`} alt="Profile Picture" className="w-full h-full object-cover" />
          </div>
          <span className='px-2'>{user?.username}</span>
        </div>

        
        <button className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent' onClick={handleLogoutButton}> Logout </button>
        
      </div>
      
      <div id="mainPage" className='flex w-full mt-16'>
        <div id="feed-component" className='mx-4 p-4 m-4 flex-1 bg-white '>
          <div id="create-new-component">
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold'>Create New</h2>
              <div className='flex gap-2'>
                <button className='bg-blue-500 text-white p-2 rounded-lg'>Add Video</button>
                <button className='bg-blue-500 text-white p-2 rounded-lg'>Add Image</button>
                <button className='bg-blue-500 text-white p-2 rounded-lg'>Post</button>
              </div>
            </div>
            <textarea className='w-full h-32 p-4 border border-gray-300 rounded-lg mt-4' placeholder="What's on your mind?" />
          </div>
        </div>
        <div id="friendlist-component" className='mx-4 p-4 m-4 w-96 h-fit bg-white ml-auto hidden lg:block'>
          {user?.following?.length === 0 && 
          <div className='flex flex-col items-center justify-center h-full'>
            <h2 className='text-xl font-bold'>No friends yet</h2>
            <p className='text-gray-500'>Start following people to see their posts here!</p>
          </div>}
          {user?.following && user?.following.length > 0 &&
          <div className='flex flex-col items-center justify-center h-full'>
            <h2 className='text-xl font-bold'>Your Friends</h2>
            <ul className='list-disc'>
              {followingInfo && followingInfo.following.map((friend: PublicUserInfo) => (
                <li key={friend._id} className='flex items-center justify-between w-full p-2 border-b border-gray-200'>
                  <div className='flex items-center'>
                    <div className='w-8 h-8 bg-contain rounded-full overflow-hidden mr-2'>
                      <img src={`${import.meta.env.VITE_API_URL.replace(/\/$/, '')}${friend.profilePicture || '/images/Default-pfp.jpg'}`} alt="Friend's Profile Picture" className="w-full h-full object-cover" />
                    </div>
                    <span>{friend.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>}
        </div>
      </div>
    </div>
  )
}

export default Home
