import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';
import MediaPost from '../components/MediaPost';
import Events from '../components/Events';
import Broadcasting from '../components/Broadcasting';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Videos from '../components/Videos';
import Viewer from '../components/Viewer';
import Images from '../components/Images';

const EventPage = () => {
  const location = useLocation();
  // const { streamId } = useParams();
  let navigate = useNavigate();
  const [admin, setAdmin] = useState(0);
  const [live, setLive] = useState(0);
  const [streamer, setStreamer] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const authToken = localStorage.getItem('token');

  const fetchUser = async () => {
    if (!authToken) return;
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/getUserDetails/${authToken}/${0}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const response = await res.json();
    if (response.success) setCurrentUser(response.data._id);
  }

  const adminStatus = async () => {
    if (!authToken) {
      setAdmin(0);
      return;
    }
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/adminStatus/${authToken}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const response = await res.json();
    if (response) setAdmin(response.admin);
  }

  const liveStatus = async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/liveStatus`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const response = await res.json();
    if (response) {
      setLive(response.live);
      setStreamer(response.id);
    }
  }

  const startLive = async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/startLive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: authToken })
    });
    const response = await res.json();
    if (!response.success) alert(response.message);
  }

  const stopLive = async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/stopLive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: authToken })
    });
    const response = await res.json();
    if (response.success) alert("Streaming ended");
  }

  // const move = () => {
  //   if (admin !== 1 && live && currentUser !== streamer) navigate("/view-stream");
  // }

  const shareVideo = () => {
    // if (!authToken) {
    //   alert("Please login first!!");
    //   return;
    // }
    navigate("/addVideo");
  }

  useEffect(() => {
    fetchUser();
    adminStatus();
    liveStatus();
    // move();
  }, [live, admin]);

  console.log("eventPage", live, currentUser, streamer);

  return (
    <>
      {admin ? <SideBar /> : null}
      <div className="event-page">
        <Header />
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
                
                <Broadcasting/>
              </div>
            </section>
          </div>
          <h2 id="recordings" className="section-title">Recordings</h2>
          <div className="scrollable">
            <div id="carouselExampleControlsVideos">
              <Videos />
            </div>
          </div>
          <br /><br /><br />
          <h2 id="events" className="section-title">Events</h2>
          <div className="scrollable">
            <div id="carouselExampleControlsEvents">
              <Events />
            </div>
          </div>
          <br /><br /><br />
          <button className="account-btn mt-3" id="live-stream" style={{ width: '40%' }} onClick={shareVideo}>
            Share Video
          </button>
          <h2 id="viralvideos" className="section-title">Viral Videos</h2>
          <Videos />
          <h2 className="section-title">Shared Images</h2>
          <Images />
        </main>
      </div>
    </>
  );
}

export default EventPage;
