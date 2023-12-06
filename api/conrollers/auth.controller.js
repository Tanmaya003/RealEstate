import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import {errorHandeler} from '../utlis/error.js'
import  Jwt  from "jsonwebtoken";

export const signup= async(req,res,next)=>{
    // res.json({"message":'hi'})
    console.log(req.body)
    const {username,email,password}=req.body;
    const hasspassword=bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password:hasspassword})
    try {
        await newUser.save();
    res.status(201).json("user created successfully")
    } catch (error) {
        next(error)
    }
};

export const signin= async(req,res,next)=>{
    console.log(req.body);
    const {email,password}=req.body;
    try {
        const validUser=await User.findOne({email});
        if (!validUser){
            return next(errorHandeler(404,"user not found"))
        }
        const validPassword =bcryptjs.compareSync(password,validUser.password)
        if(!validPassword){
            return next(errorHandeler(404,"Wrong credentials"))
        }
        
        const token =Jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const { password:pass, ...rest}=validUser._doc;  //de structuring the object to not show password to user
        res.cookie('Access_token',token,{httpOnly:true}).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const google= async(req,res,next)=>{
    console.log(req.body.email)
    try {
        
        const user=await User.findOne({email : req.body.email})
        if(user){    //if user exits
            console.log("userExists")
            const token=Jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password:pass, ...rest}=user._doc;
            res.cookie('Access_token',token,{httpOnly:true})
                .status(200)
                .json(rest)
        }
        else{       //if user doesnot exists
            console.log("user not Exists")
            const generatePassword= Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
            const hassedPassword =bcryptjs.hashSync(generatePassword,10);
            const userName= req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4);
            const newUser=new User({username:userName, email:req.body.email, password:hassedPassword ,avatar: req.body.photo});
            await newUser.save();
            console.log("saving user")
            const token=Jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:pass, ...rest}= newUser._doc;
            res.cookie("Access_token",token,{httpOnly:true}).status(200).json(rest)
        }
    } catch (error) {
        console.log("error Happened")
        next(error)
    }
}
export const signout=async (req,res,next)=>{
    try {
        res.clearCookie('Access_token');
        res.status(200).json('User has been logged out')
    } catch (error) {
        next(error)
    }
}