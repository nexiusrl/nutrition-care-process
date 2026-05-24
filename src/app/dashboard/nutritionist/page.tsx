'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  calculateBBI, 
  calculateBMI, 
  getBMICategory, 
  calculateBMR, 
  calculateTEE, 
  getNutrientRecommendations,
  LabData,
  NutrientRecommendations
} from '@/utils/nutritionCalculations';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  diseaseType: 'kidney' | 'hypertension' | 'gout' | 'none';
  status: 'active' | 'completed';
  code: string;
  // Clinical state
  height: number;
  weight: number;
  lab: LabData;
  clinicalNotes: string;
  dietRecall: string;
}

const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Budi Santoso',
    age: 58,
    gender: 'male',
    diseaseType: 'kidney',
    status: 'active',
    code: 'REG-BUDI-58',
    height: 165,
    weight: 68,
    lab: { eGFR: 45, serumPotassium: 5.4, bpSystolic: 135, bpDiastolic: 85 },
    clinicalNotes: 'Pasien mengeluh lemas dan sedikit bengkak di pergelangan kaki.',
    dietRecall: 'Recall 24 jam menunjukkan asupan protein berlebih (sekitar 80g sehari dari daging merah).'
  },
  {
    id: 'p2',
    name: 'Siti Rahma',
    age: 62,
    gender: 'female',
    diseaseType: 'hypertension',
    status: 'active',
    code: 'REG-SITI-62',
    height: 152,
    weight: 60,
    lab: { eGFR: 82, serumPotassium: 4.1, bpSystolic: 150, bpDiastolic: 95 },
    clinicalNotes: 'Pusing berulang, riwayat keluarga dengan stroke.',
    dietRecall: 'Konsumsi garam tinggi, sering makan ikan asin dan makanan olahan.'
  },
  {
    id: 'p3',
    name: 'Joko Widodo (Demo)',
    age: 45,
    gender: 'male',
    diseaseType: 'gout',
    status: 'active',
    code: 'REG-JOKO-45',
    height: 172,
    weight: 80,
    lab: { uricAcid: 8.9, bpSystolic: 120, bpDiastolic: 80 },
    clinicalNotes: 'Nyeri hebat pada jempol kaki kanan sejak kemarin malam, bengkak dan merah.',
    dietRecall: 'Suka mengonsumsi jeroan, emping melinjo, dan sering lupa minum air putih.'
  },
  {
    id: 'p4',
    name: 'Amelia Putri',
    age: 28,
    gender: 'female',
    diseaseType: 'none',
    status: 'completed',
    code: 'REG-AMEL-28',
    height: 160,
    weight: 52,
    lab: {},
    clinicalNotes: 'Klien sehat, berkonsultasi untuk menjaga kebugaran tubuh.',
    dietRecall: 'Pola makan cukup teratur, ingin optimasi asupan serat.'
  }
];

