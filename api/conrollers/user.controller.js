import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandeler } from "../utlis/error.js"
import bcryptjs from 'bcryptjs'

export const test=(req,res)=>{
    res.json({"message":'hi'})
}

export const updateUser=async (req,res,next)=>{
        console.log(req.body)
    if(req.user.id!== req.params.id) return next(errorHandeler(401,'You can update your own account'));
    try {
        if(req.body.password){
            req.body.password= bcryptjs.hashSync(req.body.password , 10)
        }

        const updatedUser= await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar: req.body.avatar
            }
        },{new:true})   //to update with new user information

        const {password, ...rest}= updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        console.log('error happend')
        next(error)
    }

}

export const deleteUser= async (req,res,next)=>{
    console.log(req.body)
    if(req.user.id!==req.params.id) return next(errorHandeler(401,'You can delete only your account'))
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('Access_token');
        res.status(200).json('user deleted successfully');
    } catch (error) {
        next(error)
    }
}

export const getUserListing =async (req,res,next)=>{
if(req.user.id === req.params.id){
    try {
        const listing= await Listing.find({userRef:req.params.id})
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}
else{
    return next(errorHandeler(401,'You can only view your own listing'))
}
}

export const getUser= async(req,res,next)=>{
    const id= req.params.id;
    try {
        const user= await User.findById(id);
        console.log(user)
        if(!user){
            return next(errorHandeler(401,'User not found'));
        }
        const {password:pass, ...rest}=user._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}