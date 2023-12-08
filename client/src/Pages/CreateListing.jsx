// import React from 'react'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
import {app} from '../firebase'
import {useSelector} from 'react-redux'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState([]);

const [imageUploadError,setImageUploadError]=useState(false)
const [uploading,setUploading]=useState(false)
const [error,setError]= useState(false);
const [Loading,setLoading]=useState(false)
const navigate=useNavigate()
const [formdata,setFormdata]=useState({
     imageUrls:[],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bathrooms:1,
    bedrooms:1,
    regularPrice:0,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false
    })
const {currentUser}=useSelector(state=>state.user)

// console.log(formdata)
// console.log(Loading)
// console.log(error)

const handleImageSubmit=(e)=>{
        if(files.length>0 && files.length+formdata.imageUrls.length < 7){
            setUploading(true)
            setImageUploadError(false)
            const promises=[];  //promises is used bcz there are more than one async operation for images upoad and we have to wait till every image store
            
            for(let i=0;i<files.length;i++){
                promises.push(storeImages(files[i]))   //all the files are present in promises which we get from storeImages
            }
            Promise.all(promises)
            .then((urls)=>{setFormdata({...formdata,          //waiting for all files in the promises then save 
                imageUrls:formdata.imageUrls.concat(urls)});                       //adding new images to existing images

                setImageUploadError(false)
                setUploading(false)
            }) 
            .catch((err)=>{
                setImageUploadError('Image upload failed (2mb max per image')
                setUploading(false)
            })         
        }
        else{
            setImageUploadError('You can only select 6 images')
            setUploading(false)
        }
    }
    const storeImages= async (file)=>{
        return new Promise((resolve,reject)=>{
            const storage=getStorage(app)
            const fileName= new Date().getTime()+file.name;
            const storageRef= ref(storage,fileName);
            const uploadTask=uploadBytesResumable(storageRef,file);
            
            uploadTask.on(
            'state_changed',
            (snapshot)=>{
                const progress= (snapshot.bytesTransferred/snapshot.totalBytes)*100;  //track percentage
                console.log(`upload status is ${progress}%`)
            },
            (error)=>{        //handleing error
                reject(error)
            } ,
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> resolve(downloadURL))  // returning data
            }
            )
        })
    }

    const handleDeleteImage=(index)=>{
        setFormdata({
            ...formdata,
            imageUrls: formdata.imageUrls.filter((url,i)=>i!==index)
        })
    }
    const handleChange =(e)=>{

        if(e.target.id==='rent'|| e.target.id==='sale'){    //to check one at a time
            setFormdata({...formdata, type: e.target.id})
        }

         if(e.target.id==='parking'|| e.target.id==='furnished'|| e.target.id==='offer'){   // this if for check boxes
            setFormdata({...formdata, [e.target.id]: e.target.checked})                     //[e.target.id] bracket is used to get the variable not value ' name not "name" '
        }

        if(e.target.type==='text' ||e.target.type==='textarea' ||e.target.type==='number'){
            setFormdata({...formdata ,[e.target.id]:e.target.value})
        }
    }

    const handleSubmit= async(e)=>{
        e.preventDefault();
        console.log('submiting')

        try {
            if(formdata.imageUrls.length<1) return setError('you must upload atleast 1 image')
            if(+formdata.regularPrice< +formdata.discountPrice) return setError('Regular price can not be less than discount price')
            setLoading(true);
            setError(false);
            const res= await fetch('/api/listing/create',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({...formdata ,userRef:currentUser._id})
            })

            const data=await res.json();
            console.log(data)
            setLoading(false)
            if(data.success ===false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            console.log(error)
            setError(error.message)
            setLoading(false)
        }
    }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="font-semibold text-center my-7 text-3xl">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-5" onSubmit={handleSubmit}>
        <div className="flex gap-4 flex-col flex-1">
          <input
            type="text"
            placeholder="name"
            className="rounded-lg border p-3"
            id="name"
            required
            maxLength="62"
            minLength="10"
            onChange={handleChange}
            value={formdata.name}
          />
          <textarea
            type="text"
            placeholder="description"
            className="rounded-lg border p-3"
            id="description"
            required
            onChange={handleChange}
            value={formdata.description}
          />
          <input
            type="text"
            placeholder="address"
            className="rounded-lg border p-3"
            id="address"
            required
            onChange={handleChange}
            value={formdata.address}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange}
            checked={formdata.type==='sale'} />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5"  onChange={handleChange}
            checked={formdata.type==='rent'}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" onChange={handleChange}
            checked={formdata.parking} />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5"  onChange={handleChange}
            checked={formdata.furnished}/>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange}
            checked={formdata.offer}/>
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300 rounded-lg"
                id="bedrooms"
                type="number"
                min="1"
                max="20"
                required
                onChange={handleChange}
                value={formdata.bedrooms}
              />
              <p>Bed Rooms</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300 rounded-lg"
                id="bathrooms"
                type="number"
                min="1"
                max="30"
                required
                onChange={handleChange}
                value={formdata.bathrooms}
              />
              <p>Bath Rooms</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300 rounded-lg"
                id="regularPrice"
                type="number"
                min="50"
                max="10000000000"
                required
                onChange={handleChange}
                value={formdata.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                {formdata.type==='rent' && (<span className="text-xm">($/Month) </span>)}
                
              </div>
            </div>
            {formdata.offer&& 
                <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300 rounded-lg"
                id="discountPrice"
                type="number"
                min="0"
                max="100000000000"
                required
                onChange={handleChange}
                value={formdata.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                {formdata.type==='rent' && (<span className="text-xm"> ($/Month)</span>)}
                
              </div>
            </div>
            }
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max-6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              id="image"
              multiple
              className="p-3 border border-gray-300 rouned w-full"
              onChange={(e) => {
                setFiles(e.target.files);
              }}
            />
            <button onClick={handleImageSubmit} type="button"
              className="p-3 text-green-700 border border-green-700 rounded upparcase
                hover:shadow-lg disabled:opacity-80
                "
            >
              {uploading? 'Loading...':'Upload'}
            </button>
          </div>
          <div className="text-sm text-red-700">{imageUploadError && imageUploadError}</div>
          {formdata.imageUrls.length>0 && formdata.imageUrls.map((url,index)=>{
            return(<>
                <div className="flex justify-between p-3 border items-center " key={url} >
            <img src={url} alt="Listing images" className="w-20 h-20 object-contain rounded-lg" />
            <button type="button" className="p-3 text-red-600 uppercase hover:opacity-70" disabled={uploading}
            onClick={()=>{handleDeleteImage(index)}}
            >Delete</button>
            </div>
            </>)
          })}
          <button
            type="submit"
            className="p-3 rounded-lg upparcase bg-slate-700 text-white 
                hover:opacity-95 disabled:opacity-80"
            disabled={Loading || uploading}
            >
            {Loading?"Creating List...":'Create Listing'}
          </button>
          {error && <p className="text-red-700  text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
