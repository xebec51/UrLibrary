import { createContext, useState, useEffect, useContext } from 'react';
import { 
  getCurrentUser, 
  loginUser as apiLogin, 
  logoutUser as apiLogout,
  registerUser as apiRegister,
  toggleFavoriteBook as apiToggleFavorite // <- Impor fungsi favorit
} from '../api/users';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
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
  
  // Fungsi baru untuk toggle favorit melalui context
  const toggleFavorite = (bookId) => {
    if (!currentUser) return;
    
    // Panggil API untuk update data
    apiToggleFavorite(currentUser.id, bookId);
    
    // Ambil data terbaru dari localStorage (yang sudah diupdate oleh API)
    // dan update state global
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
    toggleFavorite // <- Sediakan fungsi ini untuk komponen lain
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};