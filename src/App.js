import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Roles from "./components/Roles";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext } from "./components/context/AuthContext";
import Footer from "./components/Footer";
import Property from "./components/Property";
import NavbarContainer from "./components/NavbarContainer";
import Sidebar from "./components/Sidebar";
import Realtor from "./components/Realtor";


const App = () => {
  const {auth} =useContext(AuthContext)
  return (
    <div className="main-dashbord-wrapper">
      <div style={{position:"absolute"}}>
  <ToastContainer />
  </div>
{auth&& <div className="main-sidenav-wrapper">
      <Sidebar />
      </div>}

      <div className={auth?"main-sidecontent-wrapper":"login-main-page"}>
       {auth&&<NavbarContainer />}

        <Routes>
        {!auth? <Route path="/" element={<Login />} />:  <Route
            path="/property" exact
            element={
              <PrivateRoute>
                <Property />
              </PrivateRoute>
            }
          />}
      
          <Route
            path="/contacts" exact
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
             <Route
            path="/realtor" exact
            element={
              <PrivateRoute>
                <Realtor/>
              </PrivateRoute>
            }
          />
          <Route
            path="/property" exact
            element={
              <PrivateRoute>
                <Property />
              </PrivateRoute>
            }
          />

          <Route
            path="/roles"
            element={
              <PrivateRoute>
                <Roles />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>


     {/* {auth&& <Footer />} */}
     </div>
 
  );
};

export default App;
