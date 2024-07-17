import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { serverUrl } from '../helper/Helper';
const Viewer = ({streamerId}) => {
  const peerRef = useRef();

  useEffect(() => {
    if (streamerId) {
      watchStream();
    }
  }, [streamerId]);

  const watchStream = () => {
    try {
      const peer = createPeer();
      peerRef.current = peer;
      peer.addTransceiver("video", { direction: "recvonly" });
      peer.addTransceiver("audio", { direction: "recvonly" });
    } catch (error) {
      console.error("Error watching stream:", error);
    }
  };

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
  };

  const handleNegotiationNeededEvent = async (peer) => {
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      const payload = { sdp: peer.localDescription };
      console.log(payload.sdp, "sending");
      const { data } = await axios.post(`${serverUrl}/consumer/${streamerId}`, payload.sdp);
      const desc = new RTCSessionDescription(data.sdp);
      await peer.setRemoteDescription(desc);
    } catch (error) {
      console.error("Error handling negotiation:", error);
    }
  };

  const handleTrackEvent = async (e) => {
    const video = document.getElementById("video");
    console.log("setting video")
    video.srcObject = e.streams[0];
  };

  const handleICECandidateEvent = async (event) => {
    if (event.candidate) {
      try {
        console.log("ice", streamerId)
        await axios.post(`${serverUrl}/ice-candidate/${streamerId}`, {
          candidate: event.candidate,
          role: 'consumer'
        });
      } catch (error) {
        console.error("Error sending ICE candidate:", error);
      }
    }
  };

  return (
    <div className="watch-on">
      <video autoPlay playsInline id="video"></video>
    </div>
  );
};

export default Viewer;
