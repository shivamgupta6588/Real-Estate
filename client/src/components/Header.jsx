// import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';

  const Header = () => {
    const navigate=useNavigate();
    const {currentUser}=useSelector(state=>state.user); 
    const [searchTerm, setSearchTerm] = useState('');

    const hanldeFormSubmit=(e)=>{
      e.preventDefault();
      const urlParams= new URLSearchParams(window.location.search);
      urlParams.set('searchTerm',searchTerm);
      const searchQuery=urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  
  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 px-4">
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl flex flex-wrap">
            <span className="text-blue-400">Shivam</span>
            <span className="text-blue-600">Estate</span>
          </h1>
        </Link>
        <form onSubmit={hanldeFormSubmit} className="bg-gray-700 rounded-full px-4 py-2 flex items-center gap-2 flex-1 max-w-xs sm:max-w-sm mx-4">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            className="w-full focus:outline-none bg-transparent text-gray-100 text-sm placeholder-gray-400"
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer" />
          </button>
        </form>
        <ul className="flex gap-4 items-center text-gray-300">
          <Link to="/">
            <li className="hidden sm:inline hover:text-blue-400 transition-colors cursor-pointer text-sm">Home</li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline hover:text-blue-400 transition-colors cursor-pointer text-sm">About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img className='rounded-full h-8 w-8 object-cover border-2 border-blue-500 hover:border-blue-400 transition-colors' src={currentUser.avatar} alt="profile" />
            ) : (
              <li className="hover:text-blue-400 transition-colors cursor-pointer text-sm">Sign In</li>
            )}
          </Link>
          {!currentUser &&(
          <Link to="/sign-up">
            <li className="hover:text-blue-400 transition-colors cursor-pointer text-sm bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700">Sign Up</li>
          </Link>)
          }
        </ul>
      </div>
    </header>
  );
}

export default Header;
