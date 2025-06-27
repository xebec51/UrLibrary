import os
import uuid
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from ..models import db, Book, User

books_bp = Blueprint('books', __name__)

# daftar ekstensi file gambar yang diizinkan untuk upload
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# fungsi helper untuk validasi ekstensi file
def allowed_file(filename):
    """fungsi helper untuk memeriksa apakah ekstensi file diizinkan."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# --- fitur mengambil semua data buku ---
# endpoint publik untuk menampilkan daftar semua buku
# data diurutkan berdasarkan id terbaru (descending)
@books_bp.route('/books', methods=['GET'])
def get_all_books():
    """endpoint untuk mengambil semua data buku."""
    # ambil semua buku dari database, urutkan berdasarkan id terbaru
    books = Book.query.order_by(Book.id.desc()).all()
    # konversi ke format dictionary dan return sebagai json
    return jsonify({"books": [book.to_dict() for book in books]})


# --- fitur mengambil detail satu buku ---
# endpoint publik untuk menampilkan detail buku berdasarkan id
@books_bp.route('/books/<int:book_id>', methods=['GET'])
def get_one_book(book_id):
    """Endpoint untuk mengambil detail satu buku."""
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict())


@books_bp.route('/books', methods=['POST'])
@jwt_required()
def create_book():
    """Endpoint untuk membuat buku baru (hanya admin), mendukung unggah file."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Akses ditolak. Hanya admin yang bisa menambah buku."}), 403

    title = request.form.get('title')
    author = request.form.get('author')
    year = request.form.get('year')
    description = request.form.get('description')
    category = request.form.get('category')
    cover_image_url = ''

    if not all([title, author, year, description, category]):
        return jsonify({"error": "Semua data teks wajib diisi."}), 400

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

    new_book = Book(
        title=title, author=author, year=int(year),
        description=description, coverImage=cover_image_url, category=category
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify(new_book.to_dict()), 201


# --- UPDATE (PERBAIKAN UTAMA DI SINI) ---
@books_bp.route('/books/<int:book_id>', methods=['PUT'])
@jwt_required()
def update_book(book_id):
    """Endpoint untuk memperbarui buku (hanya admin), mendukung unggah file."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or not user.is_admin:
        return jsonify({"error": "Akses ditolak."}), 403

    book = Book.query.get_or_404(book_id)
    
    # Ambil data teks dari request.form
    book.title = request.form.get('title', book.title)
    book.author = request.form.get('author', book.author)
    book.year = int(request.form.get('year', book.year))
    book.description = request.form.get('description', book.description)
    book.category = request.form.get('category', book.category)
    
    # Logika untuk memperbarui gambar sampul
    # Jika ada file baru diunggah, proses file tersebut
    if 'coverImageFile' in request.files:
        file = request.files['coverImageFile']
        if file and file.filename != '' and allowed_file(file.filename):
            # (Opsional: Hapus file lama jika ada untuk menghemat ruang)
            # if book.coverImage.startswith('/uploads/'):
            #     old_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], book.coverImage.split('/')[-1])
            #     if os.path.exists(old_file_path):
            #         os.remove(old_file_path)

            filename = secure_filename(file.filename)
            unique_filename = str(uuid.uuid4().hex) + os.path.splitext(filename)[1]
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            book.coverImage = f"/uploads/{unique_filename}"
        elif file and file.filename != '':
            return jsonify({"error": f"Jenis file '{file.filename.rsplit('.', 1)[1]}' tidak diizinkan."}), 400
            
    # Jika tidak ada file baru, tapi ada URL baru yang dikirim
    elif 'coverImageUrl' in request.form and request.form.get('coverImageUrl'):
        book.coverImage = request.form.get('coverImageUrl')

    # Jika tidak ada file baru atau URL baru, book.coverImage tidak akan diubah

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
    return jsonify({'message': f'Buku "{book.title}" berhasil {action} favorit.'})