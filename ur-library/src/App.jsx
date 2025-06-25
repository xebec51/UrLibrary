import { Routes, Route, useLocation } from 'react-router-dom';

// Komponen Layout & Rute
import Navbar from './components/Navbar';
import AdminRoute from "./components/AdminRoute";

// Halaman-halaman
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import AdminLoginPage from './pages/LoginPage';
import UserLoginPage from './pages/UserLoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboard from './pages/AdminDashboard';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const location = useLocation();
  // Logika untuk menentukan padding/margin berdasarkan halaman admin
  const isAdminPage = location.pathname.startsWith('/admin');
  const mainClass = isAdminPage ? "pb-10" : "pt-12 pb-10";

  return (
    <>
      <Navbar />
      <main className={mainClass}>
        <Routes>
          {/* Rute Publik & Pengguna Biasa */}
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login-user" element={<UserLoginPage />} />
          <Route path="/login" element={<AdminLoginPage />} />

          {/* Rute yang memerlukan login */}
          <Route path="/my-favorites" element={<FavoritesPage />} />

          {/* Rute Khusus Admin yang Dilindungi */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-book" element={<AddBookPage />} />
            <Route path="/admin/edit-book/:id" element={<EditBookPage />} />
          </Route>
          
          {/* Halaman Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;