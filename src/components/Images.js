import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import CardEvent from './CardEvent';

const Images = () => {
  const [imagesData, setImagesData] = useState([]);

  const getImages = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/getImages`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          setImagesData(json.data);
        }
        console.log("events", json.data);
      });
  };

  useEffect(() => {
    getImages();
  }, []);

  useEffect(() => {
    const handleCarousel = () => {
      const multipleCardCarousel = document.querySelector("#carouselExampleControlsEvents");
      if (window.matchMedia("(min-width: 768px)").matches) {
        const carouselInner = $("#carouselExampleControlsEvents .carousel-inner");
        const carouselWidth = carouselInner[0].scrollWidth;
        const cardWidth = $("#carouselExampleControlsEvents .carousel-item").width();
        let scrollPosition = 0;

        $("#carouselExampleControlsEvents .carousel-control-next").off('click').on("click", function () {
          if (scrollPosition < carouselWidth - cardWidth * 3) { // Adjusted to * 3 to consider 3 visible cards
            scrollPosition += cardWidth;
            carouselInner.animate({ scrollLeft: scrollPosition }, 600);
          }
        });

        $("#carouselExampleControlsEvents .carousel-control-prev").off('click').on("click", function () {
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
  }, [imagesData]);

  return (
    <div id="carouselExampleControlsEvents" className="carousel">
      <div className="carousel-inner">
        {Array.isArray(imagesData) && imagesData.map((card, index) => (
          <CardEvent
            key={index}
            imageSrc={card.imageUrl}
            title={card.name}
            date={card.date}
            className={index === 0 ? 'active' : ''}
          />
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControlsEvents" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControlsEvents" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Images;
