from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import User, db
from ..extensions import bcrypt

auth_bp = Blueprint('auth', __name__)

# --- fitur register pengguna baru ---
# endpoint ini digunakan untuk mendaftarkan pengguna baru ke sistem
# menerima data json dengan field name, email, dan password
# mengecek apakah email sudah terdaftar sebelumnya
# jika valid, password akan di-hash dan user baru disimpan ke database
@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    # validasi input - pastikan semua field required ada
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "Data tidak lengkap."}), 400
    # cek apakah email sudah terdaftar di database
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "Email sudah terdaftar."}), 409
    # buat user baru dan simpan ke database
    new_user = User(name=data.get('name'), email=data.get('email'))
    new_user.password = data.get('password')  # password akan di-hash otomatis di model
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": f"Pengguna '{new_user.name}' berhasil terdaftar."}), 201

# --- fitur login pengguna ---
# endpoint ini digunakan untuk login dan mendapatkan access token jwt
# menerima email dan password, lalu memverifikasi kredensial
# jika valid, mengembalikan jwt token dan data profil user
@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    # validasi input login
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email dan password harus diisi."}), 400

    # cari user berdasarkan email
    user = User.query.filter_by(email=data.get('email')).first()
    # verifikasi password menggunakan method check_password
    if not user or not user.check_password(data.get('password')):
        return jsonify({"error": "Email atau password salah."}), 401

    # --- perbaikan: konversi user id ke string untuk jwt token ---
    # buat jwt access token dengan user id sebagai identity
    access_token = create_access_token(identity=str(user.id))
    
    # siapkan data user untuk response
    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
        "favorites": [book.id for book in user.favorite_books]  # list id buku favorit
    }
    
    # kembalikan token dan data user
    return jsonify({
        "access_token": access_token,
        "user": user_data
    }), 200

# --- fitur mendapatkan profil user yang sedang login ---
# endpoint ini menggunakan jwt authentication untuk mengambil data profil
# mengembalikan informasi lengkap user termasuk daftar buku favorit
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    # ambil user id dari jwt token
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)  # sqlalchemy bisa handle id dalam bentuk string
    if not user:
        return jsonify({"error": "Pengguna tidak ditemukan"}), 404
    # ambil daftar id buku favorit
    favorite_ids = [book.id for book in user.favorite_books]
    # siapkan data profil user
    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin,
        "favorites": favorite_ids
    }
    return jsonify(user_data), 200

# --- fitur update profil user ---
# endpoint ini digunakan untuk memperbarui data profil user yang sedang login
# mendukung update nama, email, dan password dengan validasi password lama
@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    # ambil user id dari jwt token
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    
    # update nama dan email jika ada dalam request
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)

    # --- logika update password dengan validasi ---
    # jika user ingin mengubah password
    if 'new_password' in data and data['new_password']:
        # validasi: password lama wajib diisi
        if 'current_password' not in data or not data['current_password']:
            return jsonify({"error": "Password lama wajib diisi untuk mengatur password baru."}), 400
        
        # verifikasi password lama
        if not user.check_password(data['current_password']):
            return jsonify({"error": "Password lama yang Anda masukkan salah."}), 401
        
        # jika password lama benar, set password baru (akan di-hash otomatis)
        user.password = data['new_password']

    try:
        # simpan perubahan ke database
        db.session.commit()
        # kembalikan data profil yang sudah diperbarui
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_admin": user.is_admin,
            "favorites": [book.id for book in user.favorite_books]
        }
        return jsonify(user_data), 200
    except Exception as e:
        # rollback jika terjadi error
        db.session.rollback()
        return jsonify({"msg": "Gagal memperbarui profil", "error": str(e)}), 500