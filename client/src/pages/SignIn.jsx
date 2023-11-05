import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    event.preventDefault();
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make a POST request to your sign-in API endpoint

      // If successful, set the user state or token in your application

      // Navigate to the user's dashboard or the desired page
      // navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3">
        <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username or Email"
            id="username"
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
          <p>Don't have an account?</p>
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