export default function NutritionistDashboard() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p1');
  const [activeTab, setActiveTab] = useState<'assessment' | 'diagnosis' | 'intervention' | 'monitoring'>('assessment');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected Patient State
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Forms states
  const [weight, setWeight] = useState(selectedPatient.weight);
  const [height, setHeight] = useState(selectedPatient.height);
  const [age, setAge] = useState(selectedPatient.age);
  const [gender, setGender] = useState(selectedPatient.gender);
  const [diseaseType, setDiseaseType] = useState(selectedPatient.diseaseType);
  const [lab, setLab] = useState<LabData>(selectedPatient.lab);
  const [clinicalNotes, setClinicalNotes] = useState(selectedPatient.clinicalNotes);
  const [dietRecall, setDietRecall] = useState(selectedPatient.dietRecall);

  // Intervention targets
  const [customProtein, setCustomProtein] = useState<number | null>(null);
  const [customSodium, setCustomSodium] = useState<number | null>(null);
  const [customPotassium, setCustomPotassium] = useState<number | null>(null);
  const [customFluid, setCustomFluid] = useState<number | null>(null);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  // Sync state when selected patient changes
  useEffect(() => {
    setWeight(selectedPatient.weight);
    setHeight(selectedPatient.height);
    setAge(selectedPatient.age);
    setGender(selectedPatient.gender);
    setDiseaseType(selectedPatient.diseaseType);
    setLab(selectedPatient.lab);
    setClinicalNotes(selectedPatient.clinicalNotes);
    setDietRecall(selectedPatient.dietRecall);
    setCustomProtein(null);
    setCustomSodium(null);
    setCustomPotassium(null);
    setCustomFluid(null);
    setPdfGenerated(false);
  }, [selectedPatientId]);

  // Calculations
  const bbi = calculateBBI(height, gender);
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(weight, height, age, gender);
  
  // PAGT parameters
  const activityFactor = 1.2; // Ringan
  const stressFactor = diseaseType === 'kidney' ? 1.25 : diseaseType === 'hypertension' ? 1.15 : 1.1;
  const tee = calculateTEE(bmr, activityFactor, stressFactor);

  // Recommendations
  const defaultRecs = getNutrientRecommendations(diseaseType, bbi, lab);

  // Overridden Recs
  const finalRecs: NutrientRecommendations = {
    ...defaultRecs,
    protein: customProtein !== null ? customProtein : defaultRecs.protein,
    sodium: customSodium !== null ? customSodium : defaultRecs.sodium,
    potassium: customPotassium !== null ? customPotassium : defaultRecs.potassium,
    fluid: customFluid !== null ? customFluid : defaultRecs.fluid,
  };

  // Automated Diagnosis Generator (PES Statement)
  const generatePES = () => {
    const statements: string[] = [];
    if (diseaseType === 'kidney' && lab.eGFR !== undefined && lab.eGFR < 60) {
      statements.push(
        `[P] Penurunan fungsi filtrasi ginjal berkaitan dengan [E] patologi ginjal kronis ditandai dengan [S] eGFR ${lab.eGFR} mL/min/1.73m².`
      );
      if (dietRecall.toLowerCase().includes('protein')) {
        statements.push(
          `[P] Kelebihan asupan protein berkaitan dengan [E] kurangnya edukasi diet rendah protein ditandai dengan [S] riwayat recall asupan tinggi protein.`
        );
      }
    }
    if (diseaseType === 'hypertension') {
      if (lab.bpSystolic !== undefined && lab.bpSystolic >= 140) {
        statements.push(
          `[P] Kelebihan asupan natrium berkaitan dengan [E] kebiasaan konsumsi makanan tinggi garam ditandai dengan [S] tekanan darah sistolik ${lab.bpSystolic} mmHg.`
        );
      }
    }
    if (diseaseType === 'gout') {
      if (lab.uricAcid !== undefined && lab.uricAcid > 7.0) {
        statements.push(
          `[P] Gangguan eliminasi asam urat berkaitan dengan [E] asupan purin tinggi ditandai dengan [S] kadar asam urat darah ${lab.uricAcid} mg/dL dan keluhan nyeri sendi.`
        );
      }
    }
    if (statements.length === 0) {
      statements.push("Tidak ada anomali patologis gizi yang signifikan terdeteksi. Klien dalam status gizi rumatan.");
    }
    return statements;
  };

  const pesStatements = generatePES();

  // Handle Save
  const handleSaveAssessment = () => {
    const updated = patients.map(p => {
      if (p.id === selectedPatient.id) {
        return {
          ...p,
          weight,
          height,
          age,
          gender,
          diseaseType,
          lab,
          clinicalNotes,
          dietRecall
        };
      }
      return p;
    });
    setPatients(updated);
    alert('Rekam Asesmen ADIME berhasil disimpan di database (Simulasi).');
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="h-6 w-6 bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-black font-display font-bold text-xs">
            N
          </Link>
          <span className="font-display font-bold tracking-tight">KONSOL AHLI GIZI</span>
          <span className="text-[10px] font-mono border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500">
            STR REGISTERED
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-zinc-500">// NUT. FITRA AMALIA, S.Gz</span>
          <Link href="/" className="text-zinc-400 hover:text-foreground">Keluaran Portal</Link>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Patients Grid List */}
        <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-[calc(100vh-4rem)]">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <input
              type="text"
              placeholder="Cari nama / kode rujukan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredPatients.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`w-full text-left p-4 border-b border-zinc-100 dark:border-zinc-900 transition-colors flex flex-col gap-1 ${p.id === selectedPatient.id ? 'bg-zinc-100 dark:bg-zinc-900' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/30'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-display font-bold text-sm">{p.name}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 border uppercase ${p.diseaseType === 'kidney' ? 'border-red-300 text-red-700 bg-red-50 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400' : p.diseaseType === 'hypertension' ? 'border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400' : p.diseaseType === 'gout' ? 'border-zinc-300 text-zinc-700 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300' : 'border-zinc-200 text-zinc-400'}`}>
                    {p.diseaseType === 'none' ? 'sehat' : p.diseaseType}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>{p.code}</span>
                  <span>{p.age} thn / {p.gender === 'male' ? 'L' : 'P'}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Center/Right Panel: Patient ADIME console */}
        <main className="flex-1 bg-[#fafafa] dark:bg-[#09090b] p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* Patient Detail Header */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-display text-2xl font-bold">{selectedPatient.name}</h2>
                <span className="text-xs font-mono border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 text-zinc-500">
                  Rujukan: {selectedPatient.code}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-mono">
                Pria, 58 Tahun • Diagnosa Asal: Penyakit Ginjal Kronis (CKD)
              </p>
            </div>
            
            <div className="flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 p-1 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <button
                onClick={() => setActiveTab('assessment')}
                className={`px-3 py-1.5 text-xs font-mono rounded ${activeTab === 'assessment' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-600'}`}
              >
                A - Asesmen
              </button>
              <button
                onClick={() => setActiveTab('diagnosis')}
                className={`px-3 py-1.5 text-xs font-mono rounded ${activeTab === 'diagnosis' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-600'}`}
              >
                D - Diagnosis
              </button>
              <button
                onClick={() => setActiveTab('intervention')}
                className={`px-3 py-1.5 text-xs font-mono rounded ${activeTab === 'intervention' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-600'}`}
              >
                I - Intervensi
              </button>
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`px-3 py-1.5 text-xs font-mono rounded ${activeTab === 'monitoring' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-600'}`}
              >
                M/E - Monitoring
              </button>
            </div>
          </div>

          {/* Interactive Form Panel */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 rounded-lg shadow-sm">
            
            {/* TAB 1: ASSESSMENT */}
            {activeTab === 'assessment' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">Langkah 1: Asesmen Gizi (Gaya Kemenkes)</h3>
                  
                  {/* Antropometri Section */}
                  <h4 className="font-mono text-xs text-zinc-400 mb-3 uppercase tracking-wider">// 1.1 Antropometri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">TINGGI BADAN (CM)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">BERAT BADAN AKTUAL (KG)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">BERAT BADAN IDEAL (BBI - BROCA)</label>
                      <div className="font-mono p-2 text-sm bg-zinc-900 text-white dark:bg-white dark:text-black font-bold text-center">
                        {bbi.toFixed(1)} kg
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">IMT &amp; KATEGORI</label>
                      <div className="font-mono p-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center font-semibold">
                        {bmi} ({bmiCategory.split(' ')[0]})
                      </div>
                    </div>
                  </div>

                  {/* Biokimia Section */}
                  <h4 className="font-mono text-xs text-zinc-400 mb-3 uppercase tracking-wider">// 1.2 Parameter Laboratorium (Biokimia)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">eGFR (ML/MIN/1.73M²)</label>
                      <input
                        type="number"
                        value={lab.eGFR || ''}
                        onChange={(e) => setLab({ ...lab, eGFR: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="N/A"
                        className={`w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border focus:outline-none ${lab.eGFR !== undefined && lab.eGFR < 60 ? 'border-red-300 text-red-700 bg-red-50 dark:border-red-900 dark:bg-red-950/20' : 'border-zinc-200 dark:border-zinc-800'}`}
                      />
                      {lab.eGFR !== undefined && lab.eGFR < 60 && (
                        <span className="text-[9px] font-mono text-red-600 dark:text-red-400 block mt-1">*Penurunan fungsi ginjal terdeteksi</span>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">TEKANAN DARAH SISTOLIK (MMHG)</label>
                      <input
                        type="number"
                        value={lab.bpSystolic || ''}
                        onChange={(e) => setLab({ ...lab, bpSystolic: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="N/A"
                        className={`w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border focus:outline-none ${lab.bpSystolic !== undefined && lab.bpSystolic >= 140 ? 'border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20' : 'border-zinc-200 dark:border-zinc-800'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">ASAM URAT (MG/DL)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={lab.uricAcid || ''}
                        onChange={(e) => setLab({ ...lab, uricAcid: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="N/A"
                        className={`w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border focus:outline-none ${lab.uricAcid !== undefined && lab.uricAcid > 7.0 ? 'border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-900' : 'border-zinc-200 dark:border-zinc-800'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">KALIUM DARAH (MEQ/L)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={lab.serumPotassium || ''}
                        onChange={(e) => setLab({ ...lab, serumPotassium: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="N/A"
                        className={`w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border focus:outline-none ${lab.serumPotassium !== undefined && lab.serumPotassium > 5.0 ? 'border-red-300 text-red-700 bg-red-50 dark:border-red-900' : 'border-zinc-200 dark:border-zinc-800'}`}
                      />
                    </div>
                  </div>

                  {/* Fisik Klinis & Riwayat Gizi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">1.3 FISIK / KLINIS</label>
                      <textarea
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        rows={3}
                        className="w-full p-3 text-xs font-sans bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-900"
                        placeholder="Pemeriksaan fisik..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono block text-zinc-400 mb-1">1.4 RIWAYAT GIZI (DIET RECALL 24 JAM)</label>
                      <textarea
                        value={dietRecall}
                        onChange={(e) => setDietRecall(e.target.value)}
                        rows={3}
                        className="w-full p-3 text-xs font-sans bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-900"
                        placeholder="Pola makan pasien..."
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    <button
                      onClick={handleSaveAssessment}
                      className="px-6 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black font-mono text-xs hover:bg-zinc-800 transition-colors"
                    >
                      SIMPAN ASESMEN &bull; LOKAL
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DIAGNOSIS */}
            {activeTab === 'diagnosis' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">Langkah 2: Diagnosis Gizi (PES Statement Generator)</h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    Sistem mendeteksi anomali klinis dari Asesmen secara real-time dan menghasilkan draf pernyataan PES (Problem, Etiology, Sign/Symptom):
                  </p>

                  <div className="space-y-4">
                    {pesStatements.map((stmt, i) => (
                      <div key={i} className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded font-mono text-xs flex gap-3">
                        <span className="text-zinc-400 font-bold">[{i+1}]</span>
                        <p className="leading-relaxed">{stmt}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 rounded space-y-2">
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 block">KATEGORISASI STANDAR TERMINOLOGI GIZI</span>
                    <p className="text-xs">
                      Pernyataan PES di atas secara otomatis akan terintegrasi ke dalam berkas Leaflet Diet PDF sebagai diagnosis medis resmi untuk acuan pasien.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: INTERVENTION */}
            {activeTab === 'intervention' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">Langkah 3: Intervensi Gizi &amp; Perhitungan Presisi</h3>
                  
                  {/* Energy Calculator */}
                  <h4 className="font-mono text-xs text-zinc-400 mb-3 uppercase tracking-wider">// 3.1 Kalkulator Energi (Harris-Benedict PAGT)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-lg mb-6">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block mb-1">BMR ESTIMASI</span>
                      <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">{Math.round(bmr)} kcal</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block mb-1">FAKTOR AKTIVITAS</span>
                      <span className="font-mono text-sm">{activityFactor} (Ringan)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 block mb-1">FAKTOR STRES</span>
                      <span className="font-mono text-sm">{stressFactor} (Klinis {diseaseType})</span>
                    </div>
                    <div className="bg-zinc-900 text-white dark:bg-white dark:text-black p-3 rounded flex flex-col justify-center items-center text-center">
                      <span className="text-[9px] font-mono text-zinc-400">TOTAL ENERGI (TEE)</span>
                      <span className="font-mono text-lg font-bold">{tee} kcal</span>
                    </div>
                  </div>

                  {/* Nutrients Target Limits */}
                  <h4 className="font-mono text-xs text-zinc-400 mb-3 uppercase tracking-wider">// 3.2 Target Gizi Makro &amp; Mikro (Bisa di-Override)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Protein */}
                    <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 rounded">
                      <label className="text-[9px] font-mono block text-zinc-400 mb-1">TARGET PROTEIN (G)</label>
                      <input
                        type="number"
                        value={finalRecs.protein}
                        onChange={(e) => setCustomProtein(Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                      />
                      <span className="text-[9px] font-mono text-zinc-400 block mt-1">Default Kemenkes: {defaultRecs.protein}g</span>
                    </div>

                    {/* Natrium */}
                    <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 rounded">
                      <label className="text-[9px] font-mono block text-zinc-400 mb-1">BATAS NATRIUM / GARAM (MG)</label>
                      <input
                        type="number"
                        value={finalRecs.sodium}
                        onChange={(e) => setCustomSodium(Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                      />
                      <span className="text-[9px] font-mono text-zinc-400 block mt-1">Default Kemenkes: {defaultRecs.sodium}mg</span>
                    </div>

                    {/* Kalium */}
                    <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 rounded">
                      <label className="text-[9px] font-mono block text-zinc-400 mb-1">BATAS KALIUM (MG)</label>
                      <input
                        type="number"
                        value={finalRecs.potassium}
                        onChange={(e) => setCustomPotassium(Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                      />
                      <span className="text-[9px] font-mono text-zinc-400 block mt-1">Default Kemenkes: {defaultRecs.potassium}mg</span>
                    </div>

                    {/* Fluid */}
                    <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 rounded">
                      <label className="text-[9px] font-mono block text-zinc-400 mb-1">BATAS CAIRAN (ML)</label>
                      <input
                        type="number"
                        value={finalRecs.fluid}
                        onChange={(e) => setCustomFluid(Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                      />
                      <span className="text-[9px] font-mono text-zinc-400 block mt-1">Default Kemenkes: {defaultRecs.fluid}ml</span>
                    </div>
                  </div>

                  {/* Leaflet Generation */}
                  <h4 className="font-mono text-xs text-zinc-400 mb-3 uppercase tracking-wider">// 3.3 Ekspor PDF Leaflet Diet</h4>
                  <div className="border border-dashed border-zinc-300 dark:border-zinc-700 p-6 rounded flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50">
                    <div>
                      <p className="text-xs font-mono font-bold">LEAFLET DIET: DIET PENYAKIT {diseaseType.toUpperCase()}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Format berkas PDF terstruktur berisi diagnosis PES, total kalori harian, dan tabel makanan dianjurkan/dihindari.</p>
                    </div>
                    <button
                      onClick={() => {
                        setPdfGenerated(true);
                        alert('Leaflet PDF berhasil di-render di server dan diunggah ke Supabase Storage (Simulasi). Pasien sekarang dapat mengunduhnya.');
                      }}
                      className="px-5 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black font-mono text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2"
                    >
                      {pdfGenerated ? 'PDF TERUNGGAH ✓' : 'GENERATE & UPLOAD PDF'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MONITORING & EVALUATION */}
            {activeTab === 'monitoring' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">Langkah 4 &amp; 5: Monitoring &amp; Evaluasi (Log Aktual vs Target)</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Progress log */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">// Tren Berat Badan Pasien</h4>
                      <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900 rounded font-mono text-xs space-y-2">
                        <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                          <span className="text-zinc-500">25 Mei 2026 (Hari Ini)</span>
                          <span className="font-bold">{weight} kg</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                          <span className="text-zinc-500">20 Mei 2026</span>
                          <span>68.5 kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">15 Mei 2026</span>
                          <span>69.0 kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Food Log compliance */}
                    <div className="space-y-4">
                      <h4 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">// Log Konsumsi Aktual Pasien</h4>
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs font-bold">25 Mei 2026</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 font-bold">PATUH</span>
                        </div>
                        <p className="text-xs italic text-zinc-600 dark:text-zinc-400 font-sans">
                          &ldquo;Pagi: bubur ayam tanpa kuah asin, telur rebus bagian putih saja 1 butir. Siang: nasi putih 150g, pepes ikan mas, tumis wortel.&rdquo;
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 pt-2">
                          <span>Target Gizi: {finalRecs.protein}g Protein</span>
                          <span>Aktual Est: ~32g Protein</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
