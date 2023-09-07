// src/components/Admin.js
import React, { useContext, useEffect, useState } from "react";
import "./admin.css"
import axios from "axios";
import Modal from "react-modal";
import { AuthContext } from "./context/AuthContext";
import Show from "./Show";

const Admin = () => {


const [users,setUsers]=useState([])


  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [editingUser, setEditingUser] = useState(null);


  const {auth}=useContext(AuthContext)
  console.log(auth)
  const headers={
    Authorization:auth.token
  }
const url=process.env.REACT_APP_API_URL
const [roles,setRoles]=useState([])
  useEffect(()=>{
    getUsers()
    getRoles()
  },[])

  const customStyles = {
    overlay:{
      backgroundColor:"rgb(0 0 0 / 75%)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      border:"none",
      backgroundColor: "#c59a4a",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "40px",
      width: "50%",
    },
  };

  const updateRole = async (updatedRole) => {
    const response = await axios.put(
      `/roles/${updatedRole.id}`,
      updatedRole
    );
    const updatedRoles = roles.map((r) =>
      r.id === updatedRole.id ? response.data : r
    );
    setRoles(updatedRoles);
    closeModal();
  };
  const handleCreateUser = async (userData) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}api/admin/create-user`,userData,{headers} );
      console.log("User created successfully!");
      getUsers()
      closeModal()
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };
 

  const openModal = (mode, role) => {
    setModalMode(mode);
    setEditingUser (role);
    setIsOpen(true);
  };
  const closeModal = () => {
    setModalMode("");
    setEditingUser(null);
    setIsOpen(false);
  };
 
  console.log("Userfggfg ",roles);
  const getRoles = async () => {
    try {
     const res= await axios.get(`${process.env.REACT_APP_API_URL}api/role`);
     setRoles(res.data.roles)
      console.log("User created successfully!",res);
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };
  const getUsers = async () => {
    try {
     const res= await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
     setUsers(res.data)
      console.log("User created successfully!",res);
    } catch (error) {
      console.error("User creation failed:", error);
    }
  };

  return (
    <div className="add_user_btn">
    <button onClick={() => openModal("add")}>Add Users</button>

<Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  style={customStyles}
>
  {modalMode === "add" && (
    <AddUserForm onAdd={handleCreateUser} roles={roles} onCancel={closeModal} />
  )}

  {modalMode === "edit" && (
    <EditRoleForm
      role={editingUser}
      onSave={updateRole}
      onCancel={closeModal}
    />
  )}
</Modal><h3>User List</h3>
      <div className="user_list">
     <Show />
        <div className="search_bar"><label>Search:</label><input type="text" value=""/></div>
      </div>
      
      <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.roles?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
     
     
   
    </div>
  );
};



const AddUserForm = ({ onAdd, onCancel,roles }) => {
  const [name, setName] = useState("");

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    roleId: "",
    email:"",
    phone:""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name)
    setUserData({ ...userData,[name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(userData);
  };
  

  return (
    <form onSubmit={handleSubmit} className="form-user-add">
      <div className="form-user-add-wrapper">
        <div className="form-user-add-inner-wrap">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
        />
        </div>

        <div className="form-user-add-inner-wrap">
          <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
        </div>

        <div className="form-user-add-inner-wrap">
              <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
        />
        </div>


        <div className="form-user-add-inner-wrap">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
        </div>

      <div className="form-user-add-inner-wrap">
        <label>Role</label>
        <select name="roleId" value={userData.role} onChange={handleChange}>
        {roles?.map(role=> <option value={role.id}>{role.name}</option>)}
         
        </select>
      </div>

      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
        <button type="submit">Add User</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

const EditRoleForm = ({ role, onSave, onCancel }) => {
  
  const [name, setName] = useState(role.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...role, name });
  };

  return (
    <form onSubmit={handleSubmit}>
     
      <button type="submit">Save Role</button>
      <button onClick={onCancel}>Cancel</button>
    </form>
  );
};
export default Admin;
