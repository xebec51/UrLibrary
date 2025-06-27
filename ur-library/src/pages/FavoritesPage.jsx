// mengimpor hooks react untuk state dan effect
import { useState, useEffect } from 'react';
// mengimpor hook untuk mengakses konteks autentikasi
import { useAuth } from '../context/AuthContext';
// mengimpor fungsi api untuk mendapatkan daftar buku favorit
import { getFavoriteBooks } from '../api/apiService';
// mengimpor komponen card untuk menampilkan buku
import BookCard from '../components/BookCard';
// mengimpor ikon heart untuk ui
import { FaHeart } from 'react-icons/fa';

// komponen halaman untuk menampilkan daftar buku favorit user
function FavoritesPage() {
  // state untuk menyimpan daftar buku favorit
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  // state untuk status loading
  const [loading, setLoading] = useState(true);
  // mengambil data user dan token dari context autentikasi
  const { user, token } = useAuth();

  // effect untuk mengambil data buku favorit saat komponen dimuat
  useEffect(() => {
    const fetchFavorites = async () => {
      // jika tidak ada token, hentikan loading dan return
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // mengambil data buku favorit dari server
        const data = await getFavoriteBooks(token);
        setFavoriteBooks(data || []);
      } catch (error) {
        console.error("Gagal memuat favorit:", error);
        // set array kosong jika terjadi error
        setFavoriteBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  // tampilan loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // tampilan jika user belum login
  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500">Silakan login untuk melihat buku favorit Anda.</p>
      </div>
    );
  }

  return (
    // container utama halaman favorit dengan padding responsif
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* header halaman dengan ikon heart dan judul */}
      <div className="flex items-center gap-3 mb-8 border-b border-base-300 pb-4">
        <FaHeart className="text-red-500 text-3xl" />
        <h1 className="text-4xl font-bold">Buku Favorit Saya</h1>
      </div>

      {/* kondisional rendering berdasarkan apakah ada buku favorit atau tidak */}
      {favoriteBooks.length > 0 ? (
        // grid layout responsif untuk menampilkan kartu buku favorit
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
        // pesan empty state jika belum ada buku favorit
        <div className="text-center py-20 bg-base-200 rounded-lg">
          <p className="text-xl text-base-content/80">Anda belum memiliki buku favorit.</p>
          <p className="text-base-content/60 mt-2">Cari buku yang Anda suka dan tambahkan ke favorit!</p>
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;