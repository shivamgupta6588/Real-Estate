import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import ListingItems from '../components/ListingItems';


const Search = () => {
    const navigate=useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showmore, setShowmore] = useState(false);
    console.log(listings);
    const [sidebarData, setsidebarData] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
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
            const sort=e.target.value.split('_')[0]||'created_at';
            const order=e.target.value.split('_')[1]||'desc';

            setsidebarData({...sidebarData,sort, order})

        }
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        setShowmore(false);
        // Initial values for sidebarData
        const initialSidebarData = {
          searchTerm: searchTermFromUrl || '',
          type: urlParams.get('type') || 'all',
          parking: urlParams.get('parking') === 'true',
          furnished: urlParams.get('furnished') === 'true',
          offer: urlParams.get('offer') === 'true',
          sort: urlParams.get('sort') || 'created_at',
          order: urlParams.get('order') || 'desc'
        };
    
        setsidebarData(initialSidebarData);
        const fetchListings=async()=>{
            try {
            setLoading(true);
            const searchQuery=urlParams.toString();
            const res= await fetch(`/api/listing/get?${searchQuery}`);

            const data= await res.json();
            console.log(data);
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
    // console.log(sidebarData);
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form  onSubmit={handleSubmit} className='flex-col flex gap-8'>
                <div className='flex items-center gap-2 '>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input className='border border-span-700' 
                    type='text' 
                    id='searchTerm'  
                    value={sidebarData.searchTerm}
                    onChange={handlechange}
                    />
                </div>
                <div className='flex flex-wrap gap-2 items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input className='w-5' 
                        type='checkbox' 
                        id='all'
                        onChange={handlechange}
                        checked={sidebarData.type==='all'}
                         
                    />
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        className='w-5' 
                        type='checkbox' 
                        id='rent'
                        onChange={handlechange}
                        checked={sidebarData.type==='rent'} 
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        className='w-5' 
                        type='checkbox' 
                        id='sale'
                        onChange={handlechange}
                        checked={sidebarData.type==='sale'}
                        />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        className='w-5' 
                        type='checkbox' 
                        id='offer'
                        onChange={handlechange}
                        checked={sidebarData.offer} 
                        />
                        <span>Offer</span>
                    </div>                    
                </div>
                <div className='flex flex-wrap gap-2 items-center'>
                    <label className='font-semibold'>Aminities:</label>
                    <div className='flex gap-2'>
                        <input 
                        className='w-5' 
                        type='checkbox' 
                        id='parking'
                        onChange={handlechange}
                        checked={sidebarData.parking} 
                        />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        className='w-5' 
                        type='checkbox' 
                        id='furnished'
                        onChange={handlechange}
                        checked={sidebarData.furnished} 
                        />
                        <span>Furnished</span>
                    </div>        
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select 
                        id='sort-order' 
                        className='border rounded-lg p-3' 
                        onChange={handlechange}
                        defaultValue={'created_at'}
                        >
                        <option value={'regularPrice_aesc'}>Price low to high</option>
                        <option value={'regularPrice_desc'}>Price high to low</option>
                        <option value={'createdAt_aesc'}>Oldest</option>
                        <option value={'createdAt_desc'}>Latest</option>
                    </select>
                </div>
                <button className='bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-90'>Search</button>
            </form>
        </div>
        <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {
                    loading&& <p className='text-semibold text-xl w-full text-slate-700'>Loading........</p>
                }
                {
                    !loading && listings.length===0 && <p className='text-semibold text-slate-700 text-xl'>No lisitngs Found!</p>
                }
                {
                    !loading && listings.length>0 && listings && listings.map((list)=>(
                                        <ListingItems list={list} key={list._id}/>
                    ))
                }
                {showmore &&(
                    <button  className='text-green-700 hover:underline text-lg w-full' onClick={onShowMoreclick}>
                        Show more
                    </button>
                )
                }
            </div>
        </div>
    </div>
  )
}

export default Search