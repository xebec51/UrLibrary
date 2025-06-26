import os
import uuid
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from ..models import db, Book, User

books_bp = Blueprint('books', __name__)

# Definisikan ekstensi file yang diizinkan untuk keamanan
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    """Fungsi helper untuk memeriksa apakah ekstensi file diizinkan."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@books_bp.route('/books', methods=['GET'])
def get_all_books():
    """Endpoint untuk mengambil semua data buku."""
    # Menggunakan to_dict() dari model untuk kode yang lebih bersih
    books = Book.query.order_by(Book.id.desc()).all()
    return jsonify({"books": [book.to_dict() for book in books]})


@books_bp.route('/books/<int:book_id>', methods=['GET'])
def get_one_book(book_id):
    """Endpoint untuk mengambil detail satu buku."""
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict())


# --- CREATE (PERBAIKAN UTAMA DI SINI) ---
@books_bp.route('/books', methods=['POST'])
@jwt_required()
def create_book():
    """Endpoint untuk membuat buku baru (hanya admin), mendukung unggah file."""
    # 1. Verifikasi hak akses admin (sudah benar)
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Akses ditolak. Hanya admin yang bisa menambah buku."}), 403

    # 2. Ambil data teks dari `request.form`
    title = request.form.get('title')
    author = request.form.get('author')
    year = request.form.get('year')
    description = request.form.get('description')
    category = request.form.get('category')
    cover_image_url = ''

    if not all([title, author, year, description, category]):
        return jsonify({"error": "Semua data teks wajib diisi."}), 400

    # 3. Logika untuk menangani gambar (file atau URL)
    if 'coverImageFile' in request.files:
        file = request.files['coverImageFile']
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = str(uuid.uuid4().hex) + os.path.splitext(filename)[1]
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            cover_image_url = f"/uploads/{unique_filename}"
        elif file and file.filename != '':
            return jsonify({"error": f"Jenis file '{file.filename.rsplit('.', 1)[1]}' tidak diizinkan."}), 400
    
    elif 'coverImageUrl' in request.form and request.form.get('coverImageUrl'):
        cover_image_url = request.form.get('coverImageUrl')

    if not cover_image_url:
        return jsonify({"error": "Gambar sampul wajib diisi (via URL atau unggah file)."}), 400

    # 4. Buat dan simpan buku baru
    new_book = Book(
        title=title, author=author, year=int(year),
        description=description, coverImage=cover_image_url, category=category
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify(new_book.to_dict()), 201


@books_bp.route('/books/<int:book_id>', methods=['PUT'])
@jwt_required()
def update_book(book_id):
    """Endpoint untuk memperbarui buku (hanya admin)."""
    # (Logika ini belum mendukung update file, hanya JSON, dan itu tidak apa-apa untuk saat ini)
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Akses ditolak."}), 403

    book = Book.query.get_or_404(book_id)
    data = request.get_json()
    
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.year = data.get('year', book.year)
    book.description = data.get('description', book.description)
    book.coverImage = data.get('coverImage', book.coverImage)
    book.category = data.get('category', book.category)
    
    db.session.commit()
    return jsonify(book.to_dict())


@books_bp.route('/books/<int:book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    """Endpoint untuk menghapus buku (hanya admin)."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Akses ditolak."}), 403

    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Buku berhasil dihapus."})


@books_bp.route('/books/<int:book_id>/favorite', methods=['POST'])
@jwt_required()
def toggle_favorite(book_id):
    """Menambah/menghapus buku dari daftar favorit."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    book = Book.query.get_or_404(book_id)

    if not user:
        return jsonify({"error": "Pengguna tidak ditemukan."}), 404

    if book in user.favorite_books:
        user.favorite_books.remove(book)
        action = 'dihapus dari'
    else:
        user.favorite_books.append(book)
        action = 'ditambahkan ke'
        
    db.session.commit()
    return jsonify({'message': f'Buku "{book.title}" berhasil {action} favorit.'}), 200