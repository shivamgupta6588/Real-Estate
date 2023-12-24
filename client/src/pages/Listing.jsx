import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const Listing= () => {
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params=useParams();
  const listingId = params.listingid;


  useEffect(() => {
    const fetchListing = async () => {
      try{ 
        setError(false);

        const response = await fetch(`/api/listing/get/${listingId}`); 
        const data = await response.json();
        if(data.success===false)
        {
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

    

        {/* <h2 className="text-xl font-semibold mb-4">{listing.name}</h2>
        <p className="text-gray-700">{listing.address}</p>
        <p className="text-gray-700">{listing.description}</p>
        <p className="text-gray-700">Price: ${listing.discountedPrice}</p>
        <p className="text-gray-700">Bedrooms: {listing.bedrooms}</p>
        <p className="text-gray-700">Bathrooms: {listing.bathrooms}</p>
        <p className="text-gray-700">Furnished: {listing.furnished ? 'Yes' : 'No'}</p>
        <p className="text-gray-700">Parking: {listing.parking ? 'Yes' : 'No'}</p>
        <p className="text-gray-700">Type: {listing.type}</p>
        <p className="text-gray-700">Offer: {listing.offer ? 'Yes' : 'No'}</p> */}
      </div>
      )}
    </main>
  );
};

export default Listing;
