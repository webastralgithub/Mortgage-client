import React, { useState, useEffect, useContext } from "react";

import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    mls_no: "",
    propertyType: "",
    squareFeet: "",
    lawyerName: "",
    contractDate: "",
    subjectRemovalDate: "",
    completionDate: "",
    possesionDate: "",
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [editingProperty, setEditingProperty] = useState(null);

  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getProperties();
  }, []);

  const getProperties = async () => {
    const response = await axios.get(`${url}api/property`, { headers });
    setProperties(response.data);
  };

  const openModal = (mode, property) => {
    setModalMode(mode);
    setEditingProperty(property);
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalMode("");
    setEditingProperty(null);
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

  const addProperty = async (property) => {
    const response = await axios.post(`${url}api/property/create`, property, {
      headers,
    });
    setProperties([...properties, response.data]);
    closeModal();
  };

  const updateProperty = async (updatedProperty) => {
    const response = await axios.put(
      `${url}api/property/update/${updatedProperty.id}`,
      updatedProperty,
      { headers }
    );
    const updatedProperties = properties.map((p) =>
      p.id === updatedProperty.id ? response.data : p
    );
    setProperties(updatedProperties);
    closeModal();
  };

  const deleteProperty = async (propertyId) => {
    await axios.delete(`${url}api/property/delete/${propertyId}`, { headers });
    setProperties(properties.filter((p) => p.id !== propertyId));
  };
  // Function to format date strings to "YYYY-MM-DD" format
const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // Handle cases where the date string is empty or undefined
    }
  
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  };
  

  return (
    <div className="add_property_btn">
      <button onClick={() => openModal("add")}>Add Property</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        {modalMode === "add" && <AddPropertyForm onAdd={addProperty} onCancel={closeModal} />}
        {modalMode === "edit" && (
          <EditPropertyForm property={editingProperty} onSave={updateProperty} onCancel={closeModal} />
        )}
      </Modal>
      <h3>Properties</h3>
      <div className="table-container">
        <table>
    {/* Inside the <thead> element */}
<thead>
  <tr>
    <th>MLS No</th>
    <th>Property Type</th>
    <th>Square Feet</th>
    <th>Lawyer Name</th>
    <th>Contract Date</th>
    <th>Subject Removal Date</th>
    <th>Completion Date</th>
    <th>Possession Date</th>
    <th>Actions</th>
  </tr>
</thead>

         {/* Inside the <table> element */}
<tbody>
  {properties.length &&
    properties.map((property) => (
      <tr key={property.id}>
        <td>{property.mls_no}</td>
        <td>{property.propertyType}</td>
        <td>{property.squareFeet}</td>
        <td>{property.lawyerName}</td>
        <td>{formatDate(property.contractDate)}</td> {/* Format date here */}
        <td>{formatDate(property.subjectRemovalDate)}</td> {/* Format date here */}
        <td>{formatDate(property.completionDate)}</td> {/* Format date here */}
        <td>{formatDate(property.possesionDate)}</td> {/* Format date here */}
        <td>
          <button onClick={() => openModal("edit", property)}>Edit</button>
          <button onClick={() => deleteProperty(property.id)}>Delete</button>
        </td>
      </tr>
    ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

const AddPropertyForm = ({ onAdd, onCancel }) => {
  const [property, setProperty] = useState({
    mls_no: "",
    propertyType: "",
    squareFeet: "",
    lawyerName: "",
    contractDate: "",
    subjectRemovalDate: "",
    completionDate: "",
    possesionDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(property);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={property.mls_no}
        onChange={(e) => setProperty({ ...property, mls_no: e.target.value })}
        placeholder="MLS No"
      />
      <input
        value={property.propertyType}
        onChange={(e) => setProperty({ ...property, propertyType: e.target.value })}
        placeholder="Property Type"
      />
      <input
        value={property.squareFeet}
        onChange={(e) => setProperty({ ...property, squareFeet: e.target.value })}
        placeholder="Square Feet"
      />
     
<input
  type="date"
  value={property.contractDate}
  onChange={(e) => setProperty({ ...property, contractDate: e.target.value })}
  placeholder="Contract Date"
/>

<input
  type="date"
  value={property.subjectRemovalDate}
  onChange={(e) => setProperty({ ...property, subjectRemovalDate: e.target.value })}
  placeholder="Subject Removal Date"
/>

<input
  type="date"
  value={property.completionDate}
  onChange={(e) => setProperty({ ...property, completionDate: e.target.value })}
  placeholder="Completion Date"
/>

<input
  type="date"
  value={property.possesionDate}
  onChange={(e) => setProperty({ ...property, possesionDate: e.target.value })}
  placeholder="Possession Date"
/>

      {/* Add more input fields for other property attributes */}
      <button type="submit">Add Property</button>
      <button onClick={onCancel}>Cancel</button>
    </form>
  );
};

const EditPropertyForm = ({ property, onSave, onCancel }) => {
  const [editedProperty, setEditedProperty] = useState({
    mls_no: property.mls_no,
    propertyType: property.propertyType,
    squareFeet: property.squareFeet,
    lawyerName: property.lawyerName,
    contractDate: property.contractDate,
    subjectRemovalDate: property.subjectRemovalDate,
    completionDate: property.completionDate,
    possesionDate: property.possesionDate,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...property, ...editedProperty });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={editedProperty.mls_no}
        onChange={(e) => setEditedProperty({ ...editedProperty, mls_no: e.target.value })}
        placeholder="MLS No"
      />
      <input
        value={editedProperty.propertyType}
        onChange={(e) => setEditedProperty({ ...editedProperty, propertyType: e.target.value })}
        placeholder="Property Type"
      />
      <input
        value={editedProperty.squareFeet}
        onChange={(e) => setEditedProperty({ ...editedProperty, squareFeet: e.target.value })}
        placeholder="Square Feet"
      />
      {/* Add more input fields for other property attributes */}
      <button type="submit">Save Property</button>
      <button onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default Property;
