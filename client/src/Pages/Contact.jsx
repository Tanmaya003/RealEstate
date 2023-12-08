import { list } from "firebase/storage";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [ landlord, setLandlord]  = useState(null);
  const [message,setMessage]=useState(null)
  console.log(listing);
  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        console.log(data)
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);

  const setmessagefunc=(e)=>{
    setMessage(e.target.value)
  }
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea name="message" id='message'  rows='2' value={message} onChange={setmessagefunc}
          placeholder="Enter your message" className="p-3 border rounded-lg w-full  "
          >
          </textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className="bg-slate-700 text-center text-white p-3 uppercase rounded-lg hover:opacity-95"
          >Send Message</Link>
        </div>
      )}

    </>
  );
}