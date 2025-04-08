import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Importing the useAuth hook to manage authentication
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation

const CreatePost = () => {
  const { user } = useAuth(); // Getting the authenticated user from the useAuth hook
  const navigate = useNavigate(); // Initializing the navigate function for navigation
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={(e) => {
        e.preventDefault(); // Preventing the default form submission
        const formData = new FormData(e.currentTarget); // Getting the form data
        const postContent = formData.get('postContent'); // Getting the post content from the form data
        // Here you would typically send the postContent to your backend API
        console.log('Post Content:', postContent); // Logging the post content for demonstration purposes
        navigate('/'); // Redirecting to the home page after creating the post
      }}>
        <textarea name="postContent" className="w-full h-32 p-2 border border-gray-300 rounded mb-4" placeholder="What's on your mind?" required></textarea>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Create Post</button>
      </form>
      <div className="mt-4 text-gray-600">
        <p>Logged in as: {user?.username}</p>
        <p>Email: {user?.email}</p>
        <p>Bio: {user?.bio}</p>
        <p>Followers: {user?.followers?.length || 0}</p>
        <p>Following: {user?.following?.length || 0}</p>
        <p>Profile Picture: <img src={`${import.meta.env.VITE_API_URL}${user?.profilePicture || '/images/Default-pfp.jpg'}`} alt="Profile" className="w-16 h-16 rounded-full" /></p>
      </div>
      <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded" onClick={() => navigate('/home')}>Back to Home</button>
      <button className="mt-4 bg-gray-500 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/profile`)}>View Profile</button>
      <button className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/settings`)}>Settings</button>
      <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/friends`)}>Friends</button>
      <button className="mt-4 bg-purple-500 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/notifications`)}>Notifications</button>
      <button className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/messages`)}>Messages</button>

      <button className="mt-4 bg-teal-500 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/saved`)}>Saved Posts</button>
      <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/bookmarks`)}>Bookmarks</button>
      <button className="mt-4 bg-pink-500 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/trending`)}>Trending</button>
      <button className="mt-4 bg-indigo-700 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/explore`)}>Explore</button>
      <button className="mt-4 bg-indigo-800 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/search`)}>Search</button>
      <button className="mt-4 bg-indigo-900 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/logout`)}>Logout</button>
      <button className="mt-4 bg-indigo-950 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/delete`)}>Delete Account</button>
      <button className="mt-4 bg-indigo-1000 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/deactivate`)}>Deactivate Account</button>
      <button className="mt-4 bg-indigo-1100 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/reactivate`)}>Reactivate Account</button>
      <button className="mt-4 bg-indigo-1200 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/privacy`)}>Privacy Settings</button>
      <button className="mt-4 bg-indigo-1300 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/terms`)}>Terms of Service</button>
      <button className="mt-4 bg-indigo-1400 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/help`)}>Help Center</button>
      <button className="mt-4 bg-indigo-1500 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/feedback`)}>Feedback</button>
      <button className="mt-4 bg-indigo-1600 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/support`)}>Support</button>
      <button className="mt-4 bg-indigo-1700 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/report`)}>Report a Problem</button>
      <button className="mt-4 bg-indigo-1800 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/logout`)}>Logout</button>
      <button className="mt-4 bg-indigo-1900 text-white py-2 px-4 rounded" onClick={() => navigate(`/${user?.username}/delete`)}>Delete Account</button> 
    </div>
  )
}

export default CreatePost;
