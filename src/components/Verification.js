import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Verification() {
    const [message, setMessage] = useState("");
    const params = useParams();
    useEffect(() => {
        const verify = async () => {
            try { 
            const verificationRes = await fetch(`${process.env.REACT_APP_BASE_URL}/api/verifyUser/${params.token}/${params.admin}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const verificationJson = await verificationRes.json();
            setMessage(verificationJson.message);
               
            } catch (error) {
                alert("Something went wrong, please try again later");
            }
        };

        verify();
    }, [params.token]);

    return (
        <div className="wrapper">
            <div className="logo">
                <img src={require('../websiteLogo.jpg')} alt="Logo" />
            </div>
            <div className="text-center m-4 name text-success">
                LiveStreaming
            </div>
            <p className="text-center m-4 text-success">{message}</p>
            {message === "Email verified successfully" ? (
                <Link to="/Login" className="btn mt-3 fs-6 bg-success">Login Here</Link>
            ) : (
                <p className="text-center m-4 text-success">Checking...</p>
            )}
        </div>
    );
}
