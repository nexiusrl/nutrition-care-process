"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  calculateBBI,
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTEE,
  getNutrientRecommendations,
  LabData,
  NutrientRecommendations,
} from "@/utils/nutritionCalculations";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface FoodLog {
  id: string;
  food: string;
  calories: number;
  protein: number;
  sodium: number;
}

function SelfCareDashboardContent() {
  const searchParams = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "independent" ? "none" : "kidney";

  // State for user clinical parameters
  const [name, setName] = useState("Budi Santoso");
  const [age, setAge] = useState(58);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(68);
  const [diseaseType, setDiseaseType] = useState<
    "kidney" | "hypertension" | "gout" | "none"
  >(initialMode as any);

  // Lab parameters
  const [eGFR, seteGFR] = useState<number | undefined>(45);
  const [bpSystolic, setBpSystolic] = useState<number | undefined>(135);
  const [bpDiastolic, setBpDiastolic] = useState<number | undefined>(85);
  const [uricAcid, setUricAcid] = useState<number | undefined>(6.8);
  const [serumPotassium, setSerumPotassium] = useState<number | undefined>(5.4);

  const [activeTab, setActiveTab] = useState<
    "assessment" | "diagnosis" | "intervention" | "monitoring" | "ai-assistant"
  >("assessment");

  // Custom targets (Overrides)
  const [customProtein, setCustomProtein] = useState<number | null>(null);
  const [customSodium, setCustomSodium] = useState<number | null>(null);
  const [customPotassium, setCustomPotassium] = useState<number | null>(null);
  const [customFluid, setCustomFluid] = useState<number | null>(null);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  // Calculations
  const bbi = calculateBBI(height, gender);
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(weight, height, age, gender);

  const activityFactor = 1.2; // Ringan
  const stressFactor =
    diseaseType === "kidney"
      ? 1.25
      : diseaseType === "hypertension"
        ? 1.15
        : 1.1;
  const tee = calculateTEE(bmr, activityFactor, stressFactor);

  const labData: LabData = {
    eGFR,
    bpSystolic,
    bpDiastolic,
    uricAcid,
    serumPotassium,
  };
  const defaultRecs = getNutrientRecommendations(diseaseType, bbi, labData);

  const finalRecs: NutrientRecommendations = {
    ...defaultRecs,
    protein: customProtein !== null ? customProtein : defaultRecs.protein,
    sodium: customSodium !== null ? customSodium : defaultRecs.sodium,
    potassium:
      customPotassium !== null ? customPotassium : defaultRecs.potassium,
    fluid: customFluid !== null ? customFluid : defaultRecs.fluid,
  };

  // Reset custom overrides when disease or lab data changes
  useEffect(() => {
    setCustomProtein(null);
    setCustomSodium(null);
    setCustomPotassium(null);
    setCustomFluid(null);
    setPdfGenerated(false);
  }, [diseaseType, eGFR, bpSystolic, uricAcid, serumPotassium]);

  // Automated PES Diagnosis
  const generatePES = () => {
    const statements: string[] = [];
    if (diseaseType === "kidney" && eGFR !== undefined && eGFR < 60) {
      statements.push(
        `[P] Penurunan fungsi filtrasi ginjal berkaitan dengan [E] patologi ginjal kronis ditandai dengan [S] eGFR Anda berada di angka ${eGFR} mL/min/1.73m² (Stadium 3+).`,
      );
      if (serumPotassium !== undefined && serumPotassium > 5.0) {
        statements.push(
          `[P] Risiko hiperkalemia berkaitan dengan [E] ekskresi kalium ginjal menurun ditandai dengan [S] kadar kalium darah tinggi (${serumPotassium} mEq/L).`,
        );
      }
    }
    if (diseaseType === "hypertension") {
      if (bpSystolic !== undefined && bpSystolic >= 140) {
        statements.push(
          `[P] Tekanan darah tidak terkontrol berkaitan dengan [E] beban cairan vaskular tinggi/hipertensi ditandai dengan [S] tekanan darah sistolik ${bpSystolic} mmHg.`,
        );
      }
    }
    if (diseaseType === "gout") {
      if (uricAcid !== undefined && uricAcid > 7.0) {
        statements.push(
          `[P] Gangguan eliminasi asam urat berkaitan dengan [E] asupan makanan tinggi purin ditandai dengan [S] kadar asam urat darah tinggi (${uricAcid} mg/dL).`,
        );
      }
    }
    if (statements.length === 0) {
      statements.push(
        "Status gizi Anda dalam batas normal/rumatan. Tidak terdeteksi anomali klinis kritis.",
      );
    }
    return statements;
  };

  const pesStatements = generatePES();

  // Food Log State
  const [logs, setLogs] = useState<FoodLog[]>([
    {
      id: "1",
      food: "Nasi putih (100g) + Pepes tahu (50g)",
      calories: 280,
      protein: 8,
      sodium: 90,
    },
    {
      id: "2",
      food: "Putih telur rebus (2 butir)",
      calories: 100,
      protein: 12,
      sodium: 120,
    },
  ]);
  const [newFood, setNewFood] = useState("");
  const [newCal, setNewCal] = useState("");
  const [newProtein, setNewProtein] = useState("");
  const [newSodium, setNewSodium] = useState("");

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood) return;

    const parsedCal = newCal ? Number(newCal) : 150;
    const parsedProtein = newProtein ? Number(newProtein) : 6;
    const parsedSodium = newSodium ? Number(newSodium) : 80;

    const newLog: FoodLog = {
      id: Date.now().toString(),
      food: newFood,
      calories: parsedCal,
      protein: parsedProtein,
      sodium: parsedSodium,
    };

    setLogs([...logs, newLog]);
    setNewFood("");
    setNewCal("");
    setNewProtein("");
    setNewSodium("");
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  const totalCalories = logs.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = logs.reduce((acc, curr) => acc + curr.protein, 0);
  const totalSodium = logs.reduce((acc, curr) => acc + curr.sodium, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="h-6 w-6 bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-black font-display font-bold text-xs"
          >
            N
          </Link>
          <span className="font-display font-bold tracking-tight">
            KONSOL ASUHAN GIZI MANDIRI
          </span>
          <span className="text-[10px] font-mono border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500">
            CLIENT SIDE CONSOLE
          </span>
        </div>
        <Link
          href="/"
          className="text-xs font-mono text-zinc-400 hover:text-foreground"
        >
          Keluar
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
        <div className="relative border border-red-200 bg-red-50/20 dark:border-red-950/20 dark:bg-red-950/5 p-6 font-mono text-[11px] leading-relaxed rounded-lg overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-600 dark:bg-red-500"></div>
          <div className="flex gap-4 items-start">
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-center text-red-700 dark:text-red-400 font-bold">
                <span>MEDICAL DISCLAIMER &amp; KESELAMATAN PENGGUNA</span>
                <span className="text-[8px] font-mono border border-red-300 dark:border-red-900 px-1.5 py-0.5 rounded uppercase tracking-wider text-red-600 dark:text-red-400">
                  PAGT-KEMENKES
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 font-sans text-xs leading-relaxed">
                Hasil perhitungan gizi, target zat gizi makro/mikro, serta saran
                gizi otomatis (PES Statement) yang dihasilkan oleh konsol ini
                didasarkan pada standar asuhan PAGT Kemenkes RI secara
                komputasional. Konsol ini berfungsi sebagai alat bantu simulasi
                edukasi gizi mandiri dan{" "}
                <strong className="text-zinc-900 dark:text-zinc-100 font-semibold underline decoration-red-500/50 decoration-2">
                  bukan pengganti konsultasi medis profesional
                </strong>
                . Konsultasikan pola makan Anda dengan dokter atau dietisien
                sebelum memulai perubahan diet radikal.
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Configurator Header */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-display text-2xl font-bold bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-950 focus:outline-none dark:focus:border-white"
              />
              <span className="text-[9px] font-mono border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 text-zinc-400 rounded uppercase">
                {diseaseType === "none" ? "UMUM" : diseaseType}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              BBI: {bbi.toFixed(1)} kg • IMT: {bmi} ({bmiCategory.split(" ")[0]}
              ) • Target TEE harian: {tee} kcal
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-800 p-1 bg-zinc-50 dark:bg-zinc-900 rounded-lg overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("assessment")}
              className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap ${activeTab === "assessment" ? "bg-primary text-primary-foreground font-bold" : "text-zinc-600"}`}
            >
              1. Asesmen
            </button>
            <button
              onClick={() => setActiveTab("diagnosis")}
              className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap ${activeTab === "diagnosis" ? "bg-primary text-primary-foreground font-bold" : "text-zinc-600"}`}
            >
              2. Diagnosis
            </button>
            <button
              onClick={() => setActiveTab("intervention")}
              className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap ${activeTab === "intervention" ? "bg-primary text-primary-foreground font-bold" : "text-zinc-600"}`}
            >
              3. Rencana Gizi
            </button>
            <button
              onClick={() => setActiveTab("monitoring")}
              className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap ${activeTab === "monitoring" ? "bg-primary text-primary-foreground font-bold" : "text-zinc-600"}`}
            >
              4. Log &amp; Progres
            </button>
          </div>
        </div>

        {/* Tab Workspace */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 rounded-lg shadow-sm">
          {/* LANGKAH 1: ASESMEN MANDIRI */}
          {activeTab === "assessment" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">
                  Langkah 1: Asesmen Gizi Mandiri
                </h3>

                {/* Antropometri */}
                <h4 className="font-mono text-xs text-zinc-400 mb-3 uppercase tracking-wider">
                  Data Fisik &amp; Antropometri
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                      TINGGI BADAN (CM)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                      BERAT BADAN AKTUAL (KG)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                      UMUR (TAHUN)
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                      GENDER
                    </label>
                    <select
                      value={gender}
                      onChange={(e) =>
                        setGender(e.target.value as "male" | "female")
                      }
                      className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                    >
                      <option value="male">Pria</option>
                      <option value="female">Wanita</option>
                    </select>
                  </div>
                </div>

                {/* Penyakit & Lab */}
                <h4 className="font-mono text-xs text-zinc-400 mb-3 uppercase tracking-wider">
                  Kondisi Medis &amp; Hasil Laboratorium
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-[10px] font-mono block text-zinc-400 mb-1">
                      FOKUS RUMATAN DIET PENYAKIT
                    </label>
                    <select
                      value={diseaseType}
                      onChange={(e) => setDiseaseType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                    >
                      <option value="none">
                        Sehat Mandiri (Pencegahan Umum)
                      </option>
                      <option value="kidney">
                        Gagal Ginjal Kronis (CKD - Non Dialisis)
                      </option>
                      <option value="hypertension">
                        Hipertensi (DASH Diet)
                      </option>
                      <option value="gout">Asam Urat (Rendah Purin)</option>
                    </select>
                  </div>

                  {/* Dynamic Lab Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    {diseaseType === "kidney" && (
                      <>
                        <div>
                          <label className="text-[9px] font-mono block text-red-500 mb-1">
                            KADAR eGFR (ML/MIN)
                          </label>
                          <input
                            type="number"
                            value={eGFR || ""}
                            onChange={(e) =>
                              seteGFR(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            placeholder="45"
                            className="w-full px-2 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-red-200 dark:border-red-950 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono block text-red-500 mb-1">
                            KALIUM DARAH (MEQ/L)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={serumPotassium || ""}
                            onChange={(e) =>
                              setSerumPotassium(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            placeholder="5.4"
                            className="w-full px-2 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-red-200 dark:border-red-950 rounded focus:outline-none"
                          />
                        </div>
                      </>
                    )}
                    {diseaseType === "hypertension" && (
                      <>
                        <div>
                          <label className="text-[9px] font-mono block text-amber-500 mb-1">
                            TEKANAN SISTOLIK (MMHG)
                          </label>
                          <input
                            type="number"
                            value={bpSystolic || ""}
                            onChange={(e) =>
                              setBpSystolic(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            placeholder="145"
                            className="w-full px-2 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-amber-200 dark:border-amber-950 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono block text-amber-500 mb-1">
                            DIASTOLIK (MMHG)
                          </label>
                          <input
                            type="number"
                            value={bpDiastolic || ""}
                            onChange={(e) =>
                              setBpDiastolic(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            placeholder="90"
                            className="w-full px-2 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-amber-200 dark:border-amber-950 rounded focus:outline-none"
                          />
                        </div>
                      </>
                    )}
                    {diseaseType === "gout" && (
                      <div className="col-span-2">
                        <label className="text-[9px] font-mono block text-zinc-500 mb-1">
                          KADAR ASAM URAT DARAH (MG/DL)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={uricAcid || ""}
                          onChange={(e) =>
                            setUricAcid(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                          placeholder="8.5"
                          className="w-full px-2 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                        />
                      </div>
                    )}
                    {diseaseType === "none" && (
                      <div className="col-span-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded font-mono text-[10px] text-zinc-500 text-center flex items-center justify-center">
                        Tidak ada parameter biokimia tambahan yang diperlukan
                        untuk status Sehat Umum.
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded font-mono text-[10px] text-zinc-500">
                  *Perubahan pada data Asesmen di atas akan langsung menghitung
                  ulang kebutuhan energi TEE dan memperbarui draf diagnosis
                  otomatis serta batasan nutrisi di langkah selanjutnya.
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 2: DIAGNOSIS OTOMATIS */}
          {activeTab === "diagnosis" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">
                  Langkah 2: Diagnosis Gizi Otomatis (PES Mandiri)
                </h3>

                <div className="relative border border-red-200/60 bg-red-50/10 dark:border-red-950/40 dark:bg-red-950/5 p-4 text-xs rounded font-mono flex gap-3 items-start mb-4 overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500/70"></div>
                  <span className="text-red-600 dark:text-red-400 text-base select-none">
                    ⚠️
                  </span>
                  <div className="flex-1">
                    <strong className="text-red-700 dark:text-red-400 block mb-0.5">
                      PERINGATAN KONSULTASI MEDIS
                    </strong>
                    <p className="text-zinc-600 dark:text-zinc-400 font-sans text-xs leading-relaxed">
                      Draf PES Statement di bawah dianalisis otomatis oleh
                      sistem berdasarkan input parameter klinis Anda. Harap
                      konsultasikan draf ini dengan dokter keluarga Anda untuk
                      penegakan diagnosa definitif.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {pesStatements.map((stmt, i) => (
                    <div
                      key={i}
                      className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded font-mono text-xs flex gap-3"
                    >
                      <span className="text-zinc-400 font-bold">[{i + 1}]</span>
                      <p className="leading-relaxed">{stmt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 3: RENCANA GIZI & CALCULATORS */}
          {activeTab === "intervention" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">
                  Langkah 3: Rencana Gizi &amp; Perhitungan Kemenkes
                </h3>

                {/* Energy targets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] font-mono text-zinc-400 mb-1">
                      BMR (HARRIS-BENEDICT)
                    </span>
                    <span className="font-mono text-lg font-bold">
                      {Math.round(bmr)} kcal
                    </span>
                  </div>
                  <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] font-mono text-zinc-400 mb-1">
                      FAKTOR KONDISI MEDIS
                    </span>
                    <span className="font-mono text-sm">
                      {stressFactor}x ({diseaseType.toUpperCase()})
                    </span>
                  </div>
                  <div className="p-4 bg-zinc-900 text-white dark:bg-white dark:text-black rounded flex flex-col justify-center items-center text-center">
                    <span className="text-[9px] font-mono text-zinc-400">
                      TARGET ENERGI TOTAL (TEE)
                    </span>
                    <span className="font-mono text-xl font-bold">
                      {tee} kcal
                    </span>
                  </div>
                </div>

                {/* Macros & Micros Targets */}
                <h4 className="font-mono text-xs text-zinc-400 mb-3 uppercase tracking-wider">
                  Batas Gizi Makro &amp; Mikro Harian
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* Protein */}
                  <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 rounded">
                    <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                      PROTEIN (GRAM)
                    </label>
                    <input
                      type="number"
                      value={finalRecs.protein}
                      onChange={(e) => setCustomProtein(Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                    />
                    <span className="text-[8px] font-mono text-zinc-400 block mt-1">
                      Saran Kemenkes: {defaultRecs.protein}g
                    </span>
                  </div>

                  {/* Sodium */}
                  <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 rounded">
                    <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                      NATRIUM (MG)
                    </label>
                    <input
                      type="number"
                      value={finalRecs.sodium}
                      onChange={(e) => setCustomSodium(Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                    />
                    <span className="text-[8px] font-mono text-zinc-400 block mt-1">
                      Saran Kemenkes: {defaultRecs.sodium}mg
                    </span>
                  </div>

                  {/* Potassium */}
                  <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 rounded">
                    <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                      KALIUM (MG)
                    </label>
                    <input
                      type="number"
                      value={finalRecs.potassium}
                      onChange={(e) =>
                        setCustomPotassium(Number(e.target.value))
                      }
                      className="w-full px-2 py-1 text-sm font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                    />
                    <span className="text-[8px] font-mono text-zinc-400 block mt-1">
                      Saran Kemenkes: {defaultRecs.potassium}mg
                    </span>
                  </div>

                  {/* Fluid */}
                  <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 rounded">
                    <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                      BATAS CAIRAN (ML)
                    </label>
                    <input
                      type="number"
                      value={finalRecs.fluid}
                      onChange={(e) => setCustomFluid(Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                    />
                    <span className="text-[8px] font-mono text-zinc-400 block mt-1">
                      Saran Kemenkes: {defaultRecs.fluid}ml
                    </span>
                  </div>
                </div>

                {/* Leaflet Generation */}
                <div className="border border-dashed border-zinc-300 dark:border-zinc-700 p-5 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50">
                  <div>
                    <p className="text-xs font-mono font-bold">
                      EKSPOR LEAFLET DIET {diseaseType.toUpperCase()} (PDF)
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      Simpan konfigurasi diet pribadi Anda ke dokumen PDF yang
                      berisi panduan anjuran bahan makanan Kemenkes.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setPdfGenerated(true);
                      alert(
                        "Berhasil menghasilkan Leaflet PDF Diet (Simulasi). Dokumen siap diunduh dan disimpan.",
                      );
                    }}
                    className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black font-mono text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    {pdfGenerated ? "PDF TERUNGGAH ✓" : "GENERATE PDF DIET"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LANGKAH 4: DAILY MONITORING LOG */}
          {activeTab === "monitoring" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">
                  Langkah 4: Log Asupan Makanan &amp; Monitoring
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Visual Progress bars */}
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                      Progres Asupan Hari Ini
                    </h4>

                    <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span>Energi Harian</span>
                          <span>
                            {totalCalories} / {tee} kcal
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-800 dark:bg-zinc-200"
                            style={{
                              width: `${Math.min((totalCalories / tee) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span>Protein Harian</span>
                          <span>
                            {totalProtein}g / {finalRecs.protein}g
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-800 dark:bg-zinc-200"
                            style={{
                              width: `${Math.min((totalProtein / finalRecs.protein) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1 text-red-600 dark:text-red-400">
                          <span>Natrium (Batas Maks)</span>
                          <span>
                            {totalSodium}mg / {finalRecs.sodium}mg
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${totalSodium > finalRecs.sodium ? "bg-red-500" : "bg-zinc-800 dark:bg-zinc-200"}`}
                            style={{
                              width: `${Math.min((totalSodium / finalRecs.sodium) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input log & details */}
                  <div className="lg:col-span-6 space-y-4">
                    <h4 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                      Catat Konsumsi Makanan
                    </h4>
                    <form
                      onSubmit={handleAddLog}
                      className="space-y-3 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                    >
                      <div>
                        <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                          NAMA MAKANAN
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Putih telur dadar..."
                          value={newFood}
                          onChange={(e) => setNewFood(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                            ENERGI (KCAL)
                          </label>
                          <input
                            type="number"
                            placeholder="120"
                            value={newCal}
                            onChange={(e) => setNewCal(e.target.value)}
                            className="w-full px-2 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                            PROTEIN (G)
                          </label>
                          <input
                            type="number"
                            placeholder="6"
                            value={newProtein}
                            onChange={(e) => setNewProtein(e.target.value)}
                            className="w-full px-2 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono block text-zinc-400 mb-1">
                            NATRIUM (MG)
                          </label>
                          <input
                            type="number"
                            placeholder="80"
                            value={newSodium}
                            onChange={(e) => setNewSodium(e.target.value)}
                            className="w-full px-2 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black font-mono text-xs hover:bg-zinc-800 transition-colors rounded"
                      >
                        TAMBAHKAN LOG MAKANAN
                      </button>
                    </form>

                    {/* Log items list */}
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {logs.map((l) => (
                        <div
                          key={l.id}
                          className="p-2 border border-zinc-100 dark:border-zinc-900 text-xs flex justify-between items-center bg-white dark:bg-zinc-950"
                        >
                          <div>
                            <p className="font-bold">{l.food}</p>
                            <p className="text-[9px] font-mono text-zinc-400">
                              {l.calories} kcal • {l.protein}g Prot • {l.sodium}
                              mg Na
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteLog(l.id)}
                            className="text-[10px] font-mono text-red-500 hover:text-red-400"
                          >
                            HAPUS
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SelfCareDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] flex items-center justify-center font-mono text-xs text-zinc-500">
          MEMUAT KONSOL GIZI MANDIRI...
        </div>
      }
    >
      <SelfCareDashboardContent />
    </Suspense>
  );
}
