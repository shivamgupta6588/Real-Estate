import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {signInFailure,signInStart,signInSuccess} from '../redux/user/userSlice';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const {loading,error}=useSelector((state)=>state.user);
  const dispatch=useDispatch(); 

  const handleChange = (event) => {
    // event.preventDefault();
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
        // setError(data.message);
        // setLoading(false);
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      setFormData({});
      alert("User is Logged In Successfully!");
      // setError(null);
    
      // Delay the navigation to the home page by 4 seconds (4000 milliseconds)
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (error) {
      // setError(error.message || 'An error occurred');
      dispatch(signInFailure(error.message|| 'An error occurred'));
    } 
    // finally {
    //   setLoading(false);
    // }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3">
        <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username or Email"
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
        </form>
        <div className="text-center mt-4 flex flex-row gap-2">
          <p>Don&apos;t have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-500 hover:underline">Sign Up</span>
          </Link>
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
