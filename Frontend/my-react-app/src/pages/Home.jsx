import React from 'react'
import Search from '../components/SearchMovie'
import PauseOnHover from '../components/PauseonHoverSlider'
import SwipeToSlide from '../components/SwipeToSlide'
import InCinemasSlider from '../components/InCinemasSlider'
function Home() {
    console.log("k")
    return (
        <div className='flex flex-col space-y-3' >
            
            <PauseOnHover />
            
            <div className=' border-b-2 py-3 flex justify-center content-center gap-3'>
                <div className='sm:hidden flex justify-center' ><Search /></div>
            </div>
            <div className=' border-b-2 py-3 flex justify-start content-center gap-3'>
                <div className='font-orbitron font-bold text-red-500 sm:text-sm text-xs'>Recommanded Movies</div>
            </div>
            <InCinemasSlider />
            <div className=' border-b-2 py-3 flex justify-start content-center gap-3'>
                <div className='font-orbitron font-bold text-red-500 sm:text-sm text-xs'>Explore</div>
            </div>
            <SwipeToSlide />
        </div>

    )
}

export default Home