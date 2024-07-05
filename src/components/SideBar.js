import React, { useEffect, useState } from 'react';
import AddUser from './AddUser';
// import AddEvent from './AddEvent';
import AddAdmin from './AddAdmin';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import AddEvent from './AddEvent';
import AdminProfile from './AdminProfile';
// import AllUsers from './AllUsers';

const SideBar = () => {
  const [area, setArea] = useState(0);
  let [data, setData] = useState(["", "", "", "", ""]);
  let authToken = localStorage.getItem("token");
  let navigate = useNavigate();

  const renderComponent = () => {
    switch (area) {
      case 0:
        return <AdminProfile/>;
      case 1:
        return <AddEvent />;
      case 2:
        return <AddUser />;
      case 3:
        return <AddAdmin />;
      case 4:
        return;
      default:
        return <div>Select an option from the menu</div>;
    }
  };

  const fetchUser = async () => {
    await fetch(`${process.env.REACT_APP_BASE_URL}/api/getUserDetails/${authToken}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).then(async (res) => {
      let response = await res.json();
      console.log("data", response.data);
      if (response.success) setData([response.data.name, response.data.email]);
      else alert(response.message);
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <div className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <span className="navbar-brand fs-1 fst-italic mr-5">Menu</span>
            </div>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li>
              <a onClick={() => setArea(0)} href="#" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-people"></i>
                  <span className={`btn ${area === 0 ? "bg-primary text-white" : ""} ms-1 d-none d-sm-inline`} style={{color:'blue'}}>Profile</span>
                </a>
                <a onClick={() => setArea(1)} href="#" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-people"></i>
                  <span className={`btn ${area === 1 ? "bg-primary text-white" : ""} ms-1 d-none d-sm-inline`} style={{color:'blue'}}>AddEvent</span>
                </a>
                <a onClick={() => setArea(2)} href="#" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-people"></i>
                  <span className={`btn ${area === 2 ? "bg-primary text-white" : ""} ms-1 d-none d-sm-inline`} style={{color:'blue'}}>AddUser</span>
                </a>
                <a onClick={() => setArea(3)} href="#" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-people"></i>
                  <span className={`btn ${area === 3 ? "bg-primary text-white" : ""} ms-1 d-none d-sm-inline`} style={{color:'blue'}}>AddAdmin</span>
                </a>
                <a onClick={() => setArea(4)} href="#" className="nav-link px-0 align-middle">
                  <i className="fs-4 bi-people"></i>
                  <span className={`btn ${area === 4 ? "bg-primary text-white" : ""} ms-1 d-none d-sm-inline`} style={{color:'blue'}}>AllUsers</span>
                </a>
              </li>
            </ul>
            <hr />
          </div>
        </div>
        <div className="col py-3">
          <SideNav />
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
