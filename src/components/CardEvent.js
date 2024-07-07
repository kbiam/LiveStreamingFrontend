import React from 'react';

const CardEvent = ({ imageSrc, title, date, className }) => {
    const formatDate=date.slice(0, -8);
  return (
    <div className={`carousel-item ${className}`}>
      <div className="card">
        <div className="img-wrapper">
          <img src={imageSrc} className="d-block w-100" alt={title} />
        </div>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text"><strong>Date</strong>: {formatDate}</p>
          <a href="#" className="btn btn-primary">Share</a>
        </div>
      </div>
    </div>
  );
};

export default CardEvent;
