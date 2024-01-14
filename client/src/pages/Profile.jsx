import { useState, useRef, useEffect, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast,ToastContainer} from 'react-toastify';


import { app } from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateUserStart ,updateUserFailure,updateUserSuccess,deleteUserFailure, deleteUserSuccess,clearError,signOutUserStart,signOutSuccess, signInFailure, signOutUserFailure} from '../redux/user/userSlice';
import {Link, useNavigate} from'react-router-dom';

import { FaEye,FaEyeSlash} from "react-icons/fa6";
import { FaEdit} from "react-icons/fa";
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
  const navigate=useNavigate();
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
          console.error('Sign-out Passed:', data.message);
          dispatch(signOutSuccess(data));    
    } catch (error) {
      console.error('Error during sign-out:', error.message);
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
            // console.log('File available at', downloadURL);
            setFormData({ ...formData, avatar: downloadURL });
          });
          console.log('File uploaded successfully');
          setMessage("File uploaded successfully");
          // Clear the success message after 5 seconds
          setTimeout(() => {
            setUploadProgress(0);
            setMessage(null);
          }, 5000);
        }
      );
    }

    // Add your other update profile logic here, e.g., update user data in Firebase Firestore
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
      // console.log(formData);
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

      if (formData.username.includes(' ')) {
        dispatch(updateUserFailure('Username should not contain spaces. Please use a single word for your username.'));
        return ;
      }

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

      
        // Check if the new username is taken by someone else
      const usernameResponse = await fetch(`/api/user/update/checkusername/${formData.username}?userId=${currentUser._id}`);
      const usernameData = await usernameResponse.json();

      if (usernameData.exists) {
        dispatch(updateUserFailure("Username exists already. Please choose a different Username"));
        return;
      }

      // Check if the new email is taken by someone else
      const emailResponse = await fetch(`/api/user/update/checkuseremail/${formData.email}?userId=${currentUser._id}`);
      const emailData = await emailResponse.json();

      if (emailData.exists) {
        dispatch(updateUserFailure("Email already exists. Please choose a different email"));
        return;
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
  },[]);
  
  
  const handledeleteListing=async(listingId)=>{
    try {
        const res=await fetch(`/api/listing/delete/${listingId}`,{
          method:'DELETE',
        });
        const data= await res.json();
        if(data.success===false)
        {
          // console.log(data.message);
          toast.error(data.message,{autoClose: 3000,});
          return;
        }
        toast.success('Listing deleted successfully',{autoClose: 3000,});
        setuserListings((prev)=>prev.filter((listing)=>listing._id!==listingId))
    } catch (error) {
      toast.error('An error occurred while deleting the listing');
      console.log(error);
    }

  }

  return (
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6 flex flex-col gap-3 flex- wrap items-center">
        <h2 className="text-3xl font-bold ">Profile </h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4 ">
          <div className="self-center">
            <img
              src={formData.avatar || currentUser.avatar}
              alt="Profile Avatar"
              className="h-[150px] rounded-full  shadow-md hover:scale-105 cursor-pointer"
              onClick={handleImageClick}
            />
            <input
              id='avatar'
              type="file"
              accept="image/*"
              // defaultValue={currentUser.avatar}
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="w-full">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue={currentUser.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            </div>
            <div className="w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3  text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash/> : <FaEye/>}  
              </button>
            </div>

            </div>
          <div className="flex w-full items-center  flex-col gap-4">
            <div className='flex items-center justify-center flex-wrap gap-4'>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteAccount}
                className="bg-red-500 flex-initial text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
              >
                Delete Account
              </button>
        <ToastContainer/>

              <button
                disabled={loading}
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
              >
                {loading? 'Loading....':'Update'}
              </button>
              <button 
                type='button' 
                onClick={handleSignOut}
                className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:shadow-outline-gray"
                >
                Signout
              </button>
            </div>
            <div className='flex-1 min-w-full'>
              <Link to={"/create-list"}>
                <button 
                  type='button'
                  className='min-w-full flex-1 bg-blue-500 disabled:bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300'>
                    Create Listing
                </button>
              </Link> 
            </div>
          </div>
        </form>
        {fileUploadError !== null ? (
          <div className="text-red-500">
            <p>{fileUploadError}</p>
          </div>
        ) : uploadProgress > 0 && uploadProgress < 100 ? (
          <div className="w-full bg-gray-200 h-4 rounded-md overflow-hidden">
            <div
              className="bg-green-500 h-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        ) : selectedFile ? (
          <div className="text-green-500">
            <p>{message}</p>
          </div>
        ) : null}
        <p className='text-red-800'>
          {error? error:''}
        </p>
        <p className='text-green-700'>
          {success?'User Updated successfully':''}
        </p>
        {/* <button className="text-green-500" onClick={handleListings} type="button"
        >
          Show listings
        </button> */}
        {userListings.length<1 &&
        <div>No Listings to Show</div>}

        {showListingError && 
          <p className="text-red-500">
              Error Showing the Listings
          </p>
        }
        { userListings && userListings.length>0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl  font-semibold'>{`Your Listings (${userListings.length})`}</h1>
          {userListings.map((list)=>
            < div key={list._id} className='border rounded-lg  gap-4 p-3 flex justify-between items-center'>
              <Link to={`/listing/${list._id}`}>
              <img className="h-16 w-16 object-contain" alt={list.name} src={list.imageUrls[0]}/>
              </Link>
              <Link className='truncate text-slate-700 font-semibold flex-1' to={`/listing/${list._id}`}>
                <p >{list.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <Link to={`/update-listing/${list._id}`}>
                  <button className="text-green-500 text-lg uppercase"><FaEdit/></button>
                </Link>
                <button className="text-red-500 text-lg uppercase" onClick={()=>handledeleteListing(list._id)}><MdDelete /></button>
              </div>
            </div>
          )}
        </div>
        }
        {!userListings && <div>No Listing to show</div>}
      </div>
    </div>
  );
};

export default Profile;
