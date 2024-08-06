import React from 'react'
import { useNavigate } from 'react-router-dom';
function MoviePoster({imgAddr,movieName,id}) {
  let navigate=useNavigate();
  function handleClick(){
    navigate("Movie/"+id);
  }
  return (
    <div className='flex flex-col justify-center gap-2 content-center items-center px-2 py-3 xl:py-6 hover:border-red-500  border-2 shadow-sm rounded-xl' onDoubleClick={handleClick}>
        <div className='w-full max-w-48'><img src={imgAddr} alt={movieName+"_poster"} className='object-contain' /></div>
        <div className='font-medium text-center text-wrap text-xs sm:text-sm'>{movieName}</div>
    </div>
  )
}

export default MoviePoster