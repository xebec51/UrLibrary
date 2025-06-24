import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <- Ganti import
import { getFavoriteBooks } from '../api/users'; // getFavoriteBooks tetap diperlukan
import BookCard from '../components/BookCard';
import { FaHeart } from 'react-icons/fa';

function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const { currentUser, isAuthenticated } = useAuth(); // <- Ambil dari context
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Jika tidak otentik, paksa kembali ke halaman login
      alert("Anda harus login untuk mengakses halaman ini.");
      navigate('/login-user');
    } else {
      // Ambil daftar buku favorit berdasarkan currentUser dari context
      setFavoriteBooks(getFavoriteBooks(currentUser.id));
    }
  }, [isAuthenticated, currentUser, navigate]); // Bergantung pada currentUser dari context

  if (!isAuthenticated) {
    // Tampilkan null selagi redirect
    return null;
  }

  // ... JSX lainnya tetap sama
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8 border-b pb-4">
        <FaHeart className="text-red-500 mr-3 text-3xl" />
        <h1 className="text-4xl font-bold">Buku Favorit Saya</h1>
      </div>

      {favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favoriteBooks.map((book) => (
            <BookCard 
              key={book.id} 
              id={book.id} 
              title={book.title} 
              author={book.author}
              coverImage={book.coverImage} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">Anda belum memiliki buku favorit.</p>
          <p className="text-gray-400 mt-2">Cari buku yang Anda suka dan tambahkan ke favorit!</p>
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;