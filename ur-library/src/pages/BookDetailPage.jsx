import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { booksData } from '../api/books';
import { FaArrowLeft, FaUser, FaCalendarAlt, FaBookmark } from 'react-icons/fa';

function BookDetailPage() {
  // Mengambil 'id' dari parameter URL
  const { id } = useParams();
  // State untuk menyimpan data buku yang ditemukan
  const [book, setBook] = useState(null);
  // State untuk loading
  const [isLoading, setIsLoading] = useState(true);
  // State untuk animasi
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Reset loading state ketika id berubah
    setIsLoading(true);
    setShowContent(false);

    // Simulasi loading
    setTimeout(() => {
      // Cari buku di dalam booksData yang id-nya cocok dengan id dari URL
      const foundBook = booksData.find((b) => b.id == id);
      setBook(foundBook);
      setIsLoading(false);

      // Tambahkan delay kecil sebelum menampilkan konten untuk animasi
      setTimeout(() => {
        setShowContent(true);
      }, 100);
    }, 500);
  }, [id]);

  // Jika masih loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="loading loading-spinner loading-lg text-[color:var(--color-primary)]"></div>
      </div>
    );
  }

  // Jika buku tidak ditemukan
  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-[color:var(--color-base-200)] p-12 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold mb-6">Buku tidak ditemukan!</h1>
          <p className="text-gray-600 mb-8">
            Buku dengan ID "{id}" tidak tersedia di perpustakaan kami.
          </p>
          <Link to="/" className="btn btn-primary gap-2">
            <FaArrowLeft />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    );
  }

  // Jika buku ditemukan, tampilkan detailnya dengan animasi
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div 
        className={`transition-all duration-500 transform ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-8">
          <ul>
            <li>
              <Link to="/" className="hover:text-[color:var(--color-primary)]">Beranda</Link>
            </li>
            <li className="text-[color:var(--color-primary)]">{book.title}</li>
          </ul>
        </div>

        <div className="bg-[color:var(--color-base-100)] rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cover Image Section */}
            <div className="lg:col-span-1 p-8 flex justify-center lg:border-r border-gray-200">
              <div className="max-w-sm relative">
                <img 
                  src={book.coverImage} 
                  className="rounded-lg shadow-2xl w-full object-cover max-h-[500px]" 
                  alt={`Sampul ${book.title}`} 
                />
                <div className="absolute -bottom-4 -right-4 bg-[color:var(--color-primary)] text-[color:var(--color-primary-content)] rounded-full p-4 shadow-lg">
                  <FaBookmark className="text-xl" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-2 p-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gradient">{book.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="badge badge-primary gap-2 p-3">
                  <FaUser /> 
                  <span>{book.author}</span>
                </div>
                <div className="badge badge-secondary gap-2 p-3">
                  <FaCalendarAlt />
                  <span>{book.year}</span>
                </div>
              </div>

              <div className="divider"></div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Deskripsi</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{book.description}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/" className="btn btn-primary gap-2">
                  <FaArrowLeft />
                  <span>Kembali ke Katalog</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;