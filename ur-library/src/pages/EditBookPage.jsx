// mengimpor hooks react untuk state dan effect
import { useState, useEffect } from 'react';
// mengimpor hooks untuk parameter url dan navigasi
import { useParams, useNavigate } from 'react-router-dom';
// mengimpor fungsi api untuk manajemen buku dan url backend
import { getBookById, updateBook, BACKEND_URL } from '../api/apiService';
// mengimpor hook untuk mengakses konteks autentikasi
import { useAuth } from '../context/AuthContext';
// mengimpor berbagai ikon untuk ui form
import { FaEdit, FaBook, FaUser, FaCalendarAlt, FaAlignLeft, FaImage, FaTags, FaLink, FaUpload } from 'react-icons/fa';

// daftar kategori buku yang tersedia
const bookCategories = ["Novel", "Sejarah", "Pengembangan Diri", "Fiksi", "Biografi", "Teknologi", "Sains"];

// komponen halaman untuk mengedit data buku yang sudah ada
function EditBookPage() {
    // mengambil id buku dari parameter url
    const { id } = useParams();
    const navigate = useNavigate();
    // mengambil token autentikasi dari context
    const { token } = useAuth();
    
    // state untuk menyimpan data teks form
    const [formData, setFormData] = useState({
        title: '', author: '', year: '', description: '', category: ''
    });

    // state untuk menangani upload gambar
    const [uploadMethod, setUploadMethod] =useState('url');
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [preview, setPreview] = useState(null);

    // state untuk status loading
    const [loading, setLoading] = useState(true);

    // effect untuk mengambil data buku yang akan diedit
    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                const bookData = await getBookById(id);
                // mengisi form dengan data buku yang ada
                setFormData({
                    title: bookData.title,
                    author: bookData.author,
                    year: bookData.year,
                    description: bookData.description,
                    category: bookData.category
                });

                // menentukan url gambar untuk preview
                const imageUrl = bookData.coverImage && bookData.coverImage.startsWith('http')
                    ? bookData.coverImage
                    : `${BACKEND_URL}${bookData.coverImage}`;
                
                setCoverImageUrl(imageUrl);
                setPreview(imageUrl);

            } catch (error) {
                alert('Gagal memuat data buku.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    // fungsi untuk menangani perubahan input teks
    const handleChange = (e) => {
        setFormData(prevState => ({ ...prevState, [name]: e.target.value }));
    };

    // fungsi untuk menangani pemilihan file gambar baru
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImageFile(file);
            setCoverImageUrl(''); // kosongkan url jika file dipilih
            setPreview(URL.createObjectURL(file));
        }
    };

    // fungsi untuk menangani perubahan url gambar
    const handleUrlChange = (e) => {
        const url = e.target.value;
        setCoverImageUrl(url);
        setCoverImageFile(null); // kosongkan file jika url diketik
        setPreview(url);
    };

    // fungsi untuk menangani submit form edit buku
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // membuat formdata untuk mengirim data termasuk file
        const dataToSend = new FormData();
        for (const key in formData) {
            dataToSend.append(key, formData[key]);
        }
        
        // menambahkan file baru jika ada
        if (coverImageFile) {
            dataToSend.append('coverImageFile', coverImageFile);
        } 
        // atau menambahkan url baru jika diubah
        else if (coverImageUrl !== (formData.coverImage && formData.coverImage.startsWith('http') ? formData.coverImage : `${BACKEND_URL}${formData.coverImage}`)) {
            dataToSend.append('coverImageUrl', coverImageUrl);
        }

        try {
            // mengirim data update ke server
            await updateBook(id, dataToSend, token);
            alert('Buku berhasil diperbarui!');
            navigate('/admin/dashboard');
        } catch (error) {
            alert('Gagal memperbarui buku.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // tampilan loading saat data sedang dimuat
    if (loading) return <div className="p-8 text-center">Memuat data buku...</div>;    return (
        // container utama halaman edit dengan padding responsif
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* header halaman dengan ikon dan judul */}
            <div className="flex items-center gap-4 mb-8">
                <FaEdit className="text-4xl text-primary" />
                <h1 className="text-3xl font-bold">Edit Buku</h1>
            </div>

            {/* card container untuk form edit */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {/* form edit buku dengan handler submit */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* grid layout responsif untuk form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            
                            {/* kolom kiri - input data teks buku */}
                            <div className="space-y-4">
                                {/* input judul buku */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text flex items-center gap-2"><FaBook /> Judul Buku</span></label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered w-full" required />
                                </div>
                                {/* input penulis buku */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text flex items-center gap-2"><FaUser /> Penulis</span></label>
                                    <input type="text" name="author" value={formData.author} onChange={handleChange} className="input input-bordered w-full" required />
                                </div>
                                {/* grid untuk tahun dan kategori */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* input tahun terbit */}
                                    <div className="form-control">
                                        <label className="label"><span className="label-text flex items-center gap-2"><FaCalendarAlt /> Tahun</span></label>
                                        <input type="number" name="year" value={formData.year} onChange={handleChange} className="input input-bordered w-full" required />
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

                            {/* kolom kanan - edit gambar sampul */}
                            <div className="space-y-4">
                                {/* pemilih metode ganti gambar */}
                                <div className="form-control">
                                    <label className="label"><span className="label-text flex items-center gap-2"><FaImage /> Ganti Gambar Sampul</span></label>
                                    <div className="join w-full">
                                        {/* tombol metode url */}
                                        <button type="button" className={`btn join-item flex-1 ${uploadMethod === 'url' ? 'btn-primary' : ''}`} onClick={() => setUploadMethod('url')}><FaLink className="mr-2"/> URL</button>
                                        {/* tombol metode upload file */}
                                        <button type="button" className={`btn join-item flex-1 ${uploadMethod === 'file' ? 'btn-primary' : ''}`} onClick={() => setUploadMethod('file')}><FaUpload className="mr-2"/> Unggah</button>
                                    </div>
                                </div>
                                
                                {/* input kondisional berdasarkan metode yang dipilih */}
                                {uploadMethod === 'url' ? (
                                    // input url gambar baru
                                    <input type="url" name="coverImageUrl" value={coverImageUrl} onChange={handleUrlChange} placeholder="Masukkan URL gambar baru" className="input input-bordered w-full" />
                                ) : (
                                    // input file upload baru
                                    <input type="file" name="coverImageFile" onChange={handleFileChange} className="file-input file-input-bordered file-input-primary w-full" accept="image/*" />
                                )}

                                {/* area preview gambar yang sedang dipilih */}
                                <div className="form-control mt-2">
                                    <label className="label"><span className="label-text">Pratinjau Sampul</span></label>
                                    <div className="w-full h-48 bg-base-200 rounded-lg flex items-center justify-center">
                                        {preview ? (<img src={preview} alt="Pratinjau" className="object-contain h-full w-full rounded-lg" />) : (<span className="text-base-content/50">Gambar akan muncul di sini</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* textarea untuk edit deskripsi buku */}
                        <div className="form-control">
                            <label className="label"><span className="label-text flex items-center gap-2"><FaAlignLeft /> Deskripsi</span></label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full" rows="4" required></textarea>
                        </div>

                        {/* tombol aksi simpan dan batal */}
                        <div className="flex gap-4 pt-4 border-t border-base-200">
                            {/* tombol simpan perubahan dengan loading state */}
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : 'Simpan Perubahan'}
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

export default EditBookPage;