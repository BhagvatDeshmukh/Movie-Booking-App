import React, { useState } from 'react'
import { useEffect,useContext } from 'react';
import { useParams,useNavigate} from 'react-router-dom';
import axios from "axios";
import context from '../storedContexts';

function MoviePage() {
    let { id } = useParams();
    let navigate=useNavigate();
    let {apiurl}=useContext(context);

    let [data,setData]=useState(
        {
            "movieid": 0,
            "moviename": "",
            "posteraddr": "",
            "about": "",
            "releasedate": "",
            "runtime": 0,
            "rating": 0
          }
    );
    useEffect(() => {
        try {
            axios(`http://${apiurl}:3000/getmovieDetails/${id}`).then((response) => {
                setData(response.data[0]);
            });
        } catch (error) {
            console.log(error);
        }

    }, [id]);
    function handleClick(){
        navigate("/Show/"+data.movieid);
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 p-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row shadow-md p-2">
        <div className="md:w-1/3  sm:max-w-56 ">
          <img
            src={data.posteraddr}
            alt={data.moviename}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-2/3 md:ml-6 mt-6 md:mt-0  ">
          <h1 className="text-2xl sm:text-3xl font-bold">{data.moviename}</h1>
          <div className="flex items-center mt-2">
            <span className="text-red-500 font-semibold text-lg">{data.rating.toFixed(1)}/10</span>
          </div>
          <p className="mt-4 text-gray-500 text-sm">
            {Math.floor(data.runtime / 60)}h {data.runtime % 60}m • Release Date: {new Date(data.releasedate).toLocaleDateString()}
          </p>
          <button className="bg-red-500 text-white px-4 py-2 rounded mt-6 hover:bg-red-600" onClick={handleClick}>
            Book tickets
          </button>
          <h2 className=" text-lg sm:text-xl font-medium mt-8">About the movie</h2>
          <p className="mt-2 text-gray-700 text-sm font-light ">
            {data.about}
          </p>
        </div>
      </div>
    </div>
    );
  
    
}

export default MoviePage