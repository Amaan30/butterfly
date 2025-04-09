import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Importing the useAuth hook to manage authentication
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation

const CreatePost = () => {
  const { user } = useAuth(); // Getting the authenticated user from the useAuth hook
  const navigate = useNavigate(); // Initializing the navigate function for navigation


  const handlePostCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try{
      const formdata = new FormData(e.currentTarget); // Using FormData to handle file uploads

      const response = await fetch(`${import.meta.env.VITE_API_URL}api/posts`, {
        method: 'POST',
        credentials: 'include',
        body: formdata, //formdata sets the content type automatically to multipart/form-data
      });
      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        console.log('Post created successfully:', data);
        navigate('/home'); // Redirect to home after successful post creation
      } else {
        console.error('Error creating post:', data.message);
      }
    } catch(err){
      console.error('Error creating post:', err);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form
        className="bg-white p-6 rounded-xl shadow-md w-96 space-y-4"
        onSubmit={handlePostCreation} // Function to handle post creation
      >
        <input
          type="text"
          name="title"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Post Title"
          required
        />

        {/* Unified media upload input */}
        <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-100 text-blue-500 rounded-lg border border-blue-300 cursor-pointer hover:bg-blue-50 transition duration-200">
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0L8 12m4-4v12" />
          </svg>
          <span className="text-sm font-medium">Click to upload image or video</span>
          <input
            type="file"
            name="media"
            accept="image/*,video/*"
            className="hidden"
          />
        </label>

        <textarea
          name="content"
          className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="What's on your mind?"
          required
        ></textarea>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Create Post
        </button>
      </form>

      <button className="mt-4 text-blue-500" onClick={() => navigate('/home')}>Back to Home</button> {/* Button to go back to home */}
    </div>
  )
}

export default CreatePost;
