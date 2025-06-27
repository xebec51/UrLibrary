import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFavoriteBooks } from '../api/apiService';
import BookCard from '../components/BookCard';
import { FaHeart } from 'react-icons/fa';

function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getFavoriteBooks(token);
        // --- PERBAIKAN: API sekarang mengembalikan array langsung ---
        setFavoriteBooks(data || []);
      } catch (error) {
        console.error("Gagal memuat favorit:", error);
        setFavoriteBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500">Silakan login untuk melihat buku favorit Anda.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8 border-b border-base-300 pb-4">
        <FaHeart className="text-red-500 text-3xl" />
        <h1 className="text-4xl font-bold">Buku Favorit Saya</h1>
      </div>

      {favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
        <div className="text-center py-20 bg-base-200 rounded-lg">
          <p className="text-xl text-base-content/80">Anda belum memiliki buku favorit.</p>
          <p className="text-base-content/60 mt-2">Cari buku yang Anda suka dan tambahkan ke favorit!</p>
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;