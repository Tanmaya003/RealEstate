import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Listing from './Listing';
import ListingItem from '../components/ListingItem';
import { list } from 'firebase/storage';

export default function Home() {
  const [offerListings,setOfferListings] =useState([])
  const [saleListings,setSaleListings] =useState([])
  const [rentListings,setRentListings] =useState([])
  SwiperCore.use([Navigation])
  console.log(offerListings);
  useEffect(()=>{
    const fetchOfferListing= async()=>{
      try {
        const res= await fetch('/api/listing/get?offer=true&limit=4');
        const data= await res.json();
        setOfferListings(data);
        fetchRentListing();

      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListing=async() =>{
      try {
        const res= await fetch('/api/listing/get?type=rent&limit=4');
        const data=await res.json();
        setRentListings(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListing=async()=>{
      try {
        const res=await fetch('/api/listing/get?type=sale&limit=4');
        const data=await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error)
      }
      
    }
    fetchOfferListing();

  },[])
  return (
    <div>
      {/* Top */}

        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
          <h1 className='text-salte-700 font-bold text-3xl lg:text-6xl'>Find your next 
            <span className='text-salte-500'>Perfect</span>
            <br /> Place with ease
          </h1>
          <div className='text-xs sm:text-sm text-gray-400'>
            StockEstate is the best place to find your next place to live . It will feel like home away from home.
            <br /> We have a wide range of properties for you to choose from.
          </div>
          <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 hover:underline'> Lets go started...</Link>
        </div>

      {/* Swiper */}
      <Swiper navigation>
        {offerListings && offerListings.length>0 && offerListings.map((list,index)=>{
          return(<>
            <SwiperSlide>
              <div style={{background:`url(${list.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}} className='h-[500px]' key={index} >

              </div>
            </SwiperSlide>
          </>)
        })}
      </Swiper>
      {/* listing results for offer sale and rent */}
      <div className='max-w-7xl mx-auto p-3 flex flex-col gap-6 my-10'>
        {offerListings && offerListings.length>0 &&(
          <div className=''>
          <div className='my-3 flex flex-col gap-2'>
            <h2 className='text-2xl font-semibold text-salte-600'>Recent Offers </h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            <div className='flex gap-4 flex-wrap'> 
            {offerListings.map((List)=>{
                return(<>
                  <ListingItem list={List} key={list._id}/>
                </>)
              })}</div>
            </div>
            
          </div>
        )}
        {rentListings && rentListings.length>0 &&(
          <div className=''>
          <div className='my-3 flex flex-col gap-2'>
            <h2 className='text-2xl font-semibold text-salte-600'>Recent plcae for rent </h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            <div className='flex gap-4 flex-wrap'> 
            {rentListings.map((List)=>{
                return(<>
                  <ListingItem list={List} key={list._id}/>
                </>)
              })}</div>
            </div>
            
          </div>
        )}
        {saleListings && saleListings.length>0 &&(
          <div className=''>
          <div className='my-3 flex flex-col gap-2'>
            <h2 className='text-2xl font-semibold text-salte-600'>Recent place for sale </h2>
            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            <div className='flex gap-4 flex-wrap'> 
            {saleListings.map((List)=>{
                return(<>
                  <ListingItem list={List} key={list._id}/>
                </>)
              })}</div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  )
}
