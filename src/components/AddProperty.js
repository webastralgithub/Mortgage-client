import React, { useState, useEffect, useContext } from "react";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import axios from "axios";

import Select from 'react-select';
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
const AddProperty = () => {

    const [selectedRealtor, setSelectedRealtor] = useState(null);
    const [selectedLawyer, setSelectedLawyer] = useState(null);
  
    const [realtorOptions, setRealtorOptions] = useState([]);
    const [lawyerOptions, setLawyerOptions] = useState([]);
  
    // Add state variables for validation errors
    const [mlsNoError, setMlsNoError] = useState("");
    const [propertyTypeError, setPropertyTypeError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [property, setProperty] = useState({
      mls_no: "",
      propertyType: "",
      price: 0,
      // ...other fields
    });

    const [users,setUsers]=useState([])
     const navigate=useNavigate()
    const { auth } = useContext(AuthContext);
    const headers = {
      Authorization: auth.token,
    };
    const url = process.env.REACT_APP_API_URL;
    useEffect(() => {
       
         getUsers()
       }, []);
     
     
       const getUsers = async () => {
         try {
          const res= await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
          setUsers(res.data)
          
         } catch (error) {
          
         }
       };
    const onAdd = async (property) => {
        try {
          // Make an HTTP POST request to create the property
          const response = await axios.post(`${url}api/property/create`, property, {
            headers,
          });
      
          // Check if the response indicates success (you might want to validate this based on your API's response format)
          if (response.status === 200) {
    
            toast.success(' Property added successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
            // Show a success message
           navigate("/property")
      
            // Fetch the updated list of properties
    
      
            // Close the modal (assuming closeModal is a function that does this)
    
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
  
 
  
    const colourStyles = {
      control: styles => ({ ...styles, border: 'unset',boxShadow:"unset",borderColor:"unset",minHeight:"0" }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
       
        return {
          ...styles,
        
       
        };
      },
    
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
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Validate the fields before submission
      if (validateForm()) {
        onAdd(property);
      }

    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      // Clear validation errors when the user makes changes
      clearErrors(name);
  
      setProperty({ ...property, [name]: value });
    };
  
    // Validate the form fields and set validation errors
    const validateForm = () => {
      let isValid = true;
  
      if (!property.mls_no) {
        setMlsNoError("MLS No is required");
        isValid = false;
      }
  
      if (!property.propertyType) {
        setPropertyTypeError("Type is required");
        isValid = false;
      }
  
      if (!property.price) {
        setPriceError("Price is required");
        isValid = false;
      }
  
      return isValid;
    };
  
    // Clear validation errors for the specified field
    const clearErrors = (fieldName) => {
      switch (fieldName) {
        case "mls_no":
          setMlsNoError("");
          break;
        case "propertyType":
          setPropertyTypeError("");
          break;
        case "price":
          setPriceError("");
          break;
        default:
          break;
      }
    };
  
  
    return (
  
  
  
  
  
  
  
  
      <form onSubmit={handleSubmit} className="form-user-add">
          <div className="property_header"><h3>Add Property</h3></div>
          <div className="form-user-add-wrapper">
        
          <div className="form-user-add-inner-wrap">
            <label>MLS No*</label>
            <img src="/icons-form/num.svg"/>
            <input
              type="text"
              name="mls_no"
              value={property.mls_no}
              onChange={handleChange}
              placeholder="MLS No"
              className="property-input"
            />
            <span className="error-message">{mlsNoError}</span>
          </div>
  
          <div className="form-user-add-inner-wrap">
         
            <label>Property Type*</label>
            <img src="/icons-form/Vector.svg"/>
  
            <input
              type="text"
              name="propertyType"
              value={property.propertyType}
              onChange={handleChange}
              placeholder="Property Type"
              className="property-input"
            />
            <div className="error-message">{propertyTypeError}</div>
          </div>
  
          <div className="form-user-add-inner-wrap">
            <label>Price*</label>
            <img src="/icons-form/$.svg"/>
            <input
              type="text"
              name="price"
              value={property.price}
              onChange={handleChange}
              placeholder="Price"
              className="property-input"
            />
            <span className="error-message">{priceError}</span>
          </div>
  
      <div className="form-user-add-inner-wrap">
        <label>Square Feet</label>
        <img src="/icons-form/Group-3.svg"/>
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
        <img src="/icons-form/num.svg"/>
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
  
        <img src="/icons-form/Group-3.svg"/>
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
        <img src="/icons-form/Group-3.svg"/>
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
        <img src="/icons-form/Group-3.svg"/>
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
        <img src="/icons-form/Group-3.svg"/>
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
          <img src="/icons-form/Group30055.svg"/>
          <Select
            placeholder="Select Realtor..."
            value={selectedRealtor}
            onChange={(selectedOption) => 
                {
                    setProperty({ ...property, realtorId: selectedOption.value })
                    setSelectedRealtor(selectedOption)}}
            options={realtorOptions}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            styles={colourStyles}
            className="select-new"
            
          />
  
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Lawyers</label>
          <img src="/icons-form/Group30056.svg"/>
          <Select
            placeholder="Select Lawyer..."
            value={selectedLawyer}
            onChange={(selectedOption) =>
                {
                    setProperty({ ...property, lawyerId: selectedOption.value })
                     setSelectedLawyer(selectedOption)
                }}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            options={lawyerOptions}
            styles={colourStyles}
            className="select-new"
          />
        </div>
      </div>
      <div className="form-user-add-inner-btm-btn-wrap">
     
      
      <button type="submit" ><img src="/add-new.svg"/>Add Property</button>
      </div>
    </form>
  
  
  
  
  
  
  
   
    );
  };
  export default AddProperty