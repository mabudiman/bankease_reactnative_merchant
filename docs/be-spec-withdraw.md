# BE Specification — Withdraw Feature

> **BankEase Merchant · Mobile App**
> Tanggal: 31 Maret 2026
> Versi: 1.0.0

---

## Daftar Endpoint yang Dibutuhkan

| #   | Method | Endpoint                           | Deskripsi                                                              |
| --- | ------ | ---------------------------------- | ---------------------------------------------------------------------- |
| 1   | `GET`  | `/api/accounts`                    | Daftar rekening/kartu milik merchant (untuk dropdown "Choose Account") |
| 2   | `GET`  | `/api/accounts/:accountId/balance` | Saldo tersedia dari rekening yang dipilih                              |
| 3   | `POST` | `/api/withdrawals`                 | Submit transaksi penarikan (withdraw)                                  |
| 4   | `GET`  | `/api/withdrawals/:withdrawalId`   | Cek status transaksi withdraw (polling)                                |

---

## 1. GET `/api/accounts`

Mengambil daftar rekening/kartu yang dimiliki merchant yang sedang login. Digunakan untuk mengisi dropdown **"Choose Account / Card"** di form Withdraw.

### Headers

```
Authorization: Bearer <access_token>
```

### Query Parameters

| Parameter | Tipe     | Wajib | Keterangan                                                                            |
| --------- | -------- | ----- | ------------------------------------------------------------------------------------- |
| `type`    | `string` | Tidak | Filter tipe rekening: `SAVINGS`, `GIRO`, `CARD`. Jika tidak dikirim, kembalikan semua |

### Response — 200 OK

```json
{
  "accounts": [
    {
      "id": "acc-001",
      "account_number": "1900 8988 5456",
      "account_name": "Demo Merchant",
      "account_type": "SAVINGS",
      "card_provider": "VISA",
      "currency": "IDR",
      "is_active": true
    },
    {
      "id": "acc-002",
      "account_number": "1900 8112 5222",
      "account_name": "Demo Merchant",
      "account_type": "SAVINGS",
      "card_provider": "VISA",
      "currency": "IDR",
      "is_active": true
    },
    {
      "id": "acc-003",
      "account_number": "4411 0000 1234",
      "account_name": "Demo Merchant",
      "account_type": "CARD",
      "card_provider": "VISA",
      "currency": "IDR",
      "is_active": true
    },
    {
      "id": "acc-004",
      "account_number": "1900 8988 5457",
      "account_name": "Demo Merchant",
      "account_type": "SAVINGS",
      "card_provider": "VISA",
      "currency": "IDR",
      "is_active": false
    }
  ]
}
```

### Response — 401 Unauthorized

```json
{
  "code": "UNAUTHORIZED",
  "message": "Token tidak valid atau sudah kedaluwarsa."
}
```

### Catatan

- **`id`** digunakan sebagai nilai yang dikirim saat submit withdraw, bukan `account_number`.
- **`is_active: false`** = akun tidak bisa dipilih (dinonaktifkan / dibekukan). Frontend akan menonaktifkan item tersebut di dropdown.
- `account_number` ditampilkan dalam format **spasi setiap 4 digit** untuk kemudahan baca.
- `card_provider` digunakan frontend untuk memformat tampilan: `"VISA **** **** **** 1234"`.
- Urutkan berdasarkan `is_active DESC` lalu `account_number ASC`.

---

## 2. GET `/api/accounts/:accountId/balance`

Mengambil saldo tersedia dari rekening yang dipilih. Dipanggil setelah user memilih akun dari dropdown.

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

| Parameter   | Tipe     | Keterangan                            |
| ----------- | -------- | ------------------------------------- |
| `accountId` | `string` | ID rekening dari response endpoint #1 |

### Response — 200 OK

```json
{
  "account_id": "acc-001",
  "balance": 1000000,
  "currency": "IDR",
  "formatted_balance": "Rp 1.000.000"
}
```

### Response — 404 Not Found

```json
{
  "code": "ACCOUNT_NOT_FOUND",
  "message": "Rekening tidak ditemukan."
}
```

