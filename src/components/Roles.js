import React, { useState, useEffect, useContext } from "react";
import "./Roles.css";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [editingRole, setEditingRole] = useState(null);


  const {auth}=useContext(AuthContext)
  const headers={
    Authorization:auth.token
  }
const url=process.env.REACT_APP_API_URL
  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    const response = await axios.get(`${url}api/role`,headers);
    setRoles(response.data.roles);
  };

  const openModal = (mode, role) => {
    setModalMode(mode);
    setEditingRole(role);
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalMode("");
    setEditingRole(null);
    setIsOpen(false);
  };

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

  const addRole = async (role) => {
    console.log(headers)
    const response = await axios.post(`${url}api/role/create`, role,{headers});
    setRoles([...roles, response.data]);
    closeModal();
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

  const deleteRole = async (roleId) => {
    await axios.delete(`/roles/${roleId}`);
    setRoles(roles.filter((r) => r.id !== roleId));
  };

  return (
     <div className="add_user_btn">


      <button onClick={() => openModal("add")}>Add Role</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >

    
        {modalMode === "add" && (
          <AddRoleForm onAdd={addRole} onCancel={closeModal} />
        )}

        {modalMode === "edit" && (
          <EditRoleForm
            role={editingRole}
            onSave={updateRole}
            onCancel={closeModal}
          />
        )}
      </Modal>
      <h3>Roles</h3>
      <div className="table-container">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {roles.length && roles.map((role) => (
        <tr key={role.id}>
          <td>{role.name}</td>
          <td>
            <button onClick={() => openModal("edit", role)}>
              Edit
            </button>
            <button onClick={() => deleteRole(role.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>
  );
};

const AddRoleForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Role name"
      />
      <button type="submit">Add Role</button>
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
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Role name"
      />
      <button type="submit">Save Role</button>
      <button onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default Roles;