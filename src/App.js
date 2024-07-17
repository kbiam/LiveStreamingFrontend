// App.js or any other component where you want to include EventPage
import React from 'react';
import './App.css'; // Import your global styles
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
// import Stream from './screens/Stream';
import EventPage from './screens/EventPage';
import Login from './screens/Login';
import Signup from './screens/SignUp';
import MyAccount from './components/MyAccount';
import Verification from './components/Verification';
import PasswordReset from './components/PasswordReset';
import SideBar from './components/SideBar';
import Viewer from './components/Viewer';
import AddVideo from './components/AddVideo';
import SharePhoto from './components/SharePhoto';
import StartStream from './components/StartStream';

function App() {
  return (
    <div className="App">
      <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<EventPage />}/>
          <Route path='/start-stream' element = {<StartStream />}/>
          <Route path='/view-stream/:streamId' element = {<EventPage />}/>
          {/* <Route exact path='/view-stream' element = {<EventPage />}/> */}
          <Route exact path='/addVideo' element = {<AddVideo />}/>
          <Route exact path='/shareImage' element = {<SharePhoto />}/>
          {/* <Route exact path="/LiveStreaming" element={<Stream />}/> */}
          <Route exact path="/SignUp" element={<Signup />}/>
          <Route exact path="/SideBar" element={<SideBar />}/>
          <Route exact path="/LogIn" element={<Login />}/>
          <Route exact path="/MyAccount" element={<MyAccount/>}/>
          {/* <Route exact path='/InfoUpdate' element={<InfoUpdate />}/> */}
          <Route exact path={"/users/verify/:token/:admin"} element={<Verification />}/>
          <Route exact path={"/users/reset/:token/:admin"} element={<PasswordReset />}/>
        </Routes>
      </div>
    </Router>
      
    </div>
  );
}

export default App;
