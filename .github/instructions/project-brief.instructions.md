---
applyTo: '**'
---

# Project Brief

## Nama Proyek
Sample Merchant Dashboard

## Versi
1.0.0

## Deskripsi
Aplikasi mobile merchant dashboard yang dibangun dengan Expo/React Native. Memungkinkan merchant (pemilik bisnis) untuk memantau saldo rekening bisnis, melihat riwayat transaksi, dan melakukan payout (transfer keluar) secara aman ke rekening bank via IBAN.

## Tujuan Utama
- Memberikan visibilitas real-time terhadap saldo dan riwayat transaksi merchant
- Menyediakan alur payout yang aman dengan pencegahan duplikasi transaksi
- Melindungi data finansial di perangkat mobile

## Platform Target
- iOS (primary)
- Android (primary)
- Web (Expo, secondary)

## Scope Fitur
1. **Dashboard Home**: Tampilkan saldo available & pending, preview aktivitas terbaru
2. **Riwayat Aktivitas**: Daftar transaksi dengan infinite scroll (cursor-based pagination)
3. **Payout**: Form input → konfirmasi modal → biometrik (jika > £1,000) → API → result modal
4. **Keamanan**: Biometrik, idempotency key, device ID, deteksi screenshot, anti double-submit
5. **Internasionalisasi**: English (default) dan Español
6. **Dark/Light mode**: Dukungan tema sistem

## Backend
Di-mock menggunakan MSW (Mock Service Worker) pada `http://localhost:3000`. Tidak ada backend nyata — semua API endpoint disimulasikan.

## Batasan & Kendala
- Native biometric: Custom Expo module (`modules/expo-screen-security`), **tidak menggunakan library pihak ketiga**
- Device ID: Dari native module yang sama
- Screenshot detection: Native listener via modul yang sama
- Mata uang: GBP dan EUR saja
- Threshold biometrik: £1,000 (atau ekuivalen di mata uang lain)