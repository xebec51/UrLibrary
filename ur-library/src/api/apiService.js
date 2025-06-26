const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Fungsi helper generik
const apiRequest = async (endpoint, method, body = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    // Logika baru: Prioritaskan token yang disuntikkan
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = response.status === 204 ? null : await response.json();
        if (!response.ok) {
            throw new Error(data?.error || data?.msg || 'Terjadi kesalahan pada server');
        }
        return data;
    } catch (error) {
        console.error(`[API Error] ${method} ${endpoint}:`, error);
        throw error;
    }
};

// Fungsi API sekarang menerima token sebagai argumen terakhir
export const loginUser = (credentials) => apiRequest('/auth/login', 'POST', credentials);
export const registerUser = (userData) => apiRequest('/auth/register', 'POST', userData);
export const getUserProfile = (token) => apiRequest('/auth/profile', 'GET', null, token);
export const updateUserProfile = (userData, token) => apiRequest('/auth/profile', 'PUT', userData, token);

export const getAllBooks = () => apiRequest('/books', 'GET');
export const getBookById = (id) => apiRequest(`/books/${id}`, 'GET');
export const createBook = (bookData, token) => apiRequest('/books', 'POST', bookData, token);
export const updateBook = (id, bookData, token) => apiRequest(`/books/${id}`, 'PUT', bookData, token);
export const deleteBook = (id, token) => apiRequest(`/books/${id}`, 'DELETE', token);

export const getFavoriteBooks = (token) => apiRequest('/favorites', 'GET', null, token);
export const toggleFavoriteBook = (bookId, token) => apiRequest(`/books/${bookId}/favorite`, 'POST', null, token);