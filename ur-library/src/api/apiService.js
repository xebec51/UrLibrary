const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Fungsi helper untuk mendapatkan token dari localStorage
const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

// Fungsi helper generik untuk membuat request ke API
const apiRequest = async (endpoint, method, body = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Cek jika response tidak memiliki body (misal, 204 No Content)
        if (response.status === 204) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            // Lemparkan error dengan pesan dari server jika ada
            throw new Error(data.error || data.msg || 'Terjadi kesalahan pada server');
        }

        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// --- AUTH ENDPOINTS ---
export const loginUser = (credentials) => apiRequest('/auth/login', 'POST', credentials);
export const registerUser = (userData) => apiRequest('/auth/register', 'POST', userData);
export const getUserProfile = () => apiRequest('/auth/profile', 'GET');

// --- BOOK ENDPOINTS ---
export const getAllBooks = () => apiRequest('/books', 'GET');
export const getBookById = (id) => apiRequest(`/books/${id}`, 'GET');
export const createBook = (bookData) => apiRequest('/books', 'POST', bookData);
export const updateBook = (id, bookData) => apiRequest(`/books/${id}`, 'PUT', bookData);
export const deleteBook = (id) => apiRequest(`/books/${id}`, 'DELETE');

// --- FAVORITES ENDPOINTS ---
export const getFavoriteBooks = () => apiRequest('/favorites', 'GET');
export const toggleFavoriteBook = (bookId) => apiRequest(`/books/${bookId}/favorite`, 'POST');
