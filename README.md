# Kerupuk Seblak Bandung Premium — prototipe website

Website katalog dan pemesanan pre-order untuk Kerupuk Seblak Bandung Premium. Identitas visual memakai logo KSB dan warna burgundy–emas. Cerita merek berangkat dari tujuan pemilik sebagai mahasiswa untuk belajar mandiri dan kelak membantu orang tua menikmati hasil kerja keras mereka.

## Membuka di komputer

1. Buka folder ini di File Explorer.
2. Klik dua kali `index.html` untuk melihat desain. Form akun juga memiliki fallback agar dapat dicoba di preview file lokal.
3. Pastikan komputer terhubung ke internet agar foto rujukan dari Wikimedia Commons dan Pexels dimuat.

Untuk menjalankan server lokal, buka terminal pada folder ini lalu jalankan `npx serve .`; buka alamat lokal yang ditampilkan terminal.

## Isi prototipe

- Pilih bebas 1–9 jenis kerupuk; berat dibagi sama rata otomatis.
- Pilih berat bersih 100 g, 200 g, atau 300 g; harga mengikuti tarif per 100 g yang dapat diatur pemilik.
- Pilih enam racikan Signature dengan formula lengkap, atau pilih beberapa dari 10 bumbu dan atur sendok masing-masing.
- Keranjang dan checkout tamu; akun pelanggan opsional dengan WhatsApp + PIN untuk menyimpan alamat dan riwayat.
- Tidak ada minimum belanja. Ongkir tetap Rp10.000 untuk semua jarak dan gratis jika subtotal produk mencapai Rp70.000.
- Owner dapat mengganti logo utama, ikon tiap resep Signature, ikon tiap bumbu, foto katalog, dan foto hero dari Pengaturan dashboard.
- Produk Kerupuk Merah Obor kini ditampilkan sebagai Kerupuk Pangsit.
- Footer menampilkan WhatsApp admin Iqbal dan Rehan serta Instagram @_iqbalabdlh dan @raihanzhr.
- Open order dibuat pada hari pemesanan. Pengantaran paling cepat besok, atau lusa bila kuota harian penuh.
- Struk pesanan yang bisa dicetak/disimpan sebagai PDF, pembayaran manual QRIS, unggah bukti, dan cek status.
- Akun pemilik tidak ditampilkan di beranda; buka alamat situs dengan akhiran `#pemilik` untuk mendaftar atau masuk. Dashboard mengelola pesanan/stok/harga, foto hero dan foto tiap kerupuk, serta laporan keuangan dengan grafik, laba-rugi, arus kas, CSV, dan cetak PDF.
- Pemilik bisa mengecualikan satu pesanan keliru dari laporan keuangan dengan mencatat alasan, lalu memulihkannya kembali. Riwayat pesanan tetap tersimpan; transaksi yang dikecualikan tidak dihitung di omzet, arus kas, grafik, proyeksi, atau CSV.
- Racikan dipisah menjadi enam `Signature` dengan resep tetap dan mode `Racik sendiri` untuk mencentang beberapa bumbu serta memilih sendok tiap bumbu. Seluruh takaran adalah patokan per 100 g dan menyesuaikan otomatis untuk pilihan 200 g atau 300 g. Rincian tampil di tas, struk, riwayat, dan dashboard.
- Cerita pendiri dan visi-misi berdasarkan arahan pemilik.

## Formula bumbu Signature (per 100 g)

- **Bandung Signature:** Atom Bulan 1 sdt peres, kencur 1/2 sdt, Aida 1/2–3/4 sdt, bawang putih goreng halus 1/4–1/3 sdt.
- **Cikur Jeletot:** Atom Bulan 1 sdt, kencur 3/4 sdt, Aida 1 sdt, cabai rawit kering giling kasar (BonCabe) 3/4–1 sdt.
- **Bandung Jeruk:** Atom Bulan 1 sdt peres, kencur 1/2 sdt, Aida 1/2–3/4 sdt, bumbu daun jeruk 3/4–1 sdt.
- **BBQ Bandung Fusion:** Atom Bulan 1/2–3/4 sdt, kencur 1/4–1/3 sdt, Aida 1/2 sdt, bumbu BBQ 1,5 sdt.
- **Jagung Bakar Bandung:** Atom Bulan 1/2–3/4 sdt, kencur 1/4–1/3 sdt, Aida 1/4–1/3 sdt, bumbu Jagung Bakar 1,5 sdt.
- **Balado Daun Jeruk:** Atom Bulan 1/2–3/4 sdt, kencur sejumput (1/8 sdt), Aida 1/4–1/3 sdt, bumbu Balado Pedas Manis 1,25 sdt, bumbu daun jeruk 1/2–3/4 sdt.

