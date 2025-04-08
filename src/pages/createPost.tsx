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
    </div>
  )
}

export default CreatePost;
