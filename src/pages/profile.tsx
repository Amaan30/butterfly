import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { User } from '../types/user'; // Importing User type for TypeScript type checking
import {useDropzone} from 'react-dropzone'; // Importing useDropzone for drag-and-drop file upload functionality

const Profile: React.FC = () => {

  //Test variables
  const [count, setCount] = React.useState(0);

  const {usernameProfile} = useParams();
  const {user} = useAuth();
  const logout = useAuth().logout;
  const Navigate = useNavigate(); //useNavigate is a hook from react-router-dom for navigation
  const [profile_data, setProfile_data] = useState<User | null>(null); // State to store profile data, initialized as null
  const [uploading, setUploading] = useState(false); // State to manage uploading status
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to manage search query
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value); // Update search query state on input change
  }
  console.log(searchQuery);

  const isMyProfile = usernameProfile === user?.username;
  const isFollowing = false; // Placeholder for following status, can be updated based on your logic
  const isFollower = false; // Placeholder for follower status, can be updated based on your logic

  console.log('isMyProfile:', isMyProfile);

  useEffect(() => {
    if (!usernameProfile) return;
    const Fetch_profileData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/users/${usernameProfile}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
        
        const data = await response.json();

        console.log(data);

        if (response.ok) {
          console.log('User data fetched:', data);
          setProfile_data(data);
        }else{
          console.error('Error fetching user:', data.message);
          return null;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    };
    if(usernameProfile){
      Fetch_profileData();
    };
    if(usernameProfile === user?.username){
      setProfile_data(user);
      return;
    }
  }, [usernameProfile, user]);

  function handleLogoutButton(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    try{
      logout();
    }
    catch(err){
      console.error('Error logging out:', err);
    }
  }

  function handleEditProfileButton(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    Navigate(`/${user?.username}/edit_profile`);
  }

  function handleProfileButton(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    e.preventDefault();
    Navigate(`/${user?.username}`);
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/users/upload-pfp`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        // Update the local profile_data state
      setProfile_data(prevData => {
        return prevData ? {...prevData, profilePicture: data.profilePicture} : prevData;
      });
      
      // You might want to refresh the page or use a context update function 
      // to ensure the new profile picture is shown in the navbar too
      } else {
        console.error('Error uploading profile picture:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        await handleFileUpload(acceptedFiles[0]);
      }
    },
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    maxSize: 2 * 1024 * 1024, // 2MB max file size
  });
  
  function handleToggleFollow(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    e.preventDefault();
  }

  if (!profile_data) {
    return <p>Loading profile...</p>;
  }



  return (
    <div id='ProfilePage' className='bg-gray-300 w-full min-h-screen'>
      <div id="navbar" className='bg-indigo-950 w-full h-16 flex items-center text-white'>
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
      <div id="profileContainer" className='flex justify-center bg-blue-100 h-auto w-screen'>
        <div id="profileCard" className='flex flex-col items-center justify-center bg-white p-4 my-4 w-full rounded-lg shadow-lg top-16'>
          <div id="profilePic" className="relative w-32 h-32 rounded-full overflow-hidden mb-5 group">
            <img
              src={`${import.meta.env.VITE_API_URL.replace(/\/$/, '')}${profile_data?.profilePicture || '/images/Default-pfp.jpg'}`}
              alt="Profile Picture"
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {isMyProfile && (
              <div {...getRootProps()}
                className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <input {...getInputProps()} />
                {uploading ? 'Uploading...' : 'Change pfp'}
              </div>
            )}
          </div>
          <h1 className='text-2xl font-bold'>
            {profile_data?.name}
          </h1>
          <p className='text-gray-600'>
            Username: {profile_data?.username}
          </p>
          <p className='text-gray-600'>
            Bio: {user?.bio}
          </p>
          {isMyProfile && <button className='text-blue-500' onClick={handleEditProfileButton}>edit profile</button>}
          {!isMyProfile && <button className='text-blue-500' onClick={handleToggleFollow}>
            if(isFollowing) {`Unfollow ${usernameProfile}`} else {`Follow ${usernameProfile}`}
          </button>}
          
          <div id="profileStats" className='flex space-x-4 mt-5'>
            <span className='text-gray-600'>Followers: 100</span>
            <span className='text-gray-600'>Following: 50</span>
          </div>
          <div id="userContentDetails" className='flex flex-col items-center mt-10 w-5/6'>
            <p className='font-bold m-2'>Posts</p>
            <input type="text" value={count} min={0} max={200} onChange={(e) => setCount(Number(e.target.value))} />
            <p>{count}</p>
            <p id='line' className='w-full h-1 bg-black my-2'></p>
            <div id="postsContainer" className='border-2 p-5 w-2/3 justify-items-center grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {Array.from({ length: count }).map((_, index) => (
                <div key={index} id={`postExample${index}`} className='border-2 w-32 aspect-square'>
                  <div id="postImage" className='w-full h-full bg-contain rounded-lg overflow-hidden mb-5'>
                    <img src='/images/Default-pfp.jpg' alt={`Post ${index}`} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;