### Catatan

- **`balance`** dalam **minor unit** (sen/rupiah terkecil × 100). Contoh: `1000000` = Rp 10.000,00 — disesuaikan dengan konvensi moneter internal app.
- **`formatted_balance`** bersifat opsional namun direkomendasikan untuk mencegah logika format duplikat di frontend.
- Gunakan currency `IDR` untuk Rupiah, `USD` untuk Dolar, dll (ISO 4217).

---

## 3. POST `/api/withdrawals`

Menyimpan dan memproses transaksi penarikan dana.

### Headers

```
Authorization: Bearer <access_token>
Content-Type: application/json
Idempotency-Key: <uuid-v4>
```

> **`Idempotency-Key`** wajib ada untuk mencegah double-submit jika request dikirim ulang karena timeout jaringan. Simpan key ini di server dan tolak request kedua dengan key yang sama (kembalikan response awal yang tersimpan).

### Request Body

```json
{
  "account_id": "acc-001",
  "phone_number": "+628123456789",
  "amount": 50000,
  "currency": "IDR",
  "note": "Penarikan kas operasional"
}
```

| Field          | Tipe     | Wajib | Validasi                                                                                  |
| -------------- | -------- | ----- | ----------------------------------------------------------------------------------------- |
| `account_id`   | `string` | ✅    | Harus milik merchant yang sedang login                                                    |
| `phone_number` | `string` | ✅    | Minimal 8 digit angka (boleh format internasional `+62...`)                               |
| `amount`       | `number` | ✅    | Integer positif, dalam minor unit. Min: `1000` (IDR). Tidak boleh melebihi saldo tersedia |
| `currency`     | `string` | ✅    | ISO 4217. Harus sesuai dengan currency rekening                                           |
| `note`         | `string` | Tidak | Maks 255 karakter. Boleh kosong                                                           |

### Response — 201 Created

```json
{
  "withdrawal_id": "wd-20260331-00123",
  "status": "PENDING",
  "account_id": "acc-001",
  "account_number": "1900 8988 5456",
  "card_provider": "VISA",
  "phone_number": "+628123456789",
  "amount": 50000,
  "currency": "IDR",
  "note": "Penarikan kas operasional",
  "created_at": "2026-03-31T08:30:00Z"
}
```

### Response — 400 Bad Request

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Data tidak valid.",
  "errors": [
    {
      "field": "phone_number",
      "message": "Nomor telepon harus mengandung minimal 8 digit."
    },
    {
      "field": "amount",
      "message": "Jumlah penarikan tidak boleh melebihi saldo tersedia."
    }
  ]
}
```

### Response — 422 Unprocessable Entity — Saldo Tidak Cukup

```json
{
  "code": "INSUFFICIENT_FUNDS",
  "message": "Saldo tidak mencukupi untuk melakukan penarikan."
}
```

### Response — 409 Conflict — Idempotency Key Duplikat

```json
{
  "code": "DUPLICATE_REQUEST",
  "message": "Permintaan ini sudah pernah diproses.",
  "withdrawal_id": "wd-20260331-00123"
}
```

### Response — 503 Service Unavailable

```json
{
  "code": "SERVICE_UNAVAILABLE",
  "message": "Layanan sedang tidak tersedia. Coba lagi dalam beberapa saat."
}
```

---

## 4. GET `/api/withdrawals/:withdrawalId`

Mengambil status terkini dari transaksi withdraw. Digunakan untuk **status polling** di sisi frontend setelah submit berhasil (menunggu konfirmasi dari core banking).

### Headers

```
Authorization: Bearer <access_token>
```

### Path Parameters

| Parameter      | Tipe     | Keterangan                   |
| -------------- | -------- | ---------------------------- |
| `withdrawalId` | `string` | ID dari response endpoint #3 |

### Response — 200 OK

```json
{
  "withdrawal_id": "wd-20260331-00123",
  "status": "SUCCESS",
  "account_id": "acc-001",
  "account_number": "1900 8988 5456",
  "card_provider": "VISA",
  "phone_number": "+628123456789",
  "amount": 50000,
  "currency": "IDR",
  "note": "Penarikan kas operasional",
  "created_at": "2026-03-31T08:30:00Z",
  "completed_at": "2026-03-31T08:30:05Z"
}
```

### Status Values

| Status      | Keterangan                                    |
| ----------- | --------------------------------------------- |
| `PENDING`   | Transaksi sedang diproses oleh core banking   |
| `SUCCESS`   | Transaksi berhasil — tampilkan success screen |
| `FAILED`    | Transaksi gagal — tampilkan pesan error       |
| `CANCELLED` | Transaksi dibatalkan oleh sistem atau user    |

### Response — 404 Not Found

```json
{
  "code": "WITHDRAWAL_NOT_FOUND",
  "message": "Transaksi tidak ditemukan."
}
```

---

## Data Model Ringkas

```
Account
├── id              string  (PK)
├── merchant_id     string  (FK → Merchant)
├── account_number  string
├── account_name    string
├── account_type    enum    SAVINGS | GIRO | CARD
├── card_provider   string  VISA | MASTERCARD | etc
├── currency        string  ISO 4217
└── is_active       boolean

