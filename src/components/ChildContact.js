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
import { useNavigate, useParams, useRouter } from "react-router-dom";

const ChildContact = () => {
    const {id}=useParams()
    const parentNameNew=localStorage.getItem("parent")
  const [contacts, setContacts] = useState([]);
  const[parentid,setParentId]=useState()
  const navigate=useNavigate();
  const[parentView,setParentView]=useState(true)
  const[parentName,setParentName]=useState(parentNameNew)
  const [newContact, setNewContact] = useState({
    firstname: "",
    lastname: "",
    birthDate: "",
    address1: "",
    address2: "",
    city: "",
    provinceName: "",
    source: "",
    phone: "",
    parentId: null,
    createdAt: "",
    updatedAt: "",
    realtorId: null,
    propertyId: null,
    children: [],
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalMode, setModalMode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState("contacts")
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);

  const [editingContact, setEditingContact] = useState(null);

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

  const getContacts = async () => {
    try {
        const response = await axios.get(`${url}api/contacts/get-children/${id}`, { headers });
console.log(response.data)
  
        // Set the filtered contacts in the state

     
   

      // Set the filtered contacts in the state
      setContacts(response.data);
    

    } catch (error) {
      localStorage.removeItem('token');
      setAuth(null);
      navigate('/');
    }


  };

  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };
  const contactsPerPage = 5; // Adjust the number of contacts per page as needed

  const contactsToDisplay = contacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
// Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(contacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const changeView=async(id,name)=>{
console.log(name)
const supernew=localStorage.getItem("parent")
localStorage.setItem("superParent",supernew)
localStorage.setItem("parent",name)

  setParentName(name)
  // setParentId(id)
  //   setParentView(true)
   navigate(`${id}`)

  setParentId(id)
    setParentView(true)
   
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
  // Rest of your component remains the same...

  return (
    <div className="add_property_btn">
        <div className="inner-pages-top">
      <h3>  {parentView&&<button className="back-only-btn" 
      onClick={()=>{
      navigate(-1)
      }}
      > <img src="/back.svg" /></button>} {`${parentName}`}</h3>
      <div className="add_user_btn">

     <button onClick={() =>navigate(`/contacts/add/${id}`)}>
        <img src="/plus.svg" />
   {`Family Member`}</button>
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
            </tr>
          </thead>
       
          
            {contacts.length>0 &&
              contactsToDisplay.map((contact) => (
                <tbody>
                <tr key={contact.id}>
                  <td className="property-link" onClick={() => navigate("/contact/edit/"+contact.id)}>{contact.firstname}{" "} {contact.lastname}</td>
               
                  <td>{formatPhoneNumber(contact.phone)}</td>
                  <td>{contact.email}</td>
                  <td>{contact.address1}</td>
       
                  <td>{contact.realtor?.name}</td>
           
                  <td>{contact.realtor?.name}</td>

                  
         
<td></td>
<td></td>
<td>
<button className="permissions"
          onClick={()=>{

            navigate("/todo-list/add")
          }}       >Create Task</button>
          </td>
                </tr>
                </tbody>
              ))}
     
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
      {contacts.length==0 && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default  ChildContact;
