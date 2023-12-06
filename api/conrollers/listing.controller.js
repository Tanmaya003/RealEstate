import Listing from "../models/listing.model.js"
import { errorHandeler } from "../utlis/error.js";

export const createListing= async(req,res,next)=>{

    try {
        const listing= await Listing.create(req.body);
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}

export const deleteListing =async (req,res,next)=>{

    const listing=await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandeler(401, 'Listing not found'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandeler(401,'You can only delete your own listings'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json('List has been deleted')
    } catch (error) {
        next(error)
    }
}

export const updateListing = async (req,res,next)=>{
    const listing=await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandeler(401, 'Listing not found'))
    }
    if(req.user.id !== listing.userRef){
        return next(errorHandeler(401,'You can only update your own listings'))
    }
    try {
        const updatedList= await Listing.findByIdAndUpdate(req.params.id , req.body ,{new:true})
        //model.findByIdAndUpdate(search by id, things to be updated ,{new:true}-to get updated data)
        res.status(200).json(updatedList)
    } catch (error) {
        next(error)
    }
}


export const getListing=async(req,res,next)=>{
    try {
        const listing=await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandeler(401,'Listing not found'))
        }
        res.status(200).json(listing);
    } catch (error) {
    next(error)    
    }
}

export const getListings= async(req,res,next)=>{
    try {
        const limit= parseInt(req.query.limit)||9;  //if there is limit in url then parse it and convert it into num else take 9 as default
        const startIndex=parseInt(req.query.startIndex)|| 0;

        let offer=req.query.offer;
        if(offer==='false' || offer===undefined){
            offer={$in : [false,true]}           //if offer is false and undefined then search for both false and true data
        }

        let furnished= req.query.furnished;
        if(furnished==='false' || furnished === undefined){
            furnished= {$in: [false,true]}
        }

        let parking= req.query.parking;
        if(parking==='false' || parking === undefined){
            parking= {$in: [false,true]}
        }

        let type = req.query.type;
        if(type==='all' || type === undefined){
            type= {$in: ['sale','rent']}
        }

        const searchTerm= req.query.searchTerm || '';
        const sort=req.query.sort || 'createdAt' ;
        const order= req.query.order || 'desc' ;

        

        const listings= await Listing.find({
            name:{$regex : searchTerm ,$options:'i'},
            offer,
            furnished,
            parking,
            type,
        }).sort({[sort]:order}).limit(limit).skip(startIndex)

        return res.status(200).json(listings)

    } catch (error) {
        next(error)
    }
}