// import React from 'react'
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Link, json, useNavigate} from 'react-router-dom'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signInFailure, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";


//firebase storage rule
// allow read;
// allow write: if request.resource.size<2*1024*1024 &&
// request.resource.contentType.matches("image/.*")

export default function Profile() {
  const { currentUser ,loading,error} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess]= useState(false);
  const [showListingError,setShowListingError]= useState(false)
  const [userListings,setUserListings]=useState([])
  const [showList,setShowList]=  useState(false)
  const dispatch=useDispatch();
  const navigate=useNavigate();
  // console.log(formData)
  //console.log(showListingError)


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app); //create local storage
    const fileName = new Date().getTime() + file.name; //setting file name
    const storageRef = ref(storage, fileName); //in which place we store the data ref(created storage,path )
    const uploadTask = uploadBytesResumable(storageRef, file); //creatig upload task using the storage ref(loaction) and the file

    uploadTask.on(
      "state_changed", //to track state changes
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        //error handeling
        setFileUploadError(true);
      },
      () => {
        //setting the url to avatar
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };
  const handleChange=(e)=>{
    setFormData({...formData, [e.target.id]:e.target.value})
  }

  const handleDelete=async ()=>{
    try {
      dispatch(deleteUserStart());
      const res= await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      })
      const data= await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

const handleSignOut=async ()=>{
  try {
    dispatch(signOutUserStart())
    const res= await fetch('/api/auth/signout');
    const data=await res.json();
    if(data.success===false){
      dispatch(signOutUserFailure(data.message))
      return;
    }
    dispatch(signOutUserSuccess(data))
  } catch (error) {
    dispatch(signOutUserFailure(error.message))
  }
}

  const handleSubmit=async (e)=>{
    e.preventDefault();
    
    try {
      dispatch(updateUserStart())
      const res= await fetch(`/api/user/update/${currentUser._id}`,
      {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      })

      const data= await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleShowListing= async()=>{
      try {
        setShowList(!showList)
        setFileUploadError(false)
        const res= await fetch(`/api/user/listings/${currentUser._id}`,{
          headers:{'Content-Type':'application/json'}
        })

        const data= await res.json();
        if(data.message === false){
          setShowListingError(true);
          return
        }
        setUserListings(data)
      } catch (error) {
        setShowListingError(true)
      }
  }
 const handleListingDelete= async(listid)=>{
    try {
      const res= await fetch(`/api/listing/delete/${listid}`,{        // sending req to remove
        method:'DELETE'
      })
      const data= res.json();
      if(data.success === false){
        console.log(false);
        return
      }
      setUserListings((prev)=>prev._id !== listid)   //removing list from frontend piece of state and updating list
    } catch (error) {
      console.log(error.message)
    }
 }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"> Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          className="rounded-full object-cover h-24 w-24 cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt="profie"
          onClick={() => {
            fileRef.current.click();
          }}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700"> Error in image upload (image ust be less than 2 mb)</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage == 100 ? (
            <span className="text-green-700">Image Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>

        <input
          className="border p-3 rounded-lg "
          id="username"
          type="text"
          defaultValue={currentUser.username}
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg "
          id="email"
          type="email"
          defaultValue={currentUser.email}
          placeholder="Useremail"
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg "
          id="Password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80"
          disabled={loading}
        >
          {loading===true?'loading...':'Update'}
        </button>
        <Link className="bg-green-700 text-white rounded-lg p-3 text-center uppercase hover:opacity-90 disabled:opacity-80" 
        to={'/create-listing'}>
        Create List</Link>
      </form>
      <div className="flex mt-5 justify-between">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>Delete Account</span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>SignOut</span>
      </div>
      <p className="text-red-700 mt-5">{error?error:''}</p>
      <p className="text-green-700 mt-5">{updateSuccess===true?'User is updated successfully':''}</p>

      <button className="text-green-700 w-full" onClick={handleShowListing}>{showList?"Hide List":"Show LIsting"}</button>
      <p className="text-red-700 mt-5">{showListingError?'Error in showing list':""}</p>

      {showList && userListings && userListings.length>0 &&    
      <div className="gap-2 flex flex-col">
      <h1 className="text-center mt-2 text-2xl font-semibold">Your Listings</h1>
      {userListings.map((listing)=>{
          return(<>
          <div key={listing._id} className="flex justify-between border border-slate-300 rounded-lg p-3 items-center gap-2">
            <Link to={`/listing/${listing._id}`}> 
            <img src={listing.imageUrls[0]} className="h-20 w-20 object-contain" />
            </Link>
            <Link to={`/listing/${listing._id}`} className="text-slate-700 font-semibold flex-1 hover:underline truncate"> 
            <p > {listing.name}</p>
            </Link>
            <div className="flex flex-col gap-2 items-center">
              <button className="text-red-700 uppercase" onClick={()=>handleListingDelete(listing._id)}>Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 uppercase" >Edit</button>
            </Link>
            </div>
          </div>
          </>)
        })}
       </div>}
    </div>
  );
}
