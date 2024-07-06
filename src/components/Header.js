import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  let navigate = useNavigate();

  const handleLogOut = (event) => {
    event.preventDefault(); // Prevent default link behavior
    localStorage.removeItem('token');
    navigate('/LogIn');
  };

  return (
    <header className="header">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3b2dbb1b5f83bf50b00f22bca48668129ee31dc38adf54e60a68839cc1710d37?apiKey=f7a84a3244c847b980b62828a7d406c5&"
        alt="Event logo"
        // className="logo"
        onClick={()=>navigate("/")}
      />
      {/* <Link to="/" className="navbar-brand fs-1 fst-italic mr-5">Home</Link> */}
      <div className="nav-group">
        <Link to="/" className="nav-item">Events</Link>
        <Link to="/" className="nav-item">Collaborate</Link>
        <Link to="/" className="nav-item">Audios</Link>
      </div>
      <div className="account-group">
        {!localStorage.getItem('token') ? (
          <>
            <Link to="/LogIn" className="account-btn">LogIn</Link>
            <Link to="/SignUp" className="account-btn">SignUp</Link>
          </>
        ) : (
          <>
            <Link to="/MyAccount" className="account-btn">Profile</Link>
            <a href="/" onClick={handleLogOut} className="account-btn">Logout</a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
