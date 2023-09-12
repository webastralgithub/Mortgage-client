import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import axios from "axios";

import Select from 'react-select';
import { AuthContext } from "./context/AuthContext";







const EditPropertyForm = () => {

const{property}=useContext(AuthContext)
    const [editedProperty, setEditedProperty] = useState({ ...property });
    const [editingField, setEditingField] = useState(null);
    const [users,setUsers]=useState([])
  
    const lawyers = users.filter((user) => user.roleId === 3);
    const realtors = users.filter((user) => user.roleId === 4);
 

    const { auth } = useContext(AuthContext);
 
      const url = process.env.REACT_APP_API_URL;
    const headers = {
      Authorization: auth.token,
    };



    const  onSave = async (updatedProperty) => {
        const response = await axios.put(
          `${url}api/property/update/${updatedProperty.id}`,
          updatedProperty,
          { headers }
        );
    
        toast.success('Property update  successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
     
      
    
      };
  
    const handleEditClick = (field) => {
      setEditingField(field);
    };
  
    const handleSaveClick = () => {
     onSave(editedProperty);
      

    };
  
    const handleCancelClick = () => {
  
      setEditingField(null);

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
      <div className="form-user-add">
      <div >
        <div className="property_header">

                  <h3>Property:-{editedProperty.mls_no}</h3>
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
               <FontAwesomeIcon icon={faPencil}  onClick={() => handleEditClick("mls_no")} />
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
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("propertyType")} />
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
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("price")} />
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
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("squareFeet")} />
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
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("contractDate")} />
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
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("subjectRemovalDate")} />
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
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("completionDate")} />
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
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("possesionDate")} />
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
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("realtorId")} />
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
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("lawyerId")} />
            </div>
          )}
        </div>
     
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
   
   <button   style={{background:"#A77520"}}  onClick={handleSaveClick}>Update</button>
   </div>
      </div>
    );
  };

  export default EditPropertyForm