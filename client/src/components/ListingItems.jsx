import { Link } from 'react-router-dom';
import { MdLocationOn } from "react-icons/md";
import { FaBed, FaBath } from 'react-icons/fa';


const ListingItems = ({ list }) => {

  const {name,bedrooms,bathrooms,_id,imageUrls,address,type,description,regularPrice,discountedPrice,offer}=list;
  return (
    <div className='bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl w-full sm:w-[330px] border border-gray-100'>
      <Link to={`/listing/${_id}`} className="block relative overflow-hidden">
        <img 
          src={imageUrls[0]||'https://www.livemint.com/rf/Image-621x414/LiveMint/Period1/2015/03/09/Photos/house1-kdcB--621x414@LiveMint.jpg'} 
          alt='listing cover'
          className='h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300'
          loading="lazy"
        />
        <div className='absolute top-3 left-3 flex gap-2'>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${type === 'rent' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
            {type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          {offer && (
            <span className='text-xs font-semibold px-2 py-1 rounded-full text-white bg-orange-500'>
              Special Offer
            </span>
          )}
        </div>
      </Link>

      <div className='p-4 flex flex-col gap-2 w-full'>
        <p className='truncate text-lg font-semibold text-slate-800'>{name}</p>
        <div className='flex items-center gap-1'>
          <MdLocationOn className='h-4 w-4 text-green-600 flex-shrink-0'/>
          <p className='text-sm text-gray-500 truncate'>{address}</p>
        </div>
        <p className='text-gray-500 text-sm line-clamp-2'>{description}</p>
        <div className='flex items-center justify-between mt-1'>
          <p className='text-slate-700 font-bold text-lg'>
            ₹{offer ? discountedPrice.toLocaleString('en-IN') : regularPrice.toLocaleString('en-IN')}
            {type === 'rent' && <span className='text-sm font-normal text-gray-500'>/mo</span>}
          </p>
          {offer && (
            <p className='text-xs text-gray-400 line-through'>
              ₹{regularPrice.toLocaleString('en-IN')}
            </p>
          )}
        </div>
        <div className='flex text-slate-600 gap-4 text-sm border-t pt-2 mt-1'>
          <div className='flex items-center gap-1'>
            <FaBed className='text-gray-500'/>
            <span className='font-medium'>{bedrooms > 1 ? `${bedrooms} beds` : `${bedrooms} bed`}</span>
          </div>
          <div className='flex items-center gap-1'>
            <FaBath className='text-gray-500'/>
            <span className='font-medium'>{bathrooms > 1 ? `${bathrooms} baths` : `${bathrooms} bath`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingItems;
