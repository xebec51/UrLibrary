import { useState, useEffect, useCallback } from 'react';
// mengimpor hook untuk navigasi programmatik
import { useNavigate } from 'react-router-dom';
// mengimpor context autentikasi yang sudah dibuat
import { AuthContext } from './AuthContext';
// mengimpor fungsi-fungsi api untuk autentikasi dan user management
import {
    loginUser as apiLogin,
    registerUser as apiRegister,
    getUserProfile,
    updateUserProfile as apiUpdateProfile,
    toggleFavoriteBook as apiToggleFavorite
} from '../api/apiService';

// provider untuk menyediakan context autentikasi ke seluruh aplikasi
export function AuthProvider({ children }) {
    // state untuk menyimpan data user yang sedang login
    const [user, setUser] = useState(null);
    // state untuk menyimpan token autentikasi
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    // state untuk menandai apakah proses autentikasi sedang loading
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    // fungsi untuk mengatur token dan menyimpannya di localStorage
    const setAuthToken = (newToken) => {
        setToken(newToken);
        if (newToken) {
            localStorage.setItem('accessToken', newToken);
        } else {
            localStorage.removeItem('accessToken');
        }
    };

    // fungsi untuk logout user dan menghapus data autentikasi
    const logout = useCallback(() => {
        setAuthToken(null);
        setUser(null);
        navigate('/');
    }, [navigate]);
    
    // effect untuk mengecek sesi user saat aplikasi pertama dimuat
    useEffect(() => {
        const checkUserSession = async () => {
            if (token) {
                try {
                    // mencoba mendapatkan profil user dengan token yang ada
                    const profile = await getUserProfile(token);
                    setUser(profile);
                } catch (error) {
                    console.error("Gagal memvalidasi sesi:", error);
                    // jika token tidak valid, logout user
                    logout();
                }
            }
            setAuthLoading(false);
        };
        checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // fungsi untuk melakukan login user
    const login = async (credentials) => {
        try {
            const response = await apiLogin(credentials);
            setAuthToken(response.access_token);
            setUser(response.user);
            return true;
        } catch (error) {
            console.error("Gagal login:", error);
            logout();
            return false;
        }
    };

    // fungsi untuk melakukan registrasi user baru
    const register = async (newUser) => {
        try {
            await apiRegister(newUser);
            return true;
        } catch (error) {
            console.error("Gagal registrasi:", error);
            return false;
        }
    };
    
    // fungsi untuk mengupdate data profil user
    const updateUser = async (userData) => {
        if (!token) throw new Error("Tidak ada token untuk otentikasi");
        const updatedUser = await apiUpdateProfile(userData, token);
        setUser(updatedUser);
        return updatedUser;
    };

    // fungsi untuk refresh data user dari server
    const refreshUser = useCallback(async () => {
        if (!token) return;
        try {
            const profile = await getUserProfile(token);
            setUser(profile);
        } catch (error) {
            console.error("Gagal refresh user:", error);
            logout();
        }
    }, [token, logout]);

    // fungsi untuk menambah atau menghapus buku dari daftar favorit
    const toggleFavorite = async (bookId) => {
        if (!token || !user) return;
        
        // mengecek apakah buku sudah ada di favorit
        const isCurrentlyFavorite = user.favorites.includes(bookId);

        // membuat daftar favorit baru
        const newFavorites = isCurrentlyFavorite
            ? user.favorites.filter(id => id !== bookId)
            : [...user.favorites, bookId];

        // update state user secara optimistic
        setUser({ ...user, favorites: newFavorites });

        try {
            // kirim perubahan ke server
            await apiToggleFavorite(bookId, token);
            // refresh data user dari server untuk sinkronisasi
            await refreshUser(); 
        } catch (error) {
            console.error("Gagal toggle favorit:", error);
            // kembalikan state user jika gagal
            setUser(user);
            alert("Gagal memperbarui favorit. Coba lagi.");
        }
    };

    // nilai yang akan disediakan oleh context provider
    const value = {
        token, user, authLoading,
        login, logout, register,
        toggleFavorite, refreshUser,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {/* tampilkan children jika loading selesai, jika tidak tampilkan loading spinner */}
            {!authLoading ? children : <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>}
        </AuthContext.Provider>
    );
}
