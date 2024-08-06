import React, { Component,useState,useEffect,useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import MoviePoster from "./MoviePoster";
import context from "../storedContexts";

function InCinemasSlider() {
    let {city,apiurl}=useContext(context);
    let [moviecityList,setMoviecityList]=useState([]);
  const settings = {
    className: "center",
    infinite: false,
    centerPadding: "60px",
    slidesToShow: moviecityList.length<6?moviecityList.length:5,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive:[
        {
            breakpoint: 1440,
            settings: {
              slidesToShow: moviecityList.length<5?moviecityList.length:5,
              slidesToScroll: 1
            }
        },
        {
            breakpoint: 1024,
            settings: {
              slidesToShow:moviecityList.length<4?moviecityList.length:4,
              slidesToScroll: 1
            }
        },
        {
            breakpoint: 600,
            settings: {
              slidesToShow: moviecityList.length<3?moviecityList.length:3,
              slidesToScroll: 1
            }
        }
    ],
    afterChange: function(index) {
      console.log(
        `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
      );
    }
  };

 
  // console.log("ic")
  useEffect(()=>{
  try {
    axios(`http://${apiurl}:3000/getmoviesbycity?city=${city}`).then((response)=>{
    setMoviecityList(response.data);
    });
  } catch (error) {
    console.log(error);
  }
    
  },[city])

  return (
    <div className="slider-container">
      <Slider {...settings}>
      {
        moviecityList.map((movie)=>{
      return <MoviePoster key={movie.movieid} id={movie.movieid} movieName={movie.moviename} imgAddr={movie.posteraddr} />
})}
      </Slider>
    </div>
  );
}

export default InCinemasSlider;
