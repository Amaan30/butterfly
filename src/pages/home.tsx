import React, { act, useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FollowInfoResponse, PublicUserInfo } from '../types/user';
import { PostSchema } from '../types/user';
import { io } from 'socket.io-client';

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


  const [activeChatUser, setActiveChatUser] = useState<PublicUserInfo | null>(null); // State to manage chat component

  const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true, transports: ['polling'] }); // Initialize socket connection, cant use ws because of render free tier limitations, so using polling fallback instead ;(
  const [messages, setMessages] = useState<{sender: string, content: string, receiver: string}[]>([]); // State to manage messages
  const [currentMessage, setCurrentMessage] = useState<string>(""); // State to manage current message


  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });
    socket.emit("join-room", user!._id); // Join the room with the user's ID
    socket.on("receive-message", (message) => {
      console.log("Message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]); // Append new message to the existing messages
    }); // Listen for incoming messages
    return () => {
      socket.off("receive-message"); // Clean up the event listener on component unmount
      socket.disconnect(); // Disconnect the socket when the component unmounts
      // This is important to prevent memory leaks and ensure that the socket connection is closed properly.
    };
  },[]);

      

  
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
  

  const chatHandle = (friend: PublicUserInfo) => {
    setActiveChatUser(friend);
    
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/messages/${user!._id}/${friend._id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Messages fetched successfully:', data);
          setMessages(data); // Set the messages state with the fetched data
          console.log(data);
          
        } else {
          console.error('Error fetching messages:', data.message);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages(); // Call the function to fetch messages
  };

  console.log("Messages:", messages);
  

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

        {/* start */}

        {/*Update the chat component with improved design and close button*/}
        {activeChatUser && (
          <div id="chat-component" className='mx-4 p-4 m-4 w-96 bg-white ml-auto rounded-lg shadow-md'>
            <div className="border rounded-lg w-full">
              {/* Chat header with user info and close button */}
              <div className="flex items-center justify-between bg-indigo-950 text-white p-3 rounded-t-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-contain rounded-full overflow-hidden mr-2">
                    <img 
                      src={`${activeChatUser.profilePicture || '/images/Default-pfp.jpg'}`} 
                      alt="Chat User Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="font-medium">{activeChatUser.username}</span>
                </div>
                <button 
                  onClick={() => setActiveChatUser(null)} 
                  className="text-white hover:text-red-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages container */}
              <div className="h-72 overflow-y-auto p-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Begin your conversation...
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`mb-2 ${msg.sender === user?._id ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block max-w-3/4 px-3 py-2 rounded-lg ${
                        msg.sender === user?.username 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message input and send button */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!currentMessage.trim()) return;
                  socket.emit('send-message', { 
                    sender: user!._id, 
                    receiver: activeChatUser!._id, 
                    content: currentMessage 
                  });
                  setMessages((prev) => [...prev, { 
                    sender: user!.username, 
                    content: currentMessage,
                    receiver: activeChatUser!._id 
                  }]);
                  setCurrentMessage('');
                }} 
                className="flex p-3 border-t"
              >
                <input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Type a message..."
                />
                <button 
                  type="submit" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced follower component */}
        {!activeChatUser && (
          <div id="friendlist-component" className='mx-4 p-4 m-4 w-96 bg-white ml-auto rounded-lg shadow-md hidden lg:block'>
            <h2 className='text-xl font-bold text-indigo-950 border-b pb-3 mb-4'>Your Connections</h2>
            
            {user?.following?.length === 0 && 
              <div className='flex flex-col items-center justify-center py-10'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className='text-lg font-semibold text-gray-700'>No friends yet</h3>
                <p className='text-gray-500 text-center mt-1'>Start following people to see their posts here!</p>
              </div>
            }
            
            {followingInfo && followingInfo.following.length > 0 &&
              <div className='overflow-y-auto max-h-96'>
                <ul className='divide-y divide-gray-100'>
                  {followingInfo.following.map((friend: PublicUserInfo) => (
                    <li key={friend._id} className='py-2'>
                      <div className='flex items-center justify-between'>
                        <button 
                          onClick={() => Navigate(`/${friend.username}`)} 
                          className='flex items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex-grow text-left'
                        >
                          <div className='w-10 h-10 bg-contain rounded-full overflow-hidden mr-3 border border-gray-200'>
                            <img src={`${friend.profilePicture || '/images/Default-pfp.jpg'}`} alt="Friend's Profile" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-medium text-gray-800">{friend.username}</span>
                        </button>
                        <button 
                          onClick={() => chatHandle(friend)} 
                          className='bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors ml-2 flex items-center'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Chat
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default Home;
