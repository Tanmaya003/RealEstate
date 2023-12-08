// import React from "react";
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const handleGoogleClick = async() => {
    try {
      const provider=new GoogleAuthProvider();
      const auth =getAuth(app);

      const result= await signInWithPopup(auth,provider)
      console.log(result);
      
      const res =await fetch("/api/auth/google",
      {
        method:'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify({name:result.user.displayName,email:result.user.email, photo:result.user.photoURL})
      })

      const data=await res.json();
      dispatch(signInSuccess(data))
      console.log("signin successful",data)
      navigate("/")
    } catch (error) {
      console.log("could not sign in with google");
    }
  };

  return (
    <>
      <button
        type="button"
        className="bg-red-700 p-3 rounded-lg upparcase hover:opacity-90 text-white"
        onClick={handleGoogleClick}
      >
        Continue with gooogle
      </button>
    </>
  );
}