Withdrawal
├── id              string  (PK, format: wd-YYYYMMDD-NNNNN)
├── merchant_id     string  (FK → Merchant)
├── account_id      string  (FK → Account)
├── idempotency_key string  (UNIQUE)
├── phone_number    string
├── amount          integer (minor unit)
├── currency        string  ISO 4217
├── note            string  (nullable)
├── status          enum    PENDING | SUCCESS | FAILED | CANCELLED
├── created_at      datetime
└── completed_at    datetime (nullable)
```

---

## Konvensi Umum

| Aspek              | Konvensi                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Base URL**       | `https://api.bankease.id` (production)                                                                      |
| **Autentikasi**    | Bearer Token pada header `Authorization`                                                                    |
| **Format tanggal** | ISO 8601 UTC — `2026-03-31T08:30:00Z`                                                                       |
| **Uang (amount)**  | Integer **minor unit** (IDR: sen, USD: cent). `50000` IDR = Rp 500,00                                       |
| **Bahasa error**   | `message` dalam Bahasa Indonesia untuk ditampilkan ke user                                                  |
| **HTTP Status**    | `200` GET sukses, `201` POST sukses, `400` validasi, `401` auth, `422` bisnis, `409` duplikat, `503` server |
| **Timeout**        | Frontend timeout 10 detik (`API_TIMEOUT_MS = 10000`) — backend harus merespons dalam batas ini              |

---

## Alur Lengkap (Frontend → Backend)

```
1. [App Load]     GET /api/accounts            → Isi dropdown pilih rekening

2. [Pilih Akun]   GET /api/accounts/:id/balance → Tampilkan saldo tersedia

3. [Submit Form]  POST /api/withdrawals
                  Body: { account_id, phone_number, amount, currency, note }
                  → Response: { withdrawal_id, status: "PENDING", ... }

4. [Polling]      GET /api/withdrawals/:id      (setiap 2 detik, maks 30 detik)
                  → Jika status = "SUCCESS" → tampilkan success screen
                  → Jika status = "FAILED"  → tampilkan error
                  → Jika timeout polling    → tampilkan "Cek status di riwayat transaksi"
```

---

## Catatan Integrasi untuk Frontend

- **Dropdown akun**: field yang ditampilkan ke user adalah `account_number`, disimpan internal adalah `id`.
- **Masking tampilan**: frontend memformat `account_number` menjadi `"VISA **** **** **** XXXX"` menggunakan `card_provider` + 4 digit terakhir.
- **Validasi phone**: minimal 8 digit angka (strip `+`, spasi, `-`, `()`). Validasi ini dilakukan di frontend **dan** backend.
- **Nominal preset**: `[10000, 50000, 100000, 150000, 200000]` (dalam minor unit IDR) + opsi "Other" untuk input bebas.
- **Idempotency-Key**: frontend generate UUID v4 baru untuk setiap **sesi submit form** (bukan per-tap tombol), reset setelah success.
