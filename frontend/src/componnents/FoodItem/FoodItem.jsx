import React, { useContext } from 'react'; // Mengimpor React dan useContext untuk mengakses state global
import './FoodItem.css'; // Mengimpor styling untuk komponen FoodItem
import { assets } from '../../assets/assets'; // Mengimpor aset ikon dan gambar
import { StoreContext } from '../../context/StoreContext'; // Mengimpor StoreContext untuk akses global data dan fungsi

const FoodItem = ({ id, name, price, description, image }) => {
    // Mengambil data dan fungsi dari StoreContext
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    return (
        <div className="food-item">
            {/* Container untuk gambar makanan */}
            <div className="food-item-img-container">
                {/* Menampilkan gambar makanan */}
                <img
                    className="food-item-image"
                    src={`${url}/images/${image}`} // URL dinamis untuk gambar
                    alt={name || 'Food Item'} // Gunakan nama item sebagai alternatif teks
                />
                {/* Tampilkan tombol tambah atau counter berdasarkan jumlah di cart */}
                {!cartItems[id] ? (
                    <img
                        className="add"
                        onClick={() => addToCart(id)} // Fungsi untuk menambah ke keranjang
                        src={assets.add_icon_white}
                        alt="Add to cart"
                    />
                ) : (
                    <div className="food-item-counter">
                        <img
                            onClick={() => removeFromCart(id)} // Fungsi untuk mengurangi jumlah di keranjang
                            src={assets.remove_icon_red}
                            alt="Remove from cart"
                        />
                        <p>{cartItems[id]}</p> {/* Menampilkan jumlah item di keranjang */}
                        <img
                            onClick={() => addToCart(id)} // Fungsi untuk menambah jumlah item
                            src={assets.add_icon_green}
                            alt="Add more to cart"
                        />
                    </div>
                )}
            </div>
            {/* Informasi tentang makanan */}
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating stars" /> {/* Menampilkan ikon rating */}
                </div>
                <p className="food-item-desc">{description}</p> {/* Deskripsi makanan */}
                <p className="food-item-price">${price}</p> {/* Harga makanan */}
            </div>
        </div>
    );
};

export default FoodItem; // Mengekspor komponen untuk digunakan di komponen lain
