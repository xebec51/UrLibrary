export let booksData = [
  {
    id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    year: 2005,
    description: "Sebuah novel yang mengisahkan tentang perjuangan 10 anak dari keluarga miskin yang bersekolah di sebuah sekolah Muhammadiyah di Belitung.",
    coverImage: "https://upload.wikimedia.org/wikipedia/id/7/7e/Laskar_pelangi_sampul.jpg"
  },
  {
    id: 2,
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    year: 1980,
    description: "Buku pertama dari Tetralogi Buru yang menceritakan kisah Minke, seorang priyayi Jawa pada masa Hindia Belanda.",
    coverImage: "https://upload.wikimedia.org/wikipedia/id/thumb/0/03/Bumi_Manusia_sampul.jpeg/220px-Bumi_Manusia_sampul.jpeg"
  },
  {
    id: 3,
    title: "Cantik Itu Luka",
    author: "Eka Kurniawan",
    year: 2002,
    description: "Sebuah novel dengan balutan realisme magis yang menceritakan kisah tragis seorang perempuan bernama Dewi Ayu.",
    coverImage: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1422409341l/24874906.jpg"
  },
  {
    id: 4,
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655922438l/40121378.jpg"
  }
];

export const addBook = (newBook) => {
  const bookWithId = { ...newBook, id: Date.now() };
  booksData.unshift(bookWithId);
};

export const getBookById = (id) => {
  return booksData.find(book => book.id == id);
};

export const updateBook = (id, updatedData) => {
  const bookIndex = booksData.findIndex(book => book.id == id);

  // Jika buku ditemukan, perbarui datanya
  if (bookIndex !== -1) {
    booksData[bookIndex] = { ...booksData[bookIndex], ...updatedData };
  }
};

export const deleteBook = (id) => {
  // Buat array baru yang isinya semua buku KECUALI buku dengan id yang cocok
  booksData = booksData.filter(book => book.id != id);
};