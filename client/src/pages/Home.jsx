import { useEffect, useState } from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import {Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import ListingItems from '../components/ListingItems';
import { FaHome, FaKey, FaHandshake, FaStar } from 'react-icons/fa';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings= async()=>{
      try {
        const res= await fetch("/api/listing/get?offer=true&limit=4");
        const data=await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error(error);
      }
    }
    const fetchRentListings=async()=>{
      try {
        const res= await fetch("/api/listing/get?type=rent&limit=4");
        const data=await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error(error);
      }
    }
    const fetchSaleListings=async()=>{
      try {
        const res= await fetch("/api/listing/get?type=sale&limit=4");
        const data=await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchOfferListings();
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600')", backgroundSize:"cover", backgroundPosition:"center"}}></div>
        <div className="relative flex flex-col gap-6 py-28 px-6 max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-600 bg-opacity-30 border border-blue-400 border-opacity-40 rounded-full px-4 py-1.5 w-fit">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-xs font-medium text-blue-200">Trusted Real Estate Platform</span>
          </div>
          <h1 className='font-bold text-4xl lg:text-6xl leading-tight'>
            Find Your Next{' '}
            <span className="text-blue-400">Perfect</span>{' '}
            Place With Ease
          </h1>
          <p className='text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed'>
            Discover thousands of properties for rent and sale. Our platform makes finding your dream home simple, fast, and stress-free.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Link to="/search" className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-sm shadow-lg hover:shadow-blue-600/30'>
              Browse Properties
            </Link>
            <Link to="/search?offer=true" className='bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-sm'>
              View Special Offers
            </Link>
          </div>
        </div>
        {/* Stats bar */}
        <div className="relative bg-white bg-opacity-5 border-t border-white border-opacity-10">
          <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {icon:<FaHome/>, label:"Properties Listed", value:"500+"},
              {icon:<FaKey/>, label:"Properties Rented", value:"300+"},
              {icon:<FaHandshake/>, label:"Happy Clients", value:"200+"},
              {icon:<FaStar/>, label:"5-Star Reviews", value:"150+"},
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="text-blue-400 text-xl">{stat.icon}</span>
                <div>
                  <p className="font-bold text-white text-lg">{stat.value}</p>
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Image Carousel for offer listings */}
      {offerListings && offerListings.length > 0 && (
        <Swiper
          className='mt-2'
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          navigation
          pagination={{ clickable: true }}
        >
          {offerListings.map((listing)=>(
            <SwiperSlide key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}} className='h-[480px] relative'>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-white font-semibold text-xl truncate">{listing.name}</p>
                    <p className="text-gray-300 text-sm">₹{listing.offer ? listing.discountedPrice?.toLocaleString('en-IN') : listing.regularPrice?.toLocaleString('en-IN')}{listing.type==='rent' && '/mo'}</p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Why Choose ShivamEstate?</h2>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">We make finding your perfect property easy, transparent and enjoyable.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {icon:"🏠", title:"Wide Selection", desc:"Browse hundreds of verified listings for rent and sale across multiple locations."},
            {icon:"🔒", title:"Secure & Trusted", desc:"All listings are verified and your data is protected with industry-standard security."},
            {icon:"💬", title:"Easy Contact", desc:"Connect directly with property owners or landlords with a single click."},
          ].map((feature)=>(
            <div key={feature.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-slate-700 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Listings */}
      <div className='max-w-6xl mx-auto p-4 flex flex-col gap-8 mb-10'>
        {offerListings && offerListings.length>0 && (
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-slate-700'>🏷️ Special Offers</h2>
              <Link className='text-sm text-blue-600 hover:underline font-medium' to={'/search?offer=true'}>View all offers →</Link>
            </div>
            <div className='flex flex-wrap gap-5'>
              {offerListings.map((listing)=>(
                <ListingItems list={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rent Listings */}
      <div className='bg-gray-50'>
        <div className='max-w-6xl mx-auto p-4 flex flex-col gap-8 py-10'>
          {rentListings && rentListings.length>0 && (
            <div>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold text-slate-700'>🔑 Places for Rent</h2>
                <Link className='text-sm text-blue-600 hover:underline font-medium' to={'/search?type=rent'}>View all rentals →</Link>
              </div>
              <div className='flex flex-wrap gap-5'>
                {rentListings.map((listing)=>(
                  <ListingItems list={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sale Listings */}
      <div className='max-w-6xl mx-auto p-4 flex flex-col gap-8 py-10'>
        {saleListings && saleListings.length>0 && (
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-slate-700'>🏡 Places for Sale</h2>
              <Link className='text-sm text-blue-600 hover:underline font-medium' to={'/search?type=sale'}>View all for sale →</Link>
            </div>
            <div className='flex flex-wrap gap-5'>
              {saleListings.map((listing)=>(
                <ListingItems list={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-4'>Ready to find your dream property?</h2>
          <p className='text-blue-100 mb-8 text-sm'>Join thousands of happy clients who found their perfect home through ShivamEstate.</p>
          <div className='flex flex-wrap gap-4 justify-center'>
            <Link to='/search' className='bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors'>
              Start Searching
            </Link>
            <Link to='/sign-up' className='border border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors'>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
