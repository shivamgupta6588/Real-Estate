import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {signInFailure,signInStart,signInSuccess, clearError} from '../redux/user/userSlice';
import Oauth from '../components/Oauth';
import { ToastContainer, toast,Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';1

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const {loading,error}=useSelector((state)=>state.user);
  const dispatch=useDispatch(); 

  const handleChange = (event) => {
    event.preventDefault();
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
    
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      setFormData({});
      toast.success('User has been Logged In !', { position: toast.POSITION.TOP_RIGHT, autoClose:1000 });
  
      // Delay the navigation to the home page by 2 seconds (2000 milliseconds)
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      dispatch(signInFailure(error.message|| 'An error occurred'));
    } 
  }

  useEffect(() => {
    if (error) {
      // Display toast for error message
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Slide,
      });
    }
    setTimeout(() => {
      dispatch(clearError());
    }, 6000);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3">
        <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <Oauth/>
        </form>
        <div className="text-center mt-4 flex flex-row gap-2">
          <p>Don&apos;t have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-500 hover:underline">Sign Up</span>
          </Link>
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default SignIn;
