import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {
const [landlord, setLandlord] = useState();
const [message, setMessage] = useState();
const {userRef,name}=listing;
  useEffect(() => {
    
 const getContact=async()=>{

  try {
    const res=await fetch(`/api/user/${listing.userRef}`);
    const data= await res.json();
    setLandlord(data) ; 
  }catch (error) {
    console.log(error);   
  }
 }

 getContact();
  }, [userRef])
  
const onMessageChange=(e)=>{
  setMessage(e.target.value);
}

  return (
    <>
    {landlord &&(
      <div className='flex flex-col gap-2'>
        <p>Contact: <span className='font-semibold'>{landlord.username}</span> for {name}</p>
        <textarea
        id="message"
        name="message"
        placeholder='type your message here...'
        onChange={onMessageChange}
        className='w-full border p-3 rounded-lg mt-2'
        value={message}
        />
        <Link className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-90'
        to={`mailto:${landlord.email}?subject=Regarding ${name} &body=${message}`}>Send Message</Link>
      </div>
    )}
    </>
  )
}

export default Contact