import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { serverUrl } from '../helper/Helper';
import { socket } from "../socket";

const Viewer = () => {
  const peerRef = useRef();
  const { streamId } = useParams();
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (streamId) {
      console.log("Attempting to watch stream:", streamId);
      watchStream();
    }

    return () => {
      if (peerRef.current) {
        peerRef.current.close();
      }
    };
  }, [streamId]);

  const watchStream = async () => {
    try {
      const peer = createPeer();
      peerRef.current = peer;
      peer.addTransceiver("video", { direction: "recvonly" });
      peer.addTransceiver("audio", { direction: "recvonly" });
      await handleNegotiationNeededEvent(peer);
    } catch (error) {
      console.error("Error watching stream:", error);
      setError("Failed to connect to the stream. Please try again.");
    }
  };

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.stunprotocol.org" },
        // Add TURN servers here if needed
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;

    return peer;
  };

  const handleNegotiationNeededEvent = async (peer) => {
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      const payload = { sdp: peer.localDescription };
      console.log("Sending offer:", payload.sdp);
      const { data } = await axios.post(`${serverUrl}/consumer/${streamId}`, payload.sdp);
      console.log("Received answer:", data.sdp);
      const desc = new RTCSessionDescription(data.sdp);
      await peer.setRemoteDescription(desc);
      setIsConnected(true);
    } catch (error) {
      console.error("Error handling negotiation:", error);
      setError("Failed to establish connection. The stream might not be available.");
    }
  };

  const handleTrackEvent = (e) => {
    console.log("Received track:", e.track);
    const [stream] = e.streams;
    if (videoRef.current) {
      if (!videoRef.current.srcObject) {
        videoRef.current.srcObject = stream;
        stream.onaddtrack = () => {
          console.log("New track added");
          videoRef.current.play().catch(console.error);
        }
        console.log("Set video srcObject:", stream);

      } else {
        const currentStream = videoRef.current.srcObject;
        if (!currentStream.getTracks().includes(e.track)) {
          currentStream.addTrack(e.track);
        }
      }
    } else {
      console.error("Video element not found");
    }
  };

  const handleICECandidateEvent = async (event) => {
    if (event.candidate && isConnected) {
      try {
        await axios.post(`${serverUrl}/ice-candidate/${streamId}`, {
          candidate: event.candidate,
          role: 'consumer'
        });
        socket.emit('new-ice-candidate', {
          candidate: event.candidate,
          streamId: streamId,
          role: 'consumer'
        });
      } catch (error) {
        console.error("Error sending ICE candidate:", error);
      }
    }
  };

  useEffect(() => {
    const handleIncomingICECandidate = async (data) => {
      try {
        if (peerRef.current && data.streamId === streamId && data.role === 'broadcaster' && isConnected) {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (error) {
        console.error("Error adding received ICE candidate:", error);
      }
    };

    socket.on('new-ice-candidate', handleIncomingICECandidate);

    return () => {
      socket.off('new-ice-candidate', handleIncomingICECandidate);
    };
  }, [streamId, isConnected]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="watch-on">
      <video autoPlay playsInline ref={videoRef}></video>
    </div>
  );
};

export default Viewer;
