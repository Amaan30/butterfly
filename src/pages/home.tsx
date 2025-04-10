import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FollowInfoResponse, PublicUserInfo } from '../types/user';
import { PostSchema } from '../types/user';

const Home: React.FC = () => {

  const Navigate = useNavigate(); //useNavigate is a hook from react-router-dom for navigation
  
  const {user} = useAuth();
  const username = user!.username;
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to manage search query
  
  const logout = useAuth().logout;
  const [followingInfo, setFollowingInfo] = useState<FollowInfoResponse | null>(null); // State to manage following info
  
  const [posts, setPosts] = useState<PostSchema[]>([]); // State to manage posts
  const [feed, setFeed] = useState<PostSchema[]>([]); // State to manage feed
  
  const [page, setPage] = useState(1); // State to manage pagination
  const [hasMorePages, setHasMorePages] = useState(true); // State to manage if there are more pages
  
  const [loading, setLoading] = useState(false); // State to manage loading state
  
  const fetchFeed = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/posts/feed?page=${page}&limit=5`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if(response.ok) {
        console.log('Feed fetched successfully:', data);
        if (data.length > 0) {
          setFeed((prevFeed) => [...prevFeed, ...data]);
          setPage((prevPage) => prevPage + 1);
        }
        if (data.length < 5) {
          setHasMorePages(false); // No more pages to load
        }
        else {
          setFeed((prevFeed) => [...prevFeed, ...data]); // Append new posts to the existing feed
          setPage((prevPage) => prevPage + 1); // Increment the page number for the next fetch
        }
      }
      else {
        console.error('Error fetching feed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  }
  
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
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/posts/${username}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        
        if (response.ok) {
          console.log('Posts fetched successfully:', data);
          setPosts(data); // <- Set the posts state with the fetched data
        } else {
          console.error('Error fetching posts:', data.message);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    
    fetchPosts(); // <- Don't forget to call it!
    fetchFeed(); // <- Don't forget to call it!
  }, [username]); // <- dependency added

  //intersection observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const LastPostRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return; // Prevent loading if already loading
    if (observer.current) observer.current.disconnect(); // Disconnect the previous observer
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMorePages) {
        fetchFeed();
      }
    });
    if (node) observer.current.observe(node); // Observe the last post
  }, [loading, hasMorePages]); // Dependencies for the callback
  
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
  
  const toggleLike = async (postId: string) => {
    setFeed((prevFeed) =>
      prevFeed.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: post.likes?.includes(user!._id)
                ? post.likes.filter((id) => id !== user!._id)
                : [...(post.likes || []), user!._id],
            }
          : post
      )
    );
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/posts/like/${postId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Optionally revert UI update if needed
    }
  };
  

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
            <img src={`${user?.profilePicture || '/images/Default-pfp.jpg'}`} alt="Profile Picture" className="w-full h-full object-cover" />
          </div>
          <span className='px-2'>{user?.username}</span>
        </div>

        
        <button className='mx-2 p-5 hover:bg-indigo-900 hover:border-b-blue-500 border-b-4 border-transparent' onClick={handleLogoutButton}> Logout </button>
        
      </div>
      
      <div id="mainPage" className='flex w-full mt-16'>
        <div id="feed-component" className='mx-4 p-4 m-4 flex-1 bg-white '>
          <div id="feed-header" className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold'>Welcome back, {user?.username}!</h1>
            <button className='bg-indigo-950 text-white p-2 rounded hover:bg-indigo-900' onClick={() => Navigate(`/${username}/create_post`)}>Create Post</button>
          </div>
          <div id="feed-list-component" className='mt-4'>
            <h2 className='text-2xl font-bold'>Feed</h2>
            {/* Feed items will go here */}
            <div className="flex flex-col gap-6 mt-4 px-4">
              {feed?.map((post: PostSchema, index: number) => {
                const isLastPost = index === feed.length - 1;
                return (
                  <div key={post._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition hover:shadow-lg" ref={isLastPost ? LastPostRef : null}>
                    
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-semibold text-gray-800">{post.title}</h3>
                      <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    {post.media && (
                      <div className="w-full max-h-96 overflow-hidden rounded-lg mb-4 flex justify-center">
                        {post.mediaType === 'video' ? (
                          <video src={post.media} controls className="max-h-[700px] w-full bg-black object-contain rounded" />
                        ) : (
                          <img src={post.media} alt={post.title} className="max-w-full max-h-[700px] w-auto h-auto object-contain rounded" />
                        )}
                      </div>
                    )}

                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    <div className="flex items-center justify-between mt-4">
                    <button
                      className="bg-indigo-950 text-white px-4 py-2 rounded hover:bg-indigo-900"
                      onClick={() => toggleLike(post._id)}
                    >
                      {post.likes?.includes(user!._id) ? 'Unlike' : 'Like'} ({post.likes?.length || 0})
                    </button>
                    <button className="text-indigo-950 hover:underline" onClick={() => Navigate(`/${username}/post/${post._id}`)}>View Comments</button>
                    </div>
                  </div>
                )
              }
              )}
            </div>
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
                <li key={friend._id} className='flex items-center justify-between w-full p-2 border-b border-gray-200' >
                  <button onClick={() => Navigate(`/${friend.username}`)} className='flex items-center justify-between w-full p-2 border-b border-gray-200 hover:bg-blue-200 hover:underline cursor-pointer transition-colors duration-200 text-left rounded'>
                    <div className='flex items-center'>
                      <div className='w-8 h-8 bg-contain rounded-full overflow-hidden mr-2'>
                        <img src={`${friend.profilePicture || '/images/Default-pfp.jpg'}`} alt="Friend's Profile Picture" className="w-full h-full object-cover" />
                      </div>
                      <span>{friend.username}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>}
        </div>
      </div>
    </div>
  )
}

export default Home;
