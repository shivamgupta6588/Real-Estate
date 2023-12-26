import { useState } from 'react'

const Search = () => {
    const [searchValue, setSearchValue] = useState('');
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex-col flex gap-8'>
                <div className='flex items-center gap-2 '>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input className='border border-span-700' type='text' id='searchValue'  value={searchValue}/>
                </div>
                <div className='flex flex-wrap gap-2 items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input className='w-5' type='checkbox' id='all'/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input className='w-5' type='checkbox' id='rent'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input className='w-5' type='checkbox' id='sale'/>
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input className='w-5' type='checkbox' id='offer'/>
                        <span>Offer</span>
                    </div>                    
                </div>
                <div className='flex flex-wrap gap-2 items-center'>
                    <label className='font-semibold'>Aminities:</label>
                    <div className='flex gap-2'>
                        <input className='w-5' type='checkbox' id='parking'/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input className='w-5' type='checkbox' id='furnished'/>
                        <span>Furnished</span>
                    </div>        
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select id='sort-order' className='border rounded-lg p-3' >
                        <option>Price low to high</option>
                        <option>Price high to low</option>
                        <option>Oldest</option>
                        <option>Latest</option>
                    </select>
                </div>
                <button className='bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-90'>Search</button>
            </form>
        </div>
        <div>
            <h1 className='text-3xl font-semibold border-b p-3 n'>Listing Results:</h1>
        </div>
    </div>
  )
}

export default Search