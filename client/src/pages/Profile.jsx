import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { app } from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateUserStart ,updateUserFailure,updateUserSuccess,deleteUserFailure, deleteUserSuccess} from '../redux/user/userSlice';
import {Link} from'react-router-dom';
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

  const dispatch=useDispatch();

  // const handleSignOut = () => {
  //   // Add your sign-out logic here
  // };

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
            console.log('File available at', downloadURL);
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
      console.log(formData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      dispatch(updateUserStart());
  
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
  

  return (
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md p-6 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-start mb-6">
          <div className="mb-6 w-full">
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-600">
              Avatar
            </label>
            <img
              src={formData.avatar || currentUser.avatar}
              alt="Profile Avatar"
              className="w-12 h-12 rounded-full mt-2 cursor-pointer"
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
          <div className="mb-4 w-full">
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
          <div className="mb-4 w-full">
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
            <div className="mb-4 w-full">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder='password'
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            </div>
          <div className="flex items-center mb-4">
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue mr-4"
            >
              Delete Account
            </button>
            <button
              disabled={loading}
              type="button"
              onClick={handleSubmit}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-red mr-4"
            >
              {loading? 'Loading....':'Update'}
            </button>
            <button
              type="button"
              onClick={handleUpdateProfile}  
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
            >
              Update Profile
            </button>
            <Link to={"/create-list"}>
              Create Listing
            </Link>
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
        <button className="text-green-500" onClick={handleListings} type="button">
          Show listings
        </button>
        {showListingError && 
          <p className="text-red-500">
              Error Showing the Listings
          </p>
        }
        { userListings && userListings.length>0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl  font-semibold'>Your Listings</h1>
          {userListings.map((list)=>
            < div key={list._id} className='border rounded-lg  gap-4 p-3 flex justify-between items-center'>
              <Link to={`/listing/${list._id}`}>
              <img className="h-16 w-16 object-contain" alt={list.name} src={list.imageUrls[0]}/>
              </Link>
              <Link className='truncate text-slate-700 font-semibold flex-1' to={`/listing/${list._id}`}>
                <p >{list.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
                <button className="text-green-500 uppercase">edit</button>
                <button className="text-red-500 uppercase">delete</button>
              </div>
            </div>
          )}
        </div>
        }

      </div>
    </div>
  );
};

export default Profile;
