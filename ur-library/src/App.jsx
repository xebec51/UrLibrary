import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
// Ubah nama import untuk kejelasan
import AdminLoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import BookDetailPage from './pages/BookDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
// Impor halaman baru
import RegisterPage from './pages/RegisterPage';
import UserLoginPage from './pages/UserLoginPage';
import FavoritesPage from './pages/FavoritesPage';


function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.includes('/admin');
  
  const mainClass = isAdminPage ? "pb-10" : "pt-12 pb-10";

  return (
    <>
      <Navbar />

      <main className={mainClass}>
        <Routes>
          {/* Rute Publik & Pengguna */}
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login-user" element={<UserLoginPage />} />
          <Route path="/my-favorites" element={<FavoritesPage />} />

          {/* Rute Admin */}
          <Route path="/login" element={<AdminLoginPage />} /> {/* Ini adalah login admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />}/>
          <Route path="/admin/add" element={<AddBookPage />} />
          <Route path="/admin/edit/:id" element={<EditBookPage />} />
          
          {/* Rute fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;