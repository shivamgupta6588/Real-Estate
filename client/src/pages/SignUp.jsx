import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3">
        <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6">
          SignUp
        </h1>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            id="username"
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Email"
            id="email"
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        
        <div className="text-center mt-4  flex flex-row gap-2">
          <p>
            Have an account?
          </p>
          <Link to="/sign-in">
            <span className="text-blue-500 hover:underline">Sign-In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
