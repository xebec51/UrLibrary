import { booksData } from './books';
let usersData = [];

// Fungsi untuk registrasi pengguna baru
export const registerUser = (newUser) => {
  // Cek apakah email sudah terdaftar
  const isExist = usersData.find(user => user.email === newUser.email);
  if (isExist) {
    alert('Email sudah terdaftar. Silakan gunakan email lain.');
    return null; // Kembalikan null jika gagal
  }

  // Tambahkan ID unik dan daftar favorit kosong untuk pengguna baru
  const userWithId = { ...newUser, id: Date.now(), favorites: [] };
  usersData.push(userWithId);
  console.log('Pengguna baru ditambahkan:', usersData); // Untuk debugging
  return userWithId; // Kembalikan data pengguna jika berhasil
};

// Fungsi untuk login pengguna
export const loginUser = (credentials) => {
  const { email, password } = credentials;
  const user = usersData.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Simpan informasi pengguna yang login ke localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null; // Kembalikan null jika login gagal
};

// Fungsi untuk logout
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

// Fungsi untuk mendapatkan data pengguna yang sedang login
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const toggleFavoriteBook = (userId, bookId) => {
  const userIndex = usersData.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    console.error("User tidak ditemukan");
    return;
  }
  
  const user = usersData[userIndex];
  const favoriteIndex = user.favorites.indexOf(bookId);

  if (favoriteIndex > -1) {
    // Jika sudah ada, hapus dari favorit
    user.favorites.splice(favoriteIndex, 1);
  } else {
    // Jika belum ada, tambahkan ke favorit
    user.favorites.push(bookId);
  }

  // Perbarui data pengguna di dalam array usersData
  usersData[userIndex] = user;

  // Penting: Perbarui juga data di localStorage agar tetap sinkron
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  
  // Kembalikan status favorit yang baru
  return favoriteIndex === -1; // true jika ditambahkan, false jika dihapus
};


// Fungsi untuk mendapatkan semua data buku yang difavoritkan oleh pengguna
export const getFavoriteBooks = (userId) => {
  const user = usersData.find(user => user.id === userId);
  if (!user) {
    return []; // Kembalikan array kosong jika user tidak ditemukan
  }

  // Filter booksData untuk mendapatkan buku yang ID-nya ada di `user.favorites`
  return booksData.filter(book => user.favorites.includes(book.id));
};