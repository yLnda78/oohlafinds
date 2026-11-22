# oohlafinds

Website katalog multi-halaman (HTML/CSS/JS murni, tanpa framework, tanpa build step).

## Struktur
```
index.html         Home
shop.html          Semua produk + filter kategori
collections.html   Produk per koleksi
about.html         Tentang
css/style.css      Semua styling (warna & font di :root)
js/products.js     DATA PRODUK (edit di sini)
js/main.js         Logika (nav, kartu, filter)
images/products/   Taruh gambar produk di sini
```

## Menjalankan lokal
Klik dua kali `index.html`, atau jalankan server lokal:
`python3 -m http.server 8000` lalu buka http://localhost:8000

## Mengganti gambar produk
Simpan gambar di `images/products/` dengan nama persis seperti field `image` di `js/products.js`
(contoh: `y2k-diamond-gloss-button.jpg`). Kalau file belum ada, tampil placeholder otomatis.

## Edit produk / link sosmed / link marketplace
Semua di `js/products.js`. Isi `url` pada bagian `social` untuk mengaktifkan link sosmed.

## Publish (gratis)
- Netlify Drop: buka app.netlify.com/drop, seret folder `oohlafinds`.
- GitHub Pages: upload folder ke repo, Settings > Pages > branch main.
- Cloudflare Pages / Vercel: import repo, tanpa build command, output directory `/`.

## Status gambar
Sudah ada foto: semua 25 produk.
Sampul koleksi dan hero Home memakai foto produk yang sama (lihat field "cover" di js/products.js).
Taruh file di images/products/ dengan nama persis seperti field "image" di js/products.js.
Glasses Cleaning Cloth Kit memakai kolase 4 kain (2x2).
