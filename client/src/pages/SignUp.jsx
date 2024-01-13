  import { useEffect, useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';1
    import Oauth from '../components/Oauth';

  const SignUp = () => {
    const navigate=useNavigate();

    const [formData, setformData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

  const handleChange=(event)=>{
    event.preventDefault();
    const { id, value } = event.target;
    let transformedValue = value;


    setformData({
      ...formData,
      [id]:transformedValue,
    })
  };


  useEffect(() => {
    
    setTimeout(() => {
      setError(null);
    }, 5000);

  }, [error]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state

    try {
            // Check if the email already exists
      const emailExists = await checkExistingEmail(formData.email.toLowerCase());
            // Check if the Username already exists
      const usernameExists=await checkExistingUsername(formData.username);

      if (formData.username.includes(' ')) {
        setError('Username should not contain spaces. Please use a single word for your username.');
        setLoading(false);
        return ;
      }

          // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Invalid email format');
          setLoading(false);
          return;
        }

  

        if(formData.email!==formData.email.toLowerCase())
        {
          setError('Email should have only lower case');
          setLoading(false);
          return;

        }

      if (emailExists) {
        setError('Email is already registered. Please choose a different email.');
        setLoading(false);
        return;
      }

      if(usernameExists)
      {
        setError('Username is already registered. Please choose a different Username.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.success===false) {
        setError(data.message);
        setLoading(false);
        return;
        
      }
      setformData({}); 
      // Display success toast
      toast.success('User has been created!', { position: toast.POSITION.TOP_RIGHT, autoClose:2000 });
      setError(null);
      // Delay the navigation to the "/sign-in" page by 4 seconds (4000 milliseconds)
      setTimeout(() => {
        navigate('/sign-in');
      }, 4000);
    } catch (error) {
      setError(error.message || 'An error occurred'); // Handle error and set error state
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }

  };


const checkExistingEmail = async (email) => {
  try {
    const res = await fetch(`/api/auth/check-email/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return data.exists; 
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

const checkExistingUsername=async(username)=>{
  try {
    const res = await fetch(`/api/auth//check-username/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return data.exists; 
  } catch (error) {
    console.error('Error checking Username:', error);
    return false;
  }
}



    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3">
          <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6">
            SignUp
          </h1>
          <form onSubmit={handleSubmit}className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              id="username"
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Email"
              id="email"
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 disabled:bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {loading? 'loading...':'Sign Up'}
            </button>
            <Oauth/>
          </form>
          
          <div className="text-center mt-4  flex flex-row gap-2
          onChange={handleChange}">
            <p>
              Have an account?
            </p>
            <Link to="/sign-in">
              <span className="text-blue-500 hover:underline">Sign-In</span>
            </Link>
          </div>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>} 
        </div>
        <ToastContainer/>
      </div>
    );
  };

  export default SignUp;
