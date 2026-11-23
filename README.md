# Cloudflare Pages Geo Redirect

Proyek ini memakai Cloudflare Pages Functions untuk melakukan redirect HTTP 302 di sisi server. Redirect tidak membutuhkan JavaScript di browser.

## Aturan tujuan

- IP yang dikenali Cloudflare sebagai Indonesia (`ID`): YouTube.
- Negara lain yang memiliki kode negara dua huruf dan terdeteksi: Instagram atau Facebook, dipilih acak.
- Negara kosong/tidak tersedia, `XX`, atau kode negara dengan format tidak valid: HTTP 503.

## Pembagian acak

Setiap permintaan dari negara selain Indonesia memiliki peluang 50% ke Instagram dan 50% ke Facebook. Hasil total dalam sejumlah kunjungan tidak dijamin tepat 50:50.

## Struktur repository

```text
repository/
├── index.html
├── README.md
└── functions/
    └── index.js
```

Folder `functions` harus berada langsung di root repository.

## Pengaturan Cloudflare Pages

Hubungkan repository GitHub ini melalui **Workers & Pages > Create application > Pages > Connect to Git**.

Gunakan pengaturan:

- Framework preset: None
- Root directory: `/` atau kosong (root repository)
- Build command: kosong
- Build output directory: `.`

Jangan gunakan perintah deploy Worker seperti `npx wrangler deploy` untuk konfigurasi Pages ini.

## Catatan akurasi dan pengujian

Negara ditentukan dari informasi geolokasi IP yang disediakan Cloudflare melalui `request.cf.country`. Geolokasi IP tidak menjamin lokasi fisik 100% benar. VPN, proxy, jaringan seluler, dan data geolokasi dapat menyebabkan negara salah terdeteksi.

Jika Cloudflare tidak menyediakan kode negara yang dapat dipakai, fungsi mengembalikan 503 agar permintaan tidak salah diarahkan sebagai pengunjung luar Indonesia.

Setelah deployment, uji dari jaringan yang diketahui lokasinya dan periksa status HTTP serta header `Location`. Pastikan domain memakai Cloudflare Pages dan fungsi berjalan pada route `/`.
