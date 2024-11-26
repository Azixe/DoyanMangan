import React, { useContext, useEffect } from 'react';
// Import React, useContext untuk mengakses context, dan useEffect untuk side effects.
import './Verify.css';
// Import file CSS untuk styling komponen Verify.
import { useNavigate, useSearchParams } from 'react-router-dom';
// Import hooks untuk navigasi dan mendapatkan query parameter dari URL.
import { StoreContext } from '../../context/StoreContext';
// Import StoreContext untuk akses data global.

const Verify = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    // Hook untuk mengambil dan mengatur query parameter dari URL.
    const success = searchParams.get("success");
    // Ambil nilai parameter `success` dari URL.
    const orderId = searchParams.get("orderId");
    // Ambil nilai parameter `orderId` dari URL.
    const { url } = useContext(StoreContext);
    // Ambil `url` dari context untuk akses endpoint server.
    const navigate = useNavigate();
    // Hook untuk navigasi programatik.

    const verifyPayment = async () => {
        // Fungsi untuk memverifikasi pembayaran dengan server.
        const response = await axios.post(url + "/api/order/verify", { success, orderId });
        // Kirim permintaan POST ke server dengan parameter `success` dan `orderId`.

        if (response.data.success) {
            // Jika server mengembalikan sukses, arahkan ke halaman pesanan pengguna.
            navigate("/myorders");
        } else {
            // Jika gagal, arahkan kembali ke halaman utama.
            navigate("/");
        }
    };

    useEffect(() => {
        verifyPayment();
        // Panggil fungsi verifikasi saat komponen di-mount.
    }, []);
    // Array dependency kosong memastikan fungsi hanya dijalankan sekali saat render pertama.

    return (
        <div className='verify'>
            {/* Wrapper utama untuk halaman verifikasi */}
            <div className="spinner">
                {/* Komponen spinner untuk indikasi loading */}
            </div>
        </div>
    );
};

export default Verify;
// Ekspor komponen Verify untuk digunakan di bagian lain aplikasi.
