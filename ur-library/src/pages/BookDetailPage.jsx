import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { booksData } from '../api/books'; // Import data buku kita

function BookDetailPage() {
  // Mengambil 'id' dari parameter URL
  const { id } = useParams();
  // State untuk menyimpan data buku yang ditemukan
  const [book, setBook] = useState(null);

  useEffect(() => {
    // Cari buku di dalam booksData yang id-nya cocok dengan id dari URL
    // Gunakan '==' karena id dari URL adalah string, sedangkan di data adalah number
    const foundBook = booksData.find((b) => b.id == id);
    setBook(foundBook);
  }, [id]); // Efek ini akan berjalan setiap kali 'id' di URL berubah

  // Jika buku belum ditemukan (masih proses atau id tidak ada)
  if (!book) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Buku tidak ditemukan!</h1>
        <Link to="/" className="btn btn-primary mt-4">Kembali ke Beranda</Link>
      </div>
    );
  }

  // Jika buku ditemukan, tampilkan detailnya
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <img 
          src={book.coverImage} 
          className="max-w-sm rounded-lg shadow-2xl" 
          alt={`Sampul ${book.title}`} 
        />
        <div>
          <h1 className="text-5xl font-bold">{book.title}</h1>
          <p className="py-2 text-xl">oleh: {book.author} ({book.year})</p>
          <p className="py-6">{book.description}</p>
          <Link to="/" className="btn btn-primary">Kembali ke Katalog</Link>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;