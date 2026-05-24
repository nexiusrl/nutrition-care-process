# Nutrition Care Process (NCP) - Self-Care Console

Aplikasi **NCP Self-Care Console** adalah platform digitalisasi asuhan gizi terstandar (ADIME) mandiri berbasis web yang dirancang untuk penatalaksanaan diet penyakit **Ginjal Kronis (CKD)**, **Hipertensi**, dan **Asam Urat (Gout)**, serta pemantauan gizi **Sehat Umum (Mandiri)**. 

Aplikasi ini dibangun menggunakan **Next.js (App Router)** dan **Tailwind CSS** dengan menerapkan standar perhitungan gizi resmi **Kemenkes RI / PAGT (Proses Asuhan Gizi Terstandar)**.

---

## 🎨 Sistem Desain: Clinical Monochrome
Aplikasi ini menggunakan sistem desain **Clinical Monochrome (Monokrom Klinis)** untuk menjaga konsistensi dan meminimalkan distraksi visual bagi pengguna:
* **Display / Heading Font:** `Space Grotesk` (Kesan teknis, modular, dan modern).
* **Body Font:** `Plus Jakarta Sans` (Tingkat keterbacaan tinggi untuk konten klinis).
* **Lab Data / Numbers Font:** `Space Mono` (Memudahkan pemindaian nilai angka kalori/laboratorium).
* **Palet Warna:** Monokromatik (Grayscale/Hitam-Abu-Abu) dengan saturasi sangat rendah. Warna kontras (seperti merah desaturasi) hanya digunakan secara fungsional untuk penandaan peringatan medis (data lab abnormal atau batas asupan terlampaui).

---

## ⚙️ Fitur Utama (Alur ADIME Mandiri)
Dasbor dirancang dengan alur terbimbing bertahap yang runtut:

1. **Langkah 1: Asesmen Mandiri**
   * Pengisian data antropometri (Tinggi Badan, Berat Badan, Umur, Gender) yang menghitung otomatis Berat Badan Ideal (BBI) rumus Broca dan Indeks Massa Tubuh (IMT).
   * Pengisian hasil laboratorium biokimia (eGFR, Kalium Darah, Tekanan Darah, Asam Urat) secara dinamis sesuai penyakit yang dipilih.
2. **Langkah 2: Diagnosis Gizi Otomatis**
   * Sistem secara cerdas menyusun draf diagnosis gizi otomatis dalam format pernyataan **PES (Problem, Etiology, Sign/Symptom)** berdasarkan anomali data laboratorium.
   * Dilengkapi dengan *Medical Disclaimer* keselamatan pasien yang tebal.
3. **Langkah 3: Rencana Gizi**
   * Kalkulator Energi Total (TEE) menggunakan rumus BMR Harris-Benedict yang disesuaikan dengan faktor aktivitas dan stres klinis penyakit.
   * Penghitungan batas aman zat gizi makro dan mikro (Protein, Natrium, Kalium, Cairan, Purin) sesuai kategori patologis Kemenkes RI, dengan kebebasan kustomisasi (override) oleh pengguna.
   * Fitur ekspor Leaflet Diet format PDF siap cetak.
4. **Langkah 4: Log Harian & Monitoring**
   * Pencatatan asupan makan harian pengguna secara mobile-friendly.
   * Indikator grafik progress bar kemajuan gizi aktual vs target batas gizi harian yang reaktif secara real-time.
5. **Langkah 5: AI Gizi Assistant**
   * Simulator bot asisten AI yang cerdas menjawab pertanyaan diet klinis pengguna secara kontekstual sesuai parameter kondisi tubuh dan penyakitnya.

---

## 🚀 Memulai Aplikasi

### Persyaratan Sistem
* Node.js versi 18.0 atau lebih tinggi
* npm, yarn, pnpm, atau bun

### Instalasi Dependensi
Jalankan perintah berikut di direktori proyek untuk memasang seluruh paket pustaka:
```bash
npm install
```

### Menjalankan Server Lokal (Development)
Jalankan perintah berikut untuk mengaktifkan local development server:
```bash
npm run dev
```
Buka peramban (browser) Anda dan akses halaman [http://localhost:3000](http://localhost:3000).

### Membangun Versi Produksi (Production Build)
Untuk membangun versi teroptimasi siap rilis:
```bash
npm run build
```
Lalu jalankan aplikasi hasil build:
```bash
npm run start
```

---

## 📂 Struktur Direktori Utama
* `src/app/` - Direktori rute dan layout utama Next.js App Router.
  * `page.tsx` - Halaman landing utama (publik).
  * `globals.css` - Konfigurasi variabel CSS monokrom dan tema Tailwind CSS.
  * `layout.tsx` - Pengaturan Google Fonts dan metadata SEO aplikasi.
  * `dashboard/page.tsx` - Dasbor asuhan gizi mandiri terintegrasi (user portal).
* `src/utils/` - Logika fungsi pembantu.
  * `nutritionCalculations.ts` - Implementasi rumus komputasional gizi Kemenkes (BBI, TEE, pembatasan makro/mikro).
