import React from 'react'
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

function ShowCard({show}) {
    const [data,SetData] =useState([{
        "sdate": "",
        "stime": "",
        "moviename": "",
        "cityname": "",
        "theatername": "",
        "posteraddr": "",
        "price":""
    }]) ;
    const showid=Object.keys(show)[0];
    const apiurl = 'https://movie-booking-app-backend-ibq4.onrender.com';
    
    // [
        
    // ];
    useEffect(()=>{
        try {
            // console.log("d")
          axios(`${apiurl}/getShowDetails/${showid}`).then((response)=>{
          SetData(response.data);
          });
        } catch (error) {
          console.log(error);
        }
          
        },[]);

    const movie = data[0];
    let cost=0;
    for(let i=0;i<show[showid].length;i++){
        let category=show[showid][i].split("-")[0];
        cost+=movie.price[category];
    }
    let seats=show[showid];
    const formattedDate = new Date(movie.sdate).toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const formattedTime = new Date(`${movie.sdate.split('T')[0]}T${movie.stime}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className="flex p-4 border rounded-lg shadow-lg max-w-xs bg-white">
            <img className="w-14 h-28 rounded-md object-contain" src={movie.posteraddr.replace('w780','w185')} alt={`${movie.moviename} Poster`} />
            <div className="ml-4">
                <h3 className="text-base font-bold break-all">{movie.moviename}</h3>
                <p className="mt-2 text-xs">
                    {formattedDate} | {formattedTime}
                </p>
                <p className="text-xs">{movie.theatername}, {movie.cityname}</p>
                <p className="mt-2 text-xs font-semibold">{seats.length} Tickets: {seats.join(",")}</p>
                <p className="text-xs text-gray-500">${cost}</p>
            </div>
        </div>
    );
}

export default ShowCard