import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const [listing,setListing]=useState([]);
    const [showmore,setShowmore]=useState(false);
const [sidebardata,setSidebardata]=useState({
    searchTerm:"",
    type:'all',
    parking:false,
    offer:false,
    furnished:false,
    sort:'created_at',
    order:'desc'
})
console.log(listing)
//console.log(sidebardata)
useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const searchTermFormURL=urlParams.get('searchTerm');
    const typeFormURL=urlParams.get('type');
    const parkingFormURL=urlParams.get('parking');
    const furnishedFormURL=urlParams.get('furnished');
    const offerFormURL=urlParams.get('offer');
    const orderFormURL=urlParams.get('order');
    const sortFormURL=urlParams.get('sort');
if(searchTermFormURL || typeFormURL || parkingFormURL || furnishedFormURL || offerFormURL || orderFormURL || sortFormURL){
    setSidebardata({
    searchTerm:searchTermFormURL,
    type:typeFormURL || 'all',
    parking:parkingFormURL ==='true'? true:false,
    offer:offerFormURL ==='true'? true:false,
    furnished:furnishedFormURL ==='true'? true:false,
    sort: sortFormURL|| 'created_at',
    order:orderFormURL || 'desc'
    })
  }

  const fetchListingData=async()=>{
    setLoading(true)
    setShowmore(false)
    const searchQuery= urlParams.toString();
    const res=await fetch(`/api/listing/get?${searchQuery}`);
    const data= await res.json();
    if(data.length>8){
        setShowmore(true)
    }
    else{setShowmore(false)}
    
    setListing(data)
    setLoading(false)
  }

  fetchListingData();
},[location.search])

const handleChange=(e)=>{
    if(e.target.id==='searchTerm'){
        setSidebardata({...sidebardata, searchTerm:e.target.value})
    }
    if(e.target.id==='all' || e.target.id==='rent' || e.target.id==='sale'){
        setSidebardata({...sidebardata ,type:e.target.id})
    }
    if(e.target.id==='parking' ||e.target.id==='furnished' || e.target.id==='offer'){
        setSidebardata({...sidebardata, [e.target.id ]: e.target.checked || e.target.checked==='true' ? true:false}) //since the data may be boolean or strig 'true' we have to set in this way
    }
    if(e.target.id==='sort_order'){
        const sort= e.target.value.split('_')[0] || 'created_at';
        const order= e.target.value.split('_')[1] || 'desc';
        setSidebardata({...sidebardata , sort,order})
    }
}

const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams= new URLSearchParams();
        urlParams.set('searchTerm',sidebardata.searchTerm)
        urlParams.set('type',sidebardata.type)
        urlParams.set('parking',sidebardata.parking)
        urlParams.set('furnished',sidebardata.furnished)
        urlParams.set('offer',sidebardata.offer)
        urlParams.set('sort',sidebardata.sort)
        urlParams.set('order',sidebardata.order)
    const searchQuery= urlParams.toString();
    navigate(`/search?${searchQuery}`)
}
const onShowmore=async()=>{
    const listinglength=listing.length;
    const startindex= listinglength;
    const urlParams=new URLSearchParams(window.location);
    urlParams.set('startIndex',startindex);
    const searchQuery=urlParams.toString();
    const res= await fetch(`/api/listing/get?${searchQuery}`);
    const data= await res.json();
    if(data.length<0){
        setShowmore(false)
    }
    setListing([...listing, ...data])

}
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term : </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="search"
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type : </label>
            <div className="flex gap-2">
                <input type="checkbox" id="all" className="w-5"  onChange={handleChange} checked={sidebardata.type === 'all'}/>
                <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" id="rent" className="w-5"  onChange={handleChange} checked={sidebardata.type === 'rent'}/>
                <span>Rent</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" id="sale" className="w-5"  onChange={handleChange} checked={sidebardata.type === 'sale'}/>
                <span>Sale</span>
            </div>
            
            <div className="flex gap-2">
                <input type="checkbox" id="offer" className="w-5"  onChange={handleChange} checked={sidebardata.offer} />
                <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Amenities : </label>
            <div className="flex gap-2">
                <input type="checkbox" id="parking" className="w-5"  onChange={handleChange} checked={sidebardata.parking} />
                <span>Parking</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" id="furnished" className="w-5"  onChange={handleChange} checked={sidebardata.furnished} />
                <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort : </label>
            <select className="border rounded-lg p-3" id="sort_order" onChange={handleChange} defaultValue={'createdAt_desc'}>
                <option value={'regularPrice_desc'}>Price high to low</option>
                <option value={'regularPrice_asc'}>Price low to high</option>
                <option value={'createdAt_desc'}>Latest</option>
                <option value={'createdAt_asc'}>Oldest</option>
            </select>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 ">Search</button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold p-3 border-b text-slate-700 mt-5">Listing Results</h1>
        <div className="p-7 flex flex-wrap gap-4">
            {!loading && listing.length === 0 && (
                <p className="text-xl text-slate-700 text-center">No Listing found!</p>
            )}
            {loading &&(
                <p className="text-xl text-slate-700 text-center w-full" >Loading...</p>
            )}
            {!loading&& listing && listing.map((list)=>{
                return(<>
                    <ListingItem key={list._id} list={list}/>
                </>)
            })}
            {showmore && (
                <button onClick={onShowmore} 
                className="text-green-700 w-full text-center hover:underline">
                Show more</button>
            )}
        </div>
      </div>
    </div>
  );
}
