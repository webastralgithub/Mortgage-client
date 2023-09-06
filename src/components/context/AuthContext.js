// authContext.js

import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
// AuthProvider.js

const [auth, setAuth] = useState(
    localStorage.getItem('token') ? { token: localStorage.getItem('token') } : null
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children} 
    </AuthContext.Provider>
  );
}