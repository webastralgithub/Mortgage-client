import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import { faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import InputMask from "react-input-mask";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Places from "./Places";

const EditContact = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  const headers = {
    Authorization: auth.token,
  };

  const [editedContact, setEditedContact] = useState({});
  const [realtorOptions, setRealtorOptions] = useState([]);
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [firstError, setFirstError] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editingField, setEditingField] = useState('all');
  const noSelectionOption = { value: null, label: 'No Selection' };
  const handleChange = (e) => {
    const { name, value } = e.target;
    clearErrors(name)
    setEditedContact({ ...editedContact, [name]: value });
  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6,10)}`;
  };
  const handleAddressChange = (newAddress) => {
    console.log("Dfdffdfdfd",newAddress)
    setEditedContact({ ...editedContact, address1: newAddress });
  };

  const colourStyles = {
    control: (styles) => ({ ...styles, border: "unset", boxShadow: "unset", borderColor: "unset", minHeight: "0" }),
    input: (styles) => ({ ...styles, margin: "0px" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
      };
    },
  };
  const validateForm = () => {
    let isValid = true;
  
    if (!editedContact.firstname) {
      setFirstError("First Name is required");
      isValid = false;
    }
  
  
  
    return isValid;
  };
  
  
  const clearErrors = (fieldName) => {
    switch (fieldName) {
      case "firstname":
        setFirstError("");
        break;
  
      default:
        break;
    }
  };
  useEffect(() => {
    getContactDetails();
    getRealtorOptions();
  }, [id]);

  const getContactDetails = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/get/${id}`, {
        headers,
      });
      const contactDetails = response.data;
      setEditedContact(contactDetails);
      if(contactDetails.realtor){
        setSelectedRealtor({
          value: contactDetails.realtor.id,
          label: contactDetails.realtor.name,
        })
      }
      if(contactDetails.activeAgent){
        setSelectedAgent({
          value: contactDetails.activeAgent.id,
          label: contactDetails.activeAgent.name,
        })
      }




    } catch (error) {
      console.error("Error fetching contact details: ", error);
    }
  };

  const getRealtorOptions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
      const realtorOptions = res.data
        .filter((user) => user.roleId === 4)
        .map((realtor) => ({
          value: realtor.id,
          label: realtor.name,
        }));
      setRealtorOptions([noSelectionOption,...realtorOptions]);
    } catch (error) {
      console.error("Error fetching realtors: ", error);
    }
  };

  const handleSaveClick = async () => {
    if(validateForm()){
    try {
      const response = await axios.put(`${url}api/contacts/update/${id}`, editedContact, {
        headers,
      });

      if (response.status === 200) {
        toast.success("Contact updated successfully", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setEditingField(null);
        goBack()
      } else {
        console.error("Failed to update contact");
      }
    } catch (error) {
      console.error("An error occurred while updating the contact:", error);
    }
  }
  };

  const handlePhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");
console.log(rawPhoneNumber.slice(0,10),"fsffsf")
    // Update the phone number state with the raw input
    setEditedContact({ ...editedContact,phone: rawPhoneNumber.slice(1,11) });
  };

  const goBack = () => {
    navigate(`/contacts`);
  };

  return (
    <div className="form-user-add">
      <div>
        <div className="property_header">
          <h3>
            {" "}
            <button className="back-only-btn" onClick={goBack}>
              {" "}
              <img src="/back.svg" />
            </button>{" "}
            Edit Contact
          </h3>
          <div className="top-bar-action-btns">
          <button style={{ background: "#A77520" }} onClick={handleSaveClick}>
            Update 
          </button>
          </div>
        </div>
      </div>
      <div className="form-user-edit-inner-wrap form-user-add-wrapper">
        <div className="form-user-add-inner-wrap">
          <label>First Name</label>
          {editingField === "firstname" || editingField === "all" ? (
            <div className="edit-new-input">
              <input name="firstname" value={editedContact.firstname} onChange={handleChange} placeholder="First Name" />
              <span className="error-message">{firstError}</span>
            </div>
          ) : (
            <div className="edit-new-input">
              {editedContact.firstname}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("firstname")} />
            </div>
          )}
        </div>

        <div className="form-user-add-inner-wrap">
          <label>Last Name</label>
          {editingField === "lastname" || editingField === "all" ? (
            <div className="edit-new-input">
              <input name="lastname" value={editedContact.lastname} onChange={handleChange} placeholder="Last Name" />
            </div>
          ) : (
            <div className="edit-new-input">
              {editedContact.lastname}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("lastname")} />
            </div>
          )}
        </div>

        <div className="form-user-add-inner-wrap">
          <label>Phone</label>
          {editingField === "phone" || editingField === "all" ? (
            <div className="edit-new-input">
              <InputMask
                mask="+1 (999) 999-9999"
                type="text"
                name="phone"
                value={editedContact.phone}
                onChange={handlePhoneNumberChange}
                placeholder="+1 (___) ___-____"
              />
            </div>
          ) : (
            <div className="edit-new-input">
              {editedContact.phone != undefined ? formatPhoneNumber(editedContact.phone) : ""}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("phone")} />
            </div>
          )}
        </div>

        <div className="form-user-add-inner-wrap">
  <label>Email</label>
  {editingField === "email" || editingField === "all" ? (
    <div className="edit-new-input">
      <input
        name="email"
        value={editedContact.email}
        onChange={handleChange}
        placeholder="Email"
      />
    </div>
  ) : (
    <div className="edit-new-input">
      {editedContact.email}
      <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("email")} />
    </div>
  )}
</div>
    

   
       <Places value={editedContact.address1} onChange={handleAddressChange} /> 
 
       <div className="form-user-add-inner-wrap">
         
         </div>

        <div className="form-user-add-inner-wrap">
          <label>Owner</label>
          {editingField === "realtorId" || editingField === "all" ? (
            <Select
              placeholder="Select Owner..."
              value={selectedRealtor}
              onChange={(selectedOption) => {
                console.log(selectedOption)
                setEditedContact({ ...editedContact, realtorId: selectedOption.value });
                setSelectedRealtor(selectedOption);
              }}
              options={realtorOptions}
              components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
              styles={colourStyles}
              className="select-new"
            />
          ) : (
            <div className="edit-new-input">
              {selectedRealtor?.label}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("realtorId")} />
            </div>
          )}
        </div>
        <div className="form-user-add-inner-wrap">
          <label>Active Agent</label>
          {editingField === "agentId" || editingField === "all" ? (
            <Select
              placeholder="Select Active Agent..."
              value={selectedAgent}
              onChange={(selectedOption) => {
                setEditedContact({ ...editedContact, agentId: selectedOption.value });
                setSelectedAgent(selectedOption);
              }}
              options={realtorOptions}
              components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
              styles={colourStyles}
              className="select-new"
            />
          ) : (
            <div className="edit-new-input">
              {selectedAgent?.label}
              <FontAwesomeIcon icon={faPencil} onClick={() => handleEditClick("agentId")} />
            </div>
          )}
        </div>

        <div className="form-user-add-inner-btm-btn-wrap">
          <button style={{ background: "#A77520" }} onClick={handleSaveClick}>
            Update 
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContact;
