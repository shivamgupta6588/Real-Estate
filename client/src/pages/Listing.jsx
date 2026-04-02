import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { FaBath, FaBed, FaChair,FaMapMarkerAlt, FaParking, FaShare, FaHeart, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Contact from './Contact';
import { signInSuccess } from '../redux/user/userSlice';

const Listing = () => {
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const params = useParams();
  const listingId = params.listingid;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {currentUser}=useSelector((state)=>state.user);

  useEffect(() => {
    if (currentUser && currentUser.savedListings) {
      setSaved(currentUser.savedListings.includes(listingId));
    }
  }, [currentUser, listingId]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setError(false);
        setLoading(true);
        const response = await fetch(`/api/listing/get/${listingId}`);
        const data = await response.json();
        if (data.success === false) {
          setLoading(false);
          setError(true);
          return;
        }
        setListing(data);

        setLoading(false);
        setError(false);

      } catch (error) {
        setLoading(false);
        setError(true);
        console.error('Error fetching listing:', error.message);
      }
    };

    fetchListing();

  }, [listingId]);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', {
      position: 'top-right',
      autoClose: 2000,
    });
  }

  const handleSaveToggle = async () => {
    if (!currentUser) {
      toast.info('Please sign in to save listings', { autoClose: 2000 });
      return;
    }
    try {
      setSavingLoading(true);
      const res = await fetch(`/api/user/save-listing/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error('Could not save listing');
        return;
      }
      setSaved(data.saved);
      dispatch(signInSuccess({ ...currentUser, savedListings: data.savedListings }));
      toast.success(data.saved ? 'Listing saved!' : 'Listing removed from saved', { autoClose: 2000 });
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {loading && (
        <div className='flex justify-center py-20'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
        </div>
      )}
      {error && (
        <div className='flex flex-col items-center py-20 gap-4'>
          <p className='text-2xl text-slate-700 font-semibold'>Property not found</p>
          <button onClick={() => navigate(-1)} className='text-blue-600 hover:underline text-sm'>Go back</button>
        </div>
      )}
      {listing && !error && !loading && (
        <div>
          <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]} navigation pagination={{ clickable: true }}>
            {listing.imageUrls && listing.imageUrls.length > 0
              ? listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}
                  ></div>
                </SwiperSlide>
              ))
              : null}
          </Swiper>

          {/* Action buttons */}
          <div className='fixed top-[23%] right-[3%] z-10 flex flex-col gap-2'>
            <button onClick={handleShareClick} title="Copy link" className='cursor-pointer border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-md hover:shadow-lg transition-shadow'>
              <FaShare className='text-slate-500' />
            </button>
            <button
              onClick={handleSaveToggle}
              disabled={savingLoading}
              title={saved ? "Remove from saved" : "Save listing"}
              className={`cursor-pointer border rounded-full w-12 h-12 flex justify-center items-center shadow-md hover:shadow-lg transition-all ${saved ? 'bg-red-50 border-red-200' : 'bg-white'}`}
            >
              <FaHeart className={saved ? 'text-red-500' : 'text-gray-400'} />
            </button>
          </div>

          {/* Back button */}
          <div className='max-w-4xl mx-auto px-3 pt-4'>
            <button onClick={() => navigate(-1)} className='flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors'>
              <FaArrowLeft className='text-xs'/> Back to results
            </button>
          </div>

          <div className='flex flex-col max-w-4xl mx-auto p-4 my-4 gap-4 bg-white rounded-xl shadow-sm'>
            {/* Title and price */}
            <div className='flex flex-col gap-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-slate-800'>{listing.name}</h1>
              <p className='text-2xl font-bold text-blue-600'>
                ₹{listing.offer
                  ? (listing.discountedPrice && listing.discountedPrice.toLocaleString('en-IN')) || ''
                  : (listing.regularPrice && listing.regularPrice.toLocaleString('en-IN')) || ''}
                {listing.type === 'rent' && <span className='text-base font-normal text-gray-500'> / month</span>}
              </p>
            </div>

            {/* Address */}
            <p className='flex items-center gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-600 flex-shrink-0' />
              {listing.address}
            </p>

            {/* Badges */}
            <div className='flex gap-3 flex-wrap'>
              <span className={`px-4 py-1.5 rounded-full text-white text-sm font-medium ${listing.type === 'rent' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {listing.offer && (
                <span className='px-4 py-1.5 rounded-full bg-orange-500 text-white text-sm font-medium'>
                  ₹{(listing.regularPrice - listing.discountedPrice).toLocaleString('en-IN')} off
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className='font-semibold text-slate-700 mb-1'>Description</h3>
              <p className='text-gray-600 leading-relaxed text-sm'>{listing.description}</p>
            </div>

            {/* Features */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              {[
                { icon: <FaBed className='text-blue-500'/>, label: listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed` },
                { icon: <FaBath className='text-blue-500'/>, label: listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath` },
                { icon: <FaParking className={listing.parking ? 'text-green-500' : 'text-red-400'}/>, label: listing.parking ? 'Parking' : 'No Parking' },
                { icon: <FaChair className={listing.furnished ? 'text-green-500' : 'text-red-400'}/>, label: listing.furnished ? 'Furnished' : 'Unfurnished' },
              ].map((f, i) => (
                <div key={i} className='flex items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-100'>
                  {f.icon}
                  <span className='text-sm text-slate-700 font-medium'>{f.label}</span>
                </div>
              ))}
            </div>

            {/* Contact button */}
            {currentUser && listing.userRef !== currentUser._id && !clicked && (
              <button
                className='bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold p-3 transition-colors'
                onClick={() => setClicked(true)}
              >
                Contact Landlord
              </button>
            )}
            {!currentUser && (
              <p className='text-sm text-gray-500 text-center'>
                <a href='/sign-in' className='text-blue-600 hover:underline'>Sign in</a> to contact the landlord
              </p>
            )}
            {clicked && <Contact listing={listing}/>}
          </div>
          <ToastContainer />
        </div>
      )}
    </main>
  );
};

export default Listing;

