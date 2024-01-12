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
      navigate(`/Search?${searchQuery}`);
    }

    useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);

    }
  }, [location.search]);

  
  return (
    <header className="bg-gray-800 shadow-sm">
      <div className="flex justify-between items-center mx-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl  flex flex-wrap">
            <span className="text-blue-500">Shivam</span>
            <span className="text-blue-700">Estate</span>
          </h1>
        </Link>
        <form onSubmit={hanldeFormSubmit} className="bg-gray-600 rounded-full p-3 flex flex-direction-row items-center">
          <input
            type="text"
            placeholder="Search...."
            value={searchTerm}
            className="w-24 sm:w-64 focus:outline-none bg-transparent text-gray-100"
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
          <FaSearch type="submit" className="text-gray-200 hover:text-blue-500 hover:text-xl cursor-pointer" />
        </form>
        <ul className="flex gap-4 text-gray-300">
          <Link to="/">
            <li className="hidden sm:inline hover:underline cursor-pointer">Home</li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline hover:underline cursor-pointer">About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover'src={currentUser.avatar} alt="profile" />
            ) : (
              <li className="hover:underline cursor-pointer">Sign In</li>
            )}
          </Link>
          {!currentUser &&(
          <Link to="/sign-up">
            <li className="hover:underline cursor-pointer">Sign Up</li>
          </Link>)
          }
        </ul>
      </div>
    </header>
  );
}

export default Header;
