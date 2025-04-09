import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Importing the useAuth hook to manage authentication
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation

const CreatePost = () => {
  const { user } = useAuth(); // Getting the authenticated user from the useAuth hook
  const navigate = useNavigate(); // Initializing the navigate function for navigation
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);

  const handlePostCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the post creation process

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
    } finally {
      setLoading(false); // Set loading to false after the post creation process is finished
    }
  }


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
      setPreviewType(file.type);
    }
  };

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 bg-gray-100 min-h-screen p-6">
        {/* FORM LEFT */}
        <form
          onSubmit={handlePostCreation}
          className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/2 space-y-4"
        >
          {/* Title input */}
          <input
            type="text"
            name="title"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Post Title"
            required
          />

          {/* File upload */}
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
              onChange={handleFileChange}
            />
          </label>

          {/* Content */}
          <textarea
            name="content"
            className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="What's on your mind?"
            required
          ></textarea>

          {/* Submit */}
          <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded w-full">
            {loading ? 'Posting...' : 'Create Post'}
          </button>
        </form>

        {/* PREVIEW RIGHT */}
        <div className="w-full md:w-1/3 h-96 flex items-center justify-center border border-dashed border-gray-400 rounded-lg bg-white p-4">
          {previewURL && previewType ? (
            previewType.startsWith('video') ? (
              <video src={previewURL} controls className="max-w-full max-h-full rounded" />
            ) : (
              <img src={previewURL} alt="Preview" className="max-w-full max-h-full object-contain rounded" />
            )
          ) : (
            <p className="text-gray-500 text-center">Preview will appear here</p>
          )}
        </div>
      </div>

      {/* <form
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
            onChange={(e) => handleFileChange(e)}
          />

        <div className="w-full h-64 overflow-hidden flex items-center justify-center bg-gray-100 rounded mb-4">
          {previewURL && previewType && (
            previewType.startsWith("video") ? (
              <video
                src={previewURL}
                controls
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <img
                src={previewURL}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
              />
            )
          )}
        </div>

        </label>

        <textarea
          name="content"
          className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="What's on your mind?"
          required
        ></textarea>

        <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded">
          {loading ? 'Posting...' : 'Create Post'}
        </button>

      </form> */}

      <button className="mt-4 text-blue-500" onClick={() => navigate('/home')}>Back to Home</button> {/* Button to go back to home */}
    </div>
  )
}

export default CreatePost;
