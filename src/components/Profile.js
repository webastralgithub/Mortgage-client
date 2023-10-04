import React, { useState, useLayoutEffect,useRef, useContext} from "react";



import axios from "axios";



import { AuthContext } from "./context/AuthContext";
import Modal from "react-modal";
import InputMask from 'react-input-mask';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const INITIAL_STATE = {
  
  username: "",
  email: "",
  name:'',
  phone:"",
  image:""
};


const AddRoleForm = ({ onAdd, onCancel }) => {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ newPassword });


  };
  console.log(newPassword)

  return (

    <div className="modal-roles-add">
    <form onSubmit={handleSubmit}>
      <input
      type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
      />
      <button type="submit">Change Password</button>
      <button onClick={onCancel}>Cancel</button>
    </form>
    </div>
  );
};
export default function Profile(props) {
  const [user, setUser] = useState(INITIAL_STATE);
 
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const[show,setShow]=useState(false)
  const[msg,setMsg]=useState('')
  const [previewImage, setPreviewImage] = useState('');
  const navigate=useNavigate()
  const { auth} = useContext(AuthContext)
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;
  const fileInputRef = useRef(null); 

  useLayoutEffect(() => {
    (async () => {
      try {
        const user = await 
          axios.get(`${url}api/admin/get-current-user`,{ headers })
     let userData=user.data
     console.log(userData)
     setPreviewImage(userData.profileImg?userData.profileImg:"/placeholder@2x.png")
        setUser({
          id:userData.id,
            username:userData.username,
            name:userData.name,
          email:userData.email,
          phone:userData.phone,
          profileImg:userData.profileImg?user.profileImg:"/placeholder@2x.png"
        }
          );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleClose = () => 
  {
    setShow(false);
  }
  const handlePhoneNumberChange = (event) => {
    // Extract the raw phone number from the input
    const rawPhoneNumber = event.target.value.replace(/\D/g, "");

    // Update the phone number state with the raw input
    setUser({ ...user,phone: rawPhoneNumber.slice(1,11) });
  };
  const handleEmailChange = (event) => {
    // Extract the raw phone number from the input
  console.log("here",event.target.value)

    // Update the phone number state with the raw input
    setUser({ ...user,email: event.target.value  });
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#000",
      border:"1px solid #fff",
    },
    overlay:{
      backgroundColor: "rgb(0 0 0 / 75%)",
    }
  };
  const handleInput = async(e) => {
    console.log(e)
    if (e.target.name === 'image') {
      // Handle image file upload

      const formData = new FormData();

      const imageFile = e.target.files[0];
      formData.append(`images`, imageFile)
    
      const response = await fetch(`${url}api/upload-images`, {
        method: 'POST', // Use POST for file uploads
      headers,
      body: formData,
    });
    if (response.ok) {
      const responseData = await response.json(); // Parse the JSON response
      const uploadedImageUrls = responseData.imageUrls
      setPreviewImage(uploadedImageUrls[0]);

      // Display a preview of the image
      setUser({ ...user,profileImg: uploadedImageUrls[0] }); // Store the image file in the user state
    }
    } else {
      // Handle other input fields
      console.log(e.target.name)
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };


  const addRole = async (role) => {
    console.log(role)
   const response = await axios.put(`${url}api/admin/admin/change-password/${user.id}`, role,{headers});

   if (response.status === 200) {
    
    toast.success(' Password changed successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
   // getRoles()
   }
    closeModal();
  };

  const openModal = (mode, role) => {
    setModalMode(mode);
 
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalMode("");
 
    setIsOpen(false);
  };



  const handleUploadButtonClick = () => {
    // Trigger the file input when the label is clicked
    fileInputRef.current.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
//       var form_data = new FormData();
// for ( var key in user ) {
//     form_data.append(key, user[key]);
// }

      const response = await axios.put(`${url}api/admin/admin/change-realtor/${user.id}`,user,headers);
      setMsg(response.data.message)
      navigate("/")
      toast.success("User data updated successfully", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="add_property_btn">
    <div className="inner-pages-top">

    <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
           {modalMode === "add" && (
          <AddRoleForm onAdd={addRole} onCancel={closeModal} />
        )}

    
      </Modal>
       <h3>My profile</h3>
    </div>
    {msg.length>0 &&<p style={{color:"red"}}>{msg}</p>}
      <form onSubmit={handleSubmit} className="profile-page-form">

        <div className="profilepg-top-from-cnt">
            <div className="profile-bg">
               {/* <img src="/cover.png" /> */}
               {/* <button>Edit cover</button> */}
            </div>

           
            <div className="profile-cntnt-blck">
                <div className="img-display-blck">
                {previewImage ? (
            <img className="profile-img" src={previewImage} alt="User Preview" />
          ) : (
            <img className="profile-img" src={user.profileImg} alt="User Placeholder" />
          )}
                    <div className="user-image">
    
          <label  onClick={handleUploadButtonClick}>
            <img src="/change.svg" alt="Change Image" />
          </label>
          <div style={{ display: 'none' }}>
            <input ref={fileInputRef} name="image"  type="file" onChange={handleInput} />
          </div>
        </div>
                </div>
                <div className="admin-name-pg"><p>Hello, <span>{user.username}</span></p></div>
              
            </div>

           
        </div>

        <div className="profilepg-btm-from-cnt">

        <div className="form-devider">

            <div className="input-feilds">
            <label>Name
                <input
                name="name"
                type="text"
                defaultValue={user.name}
                placeholder={"Name"}
                onChange={handleInput}
                />
                </label>
                <label>Email
                <input
                name="email"
                type="email"
                defaultValue={user.email}
                placeholder={"Your email"}
                onChange={handleEmailChange}
                /> </label>
            
            <label>Phone Number
               
               <InputMask
           mask="+1 (999) 999-9999"
           type="text"
           name="phone"
           value={user.phone}
           onChange={handlePhoneNumberChange}
           placeholder="+1 (___) ___-____"
   
         />
             </label>
            <label><button onClick={(e)=>{
            e.preventDefault()
            openModal("add")
            }}> Change Password</button></label>
            
            <Modal className='login-modal' show={show}

        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button style={{border:"none",background:"transparent"}} onClick={handleClose} ><img className='img-fluid' src="/images/cross.png"/></button> 

        </div>

        </Modal>
            
                </div>
        </div>

                <div style={{textAlign:'end'}} className="custom_profile_btn">
                <button className="btn-save" type="submit">Update</button>
                </div>
        </div>
      </form>
    </div>
  );
}

