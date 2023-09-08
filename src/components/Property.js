import React, { useState, useEffect, useContext } from "react";
import "./admin.css"
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
  const [users,setUsers]=useState([])
  const [modalMode, setModalMode] = useState("");
  const [editingProperty, setEditingProperty] = useState(null);

  const { auth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
   getProperties();
    getUsers()
  }, []);


  const getUsers = async () => {
    try {
     const res= await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
     setUsers(res.data)
     
    } catch (error) {
     
    }
  };
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


  const addProperty = async (property) => {
    const response = await axios.post(`${url}api/property/create`, property, {
      headers,
    });
    getProperties()
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
   
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        {modalMode === "add" && <AddPropertyForm onAdd={addProperty} onCancel={closeModal} users={users}/>}
        {modalMode === "edit" && (
          <EditPropertyForm property={editingProperty} onSave={updateProperty} onCancel={closeModal} />
        )}
      </Modal>
      <div className="inner-pages-top">
      <h3>Property Listing</h3>
      <div className="add_user_btn">

      <button onClick={() => openModal("add")}>
        <img src="/plus.svg" />
        Add Property</button>
      </div>
      <div className="search-group">

       <input type="text" placeholder="Search here"/>
       <img src="search.svg" />
      </div>
      </div>
      <div className="table-container">
        <table>
    {/* Inside the <thead> element */}
<thead>
  <tr>
    <th>MLS No</th>
    <th>Listing Status</th>
    <th>Property Type</th>
    <th>Price</th>
    <th>Square Feet</th>
    <th>Address</th>
    <th>Lawyer Name</th>
    <th>Realtor Name</th>
    <th>Contract Date</th>
    <th>Subject Removal Date</th>
    <th>Completion Date</th>
    <th>Possession Date</th>
    {/* <th>Actions</th> */}
  </tr>
</thead>

         {/* Inside the <table> element */}
<tbody>
  {properties.length &&
    properties.map((property) => (
      <tr key={property.id}>
        <td>{property.mls_no}</td>
        <td>Active</td>
        <td>{property.propertyType}</td>
        <td>$ {property.price.toFixed(2)}</td>
        <td>{property.squareFeet}</td>
        <td>{property.address}</td>
        <td>{property?.lawyer?.name}</td>
        <td>{property?.realtor?.name}</td>
        <td>{formatDate(property.contractDate)}</td> {/* Format date here */}
        <td>{formatDate(property.subjectRemovalDate)}</td> {/* Format date here */}
        <td>{formatDate(property.completionDate)}</td> {/* Format date here */}
        <td>{formatDate(property.possesionDate)}</td> {/* Format date here */}
        {/* <td>
          <button onClick={() => openModal("edit", property)}>Edit</button>
          <button onClick={() => deleteProperty(property.id)}>Delete</button>
        </td> */}
      </tr>
    ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

const AddPropertyForm = ({ onAdd, onCancel,users }) => {
  const [property, setProperty] = useState({
    mls_no: "",
    propertyType: "",
    squareFeet: "",
    lawyerName: "",
    contractDate: "",
    price:0,
    subjectRemovalDate: "",
    realtorId:"",
    lawyerId:"",
    completionDate: "",
    possesionDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(property);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
   
    setProperty({ ...property,[name]: value });
  };

const lawyers= users.filter(user => user.roleId === 3);
const realtors= users.filter(user => user.roleId === 4);

  return (








    <form onSubmit={handleSubmit} className="form-user-add">
        <div className="form-user-add-wrapper">
    <div className="form-user-add-inner-wrap">
 
      <label>MLS No</label>
      <input
        type="text"
        value={property.mls_no}
        onChange={(e) => setProperty({ ...property, mls_no: e.target.value })}
        placeholder="MLS No"
        className="property-input"
      />
    </div>

    <div className="form-user-add-inner-wrap">
      <label>Property Type</label>
      <input
        type="text"
        value={property.propertyType}
        onChange={(e) => setProperty({ ...property, propertyType: e.target.value })}
        placeholder="Property Type"
        className="property-input"
      />
    </div>
    <div className="form-user-add-inner-wrap">
      <label>Price</label>
      <input
        type="text"
        value={property.price}
        onChange={(e) => setProperty({ ...property, price: e.target.value })}
        placeholder="Property Type"
        className="property-input"
      />
    </div>

    <div className="form-user-add-inner-wrap">
      <label>Square Feet</label>
      <input
        type="text"
        value={property.squareFeet}
        onChange={(e) => setProperty({ ...property, squareFeet: e.target.value })}
        placeholder="Square Feet"
        className="property-input"
      />
    </div>
    <div className="form-user-add-inner-wrap">
      <label>Address</label>
      <input
        type="text"
        value={property.address}
        onChange={(e) => setProperty({ ...property, address: e.target.value })}
        placeholder="Address"
        className="property-input"
      />
    </div>

    <div className="form-user-add-inner-wrap">
      <label>Contract Date</label>
      <input
        type="date"
        value={property.contractDate}
        onChange={(e) => setProperty({ ...property, contractDate: e.target.value })}
        placeholder="Contract Date"
        className="property-input"
      />
    </div>

    <div className="form-user-add-inner-wrap">
      <label>Subject Removal Date</label>
      <input
        type="date"
        value={property.subjectRemovalDate}
        onChange={(e) => setProperty({ ...property, subjectRemovalDate: e.target.value })}
        placeholder="Subject Removal Date"
        className="property-input"
      />
    </div>

    <div className="form-user-add-inner-wrap">
      <label>Completion Date</label>
      <input
        type="date"
        value={property.completionDate}
        onChange={(e) => setProperty({ ...property, completionDate: e.target.value })}
        placeholder="Completion Date"
        className="property-input"
      />
    </div>

    <div className="form-user-add-inner-wrap">
      <label>Possession Date</label>
      <input
        type="date"
        value={property.possesionDate}
        onChange={(e) => setProperty({ ...property, possesionDate: e.target.value })}
        placeholder="Possession Date"
        className="property-input"
      />
      </div>
      <div className="form-user-add-inner-wrap">
        <label>Realtors</label>
        <select name="realtorId" value={property.realtorId} onChange={handleChange}>
        {realtors?.map(role=> <option value={role.id}>{role.name}</option>)}
         
        </select>
      </div>
      <div className="form-user-add-inner-wrap">
        <label>Lawyers</label>
        <select name="lawyerId" value={property.lawyerId} onChange={handleChange}>
        {lawyers?.map(role=> <option value={role.id}>{role.name}</option>)}
         
        </select>
      </div>
    </div>
    <div className="form-user-add-inner-btm-btn-wrap">
    <button type="submit" >Add Property</button>
    <button onClick={onCancel} >Cancel</button>
    </div>
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
