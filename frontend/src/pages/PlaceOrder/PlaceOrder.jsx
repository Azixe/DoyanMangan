import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css'; // Mengimpor CSS untuk styling komponen ini.
import { StoreContext } from '../../context/StoreContext'; // Mengimpor StoreContext untuk akses data global (cartItems, food_list, dll).
import { useNavigate } from 'react-router-dom'; // Mengimpor hook useNavigate untuk navigasi halaman.
import axios from 'axios'; // Mengimpor axios untuk melakukan request HTTP ke backend.

// Komponen utama untuk halaman pemesanan.
const PlaceOrder = () => {
  // Mengambil data dari StoreContext, seperti total harga cart, token autentikasi, food list, cart items, dan URL.
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  // Variabel untuk biaya pengiriman
  const deliveryFee = 15000;

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
      amount: getTotalCartAmount() + deliveryFee, // Total harga pemesanan (termasuk biaya pengiriman).
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
  }, [token, getTotalCartAmount, navigate]); // Menjalankan efek ini setiap kali token berubah.

  return (
    // Form untuk mengumpulkan informasi pengiriman dan menampilkan total cart.
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p> {/* Judul untuk bagian informasi pengiriman */}
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <input
          required
          name="country"
          onChange={onChangeHandler}
          value={data.country}
          type="text"
          placeholder="Country"
        />
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rp{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rp{getTotalCartAmount() === 0 ? 0 : deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rp{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryFee}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
