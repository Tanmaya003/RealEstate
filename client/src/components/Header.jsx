// import React from "react";
import { useEffect, useState } from 'react';
import {FaSearch} from 'react-icons/fa'
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const {currentUser}=useSelector(state=>state.user)
  const [searchTerm,setSearchTerm] =useState('');
  const navigate=useNavigate();

  const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams= new URLSearchParams(window.location.search); //get the url parameters
    urlParams.set('searchTerm',searchTerm);  //setting the search term
    const searchQuery= urlParams.toString(); //converting to string if any number presents
    navigate(`/search?${searchQuery}`)
  }
  useEffect(()=>{
    const urlParams=new URLSearchParams(window.location.search);
    const searchParamsinUrl=urlParams.get('searchTerm');
    setSearchTerm(searchParamsinUrl)
  },[location.search])
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center mx-auto max-w-6xl p-3">
      <Link to='/'>
      <h1 className="flex flex-wrap font-bold text-sm sm:text-xl">
          <span className="text-slate-500">Stock</span>
          <span className="text-slate-700">Estate</span>
        </h1>
      </Link>
        
        <form className="bg-slate-100 p-1 gap-2 sm:p-2 rounded-lg flex justify-between items-center " onSubmit={handleSubmit}>
          <input type="text" placeholder="Search.." className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
          <button> <FaSearch className='text-slate-500'/> </button>
          
        </form>
        <ul className="flex gap-3 ">
        <Link to='/'><li className="hidden sm:inline text-xl text-slate-800 hover:font-bold ">Home</li></Link>
        <Link to='/about'><li className="hidden sm:inline text-xl text-slate-800 hover:font-bold">About</li></Link>
        <Link to='/profile'>
        {currentUser?<img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profie" />:
          <li className=" text-xl text-slate-700 hover:font-bold">SignIn</li>
        }
         
        </Link>   
        </ul>
      </div>
    </header>
  );
}
