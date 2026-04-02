import { useState, useRef, useEffect, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast,ToastContainer} from 'react-toastify';


import { app } from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateUserStart ,updateUserFailure,updateUserSuccess,deleteUserFailure, deleteUserSuccess,clearError,signOutUserStart,signOutSuccess, signOutUserFailure} from '../redux/user/userSlice';
import {Link} from'react-router-dom';

import { FaEye,FaEyeSlash} from "react-icons/fa6";
import { FaEdit, FaHeart} from "react-icons/fa";
import { MdDelete } from "react-icons/md";


const Profile = () => {
  const { currentUser,loading, error } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState();
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setuserListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const [activeTab, setActiveTab] = useState('myListings');
  const dispatch=useDispatch();
  const [showPassword, setShowPassword] = useState(false);


  const handleDeleteAccount = async() => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
  
      dispatch(deleteUserSuccess(data));
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  };

  const handleSignOut= async()=>{

    try {
        dispatch(signOutUserStart());
        const res=await fetch('/api/auth/signout');
        const data=await res.json();
        if (data.success===false) 
        {
          dispatch(signOutUserFailure(data.message));
          return;
        } 
          dispatch(signOutSuccess(data));    
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      
    }
  }

  

  const handleUpdateProfile = async () => {
    const storage = getStorage(app);

    // If a new file is selected, upload it to Firebase Storage
    if (selectedFile) {
      const filename = new Date().getTime() + selectedFile.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      // Handle the upload task events (e.g., progress, success, error)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate the upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error.message);
          switch (error.code) {
            case 'storage/unauthorized':
              setFileUploadError('User does not have permission to access the object');
              break;
            case 'storage/canceled':
              setFileUploadError('User canceled the upload');
              break;
            case 'storage/unknown':
              setFileUploadError(`Unknown error occurred ${error.serverResponse}`);
              break;
            default:
              setFileUploadError(error.message);
              break;
          }
          // Clear the error message after 5 seconds
          setTimeout(() => {
            setFileUploadError(null);
          }, 5000);
        },
        () => {
          // Handle successful upload
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
          });
          setMessage("File uploaded successfully");
          // Clear the success message after 5 seconds
          setTimeout(() => {
            setUploadProgress(0);
            setMessage(null);
          }, 5000);
        }
      );
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleChange=(event)=>{
      setFormData({...formData,[event.target.id]:event.target.value})
  }

  const handleListings=async()=>{
      try {
        setShowListingError(false);
        const res= await fetch(`/api/user/listings/${currentUser._id}`);
        const data= await res.json();
        if(data.success==false)
        {setShowListingError(true);
         return;}
         setuserListings(data);

      } catch (error) {
        setShowListingError(true);
      }    

  }

  const handleSavedListings = async () => {
    try {
      const res = await fetch(`/api/user/saved-listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) return;
      setSavedListings(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    // Cleanup function when component unmounts
    return () => {
      setUploadProgress(0); // Reset upload progress when the component unmounts
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      dispatch(clearError());
    }, 5000);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      
      dispatch(updateUserStart());

      if (formData.username && formData.username.includes(' ')) {
        dispatch(updateUserFailure('Username should not contain spaces. Please use a single word for your username.'));
        return ;
      }

      if (formData.email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          dispatch(updateUserFailure('Invalid email format'));
          return;
        }

        if(formData.email!==formData.email.toLowerCase())
        {
          dispatch(updateUserFailure('Email should have only lower case'));
          return;
        }

        // Check if the new email is taken by someone else
        const emailResponse = await fetch(`/api/user/update/checkuseremail/${formData.email}?userId=${currentUser._id}`);
        const emailData = await emailResponse.json();

        if (emailData.exists) {
          dispatch(updateUserFailure("Email already exists. Please choose a different email"));
          return;
        }
      }

      if (formData.username) {
        // Check if the new username is taken by someone else
        const usernameResponse = await fetch(`/api/user/update/checkusername/${formData.username}?userId=${currentUser._id}`);
        const usernameData = await usernameResponse.json();

        if (usernameData.exists) {
          dispatch(updateUserFailure("Username exists already. Please choose a different Username"));
          return;
        }
      }


      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
  
      dispatch(updateUserSuccess(data));
      setSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }

    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  useEffect(() => {
    handleUpdateProfile();
  }, [selectedFile])

  useEffect(()=>{
    handleListings();
    handleSavedListings();
  },[]);
  
  
  const handledeleteListing=async(listingId)=>{
    try {
        const res=await fetch(`/api/listing/delete/${listingId}`,{
          method:'DELETE',
        });
        const data= await res.json();
        if(data.success===false)
        {
          toast.error(data.message,{autoClose: 3000,});
          return;
        }
        toast.success('Listing deleted successfully',{autoClose: 3000,});
        setuserListings((prev)=>prev.filter((listing)=>listing._id!==listingId))
    } catch (err) {
      toast.error('An error occurred while deleting the listing');
    }

  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 text-center">My Profile</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4">
            <div className="self-center relative">
              <img
                src={formData.avatar || currentUser.avatar}
                alt="Profile Avatar"
                className="h-[120px] w-[120px] rounded-full shadow-md hover:opacity-90 cursor-pointer object-cover border-4 border-blue-100"
                onClick={handleImageClick}
              />
              <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 cursor-pointer" onClick={handleImageClick}>
                <FaEdit className="text-xs"/>
              </div>
              <input
                id='avatar'
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {fileUploadError !== null ? (
              <div className="text-red-500 text-sm w-full text-center">
                <p>{fileUploadError}</p>
              </div>
            ) : uploadProgress > 0 && uploadProgress < 100 ? (
              <div className="w-full">
                <p className='text-xs text-gray-500 mb-1'>Uploading... {Math.round(uploadProgress)}%</p>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            ) : selectedFile && message ? (
              <p className="text-green-600 text-sm w-full text-center">{message}</p>
            ) : null}

            <div className="w-full">
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={currentUser.username}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={currentUser.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Leave blank to keep current"
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg p-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash/> : <FaEye/>}  
                </button>
              </div>
            </div>

            <div className="flex w-full flex-wrap gap-3 mt-2">
              <button
                disabled={loading}
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
              <button 
                type='button' 
                onClick={handleSignOut}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors"
              >
                Sign Out
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors"
              >
                Delete Account
              </button>
            </div>
          </form>

          <p className='text-red-600 text-sm text-center'>{error ? error : ''}</p>
          <p className='text-green-600 text-sm text-center'>{success ? 'Profile updated successfully!' : ''}</p>

          <Link to={"/create-list"}>
            <button 
              type='button'
              className='w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors'>
                + Create New Listing
            </button>
          </Link>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className='flex border-b'>
            <button
              onClick={() => setActiveTab('myListings')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'myListings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              My Listings ({userListings.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'saved' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FaHeart className='text-xs'/> Saved ({savedListings.length})
            </button>
          </div>

          <div className='p-4'>
            {/* My Listings Tab */}
            {activeTab === 'myListings' && (
              <>
                {showListingError && (
                  <p className="text-red-500 text-sm text-center py-4">Error loading listings</p>
                )}
                {userListings.length === 0 && !showListingError && (
                  <div className='text-center py-10'>
                    <p className='text-gray-400 text-sm mb-3'>No listings yet</p>
                    <Link to="/create-list" className='text-blue-600 hover:underline text-sm font-medium'>Create your first listing</Link>
                  </div>
                )}
                <div className='flex flex-col gap-3'>
                  {userListings.map((list) =>
                    <div key={list._id} className='border border-gray-100 rounded-xl gap-4 p-3 flex justify-between items-center hover:shadow-sm transition-shadow'>
                      <Link to={`/listing/${list._id}`}>
                        <img className="h-14 w-14 object-cover rounded-lg" alt={list.name} src={list.imageUrls[0]}/>
                      </Link>
                      <Link className='truncate text-slate-700 font-semibold flex-1 text-sm' to={`/listing/${list._id}`}>
                        <p>{list.name}</p>
                        <p className='text-gray-400 font-normal text-xs mt-0.5'>₹{list.offer ? list.discountedPrice?.toLocaleString('en-IN') : list.regularPrice?.toLocaleString('en-IN')}{list.type==='rent'&&'/mo'}</p>
                      </Link>
                      <div className='flex flex-col items-center gap-1'>
                        <Link to={`/update-listing/${list._id}`}>
                          <button title="Edit" className="text-blue-500 hover:text-blue-700 text-lg"><FaEdit/></button>
                        </Link>
                        <button title="Delete" className="text-red-400 hover:text-red-600 text-lg" onClick={()=>handledeleteListing(list._id)}><MdDelete /></button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Saved Listings Tab */}
            {activeTab === 'saved' && (
              <>
                {savedListings.length === 0 && (
                  <div className='text-center py-10'>
                    <FaHeart className='text-red-200 text-4xl mx-auto mb-3'/>
                    <p className='text-gray-400 text-sm mb-3'>No saved listings yet</p>
                    <Link to="/search" className='text-blue-600 hover:underline text-sm font-medium'>Browse properties</Link>
                  </div>
                )}
                <div className='flex flex-col gap-3'>
                  {savedListings.map((list) =>
                    <div key={list._id} className='border border-gray-100 rounded-xl gap-4 p-3 flex justify-between items-center hover:shadow-sm transition-shadow'>
                      <Link to={`/listing/${list._id}`}>
                        <img className="h-14 w-14 object-cover rounded-lg" alt={list.name} src={list.imageUrls[0]}/>
                      </Link>
                      <Link className='truncate text-slate-700 font-semibold flex-1 text-sm' to={`/listing/${list._id}`}>
                        <p>{list.name}</p>
                        <p className='text-gray-400 font-normal text-xs mt-0.5'>₹{list.offer ? list.discountedPrice?.toLocaleString('en-IN') : list.regularPrice?.toLocaleString('en-IN')}{list.type==='rent'&&'/mo'}</p>
                      </Link>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${list.type === 'rent' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {list.type === 'rent' ? 'Rent' : 'Sale'}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Profile;

