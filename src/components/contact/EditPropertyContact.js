import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import Places from "../Places";
import { toast } from "react-toastify";
import axios from "axios";

import Select from 'react-select';

import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AuthContext } from "../context/AuthContext";
import AddTask from "../AddTask";

const EditPropertyContactForm = () => {
const{id}=useParams()
console.log(id)
const{property}=useContext(AuthContext)
    const [editedProperty, setEditedProperty] = useState({ ...property });
    const [editingField, setEditingField] = useState("all");
    const [users,setUsers]=useState([])
    const [selectedRealtor, setSelectedRealtor] = useState(null);
    const [selectedLawyer, setSelectedLawyer] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [realtorOptions, setRealtorOptions] = useState([]);
    const [lawyerOptions, setLawyerOptions] = useState([]);
 const navigate=useNavigate()
   
   
  
 const colourStyles = {
  control: styles => ({ ...styles, border: 'unset',boxShadow:"unset",borderColor:"unset",minHeight:"0" }),
  input:styles=>({...styles,margin:"0px"}),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
   
    return {
      ...styles,
    
   
    };
  },

};
 const statusOptions = [
  { id: 1, name: "Active", color: "green" },
  { id: 2, name: "Foreclosures", color: "red" },
  { id: 3, name: "For Rent", color: "blue" },
  { id: 4, name: "For Sale", color: "purple" },
  { id: 5, name: "Lease", color: "orange" },
  { id: 6, name: "New Construction", color: "cyan" },
  { id: 7, name: "New Listing", color: "pink" },
  { id: 8, name: "Open House", color: "teal" },
  { id: 9, name: "Reduced Price", color: "indigo" },
  { id: 10, name: "Resale", color: "lime" },
  { id: 11, name: "Sold", color: "brown" },
  { id: 12, name: "Land", color: "gray" },
  { id: 13, name: "Owner Occupied", color: "olive" },
];
const getStatus=(id)=>{
  let option= statusOptions.find(x => x.id == id)
  return option.name
 }

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
    goBack()
        toast.success('Listing update  successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
     
      };
      useLayoutEffect(() => {
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

      const handleAddressChange = (newAddress) => {
        console.log(newAddress)
        setEditedProperty({ ...editedProperty, address: newAddress });
      };
       const getProperties = async () => {
        const response = await axios.get(`${url}api/property/contact/get/${id}`, { headers });

      console.log(id)// Replace with the specific id you want to filter by
       // const filtered = response.data.find(x => x.id == id)

      
    //     console.log(filtered);
    //   console.log(filtered)
      setEditedProperty(response.data[0])
      };
  
    const handleEditClick = (field) => {
      setEditingField(field);
    };

    const editAll=()=>{
        setEditingField('all');
    }
  
    const handleSaveClick = () => {
     onSave(editedProperty);
      

    };

  
    const handleCancelClick = () => {
  
      setEditingField(null);

    };
    useEffect(() => {
      // Fetch Realtor and Lawyer options and populate the select inputs
      const lawyers = users.filter((user) => user.roleId === 3);
      const realtors = users.filter((user) => user.roleId === 4);
  
      // Map the users into an array of options with 'label' and 'value' properties
      const realtorOptions = realtors.map((realtor) => ({
        value: realtor.id,
        label: realtor.name,
      }));
  
      const lawyerOptions = lawyers.map((lawyer) => ({
        value: lawyer.id,
        label: lawyer.name,
      }));
  
      setRealtorOptions(realtorOptions);
      setLawyerOptions(lawyerOptions);
    }, [users]);
  
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


          
    const goBack = () => {
      navigate(-1); // This function takes you back one step in the navigation stack
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      if(name=='realtorId'){
        // setEditedProperty({ ...editedProperty,  });
      }
      setEditedProperty({ ...editedProperty, [name]: value });
    };
    console.log(editedProperty?.subjectRemovalDate)
  
    return (
      <div className="form-user-add">
               
      <div >
        <div className="property_header">

            <h3> <button className="back-only-btn" onClick={goBack}> <img src="/back.svg" /></button> Property:-{editedProperty?.mls_no}</h3>

            <div className="top-bar-action-btns">
                <button   style={{background:"#A77520"}}  onClick={editAll}>Edit</button>
                <button   style={{background:"#A77520"}}  onClick={handleCancelClick}>Cancel</button>
            </div>

        </div>

 
      </div>
      <div className="form-user-edit-inner-wrap form-user-add-wrapper">
  
      
        <div className="form-user-add-inner-wrap">
          <label>MLS No</label>
          {editingField === "mls_no" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="mls_no"
                value={editedProperty?.mls_no}
                onChange={handleChange}
                placeholder="MLS No"
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {editedProperty?.mls_no}
               <FontAwesomeIcon icon={faPencil}  onClick={() => handleEditClick("mls_no")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Property Type</label>
          {editingField === "propertyType" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="propertyType"
                value={editedProperty?.propertyType}
                onChange={handleChange}
                placeholder="Property Type"
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {editedProperty?.propertyType}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("propertyType")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Price</label>
          {editingField === "price" || editingField === "all" ?  (
          <div className="edit-new-input">

              <input
                name="price"
                value={editedProperty?.price}
                onChange={handleChange}
                placeholder="Price"
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {editedProperty?.price}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("price")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Square Feet</label>
          {editingField === "squareFeet" || editingField === "all" ?  (
          <div className="edit-new-input">

              <input
                name="squareFeet"
                defaultValue={editedProperty?.squareFeet}
                onChange={handleChange}
                placeholder="Square Feet"
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {editedProperty?.squareFeet}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("squareFeet")} />
            </div>
          )}
        </div>
        <Places value={editedProperty?.address} onChange={handleAddressChange} /> 
   
  
        <div className="form-user-add-inner-wrap">
          <label>Contract Date</label>
          {editingField === "contractDate" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="contractDate"
                type="date"
                defaultValue={formatDate(editedProperty?.contractDate)}
                onChange={handleChange}
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {formatDate(editedProperty?.contractDate)}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("contractDate")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Subject Removal Date</label>
          {editingField === "subjectRemovalDate" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="subjectRemovalDate"
                type="date"
                defaultValue={formatDate(editedProperty?.subjectRemovalDate)}
                onChange={handleChange}
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {formatDate(editedProperty?.subjectRemovalDate)}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("subjectRemovalDate")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Completion Date</label>
          {editingField === "completionDate" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="completionDate"
                type="date"
                defaultValue={formatDate(editedProperty?.completionDate)}
                onChange={handleChange}
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {formatDate(editedProperty?.completionDate)}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("completionDate")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Possession Date</label>
          {editingField === "possesionDate" || editingField === "all" ? (
          <div className="edit-new-input">

              <input
                name="possesionDate"
                type="date"
                value={editedProperty?.possesionDate}
                onChange={handleChange}
              />
           
              
            </div>
          ) : (
          <div className="edit-new-input">

              {formatDate(editedProperty?.possesionDate)}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("possesionDate")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Owners</label>
          {editingField === "realtorId" || editingField === "all" ? (
          
                  <Select
            placeholder="Select Owner..."
            value={selectedRealtor}
            onChange={(selectedOption) => 
                {
                    setEditedProperty({ ...editedProperty, realtorId: selectedOption.value })
                    setSelectedRealtor(selectedOption)}}
            options={realtorOptions}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            className="select-new"
            
          />
           
         
            
           
              
         
          ) : (
          <div className="edit-new-input">

              {editedProperty?.realtor?.name}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("realtorId")} />
            </div>
          )}
        </div>
  
        <div className="form-user-add-inner-wrap">
          <label>Lawyers</label>
          {editingField === "lawyerId" || editingField === "all" ? (
        
               <Select
            placeholder="Select Lawyer..."
            value={selectedLawyer}
            onChange={(selectedOption) =>
                {
                  setEditedProperty({ ...editedProperty, lawyerId: selectedOption.value })
                     setSelectedLawyer(selectedOption)
                }}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            options={lawyerOptions}
            styles={colourStyles}
            className="select-new"
          />
           
              
     
          ) : (
          <div className="edit-new-input">

              {editedProperty?.lawyer?.name}
               <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("lawyerId")} />
            </div>
          )}
        </div>

        <div className="form-user-add-inner-wrap">
          <label>Status</label>
          {editingField === "status" || editingField === "all" ? (
        <Select
            placeholder="Select Status..."
            value={selectedStatus}
            onChange={(selectedOption) =>
                {
                    setEditedProperty({ ...editedProperty, status: selectedOption.value })
                     setSelectedStatus(selectedOption)
                }}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            options={statusOptions.map((option) => ({
              value: option.id,
              label: option.name,
              color: option.color,
            }))}
            styles={colourStyles}
            className="select-new"
          />)
          : (
            <div className="edit-new-input">
  
                {getStatus(editedProperty?.status?editedProperty.status:1)}
                 <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("status")} />
              </div>
            )}
          </div>
        <div className="notes-section">
        <div className="form-user-add-inner-wrap">
          <label>Description</label>
        
           
          <CKEditor
  editor={ClassicEditor}
  data={property.description} // Set the initial data from the API
  config={{
    toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
  }}
  className="custom-ckeditor" // Add a custom class for CKEditor container
  style={{ width: "100%", maxWidth: "800px", height: "200px" }}
  onChange={(event, editor) => {
    const data = editor.getData();
    setEditedProperty({ ...editedProperty, description: data });
  }}
/>

        
              
           
          
        </div>
        
        <div className="form-user-add-inner-wrap">
          <label>Notes</label>
          <CKEditor
  editor={ClassicEditor}
  data={property.notes} // Set the initial data from the API
  config={{
    toolbar: ["heading", "|", "bold", "italic", "link", "|", "bulletedList", "numberedList", "|", "undo", "redo"],
  }}
  className="custom-ckeditor" // Add a custom class for CKEditor container
  style={{ width: "100%", maxWidth: "800px", height: "200px" }}
  onChange={(event, editor) => {
    const data = editor.getData();
    setEditedProperty({ ...editedProperty, notes: data });
  }}
/>
        </div>
     </div>
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
      <button   style={{background:"#A77520"}}  onClick={()=>{
        navigate("/todo-list/add")
      }}>Create Task</button>
   <button   style={{background:"#A77520"}}  onClick={handleSaveClick}>Update</button>
   </div>
  
      </div>
    );
  };

  export default EditPropertyContactForm