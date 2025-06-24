import { useState, useEffect } from "react";
import { booksData } from "../api/books.js";
import BookCard from "../components/BookCard.jsx";

function HomePage() {
  // State untuk menyimpan daftar SEMUA buku (master list)
  const [books, setBooks] = useState([]);
  // State untuk menyimpan input dari kolom pencarian
  const [searchTerm, setSearchTerm] = useState('');
  // State untuk menyimpan buku yang sudah difilter
  const [filteredBooks, setFilteredBooks] = useState([]);

  // 1. useEffect ini hanya berjalan sekali untuk memuat semua data buku
  useEffect(() => {
    setBooks(booksData);
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
    <div>
      <h1 className="text-4xl font-bold mb-2">Katalog Buku</h1>
      <p className="mb-6">Cari buku favoritmu berdasarkan judul atau penulis.</p>

      {/* Form Pencarian */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari buku..."
          className="input input-bordered w-full max-w-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tampilkan daftar buku dalam bentuk grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Gunakan filteredBooks untuk di-map, bukan lagi books */}
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
      ) : (
        <p>Buku yang Anda cari tidak ditemukan.</p>
      )}
    </div>
  );
}

export default HomePage;