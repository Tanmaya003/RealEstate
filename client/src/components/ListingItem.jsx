import { linkWithRedirect } from 'firebase/auth'
import React from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function ListingItem({list}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]'>
        <Link to={`/listing/${list._id}`}>
            <img src={list.imageUrls[0]} alt='listing Cover' className='h-[320px] sm:h-[220px] w-full object-contain hover:scale-105 trasition-scale duration-300' />
            <div className='p-3 flex flex-col gap-2 w-full'>
                <p className='truncate text-lg font-semibold text-slate-700 '>{list.name}</p>
                <div className='flex items-center gap-2'>
                <FaMapMarkerAlt className="text-green-700 h-4 w-4"/>
                <p className='text-sm text-gray-600 truncate w-full'>{list.address}</p>
                </div>
                <p className='text-sm text-gray-600 line-clamp-2'>{list.descripiton}</p>
                <p className='text-slate-500 font-semibold mt-2 '>
                    $
                    {
                        list.offer? list.discountPrice.toLocaleString('en-US') : list.regularPrice.toLocaleString('en-US')
                    }
                    {
                        list.type=== "rent"? " / Month": ""
                    }
                </p>
                <div className='text-slate-700 flex gap-4'>
                    <div className='font-bold text-xs'>
                        {list.bedrooms>1 ? `${list.bedrooms} Beds` : `${list.bedrooms} Bed`}
                    </div>
                    <div className='font-bold text-xs'>
                        {list.bathrooms>1 ? `${list.bathrooms} Bathrooms` : `${list.bathrooms} Bathroom`}
                    </div>
                </div>
            </div>
        
        </Link>
    </div>
  )
}
