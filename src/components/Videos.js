import React, { useEffect, useState } from 'react';
import $ from 'jquery'; // Import jQuery
import 'jquery-ui-dist/jquery-ui'; // Import jQuery UI
import VideoCard from './VideoCard';

const Videos = () => {
  const [videoData, setVideosData] = useState([]);

  const getVideos = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/getVides`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          setVideosData(json.data);
        }
        console.log("videos", json.data);
      });
  };

  useEffect(() => {
    getVideos();
  }, []);

  useEffect(() => {
    const handleCarousel = () => {
      const multipleCardCarousel = document.querySelector("#carouselExampleControls");
      if (window.matchMedia("(min-width: 768px)").matches) {
        const carouselInner = $(".carousel-inner");
        const carouselWidth = carouselInner[0].scrollWidth;
        const cardWidth = $(".carousel-item").width();
        let scrollPosition = 0;

        $("#carouselExampleControls .carousel-control-next").off('click').on("click", function () {
          if (scrollPosition < carouselWidth - cardWidth * 3) { // Adjusted to * 3 to consider 3 visible cards
            scrollPosition += cardWidth;
            carouselInner.animate({ scrollLeft: scrollPosition }, 600);
          }
        });

        $("#carouselExampleControls .carousel-control-prev").off('click').on("click", function () {
          if (scrollPosition > 0) {
            scrollPosition -= cardWidth;
            carouselInner.animate({ scrollLeft: scrollPosition }, 600);
          }
        });
      } else {
        $(multipleCardCarousel).addClass("slide");
      }
    };

    handleCarousel();

    $(window).resize(() => {
      handleCarousel();
    });

  }, [videoData]);

  return (
    <div id="carouselExampleControls" className="carousel">
      <div className="carousel-inner">
        {Array.isArray(videoData) && videoData.map((card, index) => (
          <VideoCard
            key={index}
            videoSrc={card.videoUrl}
            title={card.name}
            date={card.date}
            className={index === 0 ? 'active' : ''}
          />
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Videos;
