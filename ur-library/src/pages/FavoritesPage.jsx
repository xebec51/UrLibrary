import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Ganti impor lama dengan apiService
import { getFavoriteBooks } from '../api/apiService';
import BookCard from '../components/BookCard';
import { FaHeart } from 'react-icons/fa';

function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Jika tidak login, alihkan ke halaman login
    if (!isAuthenticated) {
      alert("Anda harus login untuk mengakses halaman ini.");
      navigate('/login-user');
      return; // Hentikan eksekusi
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavoriteBooks();
        setFavoriteBooks(data.books || []);
      } catch (error) {
        console.error("Gagal memuat favorit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Jangan render apapun selagi redirect
  }

  if (loading) {
      return <div className="text-center p-12">Memuat buku favorit...</div>;
  }

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
