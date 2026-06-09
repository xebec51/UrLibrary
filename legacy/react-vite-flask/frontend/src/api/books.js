export let booksData = [
  {
    id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    year: 2005,
    description: "Sebuah novel yang mengisahkan tentang perjuangan 10 anak dari keluarga miskin yang bersekolah di sebuah sekolah Muhammadiyah di Belitung.",
    coverImage: "https://th.bing.com/th/id/OIP.4Kjz9sL5EA_Y-x71BVoxKgAAAA?r=0&rs=1&pid=ImgDetMain",
    category: "Novel"
  },
  {
    id: 2,
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    year: 1980,
    description: "Buku pertama dari Tetralogi Buru yang menceritakan kisah Minke, seorang priyayi Jawa pada masa Hindia Belanda.",
    coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1677112428i/122995648.jpg",
    category: "Sejarah" // <- Tambahkan kategori
  },
  {
    id: 3,
    title: "Cantik Itu Luka",
    author: "Eka Kurniawan",
    year: 2002,
    description: "Sebuah novel dengan balutan realisme magis yang menceritakan kisah tragis seorang perempuan bernama Dewi Ayu.",
    coverImage: "https://th.bing.com/th/id/R.caa1d88a7a424b0a5065c1d9385e8ae3?rik=OfEztFtM0Njf6Q&riu=http%3a%2f%2fekakurniawan.com%2fwordpress%2fwp-content%2fuploads%2f700-cil2015.jpg&ehk=m%2bmDMFSztkIimj1AH4h0YURKmRvBUklfm2jYIXyU8ac%3d&risl=&pid=ImgRaw&r=0",
    category: "Novel" // <- Tambahkan kategori
  },
  {
    id: 4,
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
    coverImage: "https://s3-ap-southeast-1.amazonaws.com/ebook-previews/49184/184449/1.jpg",
    category: "Pengembangan Diri" // <- Tambahkan kategori
  }
];

// Daftar kategori yang akan kita gunakan di aplikasi
export const bookCategories = ["Semua", "Novel", "Sejarah", "Pengembangan Diri", "Fiksi", "Biografi"];


export const addBook = (newBook) => {
  const bookWithId = { ...newBook, id: Date.now() };
  booksData.unshift(bookWithId);
};

export const getBookById = (id) => {
  return booksData.find(book => book.id == id);
};

export const updateBook = (id, updatedData) => {
  const bookIndex = booksData.findIndex(book => book.id == id);
  if (bookIndex !== -1) {
    booksData[bookIndex] = { ...booksData[bookIndex], ...updatedData };
  }
};

export const deleteBook = (id) => {
  booksData = booksData.filter(book => book.id != id);
};
