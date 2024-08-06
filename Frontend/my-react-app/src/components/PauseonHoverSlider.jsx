import React, { Component,useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Backdrop from "./Backdrop";
  
function PauseOnHover() {
  
  var settings = {
    
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  let [backdropList,setbackdropList]=useState([
    {movieid:280180,backdropaddr:'https://image.tmdb.org/t/p/w1280//k0DEUZqbB9bVcm2NsVaMkdd4Vs8.jpg'},
    {movieid:519182,backdropaddr:'https://image.tmdb.org/t/p/w1280//37xamYKRUGCRux532lKcZdVGYuR.jpg'},
    {movieid:786892,backdropaddr:'https://image.tmdb.org/t/p/w1280//fhv3dWOuzeW9eXOSlr8MCHwo24t.jpg'},
    {movieid:1022789,backdropaddr:'https://image.tmdb.org/t/p/w1280//7U2m2dMSIfHx2gWXKq78Xj1weuH.jpg'},
    {movieid:1214509,backdropaddr:'https://image.tmdb.org/t/p/w1280//buawWBeKYjYfeiPoS2jIcjOrghZ.jpg'},
  ]);
  // useEffect(()=>{
  // try {
  //   axios("http://localhost:3000/getmovies").then((response)=>{
  //   setMovieIdList(response.data);
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
    
  // },[])


  return (
    <div className="slider-container">
      <Slider {...settings}>
        {
        backdropList.map((movie)=>{
      return <Backdrop key={movie.movieid} id={movie.movieid} imgAddr={movie.backdropaddr} />
})}
      </Slider>
    </div>
  );
}

export default PauseOnHover;
