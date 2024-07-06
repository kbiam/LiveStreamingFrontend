import React, { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import MediaPost from '../components/MediaPost';
import EventPhotos from '../components/EventPhotos';
// import Functionallity from '../components/Functionallity';
import Broadcasting from '../components/Broadcasting';
import Viewer from '../components/Viewer'
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { socket } from '../socket';

const EventPage = () => {
  const location = useLocation()
  let navigate = useNavigate();
  const [admin,setAdmin]=useState(0);
  const [live,setLive]=useState(0);
  const [streamer,setStreamer]=useState(null);
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
  const adminStatus=async ()=>{
    if(!localStorage.getItem('token')){
      setAdmin(0);
      return;
    }
    fetch(`${process.env.REACT_APP_BASE_URL}/api/adminStatus/${localStorage.getItem('token')}`, {
      method: 'GET',
      headers:{'Content-Type':'application/json'}
      }).then(async (res) => {
        let response = await res.json();
        console.log("admin",response)
        if (response) setAdmin(response.admin);
      });
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
      body:JSON.stringify({id:location.getItem('token')})
      }).then(async (res) => {
        let response = await res.json();
        if (!response.success) alert(response.messege);
      });
  }
  const stopLive=async ()=>{
    fetch(`${process.env.REACT_APP_BASE_URL}/api/stopLive`, {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:location.getItem('token')})
      }).then(async (res) => {
        let response = await res.json();
        if (response.success) alert("Streaming ended");
      });
  }
  const move=()=>{
    if(!admin && live && currentUser!=streamer) navigate("/view-stream");
  }
  
  
  useEffect(() => {
    fetchUser();
    if(localStorage.getItem('token')) socket.emit('join', localStorage.getItem('token'));
    adminStatus();
    liveStatus();
    move();
  }, [live , admin]);
  return (
    <>
    {admin?<SideBar/>:<>
    <div className="event-page">
      <Header/>
      <main className="main-content">
        <div className="content-wrapper">
          <section className="left-column">
            <div className="event-container">
              <div className="event-header">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/80ab8f816310ce7fa073d00754708a74d9c99b5468bfcffb54dd15de7da82d1e?apiKey=f7a84a3244c847b980b62828a7d406c5&"
                  alt="Event icon"
                  className="event-icon"
                />
                <video
                  controls
                  className="live-stream"
                  autoPlay
                  playsInline
                  {...(location.pathname !== "/view-stream" && { muted: true })}
                  id="video"
                ></video>
                <div className="event-status">
                  <div className="live-indicator">
                    <div className="live-dot"></div>
                    <span className="live-text">Live</span>
                  </div>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/3df93c3fe5d2ce138f7424b28f00d949adb92d1ac0debf03d4906193c6123f68?apiKey=f7a84a3244c847b980b62828a7d406c5&"
                    alt="Event logo"
                    className="event-logo"
                  />
                </div>
              </div>
              <h1 className="event-title">Functionallity</h1>
              {/* <Functionallity /> */}
              <Broadcasting />
              <Viewer />
              <h2 className="section-title">Event Photos</h2>
              <EventPhotos />
              <h2 className="section-title">Social Media Posts</h2>
              <MediaPost />
              <h2 className="section-title">Event Photos</h2>
              <EventPhotos />
            </div>
          </section>
          <Chat />
        </div>
      </main>
    </div>
    </>
    }
    </>
  );
};

export default EventPage;
