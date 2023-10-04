import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NavbarContainer.css";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
const NavbarContainer = (props) => {

  const {auth,tasklength,setTasklength} =useContext(AuthContext)

  const [previewImage, setPreviewImage] = useState('');
const headers = {
  Authorization: auth.token,
};
const url = process.env.REACT_APP_API_URL;
  useEffect(() => {
    getTasks(); // Replace 'getUsers' with 'getTasks'
    // Rest of your code...
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const user = await 
          axios.get(`${url}api/admin/get-current-user`,{ headers })
     let userData=user.data

     setPreviewImage(userData.profileImg?userData.profileImg:"/placeholder@2x.png")
  
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);


  const getTasks = async () => {
    try {
      const response = await axios.get(`${url}api/todo/get`, { headers });
    
      // Set the filtered contacts in the state
      const filteredData = response.data.filter((item) => item.IsRead === false);
      setTasklength(filteredData.length);
      console.log(response.data)
    

    } catch (error) {
      
    
    }

  };
  return (
    <div className="top-navbar">
        

     
      {/* <div className="search-group">
       <input type="text" placeholder="Search here"/>
       <img src="/search.svg" />
      </div> */}

      <div className="icon-dashboard">
        <div className="icon-dashboard-child" />
        <div className="icon-dashboard-item" />
       <Link to="/todo-list"> <img className="icon-dashboard1" alt="" src="/icon-dashboard.svg" /></Link>
      <Link to="/profile">  <img className="icon-dashboard2" alt="" src="/icon-dashboard1.svg" /></Link>
        <div className="background-group">
          <div className="background6" />
          <div className="div3">{tasklength}</div>
        </div>
      </div>

      <div className="profile-parent">
        <div className="separator" />

        <div className="profile3">
          <div className="hello-samantha">
            {/* <span>{`Hello, `}</span> */}
            <span className="samantha">{props.nameofuser}</span>
            
          </div>
        </div>
        <Link to="/profile">  <div className="avatar3">
          <img className="placeholder-icon3" alt="" src={previewImage} />
        </div>
        </Link>
      </div>
     
    </div>
  );
};

export default NavbarContainer;
