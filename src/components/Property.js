import React, { useState, useEffect, useContext } from "react";
import "./admin.css"

import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";


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
  const [searchQuery, setSearchQuery] = useState("");

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
      backgroundColor: "#fff",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "64px",
      width: "60%",
      borderRadius:"24px",
    },
  };


  const addProperty = async (property) => {
    try {
      // Make an HTTP POST request to create the property
      const response = await axios.post(`${url}api/property/create`, property, {
        headers,
      });
  
      // Check if the response indicates success (you might want to validate this based on your API's response format)
      if (response.status === 200) {

        toast.success(' Property added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
        // Show a success message
       
  
        // Fetch the updated list of properties
        getProperties();
  
        // Close the modal (assuming closeModal is a function that does this)
        closeModal();
      } else {
        toast.error('Failed to add property. Please try again later.', { autoClose: 5000, position: toast.POSITION.TOP_RIGHT });
        // Handle the case where the server returned a non-successful status code
       
      }
    } catch (error) {
      // Handle any errors that occur during the HTTP request
      console.error('An error occurred while adding a property:', error);
  
      // Show an error message to the user
      toaster.push(
        <Message type="error" closable duration={5000}>
          An error occurred while adding the property. Please try again later.
        </Message>,
        { placement: 'topEnd' }
      );
    }
  };
  

  const updateProperty = async (updatedProperty) => {
    const response = await axios.put(
      `${url}api/property/update/${updatedProperty.id}`,
      updatedProperty,
      { headers }
    );

    toast.success('Property update  successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    getProperties()
  

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
          <EditPropertyForm property={editingProperty} onSave={updateProperty} users={users} onCancel={closeModal} />
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

       <input type="text"
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       placeholder="Search here"/>
       <img src="search.svg" />
      </div>
      </div>
      <div className="table-container">
        <table>
    {/* Inside the <thead> element */}
<thead>
  <tr>
    <th>MLS#</th>
    <th className="listing">Listing Status</th>
    <th>Property Type</th>
    <th className="price">Price</th>
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
        <td style={{cursor:"pointer",textDecoration: "underline",
        
    color: "#c59a4a",
}} onClick={() => openModal("edit", property)}>{property.mls_no}</td>
        <td className="listing"><button className="status-btn">Active</button></td>
        <td>{property.propertyType}</td>
        <td className="price">$ {property.price.toFixed(2)}</td>
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
        <div className="property_header"><h3>Add Property</h3></div>
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
   
    <button onClick={onCancel} > <img src="/cross-new.svg"/>Cancel</button>
    <button type="submit" ><img src="/add-new.svg"/>Add Property</button>
    </div>
  </form>







 
  );
};



// Import the Feather icon

const EditPropertyForm = ({ property, onSave, onCancel, users }) => {
  const [editedProperty, setEditedProperty] = useState({ ...property });
  const [editingField, setEditingField] = useState(null);

  const lawyers = users.filter((user) => user.roleId === 3);
  const realtors = users.filter((user) => user.roleId === 4);

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const handleSaveClick = () => {
   onSave(editedProperty);
    setEditingField(null);
    onCancel()
  };

  const handleCancelClick = () => {

    setEditingField(null);
    onCancel()
  };


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
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name=='realtorId'){
      // setEditedProperty({ ...editedProperty,  });
    }
    setEditedProperty({ ...editedProperty, [name]: value });
  };
  console.log(editedProperty.subjectRemovalDate)

  return (
    <>
    <div className="modal-header">
    <h3>Property:-{editedProperty.mls_no}</h3>
   <div className="close-button" onClick={onCancel}>
      <FontAwesomeIcon icon={faTimes} />
    </div>
    </div>
    <div className="form-user-edit-inner-wrap form-user-add-wrapper">

    
      <div className="form-user-add-inner-wrap">
        <label>MLS No</label>
        {editingField === "mls_no" ? (
          <div>
            <input
              name="mls_no"
              value={editedProperty.mls_no}
              onChange={handleChange}
              placeholder="MLS No"
            />
         
            
          </div>
        ) : (
          <div>
            {editedProperty.mls_no}
             <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("mls_no")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Property Type</label>
        {editingField === "propertyType" ? (
          <div>
            <input
              name="propertyType"
              value={editedProperty.propertyType}
              onChange={handleChange}
              placeholder="Property Type"
            />
         
            
          </div>
        ) : (
          <div>
            {editedProperty.propertyType}
             <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("propertyType")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Price</label>
        {editingField === "price" ? (
          <div>
            <input
              name="price"
              value={editedProperty.price}
              onChange={handleChange}
              placeholder="Price"
            />
         
            
          </div>
        ) : (
          <div>
            {editedProperty.price}
             <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("price")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Square Feet</label>
        {editingField === "squareFeet" ? (
          <div>
            <input
              name="squareFeet"
              defaultValue={editedProperty.squareFeet}
              onChange={handleChange}
              placeholder="Square Feet"
            />
         
            
          </div>
        ) : (
          <div>
            {editedProperty.squareFeet}
             <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("squareFeet")} />
          </div>
        )}
      </div>

 

      <div className="form-user-add-inner-wrap">
        <label>Contract Date</label>
        {editingField === "contractDate" ? (
          <div>
            <input
              name="contractDate"
              type="date"
              defaultValue={formatDate(editedProperty.contractDate)}
              onChange={handleChange}
            />
         
            
          </div>
        ) : (
          <div>
            {formatDate(editedProperty.contractDate)}
             <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("contractDate")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Subject Removal Date</label>
        {editingField === "subjectRemovalDate" ? (
          <div>
            <input
              name="subjectRemovalDate"
              type="date"
              defaultValue={formatDate(editedProperty.subjectRemovalDate)}
              onChange={handleChange}
            />
         
            
          </div>
        ) : (
          <div>
            {formatDate(editedProperty.subjectRemovalDate)}
             <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("subjectRemovalDate")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Completion Date</label>
        {editingField === "completionDate" ? (
          <div>
            <input
              name="completionDate"
              type="date"
              defaultValue={formatDate(editedProperty.completionDate)}
              onChange={handleChange}
            />
         
            
          </div>
        ) : (
          <div>
            {formatDate(editedProperty.completionDate)}
             <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("completionDate")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Possession Date</label>
        {editingField === "possesionDate" ? (
          <div>
            <input
              name="possesionDate"
              type="date"
              value={editedProperty.possesionDate}
              onChange={handleChange}
            />
         
            
          </div>
        ) : (
          <div>
            {formatDate(editedProperty.possesionDate)}
            <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("possesionDate")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Realtors</label>
        {editingField === "realtorId" ? (
          <div>
            <select
              name="realtorId"
              value={editedProperty.realtorId}
              onChange={handleChange}
            >
       
              {realtors?.map((role) => (
                <option value={role.id} key={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
         
            
          </div>
        ) : (
          <div>
            {editedProperty?.realtor?.name}
             <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("realtorId")} />
          </div>
        )}
      </div>

      <div className="form-user-add-inner-wrap">
        <label>Lawyers</label>
        {editingField === "lawyerId" ? (
          <div>
            <select
              name="lawyerId"
              value={editedProperty.lawyerId}
              onChange={handleChange}
            >
              {lawyers?.map((role) => (
                <option value={role.id} key={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
         
            
          </div>
        ) : (
          <div>
            {editedProperty?.lawyer?.name}
             <FontAwesomeIcon icon={faEdit} onClick={() => handleEditClick("lawyerId")} />
          </div>
        )}
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
      <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
    <button  className="save-btn"  onClick={handleSaveClick}>Update</button>
    </div>
    </div>
    </>
  );
};







export default Property;
