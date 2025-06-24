function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Jangan tampilkan pagination jika hanya ada satu halaman
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        {/* Tombol Sebelumnya */}
        <button 
          className="join-item btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>

        {/* Tombol Angka Halaman */}
        {pageNumbers.map(number => (
          <button 
            key={number}
            onClick={() => onPageChange(number)}
            className={`join-item btn ${currentPage === number ? 'btn-primary' : ''}`}
          >
            {number}
          </button>
        ))}
        
        {/* Tombol Selanjutnya */}
        <button 
          className="join-item btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
}

export default Pagination;