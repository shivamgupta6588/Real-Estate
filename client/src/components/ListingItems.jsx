import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from "react-icons/md";


const ListingItems = ({ list }) => {

  const {name,bedrooms,bathrooms,_id,imageUrls,address,type,description,regularPrice,discountedPrice,offer}=list;
  return (
    <div className='bg-white shoadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
      <Link to={`/listing/${_id}`}>
        <img 
          src={imageUrls[0]||'https://www.livemint.com/rf/Image-621x414/LiveMint/Period1/2015/03/09/Photos/house1-kdcB--621x414@LiveMint.jpg'} 
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
          />
      </Link>

      <div className='p-3 flex flex-col gap-2 w-full'>
        <div>
         <p className=' truncate text-lg font-semibold text-slate-700'>{name}</p> 
        </div>
        <div className='flex items-center gap-1'>
          <MdLocationOn className='h-4 w-4 text-green-700'/>
          <p className='text-small text-gray-600 truncate'>{address}</p>
        </div>
        <p className='text-gray-600 text-sm line-clamp-2'>{description}</p>
        <p className='text-slate-500 mt-2 font-semibold flex items-center'>
          ₹ {" "}{offer? discountedPrice.toLocaleString('en-IN'):regularPrice.toLocaleString('en-IN')}{type==='rent'&&" / month"}
        </p>
        <div className='flex text-slate-700 gap-4'>
          <div className='font-bold text-xs'>
            {bedrooms > 1 ? `${bedrooms} beds` : `${bedrooms} bed`}
          </div>
          <div className='font-bold text-xs'>
            {bathrooms > 1 ? `${bathrooms} bathrooms` : `${bathrooms} bathroom`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingItems;
