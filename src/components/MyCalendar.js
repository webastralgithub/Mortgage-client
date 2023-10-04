
import React, { useState, useContext, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import '@fullcalendar/common/main.css';

import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';








const MyCalendar = () => {
  const [view, setView] = useState('month');
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { auth, setAuth, todo, setTodo, tasklength, setTasklength } = useContext(
    AuthContext
  );
  const headers = {
    Authorization: auth.token,
  };
  const handleDateClick = (selected) => {
    // handle date selection
  } 
  
  const eventClick = (selected) => {
    console.log(selected.event,"FAEfddf")
   const newtask= tasks.find((option) => option.id === selected.event.id)
    setTodo(newtask)
    navigate(`/todo-list/edit/${selected.event.id}`)
  }
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await axios.get(`${url}api/todo/get`, { headers });

      // Set the filtered tasks in the state
      setTasks(response.data);
      console.log(response.data);

      const eventsdata = response.data.map((item) => ({
        id:item.id,
        title: item.Followup, // Use the desired property as the event title
        start: new Date(item.FollowupDate), // Convert the date string to a Date object
        // end: new Date(item.FollowupDate), // You can adjust the end date if needed
        // Add more event properties as needed
      }));
      setEvents(eventsdata);
    } catch (error) {
      localStorage.removeItem('token');
      setAuth(null);
      navigate('/');
    }
  };

  const handleChangeView = (newView) => {
    setView(newView);
  };

  const buttonText = {
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
  };
  for (const key in buttonText) {
    if (buttonText.hasOwnProperty(key)) {
      buttonText[key] = buttonText[key].charAt(0).toUpperCase() + buttonText[key].slice(1);
    }
  }

  return (
    <div className='add_property_btn'>
      <div>
        {/* <button onClick={() => handleChangeView('day')}>Day</button>
        <button onClick={() => handleChangeView('week')}>Week</button>
        <button onClick={() => handleChangeView('month')}>Month</button> */}
        {/* <button onClick={() => handleChangeView('year')}>Year</button> */}
        {/* Add a Year view button if needed */}
      </div>
      <FullCalendar 
      initialView="dayGridMonth"
     
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      }}
      buttonText={buttonText} 
      dayHeaders={true}
      plugins={[ dayGridPlugin, interactionPlugin ]}
      events={events}
      dateClick={handleDateClick}
      eventClick={eventClick}
  
    />
    </div>
  );
};

export default MyCalendar;
