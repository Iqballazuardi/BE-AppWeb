# Project Library - Rekomendasi Buku

Aplikasi web yang menyajikan rekomendasi buku dengan fitur untuk menambah, menghapus, dan mengupdate data buku. Proyek ini menggunakan React dengan TypeScript untuk front-end dan Express untuk back-end. Teknologi lain yang digunakan meliputi:

- **SweetAlert (swal):** Untuk notifikasi dan konfirmasi interaktif.
- **Axios:** Untuk meng-handle HTTP request.
- **js-cookie:** Untuk manajemen cookies dan penyimpanan sesi.
- **React Query:** Untuk sinkronisasi data antara server dan client.
- **React Router:** Untuk navigasi antar halaman aplikasi.

---

## Fitur Utama

- **Tampilan Rekomendasi Buku:** Menampilkan daftar buku rekomendasi.
- **Tambah Buku:** Memungkinkan penambahan buku baru.
- **Hapus Buku:** Menghapus buku yang sudah tidak diinginkan.
- **Update Buku:** Mengupdate informasi buku yang ada.
- **Notifikasi Interaktif:** Menggunakan SweetAlert untuk interaksi pengguna.
- **Sinkronisasi Data:** Manajemen state dan data dengan React Query.
- **Routing Dinamis:** Navigasi antar halaman dengan React Router.
- **Manajemen Sesi:** Penggunaan js-cookie untuk penyimpanan data sesi.

---

## Teknologi yang Digunakan

- **Front-end:**

  - React
  - TypeScript
  - React Router
  - React Query
  - SweetAlert (swal)

- **Back-end:**

  - Express

- **Lainnya:**
  - Axios
  - js-cookie

---

## installassi

- **Front-end:**

  - cd appweb
  - npm install
  - npm run dev

- **Back-end:**
  - cd be-appweb
  - npm install
  - nodemon index

## Struktur Proyek

Berikut adalah gambaran umum struktur proyek:

```plaintext

BE-AppWeb/
   ├── index.js/             // Entry point untuk Express server
   │
   └── db.js/               // koneksi ke database



AppWeb/
   │
   └──src/
        ├── components/
        │   ├── AddBook.tsx       // Komponen Tambah buku
        │   ├── DarkMode.tsx      // Komponen Dark mode
        │   ├── DropDown.tsx      // Komponen Drop down
        │   ├── Home.tsx          // Komponen Home, daftar buku
        │   ├── Login.tsx         // Komponen Login
        │   ├── Navbar.tsx        // Komponen Navbar
        │   ├── Pagination.tsx    // Komponen Pagination
        │   ├── Registrasi.tsx    // Komponen Registrasi
        │   └── UpdateBook.tsx    // Komponen notifikasi dengan swal
        │
        ├── models/
        │   ├── book.ts           // interface book
        │   └── user.ts           // interface user
        ├── services/
        │   └── api.ts            // Konfigurasi Axios untuk melakukan request API
        ├── App.tsx               // Komponen utama aplikasi
        └── index.tsx             // Entry point React
```
