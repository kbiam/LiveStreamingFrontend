import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function AddAdmin() {
    const [credentials,setCredentials] =useState({name:"",email:"",password:"",confirmPassword:""})
    const [loading,setLoading] =useState(0)
    let navigate=useNavigate();
    const handlesubmit=(event)=>{
      try {
        if(credentials.password!=credentials.confirmPassword){
          alert("conform Password is not matching");return;
        }
        setLoading(1)
        fetch(`${process.env.REACT_APP_BASE_URL}/api/createAdmin`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
              },
              body:JSON.stringify({name:credentials.name,email:credentials.email,password:credentials.password})
        }).then(response => response.json()).then(json => {
          if(json.success){
            alert(json.message)
            navigate('/LogIn')
          }
          else alert(json.message)
          setLoading(0)
        })
      } catch (error) {
        setLoading(0)
        alert("somthing went wrong try later");
      }
    }
    const onChange=(event)=>{
      setCredentials({...credentials,[event.target.name]:event.target.value})
    }
  

  return(
    <div> 
    <div className="wrapper ">
        <div className="logo">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/80ab8f816310ce7fa073d00754708a74d9c99b5468bfcffb54dd15de7da82d1e?apiKey=f7a84a3244c847b980b62828a7d406c5&" alt=""/>
        </div>
        <div className="text-center m-4 name text-success">
            LiveStreaming
        </div>
        <div><label htmlFor="exampleInputEmail1" className="form-label md-3">AddAdmin</label></div>
        <div className="form-field d-flex align-items-center">
            <span className="far fa-user"></span>
            <input type="text"  id="userName" placeholder="Name"  name='name' value={credentials.name} onChange={onChange}/>
        </div>
        
        <div className="form-field d-flex align-items-center">
            <span className="far fa-user"></span>
            <input type="email" id="userName" placeholder="email" name='email' value={credentials.email} onChange={onChange}/>
        </div>
       
        <div className="form-field d-flex align-items-center">
            <span className="fas fa-key"></span>
            <input type="password"  id="pwd" placeholder="Password" name='password' value={credentials.password} onChange={onChange} />
        </div>
        <div className="form-field d-flex align-items-center">
            <span className="fas fa-key"></span>
            <input type="password"  id="pwd" placeholder="ConfirmPassword" name='confirmPassword' value={credentials.confirmPassword} onChange={onChange} />
        </div>

        <button className="btn  bg-success" style={{width:'70%'}} onClick={handlesubmit}>MakeAdmin</button>
        {loading?<div class="spinner-border" role="status">
          <span class="visually-hidden text-center">Loading...</span>
        </div>:""}
      </div>
    </div>
  )
}
