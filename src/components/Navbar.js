import React, { useContext } from 'react';
import './Navbar.css';
import { AuthContext } from './context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { auth,setAuth } = useContext(AuthContext);
     const navigate=useNavigate()
console.log(auth)
    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuth(null);
        navigate('/')
      }
      const handleLogin=()=>{
        navigate('/')
      }
  return (
    <nav>
      <ul className="nav-links">

      <div className="logo logo-desktop">
		<a href="http://realestate.millennialgroup.ca">
							<img src="http://realestate.millennialgroup.ca/wp-content/uploads/2021/06/logo-transparent-min.png" height="90" width="" alt="logo" />
					</a>
	</div>
    <div className='links-handle'>
       {!auth && <li><Link href="/">Home</Link></li>}
        <li><Link to="/add-user">Users</Link></li>
        <li><Link to="/roles">Role</Link></li>
        </div>
        {auth ? (
        <button onClick={() => handleLogout()}>Logout</button>  
      ) : (
        <button onClick={() => handleLogin()}>Login</button>
      )}
      </ul>
    </nav>
  );
}

export default Navbar;