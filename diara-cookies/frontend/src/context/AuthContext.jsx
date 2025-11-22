import React, { createContext, useContext, useState } from 'react';
import { login as userLoginApi, register as registerApi } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek apakah user sudah login dari localStorage saat aplikasi dimulai
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Coba login ke backend - ini akan menangani otentikasi admin atau user biasa
      // berdasarkan data yang dikembalikan oleh backend
      const loginResult = await userLoginApi(email, password);

      // Simpan data user ke localStorage
      if (loginResult && loginResult.user) {
        const userData = {
          id: loginResult.user.id,
          email: loginResult.user.email,
          name: loginResult.user.name || email.split('@')[0],
          role: loginResult.user.role || 'customer'
        };

        localStorage.setItem('token', 'jwt-token-present'); // Placeholder, cookie akan menanganinya
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);

        return { success: true, user: userData };
      } else {
        throw new Error('Login response does not contain user data');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    // Registrasi hanya untuk user biasa, bukan admin
    try {
      const registerResult = await registerApi(name, email, password);

      if (registerResult && registerResult.user) {
        const userData = {
          id: registerResult.user.id,
          email: registerResult.user.email,
          name: registerResult.user.name,
          role: 'customer'
        };

        localStorage.setItem('token', 'jwt-token-present'); // Placeholder
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);

        return { success: true, user: userData };
      } else {
        throw new Error('Registration response does not contain user data');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};