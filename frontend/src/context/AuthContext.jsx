import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('buildguard_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null; // Show public landing page by default
  });

  const [activeProject, setActiveProject] = useState({
    id: '65f000000000000000000010',
    projectName: 'Greenwood Villa B-4',
    location: 'Sector 42, Gurgaon',
    areaSqft: 2400,
    budget: 145000,
    currentStage: 'Framing & Structure',
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('buildguard_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('buildguard_user');
      localStorage.removeItem('buildguard_token');
    }
  }, [user]);

  const loginAsHomeowner = () => {
    setUser({
      id: '65f000000000000000000002',
      name: 'Alice Homeowner',
      email: 'alice@homeowner.com',
      role: 'homeowner',
    });
  };

  const loginAsContractor = () => {
    setUser({
      id: '65f000000000000000000001',
      name: 'Bob Contractor',
      email: 'bob@apexbuilders.com',
      role: 'contractor',
    });
  };

  const switchRole = () => {
    if (!user || user.role === 'homeowner') {
      loginAsContractor();
    } else {
      loginAsHomeowner();
    }
  };

  const logout = () => {
    setUser(null);
  };

  const login = async (email, password) => {
    const res = await apiClient.login(email, password);
    if (res.success && res.data) {
      setUser(res.data.user);
      if (res.data.token) {
        localStorage.setItem('buildguard_token', res.data.token);
      }
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const signup = async (userData) => {
    const res = await apiClient.register(userData);
    if (res.success && res.data) {
      setUser(res.data.user);
      if (res.data.token) {
        localStorage.setItem('buildguard_token', res.data.token);
      }
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'public',
        activeProject,
        setActiveProject,
        loginAsHomeowner,
        loginAsContractor,
        switchRole,
        logout,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
