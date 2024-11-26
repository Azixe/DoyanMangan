import axios from "axios"; // Import axios untuk melakukan permintaan HTTP
import { createContext, useEffect, useState } from "react"; // Import React API untuk context dan state management

export const StoreContext = createContext(null);
// Membuat context global untuk menyimpan state yang bisa diakses di seluruh aplikasi

const StoreContextProvider = (props) => {
    // State untuk menyimpan item di keranjang belanja
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000"; // URL dasar API
    const [token, setToken] = useState(""); // State untuk menyimpan token autentikasi
    const [food_list, setFoodList] = useState([]); // State untuk menyimpan daftar makanan

    const addToCart = async (itemId) => {
        // Menambah item ke keranjang
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (token) {
            // Jika pengguna terautentikasi, sinkronkan keranjang ke server
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        // Mengurangi item dari keranjang
        setCartItems((prev) => {
            const newCart = { ...prev };
            newCart[itemId] -= 1;
            if (newCart[itemId] <= 0) delete newCart[itemId]; // Hapus item jika jumlahnya 0
            return newCart;
        });
        if (token) {
            // Jika pengguna terautentikasi, sinkronkan perubahan ke server
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        // Menghitung total harga item di keranjang
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                // Mencari informasi item berdasarkan ID
                if (itemInfo) { // Jika item ditemukan, tambahkan ke total
                    totalAmount += itemInfo.price * cartItems[item];
                } else {
                    console.warn(`Item dengan ID ${item} tidak ditemukan di food_list.`);
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        // Mendapatkan daftar makanan dari server
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
    };

    const loadCartData = async (token) => {
        // Memuat data keranjang dari server berdasarkan token pengguna
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
    };

    useEffect(() => {
        // Memuat data awal (daftar makanan dan data keranjang)
        async function loadData() {
            await fetchFoodList(); // Mendapatkan daftar makanan
            if (localStorage.getItem("token")) {
                // Jika ada token tersimpan, gunakan untuk autentikasi
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []); // Dipanggil sekali saat komponen di-mount

    const contextValue = {
        food_list,          // Daftar makanan
        cartItems,          // Item dalam keranjang
        setCartItems,       // Fungsi untuk mengatur keranjang
        addToCart,          // Fungsi untuk menambah item ke keranjang
        removeFromCart,     // Fungsi untuk menghapus item dari keranjang
        getTotalCartAmount, // Fungsi untuk menghitung total harga di keranjang
        url,                // URL dasar untuk API
        token,              // Token autentikasi
        setToken            // Fungsi untuk mengatur token
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {/* Menyediakan context untuk anak komponen */}
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider; // Mengekspor StoreContextProvider untuk digunakan di aplikasi
