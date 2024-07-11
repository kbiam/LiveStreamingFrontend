import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
const serverUrl=process.env.REACT_APP_BASE_URL

const Broadcasting = () => {
  const [streamUrl, setStreamUrl] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const peerRef = useRef();
  let navigate=useNavigate();

  const [live,setLive]=useState(0);
  const [streamer,setStreamer]=useState("");
  const [currentUser,setCurrentUser]=useState("")
  const authToken=localStorage.getItem('token')

  const fetchUser = async () => {
    if(!authToken) return;
    await fetch(`${process.env.REACT_APP_BASE_URL}/api/getUserDetails/${authToken}/${0}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(async (res) => {
        let response= await res.json();
        console.log("data",response.data);
        if(response.success) setCurrentUser(response.data._id)
    })
  }
  
  const liveStatus=async ()=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/api/liveStatus`, {
      method: 'GET',
      headers:{'Content-Type':'application/json'}
      }).then(async (res) => {
        let response = await res.json();
        if (response){
           setLive(response.live);
           setStreamer(response.id)
        }
      });
  }
  const startLive=async ()=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/api/startLive`, {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:authToken})
      }).then(async (res) => {
        let response = await res.json();
        console.log(response);
      });
  }
  const stopLive=async ()=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/api/stopLive`, {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:authToken})
      }).then(async (res) => {
        let response = await res.json();
        if (response.success) alert("Streaming ended");
        window.location.reload();
      });
  }
  
  const startStreamingAndRecording = async () => {
    if(!localStorage.getItem('token')){
      alert("please logIn first!");
      return;
    }
    navigate("/")
    liveStatus();
    startLive();
    if(live==1){
      alert("a user is already in live , you can't create meet")
    }
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

      const streamLink = `${serverUrl}/view-stream`;
      setStreamUrl(streamLink);
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
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      const payload = { sdp: peer.localDescription };
      const { data } = await axios.post(`${serverUrl}/broadcast`, payload);
      const desc = new RTCSessionDescription(data.sdp);
      await peer.setRemoteDescription(desc);
    } catch (error) {
      console.error("Error handling negotiation:", error);
    }
  };

  const handleICECandidateEvent = async (event) => {
    if (event.candidate) {
      try {
        await axios.post(`${serverUrl}/ice-candidate`, {
          candidate: event.candidate,
          role: 'broadcaster'
        });
      } catch (error) {
        console.error("Error sending ICE candidate:", error);
      }
    }
  };

  useEffect(() => {
    if(localStorage.getItem('token')) socket.emit('join', localStorage.getItem('token'));
    liveStatus();
    fetchUser();
  }, [live]);
  console.log("boroadcasting",live , currentUser,streamer);
  return (
    <>
    {live==1 && currentUser!=streamer?
    <div className="watch-on">
      <button
          className="account-btn"
          id="live-stream"
        >
         {`${streamer} is on live `} 
        </button>
    </div>
    :
    <div className="watch-on">
      {!isStreaming ? (
        <button className="account-btn" id="live-stream" onClick={startStreamingAndRecording}>
          StartLiveStreaming
        </button>
      ) : (
        <button
          className="account-btn"
          id="stop-stream"
          onClick={stopStreamingAndDownload}
        >
          Stop Stream
        </button>
      )}
      {/* <video id="video" autoPlay playsInline controls></video> */}
    </div>
    }
    </>
  );
};

export default Broadcasting;
