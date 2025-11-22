// Admin authentication service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const adminLogout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
};

export const checkAdminAuth = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    return false;
  }

  return response.json();
};