import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.MONGO)
.then(()=>{console.log("connection successful")})
.catch((e)=>{console.log(e)})

//creating dynamic directory name kjkj
const __dirname =path.resolve();

const app=express();

app.use(express.json());
app.use(cookieParser());
app.listen(3000, ()=>{console.log('server is running on port 3000') })


app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/listing',listingRouter)

app.use(express.static(path.join(__dirname,'/client/dist')));                  // In case of create react app  /client/build

app.get('*',(req,res)=>{        //Any other url send below file index.html
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"internal server error";
    return res.status(statusCode).json({success:false,statusCode,message})
})