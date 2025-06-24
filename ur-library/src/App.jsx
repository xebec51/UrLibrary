import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import BookDetailPage from './pages/BookDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';

function App() {
  return (
    <>
      <Navbar />

      <main className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />}/>
          <Route path="/admin/add" element={<AddBookPage />} />
          <Route path="/admin/edit/:id" element={<EditBookPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;