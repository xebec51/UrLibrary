import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { booksData, deleteBook } from "../api/books";
import Pagination from "../components/Pagination.jsx"; // <- Impor komponen baru

const ITEMS_PER_PAGE = 5; // Tentukan jumlah item per halaman untuk admin

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // <- State untuk halaman saat ini

  useEffect(() => {
    setBooks(booksData);
  }, []);

  const handleDeleteBook = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      deleteBook(id);
      setBooks([...booksData]); // Perbarui state dengan data baru
    }
  };

  // Kalkulasi untuk data yang akan ditampilkan di halaman saat ini
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/add" className="btn btn-primary">Tambah Buku Baru</Link>
          <Link to="/" className="btn btn-outline btn-error">Logout</Link>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-[color:var(--color-base-100)] shadow-md rounded-lg">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Cover</th>
              <th>Judul</th>
              <th>Penulis</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* Gunakan `currentBooks` untuk di-map */}
            {currentBooks.map((book, index) => (
              <tr key={book.id} className={index % 2 === 1 ? "bg-[color:var(--color-base-200)]" : ""}>
                {/* Tampilkan nomor urut yang benar berdasarkan halaman */}
                <td>{startIndex + index + 1}</td>
                <td>
                  <div className="w-16 h-20 overflow-hidden rounded-md">
                    <img 
                      src={book.coverImage} 
                      alt={`Cover ${book.title}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <div className="flex gap-2">
                    <Link to={`/admin/edit/${book.id}`} className="btn btn-warning btn-sm">Edit</Link>
                    <button 
                      className="btn btn-error btn-sm"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tambahkan Komponen Pagination di sini */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AdminDashboard;