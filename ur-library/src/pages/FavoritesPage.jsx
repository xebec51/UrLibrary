import { useState, useEffect } from 'react';
// --- PERBAIKAN 1: Hapus 'useNavigate' dari impor ---
import { useAuth } from '../context/AuthContext';
import { getFavoriteBooks } from '../api/apiService';
import BookCard from '../components/BookCard';
import { FaHeart } from 'react-icons/fa';

function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  // --- PERBAIKAN 2: Hapus deklarasi 'navigate' yang tidak terpakai ---

  useEffect(() => {
    if (!user || !token) {
      // Kita tidak perlu melakukan apa-apa di sini, biarkan PrivateRoute bekerja
      setLoading(false); // Pastikan loading berhenti jika tidak ada user
      return;
    }

    const fetchFavorites = async () => {
      // Kita sudah di dalam 'if (token)', jadi kita bisa asumsikan token ada
      try {
        setLoading(true);
        const data = await getFavoriteBooks(token);
        setFavoriteBooks(data || []);
      } catch (error) {
        console.error("Gagal memuat favorit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  // --- PERBAIKAN 3: Hapus komentar eslint-disable dan sesuaikan dependency ---
  }, [user, token]);

  if (loading) {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
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