import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function AddEvent() {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(0);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    console.log(image);

    try {
      setLoading(1);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/addEvent`, {
        method: 'POST',
        body: formData
      });
      const json = await response.json();
      if (json.success) {
        alert("imageAdded");
        // navigate or perform any other actions upon success
      } else {
        alert(json.message);
      }
      setLoading(0);
    } catch (error) {
      setLoading(0);
      alert("something went wrong, try later");
    }
  };

  return (
    <div className='m-3'>
      <div>
        <input type='file' accept='image/*' onChange={(e) => { setImage(e.target.files[0]) }}></input>
        <button type='submit' onClick={handleSubmit}>AddEvent</button>
      </div>
    </div>
  );
}
