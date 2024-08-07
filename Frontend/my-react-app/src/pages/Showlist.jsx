import React from 'react'
import { useEffect, useState, useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from "axios";
import context from '../storedContexts';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReactPopover from '../components/Popover';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


function Showlist() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  let [date, setDate] = useState(new Date('2024-07-11'));
  let { mid } = useParams();
  let [mname, setMname] = useState('');
  let { city,apiurl } = useContext(context);
  let t = [];
  let [data, setData] = useState(t);
  let navigate=useNavigate();


  useEffect(() => {
    try {
      axios.get(`${apiurl}/showlist`, {
        params: {
          'city': city,
          'mid': mid,
          'sdate': date,
        }
      }).then((response) => {
        setData(response.data);
        
      });
    } catch (error) {
      console.log(error);
    }
  }, [date, city]);

  useEffect(() => {
    try {
      axios(`${apiurl}/getmovieDetails/${mid}`).then((response) => {
        setMname(response.data[0].moviename);

      });
      setDate(new Date('2024-07-11'));
    } catch (error) {
      console.log(error);
    }

  }, []);

  const getNextThreeDays = () => {
    let dates = [];
    for (let i = 0; i < 3; i++) {
      // let temp1=date.getDate();
      let temp = new Date('2024-07-11');
      temp.setDate(temp.getDate() + i);
      dates.push((temp));
      // console.log(dates[i]);
    }
    return dates;
  };

  function filteredShowtimes() {
    // console.log(data);
    return data.filter(theater => {
      // console.log(Object.keys(theater));
      return Object.keys(theater)[0].toLowerCase().includes(searchTerm.toLowerCase());
    }
    );
  }
  



  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      <div className={`absolute sm:relative transform transition-transform bg-gray-100 w-64 p-4 ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 z-10 pb-10 rounded-md`}>
        <button className="block sm:hidden mb-4" onClick={() => setIsPanelOpen(!isPanelOpen)}>
        <FilterListIcon></FilterListIcon> Close Filter
        </button>
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Select Date</h3>
          <div className="flex flex-col space-y-2">
            {getNextThreeDays().map((d, index) => (
              <button key={index} className={`px-2 py-1 text-sm ${d.toDateString() == date.toDateString() ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg`} onClick={(d) => {
                let temp = new Date(getNextThreeDays()[index]);
                 setDate(temp)
              }}>
                {/* {console.log(d)} */}
                {days[d.getDay()]} {d.getDate()} {months[d.getMonth()]}
              </button>
            ))}
          </div>
        </div>

        {/* <div>
          <h3 className="text-sm font-semibold mb-2">Show Timings</h3>
          <div className="flex flex-col space-y-2">
            {['Morning', 'Afternoon', 'Evening', 'Night'].map((timing, index) => (
              <button key={index} className="px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded-lg">
                {timing}
              </button>
            ))}
          </div>
        </div> */}
      </div>
      <div className="flex-1 p-4">
        <button className="block sm:hidden mb-4 " onClick={() => setIsPanelOpen(!isPanelOpen)}>
          <FilterListIcon></FilterListIcon> Filter
        </button>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl  mb-4">{mname}</h1>
          <input
            type="text"
            placeholder="Search Theaters"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-2 border rounded w-full outline-none px-4 py-2 text-sm font-thin"
          />
          <div className="mt-4">
            {/* {console.log(filteredShowtimes())} */}
            {filteredShowtimes().length == 0 ? 'No Shows Avaliable' : filteredShowtimes().map((theatername, index) => (

              <div key={index} className="border-b py-4">
                <h2 className="text-sm font-bold mb-2">{Object.keys(theatername)[0]}</h2>
                <div className="flex gap-2 content-center justify-start flex-wrap">
                  {theatername[Object.keys(theatername)[0]].map((show) => (
                    <ReactPopover
                      trigger="hover"
                      key={show.showid}
                      content={
                        <div className='flex justify-around content-center'>
                          <p className="text-xs select-none">${show.price.Premium}<br></br> <p className='text-[8px] select-none'>Premium</p></p>
                          <p className="text-xs select-none">${show.price.Normal}<br></br> <p className='text-[8px] select-none'>Normal</p></p>
                          <p className="text-xs select-none">${show.price.Executive}<br></br> <p className='text-[8px] select-none'>Executive</p></p></div>
                      }
                    >
                      <button className="bg-green-50 px-4 py-1.5 border text-green-500 rounded text-xs" onClick={()=>navigate("/seatLayout/"+mname+"/"+show.theatername+"/"+show.showid+"/"+new Date(show.sdate).toDateString()+"/"+show.stime.slice(0, 5))}>
                        {new Date(show.sdate).toDateString()}<br></br>
                        {show.stime.slice(0, 5)}
                      </button>
                    </ReactPopover>

                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




{/* <div className="relative" key={show.showid}  onMouseEnter={handleopenpopover}
                    onMouseLeave={handleclosepopover}>
                      <button
                        className={`px-3 py-2 text-xs rounded-lg border-2  text-green-500`}
                      >
                       
                      </button>
                      <div className={`absolute z-10 bg-white border p-2 rounded shadow-lg `}>
                        
                      </div>
                    </div>  */}
export default Showlist