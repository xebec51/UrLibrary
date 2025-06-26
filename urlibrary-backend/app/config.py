import os
from dotenv import load_dotenv

# Muat environment variables dari file .env
load_dotenv()

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

class Config:
    """Kumpulan konfigurasi untuk aplikasi Flask."""
    
    # Konfigurasi untuk SQLAlchemy
    # Menggunakan path absolut untuk memastikan database selalu ditemukan.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'instance', 'urlibrary.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Konfigurasi untuk JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'kunci-rahasia-jwt-yang-kuat'

    # --- PERUBAHAN DI SINI ---
    # Definisikan path absolut untuk folder tempat menyimpan file unggahan
    UPLOAD_FOLDER = os.path.join(basedir, 'uploads')
    
    # Pastikan direktori untuk unggahan file ada. Jika tidak, buat direktorinya.
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)