import React, { useContext } from 'react';
import './Cart.css';
// Mengimpor file CSS untuk styling halaman keranjang belanja
import { StoreContext } from '../../context/StoreContext';
// Mengimpor context untuk mengakses state global yang berhubungan dengan keranjang belanja
import { useNavigate } from 'react-router-dom';
// Mengimpor `useNavigate` dari React Router untuk melakukan navigasi ke halaman checkout

const Cart = () => {

  // Mengakses nilai dan fungsi dari StoreContext menggunakan useContext
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);

  // Menggunakan hook `useNavigate` untuk navigasi ke halaman lainnya
  const navigate = useNavigate();

  return (
    <div className='cart'>
      {/* Menampilkan daftar item yang ada di dalam keranjang */}
      <div className="cart-item">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {/* Menampilkan daftar makanan yang ada dalam keranjang */}
        {food_list.map((item, index) => {
          // Hanya menampilkan item yang ada di dalam keranjang (cartItems[item._id] > 0)
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className='cart-items-title cart-items-item'>
                  {/* Menampilkan gambar item makanan */}
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>Rp{item.price}</p>
                  {/* Menampilkan jumlah item yang ada di keranjang */}
                  <p>{cartItems[item._id]}</p>
                  {/* Menampilkan total harga item dalam keranjang */}
                  <p>Rp{item.price * cartItems[item._id]}</p>
                  {/* Tombol untuk menghapus item dari keranjang */}
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>

      {/* Menampilkan total biaya dan checkout */}
      <div className="cart-bottom">
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
              {/* Jika keranjang kosong, biaya pengiriman 0 */}
              <p>Rp{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              {/* Total akhir setelah ditambah biaya pengiriman */}
              <b>Rp{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          {/* Tombol untuk melanjutkan ke halaman checkout */}
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>

        {/* Menampilkan input untuk kode promo */}
        <div className="cart-promocode">
          <div>
            <p>If you have promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
