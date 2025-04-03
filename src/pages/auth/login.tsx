//pages/auth/login.tsx


import React, { useState } from 'react'; // Import React and useState hook for state management
import { /*useLocation,*/ useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import { useAuth } from '../../hooks/useAuth'; // Import custom useAuth hook for authentication logic
//import AxiosInstance from '../../api/axios'; // Commented out AxiosInstance for potential API calls

// Define the Login component as a functional component
const Login: React.FC = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes programmatically
  //const location = useLocation(); // Commented out useLocation for potential route-based logic

  const auth = useAuth(); // Access authentication context or logic from the useAuth hook

  // State to manage loading status during login process
  const [_loading, setLoading] = useState(false);
  // State to store and display error messages
  const [_error, setError] = useState<string | null>(null);

  // State to manage form data for username and password
  const [LoginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Handler function to update form data as the user types
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Extract the name and value from the input field
    setLoginData({
      ...LoginData, // Spread existing LoginData to retain other fields
      [name]: value, // Update the specific field (username or password) dynamically
    });
  };

  // Handler function to submit the login form
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to true to indicate the login process has started
    setError(null); // Clear any previous errors

    try {
      if (auth?.login) { // Check if the login function is available in the auth context
        // Call the login function with the provided username and password
        await auth.login(LoginData.username, LoginData.password);
        navigate('/home'); // Navigate to the home page on successful login
      } else {
        setError("Auth service unavailable"); // Set error if auth service is not available
      }
    } catch (error) {
      console.error('Login error', error); // Log the error to the console
      setError("Invalid username or password"); // Set error message for invalid credentials
    } finally {
      setLoading(false); // Reset loading state after login attempt is complete
    }
  };

  if(_loading){
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        <p className='text-blue-500'>Loading...</p>
      </div>
    );
  }
  if(_error) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        <p className='text-red-500'>{_error}</p>
      </div>
    );
  }

  // Render the login form UI
  return (
    <div id='LoginContainer' className='flex justify-center bg-blue-100 h-screen w-screen'>
      {/* Login card container */}
      <div id="loginCard" className='flex flex-col items-center justify-center bg-white p-10 m-10 w-2/3 rounded-lg shadow-lg'>
        {/* Login heading */}
        <h1 className='text-3xl p-10'>Login</h1>

        {/* Login form */}
        <form action="" onSubmit={handleLoginSubmit} className='flex flex-col w-9/10 md:w-2/3 lg:w-1/2'>
          {/* Username input field */}
          <input
            className='border-2 border-gray-300 p-2 m-2 rounded-lg'
            placeholder='Username'
            type="text"
            name="username"
            value={LoginData.username}
            onChange={handleLoginChange} // Update username state on change
          />

          {/* Password input field */}
          <input
            className='border-2 border-gray-300 p-2 m-2 rounded-lg'
            placeholder='Password'
            type='password'
            name='password'
            value={LoginData.password}
            onChange={handleLoginChange} // Update password state on change
          />

          {/* Divider line */}
          <div id="line" className='h-0.5 bg-black m-5'></div>

          {/* Submit button */}
          <input type="submit" className='bg-blue-500 text-white p-2 m-2 mt-10 rounded-lg' />

          {/* Link to signup page for users without an account */}
          <a
            href="/signup"
            className='text-blue-500 text-center hover:underline hover:text-red-400'
          >
            Don't have an account? Signup here.
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login; // Export the Login component as the default export