import { errorHandeler } from "./error.js";
import  jwt  from "jsonwebtoken";

export const verifyToken= (req,res,next)=>{
    const token=req.cookies.Access_token;

    if(!token){
        return next(errorHandeler(401 ,'Unauthorized'))
    }
    jwt.verify(token , process.env.JWT_SECRET , (err,user)=>{
        if(err) return next(errorHandeler(403,'Forbidden'))

        req.user=user;
        next();
    })
}