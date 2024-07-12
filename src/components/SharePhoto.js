import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebase from '../firebase';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

const SharePhoto = () => {
  const [img, setImg] = useState(null);
  const [imgPerc, setImgPerc] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(0);
  const navigate = useNavigate();
  const [caption,setCaption]=useState("")
  const [userId,setUserId]=useState("");
  const authToken=localStorage.getItem('token');
  const fetchUser = async () => {
    await fetch(`${process.env.REACT_APP_BASE_URL}/api/getUserDetails/${authToken}/${0}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(async (res) => {
        let response= await res.json();
        if(response.success) setUserId(response.data._id);
    })
  }

  useEffect(() => {
    fetchUser();
    if (img) uploadFile(img, 'imgUrl');
  }, [img]);

  const handleSubmit=(event)=>{
    event.preventDefault();
    if(!img || imgPerc!=100){
        alert("image is uploading please wait");
        return;
    }
    console.log(imageUrl,caption,userId)
    try {
      if(!img){
        alert("please add img");return;
      }
      if(caption.length==0){
        alert("please add caption");return;
      }
      setLoading(1)
      fetch(`${process.env.REACT_APP_BASE_URL}/api/addImage`, {
          method: 'POST',
          headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({name:caption,userId:userId,imageUrl:imageUrl})
      }).then(response => response.json()).then(json => {
        if(json.success){
          alert("Image Shared SuccessFully!!")
        }
        else alert(json.message)
        setLoading(0)
      })
    } catch (error) {
      setLoading(0)
      alert("somthing went wrong try later");
    }
  }

  const uploadFile = (file, fileType) => {
    const storage = getStorage(firebase);
    const folder = fileType === 'imgUrl' ? 'images/' : 'videos/';
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (fileType === 'imgUrl') {
          setImgPerc(Math.round(progress));
        } else {
          // setVideoPerc(Math.round(progress));
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
        });
      }
    );
  };

  return (
    <><Header/>
    <div className='container m-3'>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="caption" className="form-label">Caption</label>
          <input type="text" className="form-control" id="caption" name="caption" value={caption} onChange={(e)=>{setCaption(e.target.value)}} />
        </div>
        <div>
          <label htmlFor="img">Image:</label> {imgPerc > 0 && `Uploading: ${imgPerc}%`}
          <br />
          <input type="file" accept="image/*" id="img" onChange={(e) => setImg(e.target.files[0])} />
        </div>
        <br />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
    </>
  );
};

export default SharePhoto;
