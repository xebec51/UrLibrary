import { useState, useEffect } from "react";
import { booksData } from "../api/books.js";
import BookCard from "../components/BookCard.jsx";
import { FaSearch, FaBook } from 'react-icons/fa';

function HomePage() {
  // State untuk menyimpan daftar SEMUA buku (master list)
  const [books, setBooks] = useState([]);
  // State untuk menyimpan input dari kolom pencarian
  const [searchTerm, setSearchTerm] = useState('');
  // State untuk menyimpan buku yang sudah difilter
  const [filteredBooks, setFilteredBooks] = useState([]);
  // State untuk tampilan loading
  const [isLoading, setIsLoading] = useState(true);

  // 1. useEffect ini hanya berjalan sekali untuk memuat semua data buku
  useEffect(() => {
    // Simulasi loading dari API
    setTimeout(() => {
      setBooks(booksData);
      setFilteredBooks(booksData);
      setIsLoading(false);
    }, 800);
  }, []);

  // 2. useEffect ini berjalan setiap kali ada perubahan pada searchTerm atau daftar buku master
  useEffect(() => {
    // Filter buku berdasarkan searchTerm
    const results = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(results);
  }, [searchTerm, books]);

  return (
    <div className="mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[color:var(--color-primary)]/20 to-[color:var(--color-secondary)]/20 rounded-2xl p-8 mb-12">
        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 text-gray-800">Selamat Datang di UrLibrary</h1>
            <p className="text-lg mb-8 text-gray-600">Temukan ribuan koleksi buku dari penulis-penulis terbaik dunia. Perluas wawasanmu melalui bacaan berkualitas.</p>
            
            {/* Form Pencarian yang ditingkatkan */}
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

      {/* Katalog Section */}
      <div className="mb-10">
        <div className="flex items-center mb-6 border-b pb-4">
          <FaBook className="text-[color:var(--color-primary)] mr-3 text-2xl" />
          <h2 className="text-3xl font-bold">Katalog Buku</h2>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-[color:var(--color-primary)]"></div>
          </div>
        ) : (
          <>
            {/* Menampilkan jumlah buku yang ditemukan */}
            <p className="mb-6 text-gray-600">
              {filteredBooks.length > 0
                ? `Menampilkan ${filteredBooks.length} buku`
                : "Buku yang Anda cari tidak ditemukan."}
            </p>

            {/* Grid Buku */}
            {filteredBooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredBooks.map((book) => (
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
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;