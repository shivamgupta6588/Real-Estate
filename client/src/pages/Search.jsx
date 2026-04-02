import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import ListingItems from '../components/ListingItems';
import { FaSearch, FaFilter } from 'react-icons/fa';


const Search = () => {
    const navigate=useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showmore, setShowmore] = useState(false);
    const [sidebarData, setsidebarData] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'createdAt',
        order:'desc'
    });
    const handlechange=(e)=>{
        e.preventDefault();
        if(e.target.id==='all'||e.target.id==='sale'||e.target.id==='rent')
        {
            setsidebarData({...sidebarData,type:e.target.id});
        }
        if(e.target.id==='searchTerm')
        {
            setsidebarData({...sidebarData,searchTerm:e.target.value});
        }
        if(e.target.id==='parking'||e.target.id==='furnished'||e.target.id==='offer')
        {
            setsidebarData({...sidebarData,[e.target.id]:e.target.checked||e.target.checked==='true'?true:false});
        }
        if(e.target.id==='sort-order'){
            const sort=e.target.value.split('_')[0]||'createdAt';
            const order=e.target.value.split('_')[1]||'desc';

            setsidebarData({...sidebarData,sort, order})

        }
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        setShowmore(false);
        const initialSidebarData = {
          searchTerm: searchTermFromUrl || '',
          type: urlParams.get('type') || 'all',
          parking: urlParams.get('parking') === 'true',
          furnished: urlParams.get('furnished') === 'true',
          offer: urlParams.get('offer') === 'true',
          sort: urlParams.get('sort') || 'createdAt',
          order: urlParams.get('order') || 'desc'
        };
    
        setsidebarData(initialSidebarData);
        const fetchListings=async()=>{
            try {
            setLoading(true);
            const searchQuery=urlParams.toString();
            const res= await fetch(`/api/listing/get?${searchQuery}`);

            const data= await res.json();
            if(data.length>8)
            setShowmore(true);
            else
            setShowmore(false);

            if(data.success===false)
            {
              setLoading(false);
              return;
            }

            setListings(data);
            setLoading(false);
      
            } catch (error) {
              console.error(error.message||'');
              setLoading(false);
      
            }}
            fetchListings();
        
      }, [location.search]);

    const handleSubmit=(e)=>{
        e.preventDefault();
        const urlParams=new URLSearchParams();
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('type',sidebarData.type);
        urlParams.set('parking',sidebarData.parking);
        urlParams.set('furnished',sidebarData.furnished);
        urlParams.set('offer',sidebarData.offer);
        urlParams.set('sort',sidebarData.sort);
        urlParams.set('order',sidebarData.order);
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }


    const onShowMoreclick=async()=>{
        const numberofListings=listings.length;
        const startIndex=numberofListings;
        const urlParams= new  URLSearchParams(location.search);
        urlParams.set('startIndex',startIndex);
        const searchQuery=urlParams.toString();
        const res= await fetch(`/api/listing/get?${searchQuery}`);
        const data=await res.json();
        if(data.length<9)
        setShowmore(false);
      
        setListings([...listings,...data]);
    }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-50'>
        {/* Sidebar */}
        <div className='p-6 bg-white border-b md:border-b-0 md:border-r md:min-h-screen md:w-72 shadow-sm'>
            <div className='flex items-center gap-2 mb-6'>
              <FaFilter className='text-blue-600'/>
              <h2 className='font-bold text-lg text-slate-800'>Filters</h2>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-700'>Search Term</label>
                    <div className='relative'>
                      <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'/>
                      <input
                        className='w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        type='text'
                        id='searchTerm'
                        placeholder='Search properties...'
                        value={sidebarData.searchTerm}
                        onChange={handlechange}
                      />
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <label className='text-sm font-semibold text-gray-700'>Property Type</label>
                    <div className='grid grid-cols-2 gap-2'>
                      {[
                        {id:'all', label:'All Types'},
                        {id:'rent', label:'For Rent'},
                        {id:'sale', label:'For Sale'},
                        {id:'offer', label:'Offers Only', isOffer: true},
                      ].map(({id, label, isOffer})=>(
                        <label key={id} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${
                          (isOffer ? sidebarData.offer : sidebarData.type===id)
                            ? 'bg-blue-50 border-blue-400 text-blue-700 font-medium'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                          <input
                            className='accent-blue-600'
                            type='checkbox'
                            id={id}
                            onChange={handlechange}
                            checked={isOffer ? sidebarData.offer : sidebarData.type===id}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                </div>

                <div className='flex flex-col gap-3'>
                    <label className='text-sm font-semibold text-gray-700'>Amenities</label>
                    <div className='flex flex-col gap-2'>
                      {[
                        {id:'parking', label:'Parking Available'},
                        {id:'furnished', label:'Furnished'},
                      ].map(({id, label})=>(
                        <label key={id} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${
                          sidebarData[id]
                            ? 'bg-blue-50 border-blue-400 text-blue-700 font-medium'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>
                          <input
                            className='accent-blue-600'
                            type='checkbox'
                            id={id}
                            onChange={handlechange}
                            checked={sidebarData[id]}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold text-gray-700'>Sort By</label>
                    <select
                        id='sort-order'
                        className='border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                        onChange={handlechange}
                        value={`${sidebarData.sort}_${sidebarData.order}`}
                        >
                        <option value='regularPrice_asc'>Price: Low to High</option>
                        <option value='regularPrice_desc'>Price: High to Low</option>
                        <option value='createdAt_asc'>Oldest First</option>
                        <option value='createdAt_desc'>Newest First</option>
                    </select>
                </div>
                <button className='bg-blue-600 hover:bg-blue-700 rounded-lg p-3 text-white font-semibold text-sm transition-colors shadow-sm'>
                  Apply Filters
                </button>
            </form>
        </div>

        {/* Results */}
        <div className='flex-1 p-6'>
            <div className='flex justify-between items-center border-b pb-4 mb-6'>
              <h1 className='text-2xl font-bold text-slate-800'>Properties</h1>
              {!loading && (
                <p className='text-sm text-gray-500'>
                  {listings.length > 0 ? `${listings.length} result${listings.length !== 1 ? 's' : ''} found` : ''}
                </p>
              )}
            </div>
            <div className='flex flex-wrap gap-5'>
                {loading && (
                  <div className='w-full flex justify-center py-16'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
                      <p className='text-gray-500 text-sm'>Loading properties...</p>
                    </div>
                  </div>
                )}
                {!loading && listings.length===0 && (
                  <div className='w-full flex flex-col items-center py-16 gap-4'>
                    <div className='text-6xl'>🏠</div>
                    <h3 className='text-xl font-semibold text-slate-700'>No properties found</h3>
                    <p className='text-gray-500 text-sm text-center max-w-sm'>Try adjusting your filters or search term to find more properties.</p>
                  </div>
                )}
                {!loading && listings.length>0 && listings.map((list)=>(
                    <ListingItems list={list} key={list._id}/>
                ))}
                {showmore &&(
                    <div className='w-full flex justify-center mt-4'>
                      <button className='bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg transition-colors text-sm' onClick={onShowMoreclick}>
                          Load More Properties
                      </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Search