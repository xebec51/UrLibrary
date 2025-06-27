import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {
    loginUser as apiLogin,
    registerUser as apiRegister,
    getUserProfile,
    updateUserProfile as apiUpdateProfile,
    toggleFavoriteBook as apiToggleFavorite
} from '../api/apiService';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    const setAuthToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('accessToken', newToken);
        } else {
            localStorage.removeItem('accessToken');
        }
    };

    const logout = useCallback(() => {
        setAuthToken(null);
        setUser(null);
        navigate('/');
    }, [navigate]);
    
    useEffect(() => {
        const checkUserSession = async () => {
            if (token) {
                try {
                    const profile = await getUserProfile(token);
                    setUser(profile);
                } catch (error) { // <-- Variabel 'error' sekarang digunakan
                    console.error("Gagal memvalidasi sesi:", error);
                    logout();
                }
            }
            setAuthLoading(false);
        };
        checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (credentials) => {
        try {
            const response = await apiLogin(credentials);
            setAuthToken(response.access_token);
            setUser(response.user);
            return true;
        } catch (error) { // <-- Variabel 'error' sekarang digunakan
            console.error("Gagal login:", error);
            logout();
            return false;
        }
    };

    const register = async (newUser) => {
        try {
            await apiRegister(newUser);
            return true;
        } catch (error) { // <-- Variabel 'error' sekarang digunakan
            console.error("Gagal registrasi:", error);
            return false;
        }
    };
    
    const updateUser = async (userData) => {
        if (!token) throw new Error("Tidak ada token untuk otentikasi");
        const updatedUser = await apiUpdateProfile(userData, token);
        setUser(updatedUser);
        return updatedUser;
    };

    const refreshUser = useCallback(async () => {
        if (!token) return;
        try {
            const profile = await getUserProfile(token);
            setUser(profile);
        } catch (error) { // <-- Variabel 'error' sekarang digunakan
            console.error("Gagal refresh user:", error);
            logout();
        }
    }, [token, logout]);

    const toggleFavorite = async (bookId) => {
        if (!token || !user) return;
        
        const isCurrentlyFavorite = user.favorites.includes(bookId);

        const newFavorites = isCurrentlyFavorite
            ? user.favorites.filter(id => id !== bookId)
            : [...user.favorites, bookId];

        setUser({ ...user, favorites: newFavorites });

        try {
            await apiToggleFavorite(bookId, token);
            await refreshUser(); 
        } catch (error) {
            console.error("Gagal toggle favorit:", error);
            setUser(user);
            alert("Gagal memperbarui favorit. Coba lagi.");
        }
    };

    const value = {
        token, user, authLoading,
        login, logout, register,
        toggleFavorite, refreshUser,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!authLoading ? children : <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>}
        </AuthContext.Provider>
    );
}