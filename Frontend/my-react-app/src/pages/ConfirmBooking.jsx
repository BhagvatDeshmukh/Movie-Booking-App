import React from 'react'
import context from '../storedContexts';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";


function ConfirmBooking() {
  let { mname, tname, showid, sdate, stime, cost, seats } = useParams();
  // console.log(seats);
  // console.log("de")
  let apiurl = 'https://movie-booking-app-backend-ibq4.onrender.com';
  const [msg, SetMsg] = useState(false)
  const [message, SetMessage] = useState()
  const navigate = useNavigate();
  const location = useLocation();
  const [user, SetUser] = useState('');
  let redirect = [{ redirect: location.pathname }];
  useEffect(() => {
    try {
      axios.post(`${apiurl}/verify`, { token: localStorage.getItem('token') }).then((response) => {
        if (response.data.user) {
          SetUser(response.data.user);
          //  console.log("api")
          try {
            axios.post(`${apiurl}/insertintopb`, { userid: response.data.user.userid, showid: showid, seats: seats.split(',') })
              .then((res) => {

                if (res.data.err) {
                  SetMsg(true); SetMessage(res.data.msg); setTimeout(() => navigate(-1), 2000);
                } else { SetMsg(false); }
                // console.log(res);

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

  async function handleBook(){
    try {
      axios.post(`${apiurl}/book`, { token: localStorage.getItem('token'), showid: showid, seats: seats.split(',') })
              .then((res) => {

                if (res.data.err) {
                  SetMsg(true); SetMessage(res.data.msg); setTimeout(() => navigate(-1), 2000);
                } else { SetMsg(true); SetMessage(res.data.msg); setTimeout(() => navigate("/"), 2000); }
                // console.log(res);

              })
    } catch (error) {
      console.log(error)
    }
  }

  const multiplex = tname;
  const movie = mname;
  const date = sdate;
  const time = stime;
  // const seats = ["A1", "A2", "A3"];
  const totalCost = cost; // Example total cost


  return (
    <div className="flex items-center justify-center">
      {msg ?
        <div className="w-full max-w-lg p-3 space-y-4 bg-white border-2 border-red-500 rounded-lg shadow-xl">{message}
        </div> :
          <div className=" flex-col w-full max-w-lg p-6 space-y-3 md:space-y-0 md:space-x-6 bg-white border-2 border-red-500 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-red-600  pb-2 space-y-6 md:space-y-0 md:space-x-6 ">Booking Review</h2>
            <div className='flex flex-row gap-2'>
              {/* Movie Details Section */}
              <div className="flex-1 space-y-4">

                <div>
                  <h3 className="text-lg font-semibold text-red-600">Movie:</h3>
                  <p className="text-gray-700">{movie}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600">Multiplex:</h3>
                  <p className="text-gray-700">{multiplex}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600">Date & Time:</h3>
                  <p className="text-gray-700">{date} at {time}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600">Seats:</h3>
                  <p className="text-gray-700">{seats}</p>
                </div>
              </div>

              {/* User Details Section */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-red-600">Username:</h3>
                  <p className="text-gray-700">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600">Email:</h3>
                  <p className="text-gray-700">{user.email}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <h3 className="text-lg font-semibold text-red-600">Total Cost:</h3>
                    <p className="text-gray-700 font-bold">${totalCost}</p>
                  </div>
                  <button className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 min-w-sm focus:ring-red-400" onClick={handleBook}>
                    Book
                  </button>
                  
                </div>
                <div className='text-xs text-gray-500 font-mono '> Note: Don't Refresh or Press Back  </div>
              </div>
            </div>
          </div>

      }
    </div>
  );
}

export default ConfirmBooking