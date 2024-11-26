import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css'; // Mengimpor CSS untuk styling komponen ini.
import { StoreContext } from '../../context/StoreContext'; // Mengimpor StoreContext untuk akses data global (cartItems, food_list, dll).
import { useNavigate } from 'react-router-dom'; // Mengimpor hook useNavigate untuk navigasi halaman.
import axios from 'axios'; // Mengimpor axios untuk melakukan request HTTP ke backend.

// Komponen utama untuk halaman pemesanan.
const PlaceOrder = () => {
  // Mengambil data dari StoreContext, seperti total harga cart, token autentikasi, food list, cart items, dan URL.
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  // State untuk menyimpan data inputan pengguna.
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    phone: "",
  });

  // Fungsi untuk menangani perubahan input form dan memperbarui state.
  const onChangeHandler = (event) => {
    const name = event.target.name; // Mengambil nama input yang diubah.
    const value = event.target.value; // Mengambil nilai input yang diubah.
    setData((data) => ({ ...data, [name]: value })); // Memperbarui state dengan nilai baru.
  };

  // Fungsi untuk menangani pengiriman form dan memproses pemesanan.
  const placeOrder = async (event) => {
    event.preventDefault(); // Mencegah reload halaman ketika form disubmit.

    // Menyiapkan list item yang ada di cart untuk disertakan dalam pemesanan.
    let orderItems = food_list
      .filter((item) => cartItems[item._id] > 0) // Mengambil item yang ada di cart.
      .map((item) => ({
        ...item, // Menyalin properti item.
        quantity: cartItems[item._id], // Menambahkan jumlah item yang ada di cart.
      }));

    // Data yang akan dikirim ke server, termasuk alamat pengiriman dan item pemesanan.
    let orderData = {
      address: data, // Alamat pengiriman yang diinput oleh pengguna.
      items: orderItems, // Daftar item yang dipesan.
      amount: getTotalCartAmount() + 2, // Total harga pemesanan (termasuk biaya pengiriman).
    };

    try {
      // Mengirim data pesanan ke backend untuk diproses.
      const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      console.log("Backend Response:", response.data); // Menampilkan response dari server di console.

      if (response.data.success) { // Jika pemesanan berhasil.
        // Mendapatkan snapToken dari response untuk memulai proses pembayaran.
        const snapToken = response.data.snapToken;
        console.log("Snap Token:", snapToken); // Menampilkan snapToken di console.

        // Menggunakan snapToken untuk memulai pembayaran dengan Snap.
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            console.log("Payment Success:", result); // Menampilkan hasil pembayaran.
            window.location.href = "/myorders"; // Mengarahkan pengguna ke halaman My Orders setelah pembayaran sukses.
          },
          onPending: function (result) {
            console.log("Payment Pending:", result); // Menampilkan status pembayaran yang masih pending.
          },
          onError: function (result) {
            console.error("Payment Error:", result); // Menampilkan kesalahan jika pembayaran gagal.
          },
          onClose: function () {
            console.log("Payment popup closed without completing transaction."); // Menangani jika popup pembayaran ditutup tanpa menyelesaikan transaksi.
          },
        });
      } else {
        alert("Error processing payment"); // Menampilkan pesan kesalahan jika pemesanan gagal.
      }
    } catch (error) {
      console.error("Error in placeOrder:", error); // Menangani kesalahan dalam pemrosesan pesanan.
      alert("Error placing the order"); // Menampilkan pesan kesalahan jika terjadi error.
    }
  };

  // Navigasi ke halaman tertentu menggunakan useNavigate hook.
  const navigate = useNavigate();

  // Menggunakan useEffect untuk memeriksa status token dan cart sebelum render.
  useEffect(() => {
    if (!token) {
      navigate('/cart'); // Mengarahkan pengguna ke halaman cart jika belum login.
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart'); // Mengarahkan pengguna ke cart jika jumlah total pemesanan 0.
    }
  }, [token]); // Menjalankan efek ini setiap kali token berubah.

  return (
    // Form untuk mengumpulkan informasi pengiriman dan menampilkan total cart.
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p> {/* Judul untuk bagian informasi pengiriman */}
        <div className="multi-fields">
          {/* Input untuk nama depan (first name) */}
          <input
            required
            name="firstName" // Nama field untuk menangani state
            onChange={onChangeHandler} // Fungsi yang menangani perubahan input
            value={data.firstName} // Nilai input yang dikontrol dari state
            type="text"
            placeholder="First name" // Placeholder teks untuk input
          />
          {/* Input untuk nama belakang (last name) */}
          <input
            required
            name="lastName" // Nama field untuk menangani state
            onChange={onChangeHandler} // Fungsi yang menangani perubahan input
            value={data.lastName} // Nilai input yang dikontrol dari state
            type="text"
            placeholder="Last name" // Placeholder teks untuk input
          />
        </div>

        {/* Input untuk email */}
        <input
          required
          name="email" // Nama field untuk menangani state
          onChange={onChangeHandler} // Fungsi yang menangani perubahan input
          value={data.email} // Nilai input yang dikontrol dari state
          type="email" // Tipe input email untuk validasi otomatis
          placeholder="Email address" // Placeholder teks untuk input
        />

        {/* Input untuk alamat jalan (street) */}
        <input
          required
          name="street" // Nama field untuk menangani state
          onChange={onChangeHandler} // Fungsi yang menangani perubahan input
          value={data.street} // Nilai input yang dikontrol dari state
          type="text"
          placeholder="Street" // Placeholder teks untuk input
        />

        {/* Input untuk kota dan negara bagian */}
        <div className="multi-fields">
          {/* Input untuk kota (city) */}
          <input
            required
            name="city" // Nama field untuk menangani state
            onChange={onChangeHandler} // Fungsi yang menangani perubahan input
            value={data.city} // Nilai input yang dikontrol dari state
            type="text"
            placeholder="City" // Placeholder teks untuk input
          />
          {/* Input untuk negara bagian (state) */}
          <input
            required
            name="state" // Nama field untuk menangani state
            onChange={onChangeHandler} // Fungsi yang menangani perubahan input
            value={data.state} // Nilai input yang dikontrol dari state
            type="text"
            placeholder="State" // Placeholder teks untuk input
          />
        </div>

        {/* Input untuk negara (country) */}
        <div className="multi-fields">
          <input
            required
            name="country" // Nama field untuk menangani state
            onChange={onChangeHandler} // Fungsi yang menangani perubahan input
            value={data.country} // Nilai input yang dikontrol dari state
            type="text"
            placeholder="Country" // Placeholder teks untuk input
          />
        </div>

        {/* Input untuk nomor telepon */}
        <input
          required
          name="phone" // Nama field untuk menangani state
          onChange={onChangeHandler} // Fungsi yang menangani perubahan input
          value={data.phone} // Nilai input yang dikontrol dari state
          type="text"
          placeholder="Phone" // Placeholder teks untuk input
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2> {/* Judul untuk bagian total cart */}
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p> {/* Menampilkan subtotal berdasarkan total cart */}
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p> {/* Menampilkan biaya pengiriman, jika total cart 0 maka biaya pengiriman 0 */}
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b> {/* Total akhir termasuk biaya pengiriman */}
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button> {/* Tombol untuk melanjutkan ke proses pembayaran */}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder; // Menyelesaikan ekspor komponen PlaceOrder.
