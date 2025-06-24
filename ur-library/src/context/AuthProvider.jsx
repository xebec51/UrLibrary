import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // <- Impor context dari file sebelah
import { 
  getCurrentUser, 
  loginUser as apiLogin, 
  logoutUser as apiLogout,
  registerUser as apiRegister,
  toggleFavoriteBook as apiToggleFavorite
} from '../api/users';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);
  
  const login = (credentials) => {
    const user = apiLogin(credentials);
    if (user) {
      setCurrentUser(user);
      navigate('/');
      return user;
    }
    return null;
  };
  
  const logout = () => {
    apiLogout();
    setCurrentUser(null);
    navigate('/');
  };

  const register = (newUser) => {
    return apiRegister(newUser);
  };
  
  const toggleFavorite = (bookId) => {
    if (!currentUser) return;
    apiToggleFavorite(currentUser.id, bookId);
    const updatedUser = getCurrentUser();
    setCurrentUser(updatedUser);
  };
  
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    logout,
    register,
    toggleFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}