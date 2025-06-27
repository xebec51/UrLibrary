// mengimpor hook untuk state management
import { useState } from 'react';
// mengimpor hook untuk navigasi programmatik
import { useNavigate } from 'react-router-dom';
// mengimpor fungsi api untuk membuat buku baru
import { createBook } from '../api/apiService';
// mengimpor hook untuk mengakses konteks autentikasi
import { useAuth } from '../context/AuthContext'; // 1. Impor useAuth
// mengimpor berbagai ikon untuk ui form
import { FaPlusCircle, FaBook, FaUser, FaCalendarAlt, FaAlignLeft, FaImage, FaTags, FaLink, FaUpload } from 'react-icons/fa';

// daftar kategori buku yang tersedia untuk dipilih
const bookCategories = ["Novel", "Sejarah", "Pengembangan Diri", "Fiksi", "Biografi", "Teknologi", "Sains"];

// komponen halaman untuk menambahkan buku baru oleh admin
function AddBookPage() {
    const navigate = useNavigate();
    // mengambil token autentikasi dari context
    const { token } = useAuth(); 
    // state untuk menyimpan data form buku
    const [formData, setFormData] = useState({
        title: '', author: '', year: '', description: '', category: bookCategories[0]
    });
    
    // state untuk menentukan metode upload gambar (url atau file)
    const [uploadMethod, setUploadMethod] = useState('url');
    // state untuk file gambar yang diupload
    const [coverImageFile, setCoverImageFile] = useState(null);
    // state untuk url gambar
    const [coverImageUrl, setCoverImageUrl] = useState('');
    // state untuk preview gambar
    const [preview, setPreview] = useState(null);

    // state untuk status loading saat submit form
    const [loading, setLoading] = useState(false);

    // fungsi untuk menangani perubahan input text
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    
    // fungsi untuk menangani pemilihan file gambar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);
            // membuat preview gambar dari file yang dipilih
            setPreview(URL.createObjectURL(file));
        }
    };

    // fungsi untuk menangani perubahan url gambar
    const handleUrlChange = (e) => {
        const url = e.target.value;
        setCoverImageUrl(url);
        setPreview(url);
    };

    // fungsi untuk menangani submit form penambahan buku
    const handleSubmit = async (e) => {
        e.preventDefault();

        // validasi token sebelum melanjutkan
        if (!token) {
            alert("Sesi Anda telah berakhir. Silakan login kembali sebagai admin.");
            navigate('/login');
            return;
        }

        setLoading(true);
        // membuat formdata untuk mengirim data termasuk file
        const dataToSend = new FormData();
        for (const key in formData) {
            dataToSend.append(key, formData[key]);
        }

        // menambahkan gambar berdasarkan metode yang dipilih
        if (uploadMethod === 'file' && coverImageFile) {
            dataToSend.append('coverImageFile', coverImageFile);
        } else if (uploadMethod === 'url' && coverImageUrl) {
            dataToSend.append('coverImageUrl', coverImageUrl);
        } else {
            alert('Gambar sampul wajib diisi.');
            setLoading(false);
            return;
        }

        try {
            // mengirim data ke api untuk membuat buku baru
            await createBook(dataToSend, token); 
            alert('Buku baru berhasil ditambahkan!');
            navigate('/admin/dashboard');
        } catch (error) {
            alert('Gagal menambahkan buku.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };    return (
        // container utama halaman dengan padding responsif
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* header halaman dengan ikon dan judul */}
            <div className="flex items-center gap-4 mb-8">
                <FaPlusCircle className="text-4xl text-primary" />
                <h1 className="text-3xl font-bold">Tambah Buku Baru</h1>
            </div>

            {/* card container untuk form */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {/* form utama untuk input data buku */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* grid layout untuk form dengan 2 kolom di desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            
                            {/* kolom kiri - input data teks buku */}
                            <div className="space-y-4">
                                {/* input judul buku */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text flex items-center gap-2"><FaBook /> Judul Buku</span></label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Contoh: Laskar Pelangi" className="input input-bordered w-full" required />
                                </div>
                                {/* input penulis buku */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text flex items-center gap-2"><FaUser /> Penulis</span></label>
                                    <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Contoh: Andrea Hirata" className="input input-bordered w-full" required />
                                </div>
                                {/* grid untuk tahun dan kategori */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* input tahun terbit */}
                                    <div className="form-control">
                                        <label className="label"><span className="label-text flex items-center gap-2"><FaCalendarAlt /> Tahun</span></label>
                                        <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Contoh: 2005" className="input input-bordered w-full" required />
                                    </div>
                                    {/* dropdown kategori buku */}
                                    <div className="form-control">
                                        <label className="label"><span className="label-text flex items-center gap-2"><FaTags /> Kategori</span></label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full" required>
                                            {bookCategories.map(category => (<option key={category} value={category}>{category}</option>))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* kolom kanan - input gambar sampul */}
                            <div className="space-y-4">
                                {/* pemilih metode upload gambar */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text flex items-center gap-2"><FaImage /> Sumber Gambar Sampul</span></label>
                                    <div className="join w-full">
                                        {/* tombol untuk metode url */}
                                        <button type="button" className={`btn join-item flex-1 ${uploadMethod === 'url' ? 'btn-primary' : ''}`} onClick={() => setUploadMethod('url')}><FaLink className="mr-2"/> URL</button>
                                        {/* tombol untuk metode upload file */}
                                        <button type="button" className={`btn join-item flex-1 ${uploadMethod === 'file' ? 'btn-primary' : ''}`} onClick={() => setUploadMethod('file')}><FaUpload className="mr-2"/> Unggah</button>
                                    </div>
                                </div>
                                
                                {/* input sesuai metode yang dipilih */}
                                {uploadMethod === 'url' ? (
                                    // input url gambar
                                    <input type="url" name="coverImageUrl" value={coverImageUrl} onChange={handleUrlChange} placeholder="https://example.com/image.jpg" className="input input-bordered w-full" />
                                ) : (
                                    // input file upload
                                    <input type="file" name="coverImageFile" onChange={handleFileChange} className="file-input file-input-bordered file-input-primary w-full" accept="image/*" />
                                )}

                                {/* area preview gambar */}
                                <div className="form-control mt-2">
                                    <label className="label"><span className="label-text">Pratinjau Sampul</span></label>
                                    <div className="w-full h-48 bg-base-200 rounded-lg flex items-center justify-center">
                                        {preview ? (<img src={preview} alt="Pratinjau" className="object-contain h-full w-full rounded-lg" />) : (<span className="text-base-content/50">Gambar akan muncul di sini</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* textarea untuk deskripsi buku */}
                        <div className="form-control">
                            <label className="label"><span className="label-text flex items-center gap-2"><FaAlignLeft /> Deskripsi</span></label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Masukkan deskripsi singkat buku" rows="4" required></textarea>
                        </div>

                        {/* tombol aksi submit dan batal */}
                        <div className="flex gap-4 pt-4 border-t border-base-200">
                            {/* tombol simpan dengan loading state */}
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Simpan Buku'}
                            </button>
                            {/* tombol batal untuk kembali ke dashboard */}
                            <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-ghost">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddBookPage;