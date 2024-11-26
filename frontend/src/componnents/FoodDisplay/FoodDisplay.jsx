import React, { useContext } from 'react' // Mengimpor React dan useContext untuk mengambil data dari StoreContext
import './FoodDisplay.css' // Mengimpor styling untuk komponen FoodDisplay
import { StoreContext } from '../../context/StoreContext' // Mengimpor StoreContext untuk akses data global
import FoodItem from '../FoodItem/FoodItem' // Mengimpor komponen FoodItem untuk menampilkan setiap item makanan
import Cart from '../../pages/Cart/Cart' // Mengimpor komponen Cart (tidak digunakan, ini bisa dihapus jika tidak diperlukan)

const FoodDisplay = ({ category }) => {
    // Mengambil daftar makanan dari context global
    const { food_list } = useContext(StoreContext)

    return (
        <div className='food-display' id='food-display'>
            <h2>Makanan favorit untuk kamu</h2>
            <div className="food-display-list">
                {/* Melakukan iterasi pada daftar makanan dan menampilkan item sesuai kategori */}
                {food_list.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={index} // Gunakan properti unik untuk membantu React melacak elemen
                                id={item._id} // ID item makanan
                                name={item.name} // Nama item
                                description={item.description} // Deskripsi item
                                price={item.price} // Harga item
                                image={item.image} // Gambar item
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default FoodDisplay // Mengekspor komponen agar bisa digunakan di komponen lain
