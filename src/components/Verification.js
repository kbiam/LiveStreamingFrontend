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
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/80ab8f816310ce7fa073d00754708a74d9c99b5468bfcffb54dd15de7da82d1e?apiKey=f7a84a3244c847b980b62828a7d406c5&" alt="Logo" />
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
