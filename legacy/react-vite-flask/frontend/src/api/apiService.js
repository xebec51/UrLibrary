const API_BASE_URL = 'http://127.0.0.1:5000/api';
export const BACKEND_URL = 'http://127.0.0.1:5000';

// Fungsi helper untuk mendapatkan token dari localStorage, ini adalah sumber kebenaran tunggal.
const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

// Fungsi helper generik yang telah disempurnakan
const apiRequest = async (endpoint, method, body = null) => {
    const headers = {}; // 1. Mulai dengan header kosong
    const token = getAuthToken();

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    // --- PERBAIKAN UTAMA DI SINI ---
    if (body) {
        // 2. Cek apakah body adalah FormData (untuk upload file)
        if (body instanceof FormData) {
            // Jika ya, JANGAN set 'Content-Type'. Browser akan melakukannya
            // secara otomatis dengan boundary yang benar.
            config.body = body;
        } else {
            // 3. Jika bukan FormData, maka itu adalah objek JSON biasa
            headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(body);
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        // Cek jika response tidak memiliki body (misal, 204 No Content)
        if (response.status === 204) {
            return null;
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.error || data?.msg || 'Terjadi kesalahan pada server');
        }
        return data;
    } catch (error) {
        console.error(`[API Error] ${method} ${endpoint}:`, error);
        throw error;
    }
};

// --- Fungsi API (Definisi tidak perlu diubah, karena apiRequest sudah fleksibel) ---

// AUTH
export const loginUser = (credentials) => apiRequest('/auth/login', 'POST', credentials);
export const registerUser = (userData) => apiRequest('/auth/register', 'POST', userData);
export const getUserProfile = () => apiRequest('/auth/profile', 'GET');
export const updateUserProfile = (userData) => apiRequest('/auth/profile', 'PUT', userData);

// BOOKS
export const getAllBooks = () => apiRequest('/books', 'GET');
export const getBookById = (id) => apiRequest(`/books/${id}`, 'GET');
export const createBook = (bookData) => apiRequest('/books', 'POST', bookData); // Sekarang bisa menerima FormData
export const updateBook = (id, bookData) => apiRequest(`/books/${id}`, 'PUT', bookData);
export const deleteBook = (id) => apiRequest(`/books/${id}`, 'DELETE');

// FAVORITES
export const getFavoriteBooks = () => apiRequest('/favorites', 'GET');
export const toggleFavoriteBook = (bookId) => apiRequest(`/books/${bookId}/favorite`, 'POST');