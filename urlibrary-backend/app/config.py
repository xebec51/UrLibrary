import os
from dotenv import load_dotenv

# Muat environment variables dari file .env
load_dotenv()

class Config:
    """Kumpulan konfigurasi untuk aplikasi Flask."""
    # Konfigurasi untuk SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Konfigurasi untuk JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')