
import "./Sidebar.css"

import React, { useContext, useEffect, useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Navbar.css';
import { AuthContext } from './context/AuthContext';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';





const Sidebar=()=>{


    const location = useLocation();

    const { auth, setAuth } = useContext(AuthContext);
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
  
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    };
  
    useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
      };
    }, []);
  console.log(window.innerWidth,window.innerHeight)
    const handleLogout = () => {
      localStorage.removeItem('token');
      setAuth(null);
      navigate('/');
    };
  
    const handleLogin = () => {
      navigate('/');
    };



return(    <>
  {width > 991 ? (
<div className="side-menu">
    <Link  to="/users">
       <img className="icon" alt="" src="/logo.png" />
    </Link>
<div className="side-menu-child" />
<div className="menu">
<Link to="/" className={location.pathname === "/" ? "active" : ""}>
  <div className="dashboard">
 
    <img className="icon" alt="" src="/icon.svg" />
  
    <div className="daily-events">Dashboard</div>
   
  </div>
  </Link>
 
  <Link to="/order" className={location.pathname === "/order" ? "active" : ""}>
  <div className="order-list">
    <img className="group-icon" alt="" src="/group.svg" />
    <div className="daily-events">Daily Events</div>
    </div>
    </Link>
    <Link to="/contacts" className={location.pathname === "/contacts" ? "active" : ""}>
  <div className="order-detail">
 
    <img className="order-detail-child" alt="" src="/group-30036.svg" />
    <div className="daily-events">Contacts</div>
   
  </div>
  </Link>
  <Link to="/realtor" className={location.pathname === "/realtor" ? "active" : ""}>
  <div className="order-list">

    <img className="customer-child" alt="" src="/group-30037.svg" />
    <div className="daily-events">Realtor Contacts</div>
   
  </div>
  </Link>
  <Link to="/property" className={location.pathname === "/property" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/vector.svg" />
    <div className="properties">Properties</div>
   
  </div>
  </Link>
  {auth ? (
              <button className="btn-logout" onClick={() => handleLogout()}>Logout</button>
            ) : (
              <button className="btn-logout" onClick={() => handleLogin()}>Login</button>
            )}
  
</div>
</div>):
<div>
    <Menu
    customBurgerIcon={<FontAwesomeIcon icon={faBars} />} // Use FontAwesome hamburger icon
  >
    <div className="side-menu">
    <Link  to="/users">
       <img className="icon" alt="" src="/logo.png" />
    </Link>
<div className="side-menu-child" />
<div className="menu">
<Link to="/" className={location.pathname === "/" ? "active" : ""}>
  <div className="dashboard">
 
    <img className="icon" alt="" src="/icon.svg" />
  
    <div className="daily-events">Dashboard</div>
   
  </div>
  </Link>
 
  <Link to="/order" className={location.pathname === "/order" ? "active" : ""}>
  <div className="order-list">
    <img className="group-icon" alt="" src="/group.svg" />
    <div className="daily-events">Daily Events</div>
    </div>
    </Link>
    <Link to="/contacts" className={location.pathname === "/contacts" ? "active" : ""}>
  <div className="order-detail">
 
    <img className="order-detail-child" alt="" src="/group-30036.svg" />
    <div className="daily-events">Contacts</div>
   
  </div>
  </Link>
  <Link to="/realtor" className={location.pathname === "/realtor" ? "active" : ""}>
  <div className="order-list">

    <img className="customer-child" alt="" src="/group-30037.svg" />
    <div className="daily-events">Realtor Contacts</div>
   
  </div>
  </Link>
  <Link to="/property" className={location.pathname === "/property" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/vector.svg" />
    <div className="properties">Properties</div>
   
  </div>
  </Link>
  <div className="add_user_btn">
  {auth ? (
              <button  onClick={() => handleLogout()}>Logout</button>
            ) : (
              <button  onClick={() => handleLogin()}>Login</button>
            )}
            </div>
  
</div>
</div>
</Menu>
</div>
} 
</>


)


    
}
export default Sidebar