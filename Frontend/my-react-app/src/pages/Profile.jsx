import React from 'react'
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import MenuIcon from '@mui/icons-material/Menu';
import context from '../storedContexts';
import ShowCard from '../components/ShowCard';

function Profile() {
    let apiurl = 'https://movie-booking-app-backend-ibq4.onrender.com';
    const [user, SetUser] = useState('');
    let {setIsAuthenticated}=useContext(context)
    const navigate = useNavigate();
    const location = useLocation();
    let redirect = [{ redirect: location.pathname }];
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [data,SetData]=useState([]);

    useEffect(() => {
        try {
            axios.post(`${apiurl}/verify`, { token: localStorage.getItem('token') }).then((response) => {
                if (response.data.user) {
                    SetUser(response.data.user);
                    //  console.log(response.data.user.userid)
                    try {
                        // console.log(response.data.user.userid)
                        axios.get(`${apiurl}/getBookings`, {params:{ userid: response.data.user.userid}})
                          .then((res) => {
                            // console.log(res.data)
                            SetData(res.data);
                          })
                      } catch (error) {
                        console.log(error)
                      }
                }
                else {
                    navigate("/SignIn", { state: redirect });
                }
            });

        } catch (error) {
            console.log(error);
        }
    }, []);
    function handleLogout () {
        try {
          axios.post(`${apiurl}/logout`,{token:localStorage.getItem('token')}).then((response) => {
            {
              let token=response.data.token;
              // console.log(token)
              localStorage.setItem("token",token);
              setIsAuthenticated(false);
              navigate("/");
            }
        });
          
        } catch (error) {
          console.log(error);
        }
    
      };

    return (
        <div className="min-h-screen bg-white text-gray-900 flex">
      <div className={`absolute sm:relative transform transition-transform bg-gray-100 w-50 p-4 ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 z-10 pb-10 rounded-md min-h-screen`}>
        <button className="block sm:hidden mb-4" onClick={() => setIsPanelOpen(!isPanelOpen)}>
        <MenuIcon />
        </button>
        <h2 className="text-lg ">Account</h2>
        <div className="text-sm font-light mb-4">{user.name}</div>
        <div className="mb-4">
          
          <div className="flex flex-col space-y-2">
          <button  className={`px-2 py-2 text-xs  bg-gray-200 text-gray-800 rounded-lg`} >
               Your Bookings
            </button>
            <button  className={`px-2 py-2 text-xs  bg-gray-200 text-gray-800 rounded-lg`} onClick={()=>{
                navigate("/");
            }} >
               Book New Ticket
            </button>
            <button  className={`px-2 py-2 text-xs bg-red-500 text-white  rounded-lg`}  onClick={handleLogout}>
               Logout
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4">
        <button className="block sm:hidden mb-4 " onClick={() => setIsPanelOpen(!isPanelOpen)}>
          <MenuIcon /> 
        </button>
        <div className="max-w-screen-lg mx-auto">
        <h1 className="text-xl  mb-4">Bookings</h1>
          <hr className='text-gray-700 shadow-lg mb-2'/>
          <div className='flex flex-wrap gap-2 mb-4'>
            {data.map((show,index)=>{
               return  <ShowCard key={index} show={show} /> 
            })}
                       
          </div>
        </div>
      </div>
    </div>

    )
}

export default Profile