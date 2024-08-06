import React from 'react'
import { useState } from 'react';

function Seatgrid({ category, columns, seats, price, handleClick,selectedSeats }) {
  // console.log("sg")
  // console.log(seatdifferntiation[-1])
  let temp;
  return (
    <div className='pb-2 border-b border-gray-200 flex gap-2 justify-between '>
      <div className='text-xs text-gray-500 mb-3 '>{category} ${price}</div>
      <div className={`grid grid-cols-5 gap-2`}>
        {seats.map((seat) => {
          temp=selectedSeats.includes(seat.id)?true:false;
          return <Button key={seat.id} price={price} handleClick={handleClick} seat={seat} selected={temp} />
        })}
      </div>
        
    </div>
  )
}



function Button({seat,price,handleClick,selected}) {
  
  let seatdifferntiation = { "-1": 'invisible', "1": 'hover:ring-1 border-green-500', "0": 'text-gray-300 border-gray-300 cursor-default', "2": ' bg-green-500 text-white' };
  
  return <button className={'size-6 border text-xs ' + seatdifferntiation[seat.avaliablity] + (selected ? seatdifferntiation[2] : ' bg-white text-black')} disabled={seat.avaliablity == 0}  onClick={() => {
    
    
    let i=!selected
    handleClick(seat.id, price,i);
  }}
  
  >
    {seat.id.split("-")[1]}
  </button>
}

export default Seatgrid