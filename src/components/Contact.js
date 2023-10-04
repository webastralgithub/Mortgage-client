import React, { useState, useEffect, useContext } from "react";
import Select from 'react-select';
import "./admin.css"

import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPencil, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Message, toaster } from "rsuite";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate, useRouter } from "react-router-dom";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const[parentid,setParentId]=useState()
  const navigate=useNavigate();
  const[parentView,setParentView]=useState(false)
  const[parentName,setParentName]=useState([])

  const [users, setUsers] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts")
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);



  const { auth, property, setProperty, setAuth } = useContext(AuthContext);
  const headers = {
    Authorization: auth.token,
  };
  const url = process.env.REACT_APP_API_URL;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };

  }, []);


    const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this contact?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDelete(propertyId),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const handleDelete = async (propertyId) => {
    await axios.delete(`${url}api/contacts/delete/${propertyId}`, { headers });

    toast.success('Contact deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setContacts(contacts.filter((p) => p.id !== propertyId));
  };

  useEffect(() => {
    getContacts();
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}api/admin/get-users`, { headers });
      setUsers(res.data);

    } catch (error) {

    }
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
  const filteredContacts = contacts.filter((contact) => {
    const searchText = searchQuery.toLowerCase();
    return (
      contact.firstname.toLowerCase().includes(searchText) ||
      contact.lastname.toLowerCase().includes(searchText) ||
      formatDate(contact.birthDate).toLowerCase().includes(searchText) ||
      contact.email.toLowerCase().includes(searchText) ||
      (contact.address1 + ' ' + contact.address2).toLowerCase().includes(searchText) ||
      contact.city.toLowerCase().includes(searchText) ||
      contact.provinceName.toLowerCase().includes(searchText) ||
      (contact.realtor?.name.toLowerCase().includes(searchText)) ||
      contact.source.toLowerCase().includes(searchText) ||
      contact.phone.toLowerCase().includes(searchText)
    );
  });

  const getContacts = async () => {
    try {
      const response = await axios.get(`${url}api/contacts/get`, { headers });
      const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null);
      const contactsWithoutParentIdandlead = contactsWithoutParentId.filter((contact) => contact.isLead === false);
      // Set the filtered contacts in the state
      setContacts(contactsWithoutParentIdandlead);
    

    } catch (error) {
      console.log(error)
      // localStorage.removeItem('token');
      // setAuth(null);
      // navigate('/');
    }

  };
  const contactsPerPage = 5; // Adjust the number of contacts per page as needed

  const contactsToDisplay = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
// Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const changeView=async(id,name)=>{

localStorage.setItem("parent",name)

  setParentName(name)
  // setParentId(id)
  //   setParentView(true)
   navigate(`${id}`)
    console.log(id)
    try {
        const response = await axios.get(`${url}api/contacts/get-children/${id}`, { headers });
        const contactsWithoutParentId = response.data.filter((contact) => contact.parentId === null);
  
        // Set the filtered contacts in the state
        setContacts(response.data);
      
  
      } catch (error) {
        // localStorage.removeItem('token');
        // setAuth(null);
        // navigate('/');
      }
  }
  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6,10)}`;
  };
  // Rest of your component remains the same...

  return (
    <div className="add_property_btn">
        <div className="inner-pages-top">
      <h3>  {parentView&&<button className="back-only-btn" 
      onClick={()=>{
        if (parentView) {
          getContacts();
          setParentView(false);
          setViewState("contacts"); // Change the view state to "contacts"
        }
      }}
      > <img src="/back.svg" /></button>} {parentView ?`${parentName} Family `:"Contacts"}</h3>
      <div className="add_user_btn">

     {parentView ? <button onClick={() =>navigate(`/contacts/add/${parentid}`)}>
        <img src="/plus.svg" />
   {`${parentName} Family Member`}</button>:
   
    <button onClick={() =>navigate("/contacts/add")}>
    <img src="/plus.svg" />
    Add Contact</button>
   }
      </div>
      <div className="search-group">

       <input type="text"
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       placeholder="Search here"/>
       <img src="/search.svg" />
      </div>
      </div>

      {/* Rest of your component remains the same... */}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
             <th>Email Id</th>
              <th>Address</th>
              
            <th>Owner</th>
            <th>Active Agent</th>
        
            
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          {contacts.length>0 &&
              contactsToDisplay.map((contact) => ( <tbody>
          
                <tr key={contact.id}>
                  <td className="property-link" onClick={() => navigate("/contact/edit/"+contact.id)}>{contact.firstname}{" "} {contact.lastname}</td>
                 
                  <td>{formatPhoneNumber(contact.phone)}</td>
                  <td>{contact.email}</td>
                  <td>{contact.address1}</td>
                 
            <td>{contact.realtor?.name}</td>
            <td>{contact.activeAgent?.name}</td>
          
             

                  <td> 
                    
                  <button className="permissions"
                    onClick={() => {changeView(Number(contact.id),contact.firstname)

                   }}> Family Members</button>
                     
          
          </td>
          <td>  <button className="permissions"
          onClick={()=>{
            localStorage.setItem("parent",contact.firstname)
            navigate(`/contacts/property/${contact.id}`)
          }}       > Properties</button>       </td>
<td>
<button className="permissions"
          onClick={()=>{

            navigate("/todo-list/add")
          }}       >Create Task</button>
          </td>
               
                <td> <button className="permissions"
          onClick={()=>handleDeleteClick(contact.id)}       >Delete</button></td> 
              </tr>
          </tbody> ))}
        </table>
        {totalPages > 1 && (
  <div className="pagination">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        className={currentPage === index + 1 ? 'active' : ''}
      >
        {index + 1}
      </button>
    ))}
  </div>
)}

      </div>
      { contactsToDisplay.length==0 && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default Contact;
