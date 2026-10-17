import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from './authContexStore';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    try {
      const res = await axiosClient.get('/auth/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function register(payload) {
    const res = await axiosClient.post('/auth/register', payload);
    setUser(res.data.user);
    return res.data.user;
  }

  async function login(payload) {
    const res = await axiosClient.post('/auth/login', payload);
    setUser(res.data.user);
    return res.data.user;
  }

  async function logout() {
    await axiosClient.post('/auth/logout');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}