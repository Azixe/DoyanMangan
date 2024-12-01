import React, { useState } from 'react';
import Navbar from './componnents/Navbar/Navbar';
// Mengimpor komponen Navbar untuk digunakan di aplikasi
import { Route, Routes } from 'react-router-dom';
// Mengimpor komponen `Route` dan `Routes` untuk mendefinisikan rute aplikasi
import Home from './pages/Home/Home';
// Mengimpor halaman utama aplikasi
import Cart from './pages/Cart/Cart';
// Mengimpor halaman keranjang belanja
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
// Mengimpor halaman untuk memesan
import Footer from './componnents/Footer/Footer';
// Mengimpor komponen footer untuk ditampilkan di bawah
import LoginPopup from './componnents/LoginPopup/LoginPopup';
// Mengimpor komponen popup login yang akan ditampilkan ketika pengguna perlu login
import Verify from './pages/Verify/Verify';
// Mengimpor halaman untuk verifikasi pengguna
import MyOrders from './pages/MyOrders/MyOrders';
// Mengimpor halaman untuk melihat riwayat pesanan
import ResetPassword from './pages/ResetPassword/ResetPassword';
import UpdatePassword from './pages/UpdatePassword/UpdatePassword';

const App = () => {

  const [showLogin, setShowLogin] = useState(false);
  // State untuk mengatur apakah popup login harus ditampilkan

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {/* Jika `showLogin` bernilai true, tampilkan popup login */}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        {/* Komponen Navbar yang menerima props `setShowLogin` untuk mengontrol tampilnya login popup */}

        <Routes>
          {/* Menentukan rute aplikasi */}
          <Route path='/' element={<Home />} />
          {/* Rute untuk halaman utama */}
          <Route path='/cart' element={<Cart />} />
          {/* Rute untuk halaman keranjang belanja */}
          <Route path='/order' element={<PlaceOrder />} />
          {/* Rute untuk halaman pemesanan */}
          <Route path='/verify' element={<Verify />} />
          {/* Rute untuk halaman verifikasi */}
          <Route path='/myorders' element={<MyOrders />} />
          {/* Rute untuk halaman riwayat pesanan */}
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/update-password" element={<UpdatePassword />} />
        </Routes>
      </div>

      <Footer />
      {/* Komponen Footer yang selalu tampil di bagian bawah aplikasi */}
    </>
  );
};

export default App;
