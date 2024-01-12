import { useEffect, useState } from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import {Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import ListingItems from '../components/ListingItems';

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings= async()=>{
      try {
        const res= await fetch("/api/listing/get?offer=true&limit=4");
        const data=await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListings=async()=>{
      try {
        const res= await fetch("/api/listing/get?type=rent&limit=4");
        const data=await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSaleListings=async()=>{
      try {
        const res= await fetch("/api/listing/get?type=sale&limit=4");
        const data=await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, [])

  return (
    <div>
      <div className=" flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
          <h1 className='text-slate-700 font-bold text-3xl lg:text-5xl'>
            Find Your Next 
            <span className="text-slate-500 "> Perfect </span> 
            place with ease 😉
          </h1>
          <div className='text-gray-500 text-xs sm:text-sm'>
            Our Estate has the best options to find your next perfect place to live
            <br/>
            We have a wide range of properties to choose from.
          </div>
          <Link to={"/search"} className='text-xs text-blue-800 font-bold hover:underline'>
              Lets get started
          </Link>
      </div>
      
      <Swiper
        className='py-10'
         modules={[Navigation, Pagination, Scrollbar, A11y]}
         navigation
      >
      {offerListings&& offerListings.length>0 && offerListings.map((listing)=>(
        <SwiperSlide  key={listing._id} >
          <div  style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}}className='h-[500px]'>

          </div>
        </SwiperSlide>
      ))}
      </Swiper>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          offerListings && offerListings.length>0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more Offers</Link>
              </div>
              <div className='flex flex-wrap gap-5'>
                {
                  offerListings.map((listing)=>(
                    <ListingItems list={listing} key={listing._id}/>
                  ))
                }

              </div>
            </div>
          )
        }
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          rentListings && rentListings.length>0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for Rent</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for Rent</Link>
              </div>
              <div className='flex flex-wrap gap-5'>
                {
                  rentListings.map((listing)=>(
                    <ListingItems list={listing} key={listing._id}/>
                  ))
                }

              </div>
            </div>
          )
        }
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          saleListings && saleListings.length>0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for Sale</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for Sale</Link>
              </div>
              <div className='flex flex-wrap gap-5'>
                {
                  saleListings.map((listing)=>(
                    <ListingItems list={listing} key={listing._id}/>
                  ))
                }

              </div>
            </div>
          )
        }
      </div>


    </div>
  )
}

export default Home;