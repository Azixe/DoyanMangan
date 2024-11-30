import React, { useContext, useState } from 'react'; // Mengimpor React, useContext, dan useState
import './FoodDisplay.css'; // Mengimpor styling untuk komponen FoodDisplay
import { StoreContext } from '../../context/StoreContext'; // Mengimpor StoreContext untuk akses data global
import FoodItem from '../FoodItem/FoodItem'; // Mengimpor komponen FoodItem untuk menampilkan setiap item makanan

const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext); // Mengambil daftar makanan dari context global

    // State untuk menyimpan kata kunci pencarian
    const [searchKeyword, setSearchKeyword] = useState("");

    // Filter daftar makanan berdasarkan kategori dan kata kunci pencarian
    const filteredFoods = food_list.filter((item) => {
        const matchesCategory = category === "All" || item.category === category;
        const matchesSearch = item.name.toLowerCase().includes(searchKeyword.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className='food-display' id='food-display'>
            <h2>Makanan favorit untuk kamu</h2>

            {/* Input pencarian */}
            <input
                type="text"
                placeholder="Cari makanan..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="search-bar"
            />

            {/* Menampilkan daftar makanan yang telah difilter */}
            <div className="food-display-list">
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((item, index) => (
                        <FoodItem
                            key={index} // Gunakan properti unik untuk membantu React melacak elemen
                            id={item._id} // ID item makanan
                            name={item.name} // Nama item
                            description={item.description} // Deskripsi item
                            price={item.price} // Harga item
                            image={item.image} // Gambar item
                        />
                    ))
                ) : (
                    <p className="no-results">Tidak ada makanan yang ditemukan.</p>
                )}
            </div>
        </div>
    );
};

export default FoodDisplay; // Mengekspor komponen agar bisa digunakan di komponen lain
