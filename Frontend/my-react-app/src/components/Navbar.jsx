import React, { useContext, useEffect, useState,Suspense } from 'react'
import { NavLink,useLocation } from 'react-router-dom'
import MovieIcon from '@mui/icons-material/Movie';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import context from '../storedContexts';
import UserIcon from './UserIcon';
import Search from './SearchMovie';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';

function Navbar() {
  let { city, setShowLocation,user,apiurl,SetUser, setCity,isAuthenticated,setIsAuthenticated,IsSeatlayout,SetIsSeatlayout } = useContext(context);
  let location=useLocation();
  let redirect=[{redirect:location.pathname}];
  useEffect(()=>{
    location.pathname.slice(0,11)=='/seatLayout' || location.pathname.slice(0,15)=='/confirmBooking' ?SetIsSeatlayout(false):SetIsSeatlayout(true);
  },)
  useEffect(()=>{
    setTimeout(()=>{
    try {
      // console.log({token:localStorage.getItem('token')});
      
      axios.post(`${apiurl}/verify`,{token:localStorage.getItem('token')}).then((response) => {
        if(response.data.user){
          setIsAuthenticated(true);
          SetUser(response.data.user)
          // console.log(response.data.user)
          
        }
        else{
          setIsAuthenticated(false);
          SetUser({ name: '', email: '' })
        }
    });
      
    } catch (error) {
      console.log(error);
    }},5000);
  },[isAuthenticated]);
  // useEffect(()=>{
  //   try {
  //     axios.post(`http://${apiurl}:3000/verify`,{token:localStorage.getItem('token')}).then((response) => {
  //       if(response.data.user){
  //         setIsAuthenticated(true);
  //         SetUser(response.data.user)
  //         // console.log(response.data.user)
  //       }
  //       else{
  //         setIsAuthenticated(false);
  //         SetUser({ name: '', email: '' })
  //       }
  //   });
      
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },[]);

  return (
    <div className="flex gap-2 px-4 py-3 box-border content-center justify-around bg-white shadow-md sticky top-0 z-20" >
      <NavLink className={({ isActive }) => {
        return isActive ? "font-bold p-2 border-red-300 text-sm text-red-500 hover:text-white rounded-full flex gap-2  shadow-md hover:border-red-500 justify-self-start border hover:bg-red-500" :"p-2 text-red-500  flex flex-nowrap gap-2 hover:border-red-300  rounded-full border hover:bg-red-500 hover:text-white"
      }} to="/"><MovieIcon /><div className='font-orbitron flex place-content-baseline justify-self-center'>MB</div></NavLink>
      
      <div className='hidden sm:flex ' ><Search /></div>
      
      <div className='flex gap-4'>
        {IsSeatlayout &&
        <button className='underline underline-offset-8 sm:text-sm text-xs font-light decoration-red-500' onClick={() => { setShowLocation(true); setCity('') }}>
          <LocationOnIcon className='text-red-500'/>
          {city}
        </button>
} 
        {isAuthenticated ? <Suspense fallback={<Skeleton variant="circular" width={40} height={40} />}>
        <UserIcon /> 
          </Suspense> :
        <NavLink to={"SignIn/"} state={redirect} className='text-white px-2 rounded-sm grid place-content-center shadow-md bg-red-500 hover:bg-red-600'><span className='text-xs sm:text-sm'>SignIn</span></NavLink>
        }
      </div>

    </div>

  )
}

export default Navbar
