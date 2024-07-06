import React,{useState} from 'react'
import { useNavigate , useParams } from 'react-router-dom';
export default function PasswordReset() {
    const [credentials,setCredentials]=useState({password:"",confirmPassword:""})
    const [loading,setLoading] =useState(0)
    const param=useParams();
    let navigate=useNavigate();
    const setPassword = async () => {
        if(credentials.password!=credentials.confirmPassword){alert("confirmPassword is not matching");return;}
        console.log(param.token,param.admin)
        setLoading(1)
        try {
            await fetch(`${process.env.REACT_APP_BASE_URL}/api/getUserDetails/${param.token}/${param.admin}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
            }).then(async (res) => {
            let response= await res.json()
            console.log("res in rest" ,response.data.email)
            if(response.success){
                await fetch(`${process.env.REACT_APP_BASE_URL}/api/updatePassword/${param.admin}`, {
                method: 'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({email:response.data.email,password:credentials.password})
                }).then(response => response.json()).then(json => {
                    setLoading(0)
                    alert(json.message);
                    navigate('/Login')
                }) 
            }
            else {setLoading(0);alert(response.message)}
            })
            
        } catch (error) {
            setLoading(0)
            alert("Somthing went wrong try later")
        }
        
    } 
    const onChange=(event)=>{
        setCredentials({...credentials,[event.target.name]:event.target.value})
    }
    
    return(
        <div className="wrapper" >
        <div className="logo">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/80ab8f816310ce7fa073d00754708a74d9c99b5468bfcffb54dd15de7da82d1e?apiKey=f7a84a3244c847b980b62828a7d406c5&" alt=""/>
        </div>
        <div className="text-center m-4 name text-success">
            LiveStreaming
        </div>
        <div><label htmlFor="exampleInputEmail1" className="form-label md-3">resetPassword</label></div>
        <div className="form-field d-flex align-items-center">
            <span className="fas fa-key"></span>
            <input type="password"  id="pwd" placeholder="Password" name='password' value={credentials.password} onChange={onChange} />
        </div>
        <div className="form-field d-flex align-items-center">
            <span className="fas fa-key"></span>
            <input type="password"  id="pwd" placeholder="confirmPassword" name='confirmPassword' value={credentials.confirmPassword} onChange={onChange} />
        </div>
        <button className="btn mt-3 bg-success" style={{width:'70%'}} onClick={setPassword}>update</button>
        {loading?<div class="spinner-border" role="status">
          <span class="visually-hidden text-center">Loading...</span>
        </div>:""}
      </div>
  )
}


