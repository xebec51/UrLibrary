# 📖 UrLibrary - Katalog Buku Digital Full-Stack

**UrLibrary** adalah aplikasi web katalog buku digital yang dibangun sebagai Proyek Akhir untuk mata kuliah Pemrograman Web Lanjutan. Aplikasi ini didesain sebagai *Single-Page Application* (SPA) modern dengan arsitektur frontend dan backend yang terpisah, mencakup fungsionalitas untuk pengunjung, pengguna terdaftar, dan administrator.

## ✨ Fitur Utama

Aplikasi ini memiliki tiga peran pengguna dengan fitur yang berbeda:

### 👤 Pengunjung (Tidak Login)

  - **Katalog Buku**: Melihat daftar lengkap buku yang tersedia dengan paginasi.
  - **Pencarian Real-time**: Mencari buku berdasarkan judul atau penulis.
  - **Filter Kategori**: Menyaring buku berdasarkan kategori yang tersedia.
  - **Lihat Detail**: Mengakses halaman detail untuk setiap buku.

### 👩‍💻 Pengguna Terdaftar

  - **Semua fitur Pengunjung**.
  - **Otentikasi**: Dapat membuat akun (Register) dan masuk (Login) ke dalam sistem.
  - **Buku Favorit**: Menandai buku sebagai favorit dan melihat koleksi favorit di halaman khusus (`/my-favorites`).
  - **Manajemen Sesi**: Status login dikelola menggunakan JSON Web Token (JWT).

### 👑 Administrator

  - **Login Khusus**: Halaman login terpisah untuk admin.
  - **Dashboard Manajemen**: Panel admin untuk mengelola seluruh data buku.
  - **CRUD Penuh**: Kemampuan untuk **C**reate (menambah), **R**ead (melihat), **U**pdate (mengedit), dan **D**elete (menghapus) data buku.
  - **Terproteksi**: Semua aksi admin diamankan dan hanya bisa diakses oleh pengguna dengan status admin.

-----

## 🛠️ Tumpukan Teknologi (Tech Stack)

Proyek ini dibangun menggunakan teknologi modern untuk frontend dan backend.

### Frontend (`/ur-library`)

  - **Framework**: React (dengan Vite)
  - **Routing**: React Router DOM
  - **Manajemen State**: React Context API
  - **Styling**: Tailwind CSS & DaisyUI
  - **HTTP Client**: `fetch` API

### Backend (`/urlibrary-backend`)

  - **Framework**: Flask
  - **Database**: SQLite (via Flask-SQLAlchemy)
  - **Migrasi Database**: Flask-Migrate
  - **Otentikasi**: JSON Web Token (via Flask-JWT-Extended)
  - **Keamanan**:
      - Hashing Password dengan Flask-Bcrypt
      - Konfigurasi CORS dengan Flask-Cors

-----

## 🚀 Panduan Instalasi dan Menjalankan Proyek

Berikut adalah langkah-langkah untuk menjalankan proyek ini secara lokal.

### Prasyarat

  - Node.js (v18 atau lebih baru)
  - Python (v3.10 atau lebih baru) dan `pip`

### 1\. Kloning Repository

```bash
git clone https://github.com/[NAMA_PENGGUNA_ANDA]/UrLibrary.git
cd UrLibrary
```

### 2\. Setup Backend (`/urlibrary-backend`)

Buka terminal baru untuk backend.

```bash
# Masuk ke direktori backend
cd urlibrary-backend

# Buat dan aktifkan virtual environment
python -m venv venv
.\venv\Scripts\activate

# Instal semua dependensi
pip install -r requirements.txt 
# (Catatan: Anda perlu membuat file requirements.txt terlebih dahulu dengan `pip freeze > requirements.txt`)

# Buat file .env dan konfigurasikan
# Salin konten di bawah ini ke dalam file .env baru
# DATABASE_URL="sqlite:///urlibrary.db"
# JWT_SECRET_KEY="kunci-rahasia-yang-sangat-acak-dan-kuat"
# FLASK_APP=run.py

# Lakukan migrasi database untuk membuat tabel
flask db init    # (Hanya jika folder 'migrations' belum ada)
flask db migrate -m "Initial migration"
flask db upgrade

# Buat akun admin pertama kali (opsional, jika database kosong)
# 1. Daftarkan user via API (lihat Postman) atau UI
# 2. Jalankan `flask shell`
# 3. from app.models import User, db
# 4. user = User.query.get(1)
# 5. user.is_admin = True
# 6. db.session.commit()
# 7. exit()
```

### 3\. Setup Frontend (`/ur-library`)

Buka terminal lain untuk frontend.

```bash
# Masuk ke direktori frontend
cd ur-library

# Instal semua dependensi
npm install
```

### 4\. Menjalankan Aplikasi

Anda perlu menjalankan kedua server secara bersamaan di terminal yang berbeda.

  - **Terminal Backend:**

    ```bash
    # Di dalam /urlibrary-backend
    flask run
    # Server akan berjalan di http://127.0.0.1:5000
    ```

  - **Terminal Frontend:**

    ```bash
    # Di dalam /ur-library
    npm run dev
    # Aplikasi akan berjalan di http://localhost:5173
    ```

Buka `http://localhost:5173` di browser Anda untuk melihat aplikasi.

## 👨‍💻 Kontributor
  - **Muh. Rinaldi Ruslan** - (H071231074)
  - **Muh. Alif Anugerah Putra** - (H071231065)
  - **Dhian Alifka Azzahra** - (H071231022)
  - **Muhammad Rifky Kurniawan** - (H071231023)
