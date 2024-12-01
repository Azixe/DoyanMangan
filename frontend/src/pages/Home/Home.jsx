import React, { useState } from 'react' // Mengimpor React dan useState untuk mengelola state lokal
import './home.css' // Mengimpor file CSS untuk styling komponen Home
import Header from '../../componnents/Header/Header' // Mengimpor komponen Header
import ExploreMenu from '../../componnents/ExploreMenu/ExploreMenu' // Mengimpor komponen untuk menu eksplorasi
import FoodDisplay from '../../componnents/FoodDisplay/FoodDisplay' // Mengimpor komponen untuk menampilkan makanan

const Home = () => {
    // State untuk mengelola kategori yang dipilih pada menu eksplorasi
    const [category, setCategory] = useState("All");

    return (
        <div>
            {/* Komponen header */}
            <Header />

            {/* Komponen menu eksplorasi untuk memilih kategori */}
            <ExploreMenu category={category} setCategory={setCategory} />

            {/* Komponen untuk menampilkan makanan berdasarkan kategori yang dipilih */}
            <FoodDisplay category={category} />
        </div>
    )
}

export default Home // Mengekspor komponen Home agar bisa digunakan di bagian lain aplikasi
