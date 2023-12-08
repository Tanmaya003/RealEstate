// import React from "react";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formdata,setFormdata]=useState({});
  const {loading,error}=useSelector((state)=>state.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleChange=(e)=>{
    setFormdata({...formdata, [e.target.id]:e.target.value})
  }
  

  const hadleSubmit= async(e)=>{
    e.preventDefault();
    try {
    dispatch(signInStart());
    const res= await fetch("/api/auth/signin",               //proxy has set in vite config to avoid write full url .each time there written /api add http://localhost:3000 before
                            {
                              method: 'POST',
                              headers:{'Content-type':'application/json'},
                              body:JSON.stringify(formdata)
                            } )     
      const data= await res.json();
      if(data.success===false){
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/')
      console.log(data)
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }                                                         
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
          Sign In
      </h1>
      <form className="flex flex-col gap-4 " onSubmit={hadleSubmit}>
        
        <input type="text" placeholder="email" className="border p-3 rounded-lg " id="email" onChange={handleChange} />
        <input type="text" placeholder="password" className="border p-3 rounded-lg " id="password" onChange={handleChange} />
        <button type="submit" 
        className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
        disabled={loading}
        >{loading===true?'Loading':"Sign In"}</button>
        {/* <button type="submit" 
        className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
        disabled={loading}
        >{loading===true?'Loading':"Continue with google"}</button> */}
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Do not have an account?</p>
        <Link to="/sign-up" ><span className="text-blue-700 font-bold">Sign up</span></Link>
        
      </div>
      {error&& <p className="text-red-500 mt-5 ">{error}</p>}
    </div>
  );
}
