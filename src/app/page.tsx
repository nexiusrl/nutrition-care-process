"use client";

import Link from "next/link";

export default function Home() {
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
            <span className="text-[10px] font-mono border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500">
              SELF-CARE v1.0
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              href="#adime"
              className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
              Alur Mandiri ADIME
            </a>
            <a
              href="#spesialisasi"
              className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
              Target Penyakit
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-mono border border-zinc-800 dark:border-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            >
              MULAI SEKARANG
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col items-start gap-6">
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
              Kalkulasi &amp; Kontrol Nutrisi Medis Secara Mandiri.
            </h1>
            <p className="font-sans text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">
              Alat bantu mandiri untuk menghitung kebutuhan kalori dan protein
              harian bagi penderita penyakit Ginjal, Hipertensi, dan Asam Urat
              berdasarkan pedoman gizi klinis Kemenkes RI.
            </p>

            <div className="relative border border-red-200 bg-red-50/30 dark:border-red-950/30 dark:bg-red-950/10 p-5 font-mono text-[11px] leading-relaxed max-w-xl overflow-hidden rounded">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500"></div>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1 text-red-700 dark:text-red-400 font-bold">
                    <span>PEMBERITAHUAN MEDIS PENTING</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-sans">
                    Aplikasi ini bersifat edukatif dan simulasi mandiri berbasis
                    standar PAGT Kemenkes. Hasil perhitungan tidak menggantikan
                    diagnosis medis profesional dari dokter atau ahli gizi
                    terdaftar.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <Link
                href="/dashboard"
                className="flex items-center justify-center px-8 h-12 bg-primary text-primary-foreground text-sm font-mono tracking-tight hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                MULAI ASKEP MANDIRI (DEMO) &rarr;
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4 hidden lg:block border border-dashed border-zinc-300 dark:border-zinc-700 p-6 bg-zinc-50 dark:bg-zinc-950 font-mono text-xs">
            <div className="flex justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-3">
              <span className="text-zinc-400">STATUS KONSOL</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                CLIENT-ONLY
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
                  AUTO-INFERENCE:
                </span>{" "}
                eGFR, BP, Uric Acid
              </p>
              <p>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                  OUTPUT:
                </span>{" "}
                PDF Leaflet &amp; Daily Tracker
              </p>
            </div>
            <div className="mt-6 p-3 bg-zinc-900 text-zinc-100 rounded">
              <span className="text-[10px] text-zinc-400 block mb-1">
                SECURITY LOG
              </span>
              <p className="font-bold text-emerald-500">
                RLS CONSTRAINED BY USER ID
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
              ALUR PEMANDU MANDIRI
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Siklus ADIME Berbasis Self-Care
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 flex flex-col justify-between h-64">
              <div>
                <span className="font-mono text-zinc-400 text-sm block mb-4">
                  STEP 01
                </span>
                <h3 className="font-display font-bold text-xl mb-2">Asesmen</h3>
                <p className="text-xs text-zinc-500">
                  Input mandiri data antropometri Anda (BB, TB) beserta hasil
                  laboratorium medis terakhir secara aman.
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                DATA ENTRY MANDIRI
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
                  Sistem mengidentifikasi anomali indikator tubuh Anda dan
                  menerbitkannya menjadi draf diagnosis gizi otomatis.
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                PES AUTO-STATEMENT
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 flex flex-col justify-between h-64">
              <div>
                <span className="font-mono text-zinc-400 text-sm block mb-4">
                  STEP 03
                </span>
                <h3 className="font-display font-bold text-xl mb-2">
                  Intervensi
                </h3>
                <p className="text-xs text-zinc-500">
                  Memperoleh batas konsumsi makronutrien/mikronutrien presisi
                  dan mengunduh Leaflet Diet khusus pribadi Anda.
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                CUSTOM TARGET &amp; PDF
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
                  Catat log asupan makan aktual harian Anda untuk membandingkan
                  asupan vs batas gizi patologis.
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                DAILY DIET TRACKING
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 flex flex-col justify-between h-64">
              <div>
                <span className="font-mono text-zinc-400 text-sm block mb-4">
                  STEP 05
                </span>
                <h3 className="font-display font-bold text-xl mb-2">
                  Evaluasi
                </h3>
                <p className="text-xs text-zinc-500">
                  Melihat grafik kepatuhan diet harian dan berkonsultasi dengan
                  Simulator AI Gizi jika memiliki pertanyaan.
                </p>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                AI ASSISTANT FEEDBACK
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Penyakit */}
      <section
        id="spesialisasi"
        className="py-24 border-b border-zinc-200 dark:border-zinc-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="font-mono text-xs text-zinc-500 block mb-2">
              KONDISI PATOLOGIS
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Modul Rumatan Gizi Klinis
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ginjal */}
            <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-display font-bold mb-4">
                G
              </div>
              <h3 className="font-display font-bold text-xl mb-2">
                Ginjal Kronis (CKD)
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                Restriksi protein otomatis berdasarkan nilai eGFR Anda untuk
                menghindari azotemia. Menampilkan batas konsumsi Kalium, Fosfor,
                dan Cairan harian.
              </p>
              <div className="font-mono text-[10px] p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                Inference: eGFR &lt; 60 &rarr; Batasi Protein &lt; 0.8g/kg BB
              </div>
            </div>

            {/* Hipertensi */}
            <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-display font-bold mb-4">
                H
              </div>
              <h3 className="font-display font-bold text-xl mb-2">
                Hipertensi (DASH)
              </h3>
              <p className="text-sm text-zinc-500 mb-6">
                Penghitungan batas maksimal konsumsi Natrium (garam dapur)
                berdasarkan tingkatan tekanan darah Anda untuk membantu
                menurunkan beban vaskular.
              </p>
              <div className="font-mono text-[10px] p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                Inference: TD &ge; 140/90 &rarr; Diet Rendah Garam II (800mg)
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
                Batas konsumsi purin harian untuk menghindari penumpukan kristal
                monosodium urat pada sendi. Disertai anjuran hidrasi air mineral
                yang intensif.
              </p>
              <div className="font-mono text-[10px] p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-600 dark:text-zinc-400">
                Inference: Asam Urat Tinggi &rarr; Purin &lt; 150mg &amp; Air
                &ge; 3.0L
              </div>
            </div>
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
            &copy; 2026 Nutrition Care Process
          </p>
        </div>
      </footer>
    </div>
  );
}
