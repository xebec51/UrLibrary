import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBookById } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaHeart, FaRegHeart } from 'react-icons/fa';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Ambil semua yang kita butuhkan dari context
  const { isAuthenticated, currentUser, toggleFavorite } = useAuth(); 

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Logika favorit sekarang berfungsi dengan data asli dari backend!
  const isFavorite = currentUser?.favorites?.includes(Number(id)) ?? false;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const data = await getBookById(id);
        setBook(data);
      } catch (error) {
        console.error("Gagal memuat detail buku:", error);
        alert("Buku tidak ditemukan atau terjadi kesalahan server.");
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return alert("Silakan login untuk menambah favorit.");
    // Fungsi toggleFavorite dari context akan menangani pembaruan state
    await toggleFavorite(book.id);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="loading loading-spinner loading-lg text-[color:var(--color-primary)]"></div>
        </div>
    );
  }

  // Jika setelah loading selesai tapi buku tetap tidak ada
  if (!book) {
    return (
        <div className="text-center p-12">
            <h1 className="text-2xl font-bold">Buku Tidak Ditemukan</h1>
            <Link to="/" className="btn btn-primary mt-4">Kembali ke Beranda</Link>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-sm breadcrumbs mb-8">
          <ul>
            <li><Link to="/" className="hover:text-[color:var(--color-primary)]">Beranda</Link></li>
            <li className="text-[color:var(--color-primary)]">{book.title}</li>
          </ul>
        </div>
        <div className="bg-[color:var(--color-base-100)] rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 p-8 flex justify-center lg:border-r border-gray-200">
              <img src={book.coverImage} className="rounded-lg shadow-2xl w-full object-cover max-h-[500px]" alt={`Sampul ${book.title}`} />
            </div>
            <div className="lg:col-span-2 p-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gradient">{book.title}</h1>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="badge badge-primary gap-2 p-3"><FaUser /><span>{book.author}</span></div>
                <div className="badge badge-secondary gap-2 p-3"><FaCalendarAlt /><span>{book.year}</span></div>
              </div>
              <div className="divider"></div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Deskripsi</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{book.description}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/" className="btn btn-primary gap-2"><FaArrowLeft /><span>Kembali ke Katalog</span></Link>
                {isAuthenticated && (
                    <button onClick={handleToggleFavorite} className="btn btn-outline btn-accent gap-2">
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    {isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default BookDetailPage;
