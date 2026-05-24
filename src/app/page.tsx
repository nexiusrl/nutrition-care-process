"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "nutritionist" | "patient" | "client"
  >("nutritionist");

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-zinc-800 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm tracking-tighter">
              N
            </div>
            <span className="font-display font-bold tracking-tight text-lg">
              NUTRITION CARE PROCESS
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              href="#adime"
              className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
              Sistem ADIME
            </a>
            <a
              href="#spesialisasi"
              className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
              Spesialisasi Klinis
            </a>
            <a
              href="#preview"
              className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
              Preview Dasbor
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/nutritionist"
              className="px-4 py-2 text-xs font-mono border border-zinc-800 dark:border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            >
              PORTAL MEDIS
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col items-start gap-6">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              // DIGITALISASI REKAM MEDIS GIZI KLINIS
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
              Metodologi ADIME dalam Satu Konsol Terintegrasi.
            </h1>
            <p className="font-sans text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">
              Platform pendukung keputusan asuhan gizi klinis untuk penyakit
              Ginjal, Hipertensi, dan Asam Urat. Menghitung rumatan gizi presisi
              berbasis pedoman resmi Kemenkes RI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <Link
                href="/dashboard/nutritionist"
                className="flex items-center justify-center px-6 h-12 bg-primary text-primary-foreground text-sm font-mono tracking-tight hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                MASUK PORTAL AHLI GIZI (DEMO)
              </Link>
              <Link
                href="/dashboard/patient"
                className="flex items-center justify-center px-6 h-12 border border-zinc-300 dark:border-zinc-700 text-sm font-mono tracking-tight hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                LOG MONITORING PASIEN (DEMO)
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4 hidden lg:block border border-dashed border-zinc-300 dark:border-zinc-700 p-6 bg-zinc-50 dark:bg-zinc-950 font-mono text-xs">
            <div className="flex justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
              <span className="text-zinc-400">METRIC CLASS</span>
              <span className="text-emerald-600 dark:text-emerald-500 font-bold">
                ACTIVE
              </span>
            </div>
            <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <p>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  FORMULA:
                </span>{" "}
                Harris-Benedict (rev)
              </p>
              <p>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  STANDARD:
                </span>{" "}
                PAGT Kemenkes RI
              </p>
              <p>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  eGFR INFERENCE:
                </span>{" "}
                Auto-restrict Protein
              </p>
              <p>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  BP INFERENCE:
                </span>{" "}
                Sodium limits (RG-II/III)
              </p>
              <p>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  URIC ACID INFERENCE:
                </span>{" "}
                Purine restrict
              </p>
            </div>
            <div className="mt-6 p-3 bg-zinc-900 text-zinc-100 rounded">
              <span className="text-[10px] text-zinc-400 block mb-1">
                TERMINAL LOG
              </span>
              <p className="font-bold text-zinc-300">
                SYSTEM READY & SECURED BY RLS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ADIME Grid Section */}
      <section
        id="adime"
        className="py-24 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="font-mono text-xs text-zinc-500 block mb-2">
              // CORE METHODOLOGY
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Sistem Grid ADIME Terstandardisasi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 flex flex-col justify-between h-64">
              <div>
                <span className="font-mono text-zinc-400 text-sm block mb-4">
                  STEP 01
                </span>
                <h3 className="font-display font-bold text-xl mb-2">
                  Assessment
                </h3>
                <p className="text-xs text-zinc-500">
                  Pengumpulan data antropometri, nilai laboratorium biokimia
                  (eGFR, kreatinin, asam urat), fisik klinis, dan recall gizi
                  harian.
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                INPUT DATA KLINIS
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 flex flex-col justify-between h-64">
              <div>
                <span className="font-mono text-zinc-400 text-sm block mb-4">
                  STEP 02
                </span>
                <h3 className="font-display font-bold text-xl mb-2">
                  Diagnosis
                </h3>
                <p className="text-xs text-zinc-500">
                  Identifikasi problem gizi secara otomatis dari anomali data
                  lab dan antropometri (Problem, Etiology, Sign/Symptom).
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                PES STATEMENT GENERATOR
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 flex flex-col justify-between h-64">
              <div>
                <span className="font-mono text-zinc-400 text-sm block mb-4">
                  STEP 03
                </span>
                <h3 className="font-display font-bold text-xl mb-2">
                  Intervention
                </h3>
                <p className="text-xs text-zinc-500">
                  Kalkulasi presisi zat gizi makro & mikro. Penyusunan diet
                  schedule serta ekspor PDF leaflet gizi secara instan.
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                PDF LEAFLET GENERATOR
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 flex flex-col justify-between h-64">
              <div>
                <span className="font-mono text-zinc-400 text-sm block mb-4">
                  STEP 04
                </span>
                <h3 className="font-display font-bold text-xl mb-2">
                  Monitoring
                </h3>
                <p className="text-xs text-zinc-500">
                  Pencatatan asupan makan harian oleh pasien dan pelacakan
                  fluktuasi berat badan secara mobile-friendly.
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                DAILY DIET LOGGING
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 flex flex-col justify-between h-64">
              <div>
                <span className="font-mono text-zinc-400 text-sm block mb-4">
                  STEP 05
                </span>
                <h3 className="font-display font-bold text-xl mb-2">
                  Evaluation
                </h3>
                <p className="text-xs text-zinc-500">
                  Analisis deviasi asupan aktual terhadap target presisi. Grafik
                  kemajuan kepatuhan diet berkala.
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                EVALUATION METRICS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spesialisasi Klinis */}
      <section
        id="spesialisasi"
        className="py-24 border-b border-zinc-200 dark:border-zinc-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="font-mono text-xs text-zinc-500 block mb-2">
              // TARGET PATOLOGY
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Kalkulator Gizi Penyakit Kronis
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ginjal */}
            <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-display font-bold mb-4">
                G
              </div>
              <h3 className="font-display font-bold text-xl mb-2">
                Penyakit Ginjal Kronis (CKD)
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                Restriksi protein ketat berdasarkan kadar eGFR pasien
                non-dialisis (0.6 - 0.8 g/kg BB) untuk meminimalkan beban
                filtrasi ginjal. Batasan kalium & fosfor otomatis.
              </p>
              <div className="font-mono text-[10px] p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
                Formula Protein: eGFR &lt; 60 &rarr; 0.6g/kg BBI
              </div>
            </div>

            {/* Hipertensi */}
            <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-display font-bold mb-4">
                H
              </div>
              <h3 className="font-display font-bold text-xl mb-2">
                Hipertensi (DASH Diet)
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                Pembatasan asupan natrium terbagi dalam kategori Diet Rendah
                Garam I, II, dan III. Sistem secara otomatis merekomendasikan
                target natrium dari data tekanan darah.
              </p>
              <div className="font-mono text-[10px] p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
                Formula Natrium: Sistolik &ge; 140 &rarr; 800mg (RG-II)
              </div>
            </div>

            {/* Asam Urat */}
            <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-display font-bold mb-4">
                U
              </div>
              <h3 className="font-display font-bold text-xl mb-2">
                Asam Urat (Gout)
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                Batasan asupan purin &lt; 150 mg sehari untuk mencegah
                penumpukan asam urat. Penyesuaian rekomendasi cairan hidrasi
                tinggi untuk ekskresi optimal.
              </p>
              <div className="font-mono text-[10px] p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
                Formula Purin: Rendah Purin &amp; Cairan &ge; 3.0L
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Segmentasi Preview */}
      <section id="preview" className="py-24 bg-zinc-50/50 dark:bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-zinc-500 block mb-2">
                // ANTARMUKA PENGGUNA
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight">
                Simulasi Tampilan Dasbor
              </h2>
            </div>
            <div className="flex border border-zinc-300 dark:border-zinc-700 p-1 bg-white dark:bg-black rounded-lg">
              <button
                onClick={() => setActiveTab("nutritionist")}
                className={`px-4 py-1.5 text-xs font-mono rounded ${activeTab === "nutritionist" ? "bg-primary text-primary-foreground font-bold" : "text-zinc-600"}`}
              >
                Ahli Gizi
              </button>
              <button
                onClick={() => setActiveTab("patient")}
                className={`px-4 py-1.5 text-xs font-mono rounded ${activeTab === "patient" ? "bg-primary text-primary-foreground font-bold" : "text-zinc-600"}`}
              >
                Pasien Medis
              </button>
              <button
                onClick={() => setActiveTab("client")}
                className={`px-4 py-1.5 text-xs font-mono rounded ${activeTab === "client" ? "bg-primary text-primary-foreground font-bold" : "text-zinc-600"}`}
              >
                Klien Sehat (Mandiri)
              </button>
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-lg shadow-sm">
            {activeTab === "nutritionist" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <div>
                      <h3 className="font-display font-bold text-lg">
                        Konsol Ahli Gizi (Desktop Sentris)
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Modul ADIME interaktif dengan data rekam medis terpadu.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-1 border border-zinc-200 dark:border-zinc-800">
                      ROLE: NUTRITIONIST
                    </span>
                  </div>

                  {/* Mock UI Asesmen */}
                  <div className="border border-dashed border-zinc-300 dark:border-zinc-700 p-4 rounded space-y-4">
                    <span className="text-[10px] font-mono text-zinc-400 block">
                      // PREVIEW MODUL ASESMEN
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono block text-zinc-400 mb-1">
                          TINGGI BADAN (CM)
                        </label>
                        <div className="font-mono border border-zinc-200 dark:border-zinc-800 p-2 text-sm bg-zinc-50 dark:bg-zinc-900">
                          170 cm
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono block text-zinc-400 mb-1">
                          BERAT BADAN (KG)
                        </label>
                        <div className="font-mono border border-zinc-200 dark:border-zinc-800 p-2 text-sm bg-zinc-50 dark:bg-zinc-900">
                          72 kg
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-mono block text-zinc-400 mb-1">
                          BBI (ESTIMASI)
                        </label>
                        <div className="font-mono p-2 text-sm bg-zinc-900 text-white dark:bg-white dark:text-black font-bold">
                          63.0 kg
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono block text-zinc-400 mb-1">
                          IMT
                        </label>
                        <div className="font-mono p-2 text-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          24.9 (Normal)
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono block text-zinc-400 mb-1">
                          DIAGNOSIS UTAMA
                        </label>
                        <div className="font-mono p-2 text-xs bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300 border border-red-200 dark:border-red-900 font-bold">
                          GINJAL KRONIS (CKD)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4 bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    // SPESIFIKASI DUKUNGAN KEPUTUSAN
                  </span>
                  <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      Alur Pengambilan Keputusan:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Validasi data lab real-time.</li>
                      <li>
                        Kombinasi formulasi gizi makro dan mikro otomatis.
                      </li>
                      <li>Penyusunan Leaflet PDF siap unduh untuk pasien.</li>
                    </ul>
                  </div>
                  <Link
                    href="/dashboard/nutritionist"
                    className="w-full flex items-center justify-center h-10 bg-primary text-primary-foreground text-xs font-mono hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    COBA KONSOL AHLI GIZI &rarr;
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "patient" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <div>
                      <h3 className="font-display font-bold text-lg">
                        Dasbor Pasien (Mobile First / Responsive)
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Membantu pasien mengontrol progres gizi harian secara
                        mandiri.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-1 border border-zinc-200 dark:border-zinc-800">
                      ROLE: PATIENT
                    </span>
                  </div>

                  {/* Mock UI Pasien */}
                  <div className="border border-dashed border-zinc-300 dark:border-zinc-700 p-4 rounded space-y-4">
                    <span className="text-[10px] font-mono text-zinc-400 block">
                      // PROGRES TARGET GIZI SEHARI
                    </span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span>ASUPAN ENERGI</span>
                          <span>1,450 kcal / 1,800 kcal (80%)</span>
                        </div>
                        <div className="h-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-800 dark:bg-zinc-200"
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1 text-red-600 dark:text-red-400 font-semibold">
                          <span>BATAS PROTEIN (CKD RESTRICTION)</span>
                          <span>38g / 45g (84%)</span>
                        </div>
                        <div className="h-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500/80"
                            style={{ width: "84%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4 bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    // FITUR PASIEN MEDIS
                  </span>
                  <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      Kelebihan Antarmuka Pasien:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Log harian visual ringkas.</li>
                      <li>Akses cepat ke berkas PDF Leaflet dari Ahli Gizi.</li>
                      <li>Live Chat aman dengan Ahli Gizi pendamping.</li>
                    </ul>
                  </div>
                  <Link
                    href="/dashboard/patient"
                    className="w-full flex items-center justify-center h-10 bg-primary text-primary-foreground text-xs font-mono hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    COBA LOG MONITORING &rarr;
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "client" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
                    <div>
                      <h3 className="font-display font-bold text-lg">
                        Klien Sehat (Pemantauan Mandiri)
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Pemantauan status gizi (BBI, IMT) umum tanpa
                        pendampingan klinis.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-1 border border-zinc-200 dark:border-zinc-800">
                      ROLE: GENERAL USER
                    </span>
                  </div>

                  <div className="border border-dashed border-zinc-300 dark:border-zinc-700 p-4 rounded space-y-3 font-mono text-xs">
                    <p>// STATUS ESTIMASI MANDIRI</p>
                    <p className="text-zinc-500">
                      Masukkan Tinggi Badan dan Berat Badan Anda di halaman
                      monitoring mandiri untuk memperoleh hasil instan.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4 bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 block">
                    // MONITORING MANDIRI
                  </span>
                  <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      Fungsionalitas:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Kalkulasi IMT instan.</li>
                      <li>Estimasi berat badan ideal.</li>
                      <li>
                        Opsi naik kelas ke rujukan Ahli Gizi jika terdeteksi
                        indikasi gizi buruk/obesitas ekstrem.
                      </li>
                    </ul>
                  </div>
                  <Link
                    href="/dashboard/patient?mode=independent"
                    className="w-full flex items-center justify-center h-10 bg-primary text-primary-foreground text-xs font-mono hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    MULAI ESTIMASI MANDIRI &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm">
              NUTRITION CARE PROCESS (NCP)
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            &copy; 2026 UTS Desain Web Gizi Klinis. Sesuai Standar PAGT Kemenkes
            RI.
          </p>
        </div>
      </footer>
    </div>
  );
}
