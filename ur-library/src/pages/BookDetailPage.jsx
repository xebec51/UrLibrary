import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// 1. Impor alamat dasar backend
import { getBookById, BACKEND_URL } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaHeart, FaRegHeart, FaTags } from 'react-icons/fa';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Ambil user dan fungsi yang relevan dari context
  const { user, toggleFavorite } = useAuth(); 

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Logika favorit sekarang lebih andal dengan memeriksa 'user'
  const isFavorite = user?.favorites?.includes(Number(id)) ?? false;

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
    // Cek user, bukan isAuthenticated, untuk memastikan kita punya data
    if (!user) {
        alert("Silakan login untuk menambah favorit.");
        navigate('/login-user');
        return;
    }
    await toggleFavorite(book.id);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
  }

  if (!book) {
    return (
        <div className="text-center p-12">
            <h1 className="text-2xl font-bold">Buku Tidak Ditemukan</h1>
            <Link to="/" className="btn btn-primary mt-4">Kembali ke Beranda</Link>
        </div>
    );
  }

  // 2. Logika untuk membangun URL gambar yang benar
  const imageUrl = book.coverImage && book.coverImage.startsWith('http')
    ? book.coverImage
    : `${BACKEND_URL}${book.coverImage}`;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-sm breadcrumbs mb-4">
          <ul>
            <li><Link to="/" className="hover:text-primary">Beranda</Link></li>
            <li className="text-primary font-semibold">{book.title}</li>
          </ul>
        </div>
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="md:col-span-1 p-6 flex justify-center items-center">
              {/* 3. Gunakan imageUrl yang sudah diperbaiki */}
              <img src={imageUrl} className="rounded-lg shadow-lg w-full object-contain max-h-[450px]" alt={`Sampul ${book.title}`} />
            </div>
            <div className="md:col-span-2 p-6 md:p-8">
              <div className="badge badge-primary gap-2 p-3 mb-4"><FaTags /><span>{book.category}</span></div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-3">{book.title}</h1>
              <div className="flex items-center gap-4 text-base-content/80 mb-6">
                <div className="flex items-center gap-2"><FaUser /><span>{book.author}</span></div>
                <div className="flex items-center gap-2"><FaCalendarAlt /><span>{book.year}</span></div>
              </div>
              <div className="divider my-4"></div>
              <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
              <p className="text-base-content/90 leading-relaxed">{book.description}</p>
              <div className="divider my-6"></div>
              <div className="flex flex-wrap gap-3">
                <Link to="/" className="btn btn-outline btn-primary gap-2"><FaArrowLeft /><span>Kembali</span></Link>
                {/* --- PERBAIKAN 4: Tambahkan kembali tombol favorit --- */}
                {user && (
                    <button onClick={handleToggleFavorite} className="btn btn-accent gap-2">
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