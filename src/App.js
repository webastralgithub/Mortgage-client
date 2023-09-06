import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Roles from "./components/Roles";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext } from "./components/context/AuthContext";

const App = () => {
  const {auth} =useContext(AuthContext)
  return (
    <div>
      <Navbar />
      <Routes>
       {!auth&& <Route path="/" element={<Login />} />}

        <Route
          path="/add-user" exact
          element={
            <PrivateRoute>
              <Admin />
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
  );
};

export default App;
