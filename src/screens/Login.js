import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Login() {
  const [credentials,setCredentials] =useState({email:"",password:""})
  const [admin,setAdmin]=useState(0);
  const [loading,setLoading] =useState(0)
  const [forgot,setForgot] =useState(0)
  let navigate=useNavigate()
  const handlesubmit= (event)=>{
    try {
      setLoading(1)
      if(forgot){
        fetch(`${process.env.REACT_APP_BASE_URL}/api/forgotPassword/${credentials.email}/${admin}`, {
            method: 'GET',
            headers:{'Content-Type':'application/json'}
        }).then(response => response.json()).then(json => {
          setLoading(0);setForgot(0)
          alert(json.message);
        })
      }
      else{
        fetch(`${process.env.REACT_APP_BASE_URL}/api/loginUser/${credentials.email}/${credentials.password}/${admin}`, {
            method: 'GET',
            headers:{'Content-Type':'application/json'}
        }).then(response => response.json()).then(json => {
          if(!json.success) alert(json.message)
          else{
            localStorage.setItem('token',json.data)
            navigate("/");
          }
          setLoading(0)
        })
      }
      
    } catch (error) {
      setLoading(0)
      alert("Somthing went wrong try later")
    }
  }
  const onChange=(event)=>{
    setCredentials({...credentials,[event.target.name]:event.target.value})
  }

  return(
    <div> 
    <div><Header/></div>
    <div className="wrapper ">
        <div className="logo">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/80ab8f816310ce7fa073d00754708a74d9c99b5468bfcffb54dd15de7da82d1e?apiKey=f7a84a3244c847b980b62828a7d406c5&" alt=""/>
        </div>
        <div className="text-center m-4 name text-success">
            LiveStreaming
        </div>
        <div><label htmlFor="exampleInputEmail1" className="form-label md-3">{!forgot?"Login Here":"enterEmail"}</label></div>
        <div className="form-field d-flex align-items-center">
            <span className="far fa-user"></span>
            <input type="email" id="userName" placeholder="email" name='email' value={credentials.email} onChange={onChange}/>
        </div>

        {!forgot?<>
        <div className="form-field d-flex align-items-center">
            <span className="fas fa-key"></span>
            <input type="password"  id="pwd" placeholder="Password" name='password' value={credentials.password} onChange={onChange} />
        </div>
        
        </>
        :""}
        <button className={admin?"btn bg-light m-1":"btn  bg-success m-1"} style={{width:'40%',color:'black'}} onClick={()=>{setAdmin(0)}}>User</button>
        <button className={admin?"btn m-1 bg-success":" m-1 btn bg-light"} style={{width:'40%',color:'black'}} onClick={()=>{setAdmin(1)}}>Admin</button>
        <button className="btn mt-2  bg-success" style={{width:'70%'}} onClick={handlesubmit}>{!forgot?'Login':'Submit'}</button>
        {loading?<div class="spinner-border" role="status">
          <span class="visually-hidden text-center">Loading...</span>
        </div>:""}
        {!forgot?<div className='text-center'>
          <button  className=" mt-3 fs-6 border-white" onClick={()=>{setForgot(1)}}>forgotPassword</button>
          </div>:<button className=" m-3 fs-6 border-white " onClick={()=>{setForgot(0)}} >back</button>}
        
      </div>
    </div>
  )
}