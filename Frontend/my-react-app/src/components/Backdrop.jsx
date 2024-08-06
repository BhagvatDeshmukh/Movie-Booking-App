import React from 'react'
import { useNavigate } from 'react-router-dom';

function Backdrop({imgAddr,id}) {
  let navigate=useNavigate();
  function handleClick(){
    navigate("Movie/"+id);
  }
  return (
    <div className='flex justify-around content-center bg-black ' onDoubleClick={handleClick}>
        <div className='sm:max-xl:h-80 xl:h-96 relative'><img src={imgAddr} alt={imgAddr+"_poster"} className=' object-contain sm:max-xl:max-w-screen-md xl:max-w-screen-xl' /></div>
        
    </div>
  )
}

export default Backdrop