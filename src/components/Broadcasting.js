import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import Share from "./Share";
import { serverUrl } from "../helper/Helper";

const Broadcasting = () => {
  const [streamUrl, setStreamUrl] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const peerRef = useRef();
  const [streamerId, setStreamerId] = useState(null);

  const [live, setLive] = useState(0);
  const [streamer, setStreamer] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const authToken = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (!authToken) return;
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/getUserDetails/${authToken}/${0}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });
    const response = await res.json();
    if (response.success) setCurrentUser(response.data._id);
  };

  const startLive = async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/startLive`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: authToken})
    });
    const response = await res.json();
    console.log(response);
  };

  const stopLive = async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/stopLive`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: authToken})
    });
    const response = await res.json();
    if (response.success) alert("Streaming ended");
    window.location.reload();
  };

  const startStreamingAndRecording = async () => {
    await startLive();
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const videoElement = document.getElementById("video");
      const peer = await createPeer();
      console.log("peer", peer);
      peerRef.current = peer;
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      videoElement.srcObject = stream;

      setIsStreaming(true);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp8,opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = function (e) {
        chunksRef.current.push(e.data);
      };
      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting stream and recording:", error);
    }
  };

  const stopStreamingAndDownload = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "recorded-video.webm";
        a.click();

        chunksRef.current = [];
        setIsStreaming(false);
      };
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    stopLive();
  };

  const createPeer = async () => {
    const peer = await new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });

    let localStreamerId = streamerId;
    if (localStreamerId === null) {
      const response = await axios.post(`${serverUrl}/generate-stream-id`);
      localStreamerId = response.data.streamerId;
      setStreamerId(localStreamerId);
      console.log("streamerID", localStreamerId);
      setStreamUrl(`localhost:3000/view-stream/${localStreamerId}`);
    }

    const streamIDfromFUNC = localStreamerId;
    peer.onicecandidate = (event) => handleICECandidateEvent(event, streamIDfromFUNC);
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer, streamIDfromFUNC);

    return peer;
  };

  const handleNegotiationNeededEvent = async (peer, localStreamerId) => {
    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      const payload = { sdp: peer.localDescription };

      if (localStreamerId) {
        console.log("Broadcasting request");
        const { data } = await axios.post(`${serverUrl}/broadcast/${localStreamerId}`, payload);
        const desc = new RTCSessionDescription(data.sdp);
        await peer.setRemoteDescription(desc);
      }
    } catch (error) {
      console.error("Error handling negotiation:", error);
    }
  };

  const handleICECandidateEvent = async (event, streamIDfromFUNC) => {
    if (event.candidate) {
      try {
        console.log("ice", streamIDfromFUNC);
        await axios.post(`${serverUrl}/ice-candidate/${streamIDfromFUNC}`, {
          candidate: event.candidate,
          role: 'broadcaster'
        });
      } catch (error) {
        console.error("Error sending ICE candidate:", error);
      }
    }
  };

  useEffect(() => {
    const handleIncomingICECandidate = async (data) => {
      try {
        if (peerRef.current && data.streamerId === streamerId && data.role === 'consumer') {
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
  }, [streamerId]);

  return (
    <>
      <div className="watch-on">
        {!isStreaming ? (
          <button className="account-btn" id="live-stream" onClick={startStreamingAndRecording}>
            Start Live Streaming
          </button>
        ) : (
          <>
            <button className="account-btn" id="stop-stream" onClick={stopStreamingAndDownload}>
              Stop Streaming
            </button>
            <Share
              description={`I am sharing this interesting event! Check out the details and join us here:`}
              viewUrl={streamUrl}
            />
          </>
        )}
      </div>
      <div className="video-container">
        <video id="video" autoPlay muted></video>
      </div>
    </>
  );
};

export default Broadcasting;
