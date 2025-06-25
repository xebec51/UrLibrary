import { useState, useEffect } from "react";
// Ganti impor lama dengan apiService
import { getAllBooks } from "../api/apiService.js";
import BookCard from "../components/BookCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { FaSearch, FaBook } from 'react-icons/fa';

const ITEMS_PER_PAGE = 8;
// Karena file lama dihapus, kita definisikan kategori di sini untuk sementara.
// Nantinya, ini bisa diambil dari API terpisah jika diperlukan.
const bookCategories = ["Semua", "Novel", "Sejarah", "Pengembangan Diri", "Fiksi", "Biografi"];

function HomePage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // State baru untuk menangani error
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  // useEffect untuk mengambil data dari backend saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchBooks = async () => {
        try {
            setIsLoading(true);
            const data = await getAllBooks();
            setBooks(data.books || []);
        } catch (error) {
            console.error("Gagal memuat buku:", error);
            setError("Tidak dapat memuat data buku. Pastikan server backend Anda berjalan dan dapat diakses.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchBooks();
  }, []);
  
  // useEffect untuk filtering, tidak berubah
  useEffect(() => {
    let results = books;
    if (selectedCategory !== 'Semua') {
      results = results.filter(book => book.category === selectedCategory);
    }
    if (searchTerm) {
      results = results.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBooks(results);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, books]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-gradient-to-r from-[color:var(--color-primary)]/20 to-[color:var(--color-secondary)]/20 rounded-2xl p-8 mb-12">
        <div className="text-center">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-bold mb-4 text-gray-800">Selamat Datang di UrLibrary</h1>
                <p className="text-lg mb-8 text-gray-600">Temukan ribuan koleksi buku dari penulis-penulis terbaik dunia. Perluas wawasanmu melalui bacaan berkualitas.</p>
                <div className="relative max-w-lg mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Cari judul buku atau penulis..."
                    className="input input-bordered w-full pl-10 pr-4 py-3 rounded-full focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
            </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-6 border-b pb-4">
          <FaBook className="text-[color:var(--color-primary)] mr-3 text-2xl" />
          <h2 className="text-3xl font-bold">Katalog Buku</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {bookCategories.map(category => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn btn-sm ${selectedCategory === category ? 'btn-primary' : 'btn-ghost'}`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-[color:var(--color-primary)]"></div>
          </div>
        ) : error ? (
            <div className="text-center py-16 text-red-500 bg-red-50 p-8 rounded-lg">
                <h3 className="font-bold text-xl">Oops! Terjadi Kesalahan</h3>
                <p>{error}</p>
            </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              {filteredBooks.length > 0
                ? `Menampilkan ${currentBooks.length} dari ${filteredBooks.length} buku`
                : "Buku yang Anda cari tidak ditemukan."}
            </p>

            {currentBooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {currentBooks.map((book) => (
                  <BookCard 
                    key={book.id} 
                    id={book.id} 
                    title={book.title} 
                    author={book.author}
                    coverImage={book.coverImage} 
                  />
                ))}
              </div>
            )}
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
