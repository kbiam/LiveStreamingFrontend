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

  // const liveStatus = async () => {
  //   const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/liveStatus`, {
  //     method: 'GET',
  //     headers: {'Content-Type': 'application/json'}
  //   });
  //   const response = await res.json();
  //   if (response) {
  //     setLive(response.live);
  //     setStreamer(response.id);
  //   }
  // };

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
    let localStreamerId
    // if (!authToken) {
    //   alert("Please log in first!");
    //   return;
    // }
    // await liveStatus();
    await startLive();
    // if (live === 1) {
    //   alert("A user is already live, you can't create a meet");
    //   return;
    // }
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
      const peer = createPeer();
      peerRef.current = peer;
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      videoElement.srcObject = stream;

      // const response = await axios.post(`${serverUrl}/generate-stream-id`);
      // localStreamerId = response.data.streamerId
      // // console.log(response.data.streamerId)
      // setStreamerId(localStreamerId);

      // setStreamUrl(`localhost:3000/view-stream/${response.data.streamerId}`);
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

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
  };

  const handleNegotiationNeededEvent = async (peer) => {
    try {
      let localStreamerId = streamerId;

      if (localStreamerId === null) {
        const response = await axios.post(`${serverUrl}/generate-stream-id`);
        localStreamerId = response.data.streamerId;
        setStreamerId(localStreamerId);
        console.log(streamerId)
        setStreamUrl(`localhost:3000/view-stream/${localStreamerId}`);
      }
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      const payload = { sdp: peer.localDescription };

      if (localStreamerId) {
        const { data } = await axios.post(`${serverUrl}/broadcast/${localStreamerId}`, payload);
        const desc = new RTCSessionDescription(data.sdp);
        await peer.setRemoteDescription(desc);
      }
    } catch (error) {
      console.error("Error handling negotiation:", error);
    }
  };

  const handleICECandidateEvent = async (event) => {
    if (event.candidate) {
      try {
        console.log("ice",streamerId)
        await axios.post(`${serverUrl}/ice-candidate/${streamerId}`, {
          candidate: event.candidate,
          role: 'broadcaster'
        });
      } catch (error) {
        console.error("Error sending ICE candidate:", error);
      }
    }
  };

  // useEffect(() => {
  //   if (authToken) socket.emit('join', authToken);
  //   liveStatus();
  //   fetchUser();
  // }, [live]);

  return (
    <>
      {/* {live === 1 && currentUser !== streamer ? (
        <div className="watch-on">
          <button className="account-btn" id="live-stream">
            {`${streamer} is live`}
          </button>
          <Share
            description={`I am sharing this interesting event! Check out the details and join us here:`}
            viewUrl={streamUrl}
          />
        </div>
      )  */}
      {/* : ( */}
        <div className="watch-on">
          {!isStreaming ? (
            <button className="account-btn" id="live-stream" onClick={startStreamingAndRecording}>
              Start Live Streaming
            </button>
          ) : (
            <>
              <button
                className="account-btn"
                id="stop-stream"
                onClick={stopStreamingAndDownload}
              >
                Stop Streaming
              </button>
              <Share
                description={`I am sharing this interesting event! Check out the details and join us here:`}
                viewUrl={streamUrl}
              />
            </>
          )}
        </div>
      {/* )} */}
      <div className="video-container">
        <video id="video" autoPlay muted></video>
      </div>
    </>
  );
};

export default Broadcasting;
