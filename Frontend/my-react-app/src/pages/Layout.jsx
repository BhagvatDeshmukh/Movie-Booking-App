import React, { useEffect, useState ,Suspense} from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import context from '../storedContexts'
import CitySelector from '../components/CitySelector'
import ScrollToTop from '../components/ScrollToTop'
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

function Layout() {
  if (!localStorage.length) { localStorage.setItem('city', ''); }
  let [city, setCity] = useState(localStorage.getItem('city'));
  let [showLocation, setShowLocation] = useState(false);
  let [isAuthenticated, setIsAuthenticated] = useState(false);
  let [user, SetUser] = useState({ name: '', email: '' });
  let apiurl = 'https://movie-booking-app-backend-5hre.onrender.com';
  let [IsSeatlayout, SetIsSeatlayout] = useState(true);
  useEffect(() => { if (city == '') setTimeout(() => { setShowLocation(true) }, 2000); }, []);
  // console.log("lo")

  return (
    <context.Provider value={{ city, setCity, showLocation, setShowLocation, user, SetUser, isAuthenticated, setIsAuthenticated, apiurl, IsSeatlayout, SetIsSeatlayout }}>
      <ScrollToTop />
      {showLocation && <CitySelector setShowLocation={setShowLocation} />}
      <div className='flex flex-col content-center box-border gap-3 scroll-smooth'>
        <Suspense fallback={<Skeleton variant="text" sx={{ fontSize: '1rem' }} />}>
        <Navbar />  
        </Suspense>
        <div className='bg-slate-50 px-5 py-2.5 min-h-dvh '>
          <Suspense fallback={<CircularProgress />}>
          <Outlet />  
          </Suspense>
        </div>
      </div>
    </context.Provider>

  )
}

export default Layout
