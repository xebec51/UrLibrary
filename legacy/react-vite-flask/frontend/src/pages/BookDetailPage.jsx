// mengimpor hooks react untuk state dan effect
import { useState, useEffect } from 'react';
// mengimpor hooks untuk parameter url dan navigasi
import { useParams, Link, useNavigate } from 'react-router-dom';
// mengimpor fungsi api untuk mendapatkan detail buku dan url backend
import { getBookById, BACKEND_URL } from '../api/apiService';
// mengimpor hook untuk mengakses konteks autentikasi
import { useAuth } from '../context/AuthContext';
// mengimpor berbagai ikon untuk ui halaman
import { FaArrowLeft, FaUser, FaCalendarAlt, FaHeart, FaRegHeart, FaTags } from 'react-icons/fa';

// komponen halaman detail buku yang menampilkan informasi lengkap buku
function BookDetailPage() {
  // mengambil id buku dari parameter url
  const { id } = useParams();
  const navigate = useNavigate();
  // mengambil user dan fungsi toggle favorit dari context
  const { user, toggleFavorite } = useAuth(); 

  // state untuk menyimpan data buku
  const [book, setBook] = useState(null);
  // state untuk status loading
  const [isLoading, setIsLoading] = useState(true);
  
  // logika untuk mengecek apakah buku ada di favorit user
  const isFavorite = user?.favorites?.includes(Number(id)) ?? false;

  // effect untuk mengambil data detail buku saat komponen dimuat
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

  // fungsi untuk menangani toggle favorit buku
  const handleToggleFavorite = async () => {
    // cek apakah user sudah login
    if (!user) {
        alert("Silakan login untuk menambah favorit.");
        navigate('/login-user');
        return;
    }
    await toggleFavorite(book.id);
  };

  // tampilan loading
  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
  }

  // tampilan jika buku tidak ditemukan
  if (!book) {
    return (
        <div className="text-center p-12">
            <h1 className="text-2xl font-bold">Buku Tidak Ditemukan</h1>
            <Link to="/" className="btn btn-primary mt-4">Kembali ke Beranda</Link>
        </div>
    );
  }

  // logika untuk membangun url gambar yang benar
  const imageUrl = book.coverImage && book.coverImage.startsWith('http')
    ? book.coverImage
    : `${BACKEND_URL}${book.coverImage}`;
  return (
    // container utama halaman detail dengan padding responsif
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* breadcrumb navigasi */}
        <div className="text-sm breadcrumbs mb-4">
          <ul>
            <li><Link to="/" className="hover:text-primary">Beranda</Link></li>
            <li className="text-primary font-semibold">{book.title}</li>
          </ul>
        </div>
        {/* card utama untuk detail buku */}
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          {/* grid layout dengan 1 kolom di mobile, 3 kolom di desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* kolom gambar sampul buku */}
            <div className="md:col-span-1 p-6 flex justify-center items-center">
              {/* menggunakan imageurl yang sudah diperbaiki */}
              <img src={imageUrl} className="rounded-lg shadow-lg w-full object-contain max-h-[450px]" alt={`Sampul ${book.title}`} />
            </div>
            {/* kolom informasi detail buku */}
            <div className="md:col-span-2 p-6 md:p-8">
              {/* badge kategori buku */}
              <div className="badge badge-primary gap-2 p-3 mb-4"><FaTags /><span>{book.category}</span></div>
              {/* judul buku */}
              <h1 className="text-3xl lg:text-4xl font-bold mb-3">{book.title}</h1>
              {/* informasi penulis dan tahun */}
              <div className="flex items-center gap-4 text-base-content/80 mb-6">
                <div className="flex items-center gap-2"><FaUser /><span>{book.author}</span></div>
                <div className="flex items-center gap-2"><FaCalendarAlt /><span>{book.year}</span></div>
              </div>
              <div className="divider my-4"></div>
              {/* judul seksi deskripsi */}
              <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
              {/* deskripsi lengkap buku */}
              <p className="text-base-content/90 leading-relaxed">{book.description}</p>
              <div className="divider my-6"></div>
              {/* tombol aksi */}
              <div className="flex flex-wrap gap-3">
                {/* tombol kembali ke beranda */}
                <Link to="/" className="btn btn-outline btn-primary gap-2"><FaArrowLeft /><span>Kembali</span></Link>
                {/* tombol favorit hanya muncul jika user sudah login */}
                {user && (
                    <button onClick={handleToggleFavorite} className="btn btn-accent gap-2">
                    {/* ikon berubah sesuai status favorit */}
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    {/* teks berubah sesuai status favorit */}
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