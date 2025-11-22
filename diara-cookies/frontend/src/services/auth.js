// User authentication service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // Cek apakah response berisi JSON sebelum mencoba parse
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Login failed';

    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } else {
      // Jika bukan JSON, mungkin server mengembalikan HTML atau tidak ditemukan
      errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

export const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
};

export const checkAuth = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    return false;
  }

  return response.json();
};