import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 
import { 
    loginUser as apiLogin, 
    registerUser as apiRegister,
    getUserProfile,
    toggleFavoriteBook as apiToggleFavorite 
} from '../api/apiService';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null); 
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
        if (token) {
            try {
                const profile = await getUserProfile();
                setUser(profile);
            } catch (error) {
                console.error("Token tidak valid, logout...", error);
                logout();
            }
        }
        setAuthLoading(false);
    };
    fetchUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const setAuthToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  };

  const login = async (credentials) => {
    try {
      const data = await apiLogin(credentials);
      setAuthToken(data.access_token);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };
  
  const register = async (newUser) => {
    try {
        await apiRegister(newUser);
        return true;
    } catch (error) {
        console.error("Registration failed:", error);
        return false;
    }
  };
  
  const toggleFavorite = async (bookId) => {
    if (!token) return;
    try {
        await apiToggleFavorite(bookId);
        const profile = await getUserProfile();
        setUser(profile);
    } catch (error) {
        console.error("Failed to toggle favorite:", error);
    }
  };
  
  const value = {
    token, user, isAuthenticated: !!token, loading: authLoading,
    login, logout, register, toggleFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
}
