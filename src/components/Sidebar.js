
import "./Sidebar.css"

import React, { useContext, useEffect, useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Navbar.css';
import { AuthContext } from './context/AuthContext';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';





const Sidebar=(props)=>{


    const location = useLocation();
    
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
      setMenuOpen(false);
    };
    const { auth, setAuth } = useContext(AuthContext);
    const[toggle,setToggle]=useState(false)
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
    <>
  
<div className="side-menu">
    <Link  to="/">
       <img className="icon" alt="" src="/logo.svg" />
    </Link>
<div className="side-menu-child" />
<div className="menu">
<Link to="/" className={location.pathname === "/" ? "active" : ""}>
  <div className="dashboard">
 
    <img className="icon" alt="" src="/icon.svg" />
  
    <div className="daily-events">Dashboard</div>
   
  </div>
  </Link>
 
  <Link to="/todo-list" className={location.pathname === "/todo-list" ? "active" : ""}>
  <div className="order-list">
    <img className="group-icon" alt="" src="/group.svg" />
    <div className="daily-events">To-Do List</div>
    </div>
    </Link>
    <Link to="/leads" className={location.pathname === "/leads" ? "active" : ""}>
  <div className="order-detail">
 
    <img className="order-detail-child" alt="" src="/group-30036.svg" />
    <div className="daily-events">Leads</div>
   
  </div>
  </Link>
    <Link to="/contacts" className={location.pathname === "/contacts" ? "active" : ""}>
  <div className="order-detail">
 
    <img className="order-detail-child" alt="" src="/group-30036.svg" />
    <div className="daily-events">Contacts</div>
   
  </div>
  </Link>

  {props.role==1&&<Link to="/owners" className={location.pathname === "/owners" ? "active" : ""}>
  <div className="order-list">

    <img className="customer-child" alt="" src="/group-30037.svg" />
    <div className="daily-events">Owners</div>
   
  </div>
  </Link>}
  {/* {props.role==1&& <Link to="/roles" className={location.pathname === "/roles" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/role.svg" />
    <div className="properties">Roles</div>
   
  </div>
  </Link>} */}
  <Link to="/listing" className={location.pathname === "/listing" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/vector.svg" />
    <div className="properties">Exclusive Listings</div>
   
  </div>
  </Link>
 {/* {props.role==1&& <Link to="/permission" className={location.pathname === "/permission" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/permisson.svg" />
      <div className="properties">Permission</div>
   
  </div>
  </Link>} */}
  
   

  
  {auth ? (
              <button className="btn-logout" onClick={() => handleLogout()}>Logout</button>
            ) : (
              <button className="btn-logout" onClick={() => handleLogin()}>Login</button>
            )}


   <div className="add-property-box-side-nav">
    <h6>Add new listing here
to multiply the revenue. </h6>
   
     <div className="add_user_btn">
      <button onClick={() =>navigate("/listing/add")}>
        <img src="/plus.svg" />
        Add Exclusive Listing</button>
      </div>
    </div>         
  
</div>
</div>
</>):
<div>
    <Menu
    customBurgerIcon={<FontAwesomeIcon icon={faBars} />} // Use FontAwesome hamburger icon
    isOpen={menuOpen}
    onStateChange={({ isOpen }) => setMenuOpen(isOpen)}
  >
    <div className="side-menu"  onClick={closeMenu}>
    <Link className="side-users-logo" to="/listing">
       <img className="icon" alt="" src="/logo.svg" />
    </Link>
<div className="side-menu-child" />
<div className="menu">
<Link to="/" className={location.pathname === "/" ? "active" : ""}>
  <div className="dashboard">
 
    <img className="icon" alt="" src="/icon.svg" />
  
    <div className="daily-events">Dashboard</div>
   
  </div>
  </Link>
 
  <Link to="/todo-list" className={location.pathname === "/todo-list" ? "active" : ""}>
  <div className="order-list">
    <img className="group-icon" alt="" src="/group.svg" />
    <div className="daily-events">To-Do List</div>
    </div>
    </Link>
    <Link to="/leads" className={location.pathname === "/leads" ? "active" : ""}>
  <div className="order-detail">
 
    <img className="order-detail-child" alt="" src="/group-30036.svg" />
    <div className="daily-events">Leads</div>
   
  </div>
  </Link>
    <Link to="/contacts" className={location.pathname === "/contacts" ? "active" : ""}>
  <div className="order-detail">
 
    <img className="order-detail-child" alt="" src="/group-30036.svg" />
    <div className="daily-events">Contacts</div>
   
  </div>
  </Link>

  {props.role==1&&<Link to="/owners" className={location.pathname === "/owners" ? "active" : ""}>
  <div className="order-list">

    <img className="customer-child" alt="" src="/group-30037.svg" />
    <div className="daily-events">Owners</div>
   
  </div>
  </Link>}
  {/* {props.role==1&&<Link to="/roles" className={location.pathname === "/roles" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/role.svg" />
    <div className="properties">Roles</div>
   
  </div>
  </Link>} */}
  <Link to="/listing" className={location.pathname === "/listing" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/vector.svg" />
    <div className="properties">Exclusive Listings</div>
   
  </div>
  </Link>
  {/* {props.role==1&&<Link to="/permission" className={location.pathname === "/permission" ? "active" : ""} >
  <div className="customer-detail">

    <img className="vector-icon" alt="" src="/permisson.svg" />
    <div className="properties">Permission</div>
   
  </div>
  </Link>} */}
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