import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { FaBath, FaBed, FaChair,FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Contact from './Contact';

const Listing = () => {
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clicked, setClicked] = useState(false);
  const params = useParams();
  const listingId = params.listingid;

  const {currentUser}=useSelector((state)=>state.user);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setError(false);
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
    toast.success('Copied Successfully!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  return (
    <main className="">
      {loading && <p>Loading</p>}
      {error && <p>Something went wrong</p>}
      {listing && !error && !loading && (
        <div className="">
          <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]} navigation>
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
          <div onClick={handleShareClick} className=' cursor-pointer fixed top-[23%] border rounded-full w-12 h-12 flex justify-center items-center  bg-slate-100 right-[3%] z-10'>
            <FaShare className='text-slate-500' />
          </div>
          <div className='flex flex-col  max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='sm:text-2xl font-semibold '>
              {listing.name} -₹ {" "}{listing.offer? (listing.discountedPrice && listing.discountedPrice.toLocaleString('en-IN')) || ''
                : (listing.regularPrice && listing.regularPrice.toLocaleString('en-IN')) || ''}
                  {listing.type==='rent'&&" / month"}
            </p>
            <p className='flex items-center mt-6  gap-2 text-slate-600 my-2 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer &&
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ₹ {listing.regularPrice - listing.discountedPrice} off
                </p>}
            </div>
            <p className='text-slate-500'>
              <span className='fon-semibold text-black'>Description - </span>{listing.description}
            </p>
            <ul className=' text-green-900 text-sm font-semibold flex items-center gap-3 sm:gap-6 flex-wrap'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking Spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Non Furnished'}
              </li>
            </ul>
            {currentUser && listing.userRef!==currentUser._id && !clicked &&(
            <button className='bg-slate-900 hover:opacity-90 text-white rounded-lg uppercase p-3' onClick={()=>setClicked(true)}>Contact Landlord</button>
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
