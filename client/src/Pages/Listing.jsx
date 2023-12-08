import { list } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa";
import { trusted } from "mongoose";
import { useSelector } from "react-redux";
import Contact from "./Contact";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact,setContact]= useState(false)
  const params = useParams();
  const {currentUser} =useSelector((state)=>state.user)
  SwiperCore.use([Navigation]);

  console.log(listing);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const listId = params.listId;
        const res = await fetch(`/api/listing/get/${listId}`);
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          setError(true);
          setLoading(false);
          setError(false);
          return;
        }
        setLoading(false);
        setListing(data);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchListing();
  }, [params.listId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{ background: `url(${url}) center no-repeat` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex items-center justify-center bg-slate-100 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
             }}
            >
            <FaShare className="text-slate-500 " />
            </div>
            {copied && (
                <p className="fixed top-[23%] right-[3%] z-10 rounded-md bg-slate-100 p-2">
                Link Copied!
                </p>
            )}
            <div className="flex max-w-4xl mx-auto p-3 my-7 gap-4 flex-col">
                <p className="text-2xl font-semibold">
                {listing.name} - ${" "} {listing.offer ? listing.discountPrice.toLocaleString('en-US'): listing.regularPrice.toLocaleString('en-US')}
                {listing.type==='rent' && ' / Month'}
                </p>
                <p className="flex items-center mt-4 gap-2 text-slate-600 my-2 text-sm">
                    <FaMapMarkerAlt className="text-green-700"/>
                    {listing.address}
                </p>
                <div className="flex gap-4">
                    <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                        {listing.type==='rent'?'For Rent' : 'For Sale'}
                    </p>
                    {listing.offer && (
                        <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">${+listing.regularPrice - +listing.discountPrice} Discount</p>
                    )}
                </div>
                <p className="text-slate-800">
                    <span className="font-semibold text-black">description - </span>
                    {listing.description}
                </p>
                <ul className="font-semibold text-sm text-green-900 flex gap-4 items-center flex-wrap">
                    <li className="flex items-center gap-1 whitespace-nowrap"> <FaBed className="text-lg"/> 
                    {listing.bedrooms >1 ?`${listing.bedrooms} Beds`:`${listing.bedrooms} Bed`}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap"> <FaBath className="text-lg"/> 
                    {listing.bathrooms >1 ?`${listing.bathrooms} Bathrooms`:`${listing.bathrooms} Bathroom`}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap"> <FaParking className="text-lg"/> 
                    {listing.parking===true  ?`Parking Available`:`No Parking`}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap"> <FaChair className="text-lg"/> 
                    {listing.furnished  ?`Furnished`:`Unfurnished`}
                    </li>   
                </ul>
                {currentUser && listing.userRef !== currentUser._id && !contact &&
                (<button className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-70 p-3"
                    onClick={()=>setContact(true)}> Contact Landloard</button>)
                }
                {contact && <Contact listing={listing}/>}
            </div>
        </div>
      )}
    </main>
  );
}
