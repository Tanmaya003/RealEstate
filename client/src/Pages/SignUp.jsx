// import React from "react";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formdata,setFormdata]=useState({});
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate();

  const handleChange=(e)=>{
    setFormdata({...formdata, [e.target.id]:e.target.value})
  }
  

  const hadleSubmit= async(e)=>{
    e.preventDefault();
    try {
      setLoading(true)
    const res= await fetch("/api/auth/signup",               //proxy has set in vite config to avoid write full url .each time there written /api add http://localhost:3000 before
                            {
                              method: 'POST',
                              headers:{'Content-type':'application/json'},
                              body:JSON.stringify(formdata)
                            } )     
      const data= await res.json();
      if(data.success===false){
        setError(data.message);
        setLoading(false)
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in')
      console.log(data)
    } catch (error) {
      setError(error.message)
    }
  }                                                         //
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
          SignUp
      </h1>
      <form className="flex flex-col gap-4 " onSubmit={hadleSubmit}>
        <input type="text" placeholder="username" className="border p-3 rounded-lg " id="username" onChange={handleChange} />
        <input type="text" placeholder="email" className="border p-3 rounded-lg " id="email" onChange={handleChange} />
        <input type="text" placeholder="password" className="border p-3 rounded-lg " id="password" onChange={handleChange} />
        <button type="submit" 
        className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
        disabled={loading}
        >{loading===true?'Loading':"Sign Up"}</button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in" ><span className="text-blue-700 font-bold">Sign In</span></Link>
        
      </div>
      {error&& <p className="text-red-500 mt-5 ">{error}</p>}
    </div>
  );
}
