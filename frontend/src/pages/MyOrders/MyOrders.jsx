import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css'; // Mengimpor styling untuk halaman MyOrders
import { StoreContext } from '../../context/StoreContext'; // Mengimpor context untuk mendapatkan token dan URL API
import axios from 'axios'; // Mengimpor axios untuk melakukan request HTTP
import { assets } from '../../assets/assets'; // Mengimpor aset (gambar) yang digunakan di dalam halaman

const MyOrders = () => {
    const { url, token } = useContext(StoreContext); // Mengambil `url` dan `token` dari context
    const [data, setData] = useState([]); // State untuk menyimpan daftar pesanan pengguna

    // Fungsi untuk mengambil daftar pesanan dari server
    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            if (response.data.success) {
                setData(response.data.data); // Jika berhasil, simpan data pesanan ke dalam state
                console.log("Orders fetched successfully:", response.data.data);
            } else {
                console.error("Error fetching orders:", response.data.message); // Jika gagal, tampilkan pesan error
            }
        } catch (error) {
            console.error("Error fetching orders:", error); // Tangani error jika terjadi kesalahan saat request
        }
    };

    // Gunakan useEffect untuk memanggil fetchOrders saat komponen pertama kali dimuat atau saat token berubah
    useEffect(() => {
        if (token) {
            fetchOrders(); // Panggil fetchOrders hanya jika token tersedia
        }
    }, [token]); // Hanya dijalankan ulang jika token berubah

    return (
        <div className="my-orders">
            <h2>My Orders</h2> {/* Judul halaman */}
            <div className="container">
                {/* Jika tidak ada pesanan, tampilkan pesan */}
                {data.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    // Jika ada pesanan, tampilkan daftar pesanan
                    data.map((order, index) => (
                        <div key={index} className="my-orders-order">
                            {/* Menampilkan ikon parcel */}
                            <img src={assets.parcel_icon} alt="Parcel icon" />
                            {/* Menampilkan daftar item dalam pesanan */}
                            <p>
                                {Array.isArray(order.items) && order.items.length > 0 ? (
                                    // Menampilkan setiap item yang ada dalam pesanan
                                    order.items.map((item, itemIndex) => (
                                        <span key={itemIndex}>
                                            {item.name} x {item.quantity}
                                            {itemIndex !== order.items.length - 1 ? ", " : ""}
                                        </span>
                                    ))
                                ) : (
                                    <span>No items found</span> // Jika tidak ada item, tampilkan pesan fallback
                                )}
                            </p>
                            {/* Menampilkan total harga pesanan */}
                            <p>Rp{order.amount.toFixed(2)}</p>
                            {/* Menampilkan jumlah item dalam pesanan */}
                            <p>Items: {order.items ? order.items.length : 0}</p>
                            {/* Menampilkan status pesanan */}
                            <p>
                                <span>&#x25cf;</span>
                                <b>{order.status || "Unknown"}</b> {/* Fallback jika status tidak ditemukan */}
                            </p>
                            {/* Tombol untuk melacak pesanan */}
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;
