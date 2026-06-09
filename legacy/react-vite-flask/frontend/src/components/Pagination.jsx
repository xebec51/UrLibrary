// komponen untuk menampilkan navigasi halaman dengan tombol prev/next dan nomor halaman
function Pagination({ currentPage, totalPages, onPageChange }) {
  // membuat array berisi nomor-nomor halaman
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // jangan tampilkan pagination jika hanya ada satu halaman atau kurang
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        {/* tombol untuk ke halaman sebelumnya */}
        <button 
          className="join-item btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>

        {/* tombol untuk setiap nomor halaman */}
        {pageNumbers.map(number => (
          <button 
            key={number}
            onClick={() => onPageChange(number)}
            className={`join-item btn ${currentPage === number ? 'btn-primary' : ''}`}
          >
            {number}
          </button>
        ))}
        
        {/* tombol untuk ke halaman selanjutnya */}
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