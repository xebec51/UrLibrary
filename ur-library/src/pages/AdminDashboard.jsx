import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// Ganti impor lama dengan apiService
import { getAllBooks, deleteBook } from "../api/apiService";
import Pagination from "../components/Pagination.jsx";

const ITEMS_PER_PAGE = 5;

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data buku dari server
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data.books || []);
    } catch (err) {
      setError("Gagal memuat data buku. Pastikan server backend berjalan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Jadikan fungsi delete async
  const handleDeleteBook = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await deleteBook(id);
        alert("Buku berhasil dihapus.");
        // Ambil ulang data buku untuk memperbarui tampilan
        fetchBooks();
      } catch (err) {
        alert("Gagal menghapus buku.");
        console.error(err);
      }
    }
  };

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  if (loading) {
      return <div className="text-center p-12">Memuat data...</div>;
  }
  
  if (error) {
      return <div className="text-center p-12 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/add" className="btn btn-primary">
            Tambah Buku Baru
          </Link>
          <Link to="/" className="btn btn-outline btn-error">
            Logout
          </Link>
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
            {currentBooks.map((book, index) => (
              <tr key={book.id} className={index % 2 === 1 ? "bg-[color:var(--color-base-200)]" : ""}>
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
                    <Link to={`/admin/edit/${book.id}`} className="btn btn-warning btn-sm">
                      Edit
                    </Link>
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

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AdminDashboard;
