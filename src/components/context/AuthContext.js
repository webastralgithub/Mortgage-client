// authContext.js

import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
// AuthProvider.js

const [auth, setAuth] = useState(
    localStorage.getItem('token') ? { token: localStorage.getItem('token') } : null
  );
  const [property, setProperty] = useState([ ]); 
  const [todo, setTodo] = useState({}); 
  const [tasklength,setTasklength]=useState(0)
  

  return (
    <AuthContext.Provider value={{ auth, setAuth,property,setProperty,todo,setTodo,tasklength,setTasklength }}>
      {children} 
    </AuthContext.Provider>
  );
}