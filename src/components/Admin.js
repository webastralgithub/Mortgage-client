// src/components/Admin.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { AuthContext } from "./context/AuthContext";

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
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
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
    <div>
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
</Modal>
      <h3>User List</h3>
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
              <td>{user.role}</td>
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
    role: "",
    email:"",
    phone:""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(userData);
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
        />
          <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
              <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
        />
         <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Role</label>
        <select name="role" value={userData.role} onChange={handleChange}>
        {roles?.map(role=> <option value={role.id}>{role.name}</option>)}
         
        </select>
      </div>
      </div>
      <button type="submit">Add User</button>
      <button onClick={onCancel}>Cancel</button>
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
