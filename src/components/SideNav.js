import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SideNav = () => {
  let navigate=useNavigate();
  const handleLogOut=(event)=>{
    event.preventDefault();
    console.log(localStorage.getItem('token'))
    localStorage.removeItem('token');
    navigate('/Login');
  }
  
  return (
    <header className="header">
      
      <div className="nav-group">
      <Link to="/" className="navbar-brand fs-1 fst-italic mr-5">LiveStreaming</Link>
      </div>
      <div className="account-group">       
        <Link onClick={handleLogOut} className="account-btn">Logout</Link>
      </div>
    </header>
  );
};

export default SideNav;
