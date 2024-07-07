import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebase from '../firebase';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

const AddEvent = () => {
  const [img, setImg] = useState(null);
  const [imgPerc, setImgPerc] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(0);
  const [date, setDate] = useState(null);
  const navigate = useNavigate();
  const [eventName,setEvent]=useState("")
  const [userId,setUserId]=useState("");
  const authToken=localStorage.getItem('token');
  const fetchUser = async () => {
    await fetch(`${process.env.REACT_APP_BASE_URL}/api/getUserDetails/${authToken}/${1}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(async (res) => {
        let response= await res.json();
        if(response.success) setUserId(response.data._id);
        else alert(response.message)
    })
}

  useEffect(() => {
    fetchUser();
    if (img) uploadFile(img, 'imgUrl');
  }, [img]);

  const handleSubmit=(event)=>{
    event.preventDefault();
    console.log(imageUrl,eventName,date,userId)
    try {
      if(!img){
        alert("please add img");return;
      }
      if(eventName.length==0){
        alert("please add eventName");return;
      }
      setLoading(1)
      fetch(`${process.env.REACT_APP_BASE_URL}/api/addEvent`, {
          method: 'POST',
          headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({name:eventName,userId:userId,imageUrl:imageUrl,date:date})
      }).then(response => response.json()).then(json => {
        if(json.success){
          alert("Event Added SuccessFully!!")
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
    <div className='m-3'>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="eventName" className="form-label">Event Name</label>
          <input type="text" className="form-control" id="eventName" name="eventName" value={eventName} onChange={(e)=>{setEvent(e.target.value)}} />
        </div>
        <div className="mb-3">
          <label htmlFor="eventName" className="form-label">EventDate</label>
            <div className="mb-3 date-picker-wrapper form-control">
              <DatePicker onChange={setDate} value={date} />
            </div>
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
  );
};

export default AddEvent;
