// authContext.js

import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
// AuthProvider.js

const [auth, setAuth] = useState(
    localStorage.getItem('token') ? { token: localStorage.getItem('token') } : null
  );
  const [property, setProperty] = useState([]); 

  return (
    <AuthContext.Provider value={{ auth, setAuth,property,setProperty }}>
      {children} 
    </AuthContext.Provider>
  );
}