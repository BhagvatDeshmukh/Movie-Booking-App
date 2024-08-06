import React, { Component,useState,useEffect,useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import MoviePoster from "./MoviePoster";
import context from "../storedContexts";

function SwipeToSlide() {
  let {apiurl}=useContext(context)
  const settings = {
    className: "center",
    infinite: false,
    centerPadding: "60px",
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive:[
        {
            breakpoint: 1440,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1
            }
        },
        {
            breakpoint: 1024,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1
            }
        },
        {
            breakpoint: 600,
            settings: {
              slidesToShow: 3,
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

  let [movieList,setMovieList]=useState([]);

  useEffect(()=>{
  try {
    axios(`http://${apiurl}:3000/getmovies`).then((response)=>{
    setMovieList(response.data);
    });
  } catch (error) {
    console.log(error);
  }
    
  },[])

  return (
    <div className="slider-container">
      <Slider {...settings}>
      {
        movieList.map((movie)=>{
      return <MoviePoster key={movie.movieid} id={movie.movieid} movieName={movie.moviename} imgAddr={movie.posteraddr} />
})}
      </Slider>
    </div>
  );
}

export default SwipeToSlide;
