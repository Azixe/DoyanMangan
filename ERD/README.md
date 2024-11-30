<img src="DoyanMangan ERD.png" alt="ERD" >

# Database Relationships and Cardinality


## **1. `foods` → `orders`**
- **Jenis Hubungan**: **One-to-Many** (Satu ke Banyak)  
  - Satu item `food` dapat muncul di banyak dokumen `orders`.  
  - Setiap dokumen `order` memiliki array `items` yang berisi objek item pesanan. Field `id` dalam objek ini kemungkinan besar merujuk ke field `_id` pada koleksi `foods`.

- **Cardinalitas**:  
  - Satu dokumen `food` dapat digunakan di banyak pesanan.  
  - Setiap dokumen `order` dapat memiliki banyak item makanan dalam array `items`.

---

## **2. `users` → `orders`**
- **Jenis Hubungan**: **One-to-Many** (Satu ke Banyak)  
  - Setiap dokumen `order` memiliki field `userId` yang menghubungkan pesanan dengan pengguna tertentu.

- **Cardinalitas**:  
  - Satu pengguna dapat memiliki banyak dokumen `orders`.  
  - Setiap dokumen `order` hanya terkait dengan satu pengguna.

---

## **3. `users` → `cartData`**
- **Jenis Hubungan**: **One-to-One** (Satu ke Satu)  
  - Field `cartData` dalam dokumen `users` menyimpan informasi keranjang belanja pengguna. Struktur ini menunjukkan bahwa keranjang terkait secara unik dengan pengguna tersebut.

- **Cardinalitas**:  
  - Satu pengguna memiliki satu dokumen `cartData`.

---

## **Kekurangan pada Model Data**
1. **Foreign Key Eksplisit**:  
   - MongoDB tidak secara langsung menegakkan hubungan antar-koleksi seperti SQL. Namun, field `id` dalam `orders.items` dan `userId` dalam `orders` menunjukkan referensi implisit ke koleksi lain.
   
2. **Saran Peningkatan**:
   - Gunakan field `_id` unik pada koleksi `foods` dan `users`, lalu gunakan referensi eksplisit di koleksi `orders` melalui `ObjectId`.
   - Tambahkan indeks pada referensi tersebut untuk meningkatkan efisiensi query.

---

## **Kesimpulan**
- Koleksi `foods` memiliki hubungan **one-to-many** dengan `orders` (direferensikan dalam array `items`).
- Koleksi `users` memiliki hubungan **one-to-many** dengan `orders` (melalui `userId`).
- Koleksi `users` memiliki hubungan **one-to-one** dengan `cartData`.

Hubungan ini logis, tetapi tidak sepenuhnya ditegakkan tanpa referensi eksplisit atau validasi tambahan.
