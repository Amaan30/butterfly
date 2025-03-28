import React from 'react'
import '../styles/index.css'

const Landing: React.FC = () => {
  return (
    <div id="Landing-container" className="flex flex-col items-center justify-center h-screen text-2xl"> 
      
      <div id="navbar" className='flex justify-between w-full h-fit fixed top-0'>
        <div id="logo" className='flex justify-between'>
          <a href="/" className='flex justify-between m-5' >Butterfly</a>
        </div>
        <div id="nav-links" className='flex justify-between'>
          <a href="/login" className='mx-4 block w-fit justify-center p-2 md:px-10 rounded m-5 text-sm md:text-2xl text-white bg-blue-500'>Login</a>
          <a href="/signup" className='mx-4 block w-fit justify-center p-2 md:px-10 rounded m-5 text-sm md:text-2xl'>Signup</a>
        </div>
      </div>

      <div id="content">
        <p className='text-center m-10 mx-48 hidden md:block
          sm:p-1 sm:mx-1 sm:text-1xl
          md:text-6xl
         '>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam, nulla in. Tempora at sapiente accusantium cupiditate earum odio excepturi nihil!
        </p>
        <a href="/home" className='justify-center bg-blue-500 rounded m-5 p-5 mx-auto block w-fit text-white'>Get Started.</a>
      </div>
    </div>
  )
}

export default Landing;
