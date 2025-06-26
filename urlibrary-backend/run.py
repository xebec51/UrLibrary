from app import create_app
from flask import send_from_directory # --- PERBAIKAN DI SINI ---

app = create_app()

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    """Menyajikan file yang telah diunggah dari direktori uploads."""
    # Ambil path folder uploads dari konfigurasi aplikasi
    upload_dir = app.config['UPLOAD_FOLDER']
    return send_from_directory(upload_dir, filename)

if __name__ == '__main__':
    app.run(debug=True)