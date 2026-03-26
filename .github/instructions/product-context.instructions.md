---
applyTo: '**'
---

# Product Context

## Mengapa Produk Ini Ada
Merchant membutuhkan akses mobile yang mudah dan aman ke informasi keuangan bisnis mereka — saldo real-time, riwayat transaksi, dan kemampuan mengirim dana ke rekening bank tanpa harus menggunakan web banking tradisional.

## Masalah yang Diselesaikan
1. **Visibilitas keuangan**: Merchant ingin lihat saldo available & pending kapan saja
2. **Transaksi aman**: Payout harus mencegah duplikasi, memverifikasi identitas untuk transaksi besar
3. **Keamanan data di mobile**: Screenshot pada layar sensitif bisa membocorkan data finansial

## Target Pengguna
**Merchant / Pemilik Bisnis** yang memiliki akun bisnis dan perlu:
- Memantau arus kas
- Mengirim payout ke vendor/supplier via IBAN
- Meninjau riwayat transaksi

## User Experience Goals

### Home Screen
- Saldo available dan pending langsung terlihat di atas
- Preview 15 transaksi terbaru
- Tombol "Show More" untuk lihat semua riwayat
- Refresh otomatis setelah payout berhasil

### Alur Payout (form → confirm → send → result)
1. User mengisi form: Amount, Currency (GBP/EUR), IBAN
2. Submit → Confirmation modal muncul dengan detail (jumlah + IBAN masked: `IBAN ************1234`)
3. Tap "Send" → biometrik diminta jika amount > £1,000
4. Loading state "Sending..."
5. Result modal: sukses atau error dengan aksi yang tepat (retry/close/create another)

### Error Handling UX
| Skenario | Aksi Tersedia |
|----------|---------------|
| Sukses | "Create Another Payout" atau "Close" |
| Insufficient Funds (400) | "Close" (form reset) — non-recoverable |
| Service Unavailable (503) | "Try Again" — recoverable |
| Network Error | "Try Again" — recoverable |
| Biometric Cancelled | "Try Again" — recoverable |

## Mata Uang & Format
- Nilai disimpan dalam **minor unit** (pence/cent): 1050 = £10.50
- Tampilkan selalu dalam **major unit** dengan 2 desimal
- Warna: positif = hijau `#34C759`, negatif = merah `#FF3B30`

## Alur Autentikasi (Sign In → Forgot Password)
1. User di halaman Sign In, klik "Forgot your password?"
2. Layar Forgot Password: input kode OTP + tombol Resend
3. Setelah OTP valid, navigasi ke layar Change Password
4. Input password baru + konfirmasi password (dengan toggle visibility)
5. Sukses → layar konfirmasi dengan ilustrasi + tombol "Ok" kembali ke Sign In

## Internasionalisasi
- Default: English
- Tersedia: Indonesian (Bahasa Indonesia)
- Dikelola via `core/i18n/` dengan context React
- Locale per-feature: `features/<nama>/locales/{en,id}.json` dengan prefix namespace