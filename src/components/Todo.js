// src/components/Admin.js
import React, { useContext, useEffect, useState } from "react";
import "./admin.css";
import axios from "axios";
import Modal from "react-modal";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AuthContext } from "./context/AuthContext";
import Show from "./Show";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-confirm-alert/src/react-confirm-alert.css';

const TodoList = () => {

  const [tasks, setTasks] = useState([]); // Replace 'users' with 'tasks'
  const [width, setWidth] = useState(window.innerWidth);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [editingTask, setEditingTask] = useState(null); // Replace 'editingUser' with 'editingTask'

  const navigate = useNavigate();
  const { auth,setAuth,todo,setTodo,tasklength,setTasklength } = useContext(AuthContext);
  console.log(auth);

  const headers = {
    Authorization: auth.token,
  };
  const formatDate = (dateTimeString) => {
    if (!dateTimeString) {
      return ""; // Handle cases where the date-time string is empty or undefined
    }
  
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const seconds = String(dateTime.getSeconds()).padStart(2, "0");
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  // Example usage:
 // Outputs: "2023-09-26 14:30:00"
  
  const url = process.env.REACT_APP_API_URL;
  // Rest of your code...


  const handleDeleteClick = (propertyId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this task?',
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
    await axios.delete(`${url}api/todo/delete/${propertyId}`, { headers });

    toast.success('Todo deleted successfully', { autoClose: 3000, position: toast.POSITION.TOP_RIGHT });
    setTasks(tasks.filter((p) => p.id !== propertyId));
  };
  const filteredContacts = tasks.filter((contact) => {
    const searchText = searchQuery.toLowerCase();
    return (
      contact?.Followup?.toLowerCase().includes(searchText) ||
      contact?.lastname?.toLowerCase().includes(searchText) ||
      formatDate(contact?.FollowupDate).toLowerCase().includes(searchText) ||
      contact?.Comments?.toLowerCase().includes(searchText) ||
 
      contact?.phone?.toLowerCase().includes(searchText) 
)

  });
  const contactsPerPage = 10; // Adjust the number of contacts per page as needed

  const contactsToDisplay = filteredContacts.slice(
    (currentPage - 1) * contactsPerPage,
    currentPage * contactsPerPage
  );
// Adjust the number of contacts per page as needed
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };








  useEffect(() => {
    getTasks(); // Replace 'getUsers' with 'getTasks'
    // Rest of your code...
  }, []);

  const changeStatus=async(status,id)=>{
    const response = await axios.put(`${url}api/todo/update/${id}`,
    {IsRead:status},
    { headers });
    console.log(response)
    getTasks()
    
  }
  const formatPhoneNumber = (phoneNumber) => {
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };
  const getTasks = async () => {
    try {
      const response = await axios.get(`${url}api/todo/get`, { headers });
    
      // Set the filtered contacts in the state
      setTasks(response.data);
      console.log(response.data)
    

    } catch (error) {
      localStorage.removeItem('token');
      setAuth(null);
      navigate('/');
    }

  };
  // Rest of your code...

  return (
    <div className="add_property_btn">
   

      

      <div className="inner-pages-top">
        <h3>To-Do List</h3>

        <div className="add_user_btn">
          <button onClick={() =>navigate("/todo-list/add")}>
            <img src="/plus.svg" />
           Create Task
          </button>
        </div>
        <div className="search-group">
          <input type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search here" />
          <img src="/search.svg" />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
           

<th>Task Title</th>
<th>Follow Up Date</th>	
<th>Phone</th>

<th>Contact</th>
{/* <th>Family Member</th> */}
<th>Owner</th>
<th>Active Agent</th>

              <th></th>
              {/* Include other fields as needed */}
            </tr>
          </thead>
          <tbody>
            {contactsToDisplay?.map((task) => (
              <>
             { !task.IsRead&&<tr key={task.id}>
                <td
                  className="property-link"
                  onClick={() => {
                    setTodo(task)
                    navigate(`/todo-list/edit/${task.id}`);
                  }}
                >
                  {task.Followup}
                </td>
              
              <td>
                {formatDate(task.FollowupDate)}
              </td>
        
              <td>
                {task.phone!=undefined?formatPhoneNumber(task.phone):""}
              </td>
              <td>
                {task.client?.firstname}
              </td>
            
              <td>
                {task.realtor?.name}
              </td>
              <td>
                {""}
              </td>
      
              <td>
              <button className="permissions"
                   onClick={()=>{
                    changeStatus(!task.IsRead,task.id)
                 setTasklength(tasklength-1)
                   }}
                   
                   > Mark as {task.IsRead ? "unread" : "read"}</button>
               </td>
             <td> <button className="permissions"
          onClick={()=>handleDeleteClick(task.id)}       >Delete</button></td> 
                {/* Render other fields as needed */}
              </tr>}
              </>
            ))}
          </tbody>
        </table>
      </div>
      { contactsToDisplay.length==0 && <p className="no-data">No data Found</p>}
    </div>
  );
};

export default TodoList;
