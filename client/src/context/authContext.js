import { createContext, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('@Rentit:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading] = useState(false);

  const isAdmin = user?.email === process.env.REACT_APP_ADMIN_EMAIL;

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data.user;
    
    setUser(userData);
    sessionStorage.setItem('@Rentit:user', JSON.stringify(userData));
    
    return response.data; 
  };

const logout = async () => {
  try {
    await api.post('/auth/logout'); 
  } catch (err) {
    console.error("Logout error", err);
  } finally {
    setUser(null);
    sessionStorage.removeItem('@Rentit:user');
    
    localStorage.clear(); 
    
    window.location.href = '/login'; 
  }
};

  return (
    <AuthContext.Provider value={{ signed: !!user, user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}