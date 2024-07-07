import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import firebase from '../firebase';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const AddVideo = () => {
  const [video, setVideo] = useState("");
  const [videoPerc, setVideoPerc] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoName, setVideoName] = useState("");
  const authToken = localStorage.getItem("token");
  let navigate = useNavigate();

  const fetchUser = async () => {
    if (!authToken) return;
    await fetch(`${process.env.REACT_APP_BASE_URL}/api/getUserDetails/${authToken}/${0}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    }).then(async (res) => {
      let response = await res.json();
      if (response.success) setUserId(response.data._id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!video){
        alert("please add img");return;
      }
      if(videoName.length==0){
        alert("please add eventName");return;
      }
      setLoading(1)
      fetch(`${process.env.REACT_APP_BASE_URL}/api/addVideo`, {
          method: 'POST',
          headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({name:videoName,userId:userId,videoUrl:videoUrl})
      }).then(response => response.json()).then(json => {
        if(json.success){
          alert("Video Added SuccessFully!!")
        }
        else alert(json.message)
        setLoading(0)
      })
    } catch (error) {
      setLoading(0)
      alert("somthing went wrong try later");
    }
  };

  useEffect(() => {
    fetchUser();
    video && uploadFile(video, "videoUrl");
  }, [video]);

  const uploadFile = (file, fileType) => {
    const storage = getStorage(firebase);
    const folder = fileType === "imgUrl" ? "images/" : "videos/";
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        fileType === "imgUrl" ? <></> : setVideoPerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        // Handle upload error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('DownloadURL - ', downloadURL);
          setVideoUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className='container m-3'>
      <Header/>
      <div className="upload">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="eventName" className="form-label">Video Name</label>
            <input type="text" className="form-control" id="eventName" name="eventName" value={videoName} onChange={(e)=>{setVideoName(e.target.value)}} />
          </div>
          <div>
            <label htmlFor="video">Video:</label> {videoPerc > 0 && "Uploading: " + videoPerc + "%"}
            <br />
            <input type="file" accept="video/*" id="video" onChange={(e) => setVideo(e.target.files[0])}/>
          </div>
          <br />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVideo;