Mode `Racik sendiri` menyediakan Bumbu Atom Bulan, kencur bubuk, cabai bubuk Aida, cabai rawit kering giling, bawang putih goreng halus, bumbu daun jeruk, bumbu BBQ, bumbu Jagung Bakar, bumbu Balado Pedas Manis, dan bumbu keju.

## Batasan sebelum dipakai jualan

Ini prototipe frontend statis. Pesanan, akun, alamat, foto bukti, dan pengaturan tersimpan di browser/perangkat yang sedang dipakai; data tidak terkirim ke server dan tidak sinkron antarperangkat. Akses owner tidak ditampilkan di beranda. Untuk demo lokal, buka `#pemilik` untuk mendaftarkan WhatsApp + PIN. Karena nomor WhatsApp asli dan PIN owner belum diberikan, prototipe tidak menanam nomor atau PIN palsu di kode. Pendaftaran lokal ini bukan autentikasi aman: siapa pun yang mengetahui `#pemilik` sebelum akun lokal dibuat bisa mengklaimnya, dan data lokal bisa dibaca atau diubah dari perangkat tersebut.

Jangan gunakan prototipe statis ini untuk menerima transaksi nyata. Untuk jualan sungguhan lintas perangkat, perlu backend/database bersama dan autentikasi server, lalu akun pemilik dibuat di backend sebelum website publik dibuka. QRIS harus diunggah pada Pengaturan pemilik. Tarif pelanggan adalah Rp10.000 flat atau gratis saat subtotal produk mencapai Rp70.000. Harga berasal dari simulasi konsep; masukkan harga dan HPP aktual pada Pengaturan sebelum dipakai. Formula sendok adalah patokan yang perlu dites pada batch produk.

## Foto dan kredit

Foto diambil dari sumber terbuka dan resolusi sumbernya cukup besar untuk tampilan kartu. Foto bertanda rujukan tidak selalu menunjukkan bentuk persis produk KSB; tiga kartu memakai ilustrasi vektor sendiri untuk membedakan bentuk rante, mawar putih, dan bintang. Ganti foto rujukan dengan foto kerupuk aktual sebelum promosi agar pelanggan melihat barang yang benar.

- SATELITBM, [Kerupuk Bawang warna Warni](https://commons.wikimedia.org/wiki/File:Kerupuk_Bawang_warna_Warni.jpg), CC BY-SA 4.0.
- Rubel Das, [Fusilli and Penne Pasta](https://commons.wikimedia.org/wiki/File:Fusilli_and_Penne_Pasta.jpg), CC0.
- Mdsheth1986, [Kerepek Bawang](https://commons.wikimedia.org/wiki/File:Kerepek_Bawang.jpg), CC BY-SA 4.0.
- Ruswandi1971, [Kerupuk Jengkol dan Beras](https://commons.wikimedia.org/wiki/File:Kerupuk_Jengkol_dan_Beras.jpg), CC BY-SA 4.0.
- Jerimee, [Macaroni](https://commons.wikimedia.org/wiki/File:Macaroni.png), CC0.
- Tamba Budiarsana, [Traditional Indonesian Snack with Red Chilies](https://www.pexels.com/photo/traditional-indonesian-snack-with-red-chilies-37106605/).

Ketentuan penggunaan setiap foto mengikuti halaman sumbernya. Pexels menyatakan foto dapat digunakan gratis berdasarkan [lisensi Pexels](https://www.pexels.com/license/). Gambar tetap dimuat dari situs sumber; situs memerlukan internet untuk menampilkannya.
