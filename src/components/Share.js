// Share.js
import React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';


const Share = ({ description, viewUrl }) => {
  const url = viewUrl;
  return (
    <div className="share-container">
      <div className="share-icon-collections">
        <div className="mt-2 share-on-text">Share On</div>
        <TwitterShareButton url={url} title={description} className="share-icon">
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton url={url} title={description} separator=":: " className="share-icon">
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
         <LinkedinShareButton url={url} summary={description} className="share-icon">
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <FacebookShareButton url={url} quote={description} className="share-icon">
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </div>
    </div>
  );
};

export default Share;
