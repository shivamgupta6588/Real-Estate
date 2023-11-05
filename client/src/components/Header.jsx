import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 shadow-sm">
      <div className="flex justify-between items-center mx-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl  flex flex-wrap">
            <span className="text-blue-500">Shivam</span>
            <span className="text-blue-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-gray-600 rounded-full p-3 flex flex-direction-row items-center">
          <input
            type="text"
            placeholder="Search...."
            className="w-24 sm:w-64 focus:outline-none bg-transparent text-gray-100"
          />
          <FaSearch className="text-gray-200 hover:text-blue-500 hover:text-xl cursor-pointer" />
        </form>
        <ul className="flex gap-4 text-gray-300">
          <Link to="/home">
            <li className="hidden sm:inline hover:underline cursor-pointer">Home</li>
          </Link>
          <Link to="/sign-in">
            <li className="hover:underline cursor-pointer">Sign In</li>
          </Link>
          <Link to="/sign-up">
            <li className="hover:underline cursor-pointer">Sign Up</li>
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
