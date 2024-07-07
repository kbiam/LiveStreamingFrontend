import React, { useEffect, useState } from 'react';
import $ from 'jquery'; // Import jQuery
import 'jquery-ui-dist/jquery-ui'; // Import jQuery UI
import CardEvent from './CardEvent';

const Events = () => {
  const [eventData, setEventsData] = useState([]);

  const getEvents = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/getEvents`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          setEventsData(json.data);
        }
        console.log("events", json.data);
      });
  };

  useEffect(() => {
    getEvents();

    var multipleCardCarousel = document.querySelector(
      "#carouselExampleControls"
    );
    if (window.matchMedia("(min-width: 768px)").matches) {
     
      var carouselWidth = $(".carousel-inner")[0].scrollWidth;
      var cardWidth = $(".carousel-item").width();
      var scrollPosition = 0;
      $("#carouselExampleControls .carousel-control-next").on("click", function () {
        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
      $("#carouselExampleControls .carousel-control-prev").on("click", function () {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
    } else {
      $(multipleCardCarousel).addClass("slide");
    }}, []);

  return (
    <div id="carouselExampleControls" className="carousel">
      <div className="carousel-inner">
        {Array.isArray(eventData) && eventData.map((card, index) => (
          <CardEvent
            key={index}
            imageSrc={card.imageUrl}
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

export default Events;
