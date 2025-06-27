// mengimpor hooks react untuk state dan effect
import { useState, useEffect } from "react";
// mengimpor fungsi api untuk mengambil semua data buku
import { getAllBooks } from "../api/apiService.js";
// mengimpor komponen untuk menampilkan kartu buku
import BookCard from "../components/BookCard.jsx";
// mengimpor komponen pagination untuk navigasi halaman
import Pagination from "../components/Pagination.jsx";
// mengimpor ikon untuk ui pencarian dan buku
import { FaSearch, FaBook } from 'react-icons/fa';

// konstanta jumlah item per halaman
const ITEMS_PER_PAGE = 8;
// daftar kategori buku yang tersedia untuk filter
const bookCategories = ["Semua", "Novel", "Sejarah", "Pengembangan Diri", "Fiksi", "Biografi", "Teknologi", "Sains"];

// komponen halaman utama yang menampilkan katalog buku dengan fitur pencarian dan filter
function HomePage() {
  // state untuk menyimpan semua data buku
  const [books, setBooks] = useState([]);
  // state untuk kata kunci pencarian
  const [searchTerm, setSearchTerm] = useState('');
  // state untuk buku yang sudah difilter
  const [filteredBooks, setFilteredBooks] = useState([]);
  // state untuk status loading
  const [isLoading, setIsLoading] = useState(true);
  // state untuk menangani error
  const [error, setError] = useState(null);
  // state untuk kategori yang dipilih
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  // state untuk halaman yang sedang aktif
  const [currentPage, setCurrentPage] = useState(1);

  // effect untuk mengambil data buku dari backend saat komponen pertama dimuat
  useEffect(() => {
    const fetchBooks = async () => {
        try {
            setIsLoading(true);
            // mengambil data dari api
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
  
  // effect untuk filtering berdasarkan kategori dan pencarian
  useEffect(() => {
    let results = books;
    // filter berdasarkan kategori jika bukan "semua"
    if (selectedCategory !== 'Semua') {
      results = results.filter(book => book.category === selectedCategory);
    }
    // filter berdasarkan kata kunci pencarian di judul atau penulis
    if (searchTerm) {
      results = results.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBooks(results);
    // reset ke halaman pertama setelah filter
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, books]);

  // kalkulasi untuk pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  return (
    // container utama halaman dengan padding dan lebar maksimal
    <div className="mx-auto px-4 py-8 max-w-7xl">
      {/* section hero dengan gradient background */}
      <div className="bg-gradient-to-r from-[color:var(--color-primary)]/20 to-[color:var(--color-secondary)]/20 rounded-2xl p-8 mb-12">
        <div className="text-center">
            <div className="max-w-3xl mx-auto">
                {/* judul utama halaman */}
                <h1 className="text-5xl font-bold mb-4 text-gray-800">Selamat Datang di UrLibrary</h1>
                {/* deskripsi singkat aplikasi */}
                <p className="text-lg mb-8 text-gray-600">Temukan ribuan koleksi buku dari penulis-penulis terbaik dunia. Perluas wawasanmu melalui bacaan berkualitas.</p>
                {/* search bar dengan ikon */}
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

      {/* section katalog buku */}
      <div className="mb-10">
        {/* header section katalog */}
        <div className="flex items-center mb-6 border-b pb-4">
          <FaBook className="text-[color:var(--color-primary)] mr-3 text-2xl" />
          <h2 className="text-3xl font-bold">Katalog Buku</h2>
        </div>

        {/* filter kategori dengan tombol */}
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
        
        {/* conditional rendering berdasarkan status loading, error, atau data */}
        {isLoading ? (
          // tampilan loading
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-[color:var(--color-primary)]"></div>
          </div>
        ) : error ? (
            // tampilan error
            <div className="text-center py-16 text-red-500 bg-red-50 p-8 rounded-lg">
                <h3 className="font-bold text-xl">Oops! Terjadi Kesalahan</h3>
                <p>{error}</p>
            </div>
        ) : (
          <>
            {/* informasi jumlah buku yang ditampilkan */}
            <p className="mb-6 text-gray-600">
              {filteredBooks.length > 0
                ? `Menampilkan ${currentBooks.length} dari ${filteredBooks.length} buku`
                : "Buku yang Anda cari tidak ditemukan."}
            </p>

            {/* grid layout untuk menampilkan kartu buku */}
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
            
            {/* komponen pagination untuk navigasi halaman */}
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
