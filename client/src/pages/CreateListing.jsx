import React, { useState } from 'react';

const CreateListing = () => {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type="text"
            maxLength="62"
            minLength="10"
            className='border p-3 rounded-lg'
            id="name"
            placeholder="name"
            required
          />
          <textarea
            id="description"
            maxLength="62"
            minLength="10"
            className='border p-3 rounded-lg'
            placeholder="description"
            required
          />
          <input
            type="text"
            maxLength="62"
            minLength="10"
            id="address"
            className='border p-3 rounded-lg'
            placeholder="address"
            required
          />

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' id="furnished" className='w-5' />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type='checkbox' id="parking" className='w-5' />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type='checkbox' id="sell" className='w-5' />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type='checkbox' id="rent" className='w-5' />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type='checkbox' id="offer" className='w-5' />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                required
                min="1"
                max="10"
                id="bedrooms"
              />
              <span>Beds</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                required
                min="1"
                max="10"
                id="bathrooms"
              />
              <span>Baths</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                required
                min="1"
                max="10"
                id="regularPrice"
              />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs'>(₹ / month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                required
                min="1"
                max="10"
                id="discountedPrice"
              />
              <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
                <span className='text-xs'>(₹ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 flex-1 '>
          <div>
            <p className='font-semibold'>
              Images:
              <span className='text-grapy-600 font-normal ml-2'>
                The first image will be cover (max 6)
              </span>
            </p>
          </div>
          <div className='flex gap-4'>
            <input
              className="border p-3 w-full border-gray-300 rounded"
              type='file'
              multiple
              id='images'
              accept='image/'
            />
            <button className='border uppercase disabled:opacity-80 hover:shadow-lg border-green-600 text-green-500 rounded-sm p-2 '>
              UPLOAD
            </button>
          </div>
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;