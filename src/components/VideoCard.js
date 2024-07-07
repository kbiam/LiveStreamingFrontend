import React from 'react';

const VideoCard = ({ videoSrc, title, date, className }) => {
  return (
    <div className={`carousel-item ${className}`}>
      <div className="card video-card">
        <div className="img-wrapper">
          <video src={videoSrc} controls className="d-block w-100" />
        </div>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text"><strong>Date</strong>: {date}</p>
          <a href="#" className="btn btn-primary">Share</a>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
