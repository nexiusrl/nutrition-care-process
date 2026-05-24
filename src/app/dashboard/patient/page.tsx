'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  calculateBBI, 
  calculateBMI, 
  getBMICategory, 
  calculateBMR, 
  calculateTEE, 
  getNutrientRecommendations 
} from '@/utils/nutritionCalculations';

interface ChatMessage {
  id: string;
  sender: 'patient' | 'nutritionist';
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

function PatientDashboardContent() {
  const searchParams = useSearchParams();
  const isIndependentMode = searchParams.get('mode') === 'independent';

  // State for Patient Profile (Simulated default for Kidney disease)
  const [patientProfile, setPatientProfile] = useState({
    name: 'Budi Santoso',
    age: 58,
    gender: 'male' as 'male' | 'female',
    height: 165,
    weight: 68,
    diseaseType: 'kidney' as 'kidney' | 'hypertension' | 'gout' | 'none',
    eGFR: 45,
    serumPotassium: 5.4,
  });

  // State for Independent Mode Inputs
  const [indepHeight, setIndepHeight] = useState(170);
  const [indepWeight, setIndepWeight] = useState(70);
  const [indepAge, setIndepAge] = useState(30);
  const [indepGender, setIndepGender] = useState<'male' | 'female'>('male');
  const [indepDisease, setIndepDisease] = useState<'none' | 'hypertension' | 'gout'>('none');

  // Sub-Navigation Tabs
  const [activeSubTab, setActiveSubTab] = useState<'daily-log' | 'leaflet' | 'chat'>('daily-log');

  // Calculations based on mode
  const currentHeight = isIndependentMode ? indepHeight : patientProfile.height;
  const currentWeight = isIndependentMode ? indepWeight : patientProfile.weight;
  const currentAge = isIndependentMode ? indepAge : patientProfile.age;
  const currentGender = isIndependentMode ? indepGender : patientProfile.gender;
  const currentDisease = isIndependentMode ? indepDisease : patientProfile.diseaseType;
  
  const bbi = calculateBBI(currentHeight, currentGender);
  const bmi = calculateBMI(currentWeight, currentHeight);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(currentWeight, currentHeight, currentAge, currentGender);
  const TEE = calculateTEE(bmr, 1.2, currentDisease === 'kidney' ? 1.25 : currentDisease === 'hypertension' ? 1.15 : 1.1);
  const recs = getNutrientRecommendations(currentDisease, bbi, isIndependentMode ? {} : { eGFR: patientProfile.eGFR, serumPotassium: patientProfile.serumPotassium });

  // Food Log State
  const [logs, setLogs] = useState<FoodLog[]>([
    { id: '1', food: 'Bubur beras putih hambar (150g)', calories: 250, protein: 4, sodium: 50 },
    { id: '2', food: 'Putih telur rebus (2 butir)', calories: 100, protein: 12, sodium: 120 }
  ]);
  const [newFood, setNewFood] = useState('');
  const [newCal, setNewCal] = useState('');
  const [newProtein, setNewProtein] = useState('');
  const [newSodium, setNewSodium] = useState('');

  // Add Log
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
      sodium: parsedSodium
    };

    setLogs([...logs, newLog]);
    setNewFood('');
    setNewCal('');
    setNewProtein('');
    setNewSodium('');
  };

  // Delete Log
  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  // Cumulative totals
  const totalCalories = logs.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = logs.reduce((acc, curr) => acc + curr.protein, 0);
  const totalSodium = logs.reduce((acc, curr) => acc + curr.sodium, 0);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'nutritionist', text: 'Halo Budi, apakah hari ini Anda sudah melakukan penimbangan berat badan?', timestamp: '08:00' },
    { id: '2', sender: 'patient', text: 'Halo Bu Fitra, sudah. Berat badan saya pagi ini 68 kg.', timestamp: '08:05' },
    { id: '3', sender: 'nutritionist', text: 'Bagus. Pertahankan asupan protein harian di batas 40-45 gram ya, karena eGFR Anda berada di angka 45.', timestamp: '08:06' }
  ]);
  const [typedMessage, setTypedMessage] = useState('');

  // Send Chat message with simulated reply
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'patient',
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setTypedMessage('');

    // Trigger auto reply after 1.5 seconds
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'nutritionist',
        text: 'Baik, pesan Anda telah diterima. Saya akan mengecek log asupan harian Anda segera.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="h-6 w-6 bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-black font-display font-bold text-xs">
            N
          </Link>
          <span className="font-display font-bold tracking-tight">
            {isIndependentMode ? 'MONITORING MANDIRI' : 'DASBOR PASIEN'}
          </span>
          <span className="text-[10px] font-mono border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-500">
            {isIndependentMode ? 'CLIENT' : 'PATIENT PORTAL'}
          </span>
        </div>
        <Link href="/" className="text-xs font-mono text-zinc-400 hover:text-foreground">Keluar</Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 space-y-6">
        
        {/* Profile Card / Configurator */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-lg shadow-sm">
          {isIndependentMode ? (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-base border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-2">Simulasi Parameter Mandiri</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-mono text-zinc-400 block mb-1">TINGGI BADAN (CM)</label>
                  <input
                    type="number"
                    value={indepHeight}
                    onChange={(e) => setIndepHeight(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-400 block mb-1">BERAT BADAN (KG)</label>
                  <input
                    type="number"
                    value={indepWeight}
                    onChange={(e) => setIndepWeight(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-400 block mb-1">UMUR (TAHUN)</label>
                  <input
                    type="number"
                    value={indepAge}
                    onChange={(e) => setIndepAge(Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-zinc-400 block mb-1">JENIS KELAMIN</label>
                  <select
                    value={indepGender}
                    onChange={(e) => setIndepGender(e.target.value as 'male' | 'female')}
                    className="w-full px-2 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                  >
                    <option value="male">Pria</option>
                    <option value="female">Wanita</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-mono text-zinc-400 block mb-1">PENCEGAHAN PENYAKIT</label>
                <select
                  value={indepDisease}
                  onChange={(e) => setIndepDisease(e.target.value as 'none' | 'hypertension' | 'gout')}
                  className="w-full px-2 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                >
                  <option value="none">Sehat (Umum)</option>
                  <option value="hypertension">Hipertensi</option>
                  <option value="gout">Asam Urat (Gout)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="font-display font-bold text-lg">{patientProfile.name}</h2>
                <p className="text-xs text-zinc-500 font-mono">
                  Gagal Ginjal non-dialisis • Pendamping: Nut. Fitra Amalia
                </p>
              </div>
              <span className="text-[9px] font-mono border border-red-300 text-red-700 bg-red-50 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400 px-2 py-1 uppercase font-bold">
                {patientProfile.diseaseType}
              </span>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 border-t border-zinc-100 dark:border-zinc-900 mt-4 pt-4 text-center font-mono text-xs">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
              <span className="text-[9px] text-zinc-400 block mb-0.5">BBI</span>
              <span className="font-bold">{bbi.toFixed(1)} kg</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
              <span className="text-[9px] text-zinc-400 block mb-0.5">IMT</span>
              <span className="font-bold">{bmi}</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded">
              <span className="text-[9px] text-zinc-400 block mb-0.5">TEE</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{TEE} kcal</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border border-zinc-200 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-950 rounded-lg justify-between w-full">
          <button
            onClick={() => setActiveSubTab('daily-log')}
            className={`flex-1 py-2 text-xs font-mono text-center rounded ${activeSubTab === 'daily-log' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
          >
            Daily Log
          </button>
          {!isIndependentMode && (
            <button
              onClick={() => setActiveSubTab('leaflet')}
              className={`flex-1 py-2 text-xs font-mono text-center rounded ${activeSubTab === 'leaflet' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
            >
              Leaflet Gizi
            </button>
          )}
          {!isIndependentMode && (
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`flex-1 py-2 text-xs font-mono text-center rounded ${activeSubTab === 'chat' ? 'bg-primary text-primary-foreground font-bold' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
            >
              Chat (AG)
            </button>
          )}
        </div>

        {/* TAB WORKSPACE */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-lg shadow-sm">
          
          {/* TAB 1: DAILY LOG */}
          {activeSubTab === 'daily-log' && (
            <div className="space-y-6">
              {/* Daily progress bars */}
              <div>
                <h3 className="font-display font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">
                  Kemajuan Asupan Hari Ini
                </h3>
                
                <div className="space-y-4">
                  {/* Calories Progress */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>Kalori Harian</span>
                      <span>{totalCalories} kcal / {TEE} kcal</span>
                    </div>
                    <div className="h-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${totalCalories > TEE ? 'bg-red-500' : 'bg-primary'}`} 
                        style={{ width: `${Math.min((totalCalories / TEE) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Protein Progress */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>Asupan Protein</span>
                      <span>{totalProtein}g / {recs.protein}g</span>
                    </div>
                    <div className="h-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${totalProtein > recs.protein ? 'bg-red-500' : 'bg-primary'}`} 
                        style={{ width: `${Math.min((totalProtein / recs.protein) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Sodium Progress */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>Asupan Natrium (Garam)</span>
                      <span>{totalSodium}mg / {recs.sodium}mg</span>
                    </div>
                    <div className="h-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${totalSodium > recs.sodium ? 'bg-red-500' : 'bg-primary'}`} 
                        style={{ width: `${Math.min((totalSodium / recs.sodium) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input Log Makanan */}
              <div>
                <h4 className="font-mono text-xs text-zinc-400 mb-3 uppercase tracking-wider">// Catat Log Makanan Baru</h4>
                <form onSubmit={handleAddLog} className="space-y-3">
                  <div>
                    <label className="text-[9px] font-mono text-zinc-400 block mb-1">NAMA MAKANAN</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bubur ayam kuah tawar..."
                      value={newFood}
                      onChange={(e) => setNewFood(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] font-mono text-zinc-400 block mb-1">ESTIMASI KALORI (KCAL)</label>
                      <input
                        type="number"
                        placeholder="150"
                        value={newCal}
                        onChange={(e) => setNewCal(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-zinc-400 block mb-1">ESTIMASI PROTEIN (G)</label>
                      <input
                        type="number"
                        placeholder="6"
                        value={newProtein}
                        onChange={(e) => setNewProtein(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-zinc-400 block mb-1">ESTIMASI NATRIUM (MG)</label>
                      <input
                        type="number"
                        placeholder="80"
                        value={newSodium}
                        onChange={(e) => setNewSodium(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none"
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
              </div>

              {/* Logs List */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-zinc-400 uppercase tracking-wider">// Rincian Makanan Terdaftar</h4>
                {logs.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-mono italic">Belum ada makanan yang dicatat hari ini.</p>
                ) : (
                  <div className="space-y-2">
                    {logs.map(l => (
                      <div key={l.id} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold">{l.food}</p>
                          <p className="text-[10px] font-mono text-zinc-500">
                            {l.calories} kcal • {l.protein}g Protein • {l.sodium}mg Natrium
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteLog(l.id)}
                          className="text-[10px] font-mono text-red-600 hover:text-red-500"
                        >
                          HAPUS
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LEAFLET DIET */}
          {activeSubTab === 'leaflet' && !isIndependentMode && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">
                  Leaflet Diet Terbitan Ahli Gizi
                </h3>

                <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900 rounded space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="font-mono text-xs font-bold uppercase">DIET PENYAKIT GINJAL KRONIS</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-900 text-white dark:bg-white dark:text-black font-bold">READY</span>
                  </div>
                  
                  <div className="text-xs font-mono space-y-2 text-zinc-600 dark:text-zinc-400">
                    <p><span className="font-bold text-zinc-950 dark:text-zinc-50">Target Energi:</span> {TEE} kcal</p>
                    <p><span className="font-bold text-zinc-950 dark:text-zinc-50">Target Protein:</span> {recs.protein} gram</p>
                    <p><span className="font-bold text-zinc-950 dark:text-zinc-50">Target Natrium:</span> {recs.sodium} mg</p>
                    <p><span className="font-bold text-zinc-950 dark:text-zinc-50">Batas Cairan:</span> {recs.fluid} ml</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-[10px] space-y-1">
                    <p className="font-bold text-emerald-600 dark:text-emerald-500 font-mono">// MAKANAN DIANJURKAN</p>
                    <p>Nasi, roti tawar, putih telur rebus, madu, wortel, labu siam.</p>
                    <p className="font-bold text-red-600 dark:text-red-500 font-mono mt-2">// MAKANAN DIHINDARI</p>
                    <p>Daging kambing, emping melinjo, buah tinggi kalium (pisang, alpukat) jika hiperkalemia.</p>
                  </div>

                  <button
                    onClick={() => alert('Simulasi unduhan PDF Leaflet Diet berhasil.')}
                    className="w-full py-2 border border-zinc-800 dark:border-zinc-200 text-xs font-mono hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    UNDUH LEAFLET PDF (SIGNED URL)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE CHAT */}
          {activeSubTab === 'chat' && !isIndependentMode && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-4">
                Chat dengan Nut. Fitra Amalia
              </h3>

              {/* Chat messages screen */}
              <div className="h-64 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 p-3 rounded overflow-y-auto space-y-3">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`max-w-[85%] p-2.5 rounded text-xs leading-relaxed ${msg.sender === 'patient' ? 'bg-zinc-900 text-white dark:bg-white dark:text-black ml-auto' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mr-auto'}`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[8px] font-mono text-zinc-400 block mt-1 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input Chat */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik pesan konsultasi gizi..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none focus:border-zinc-900"
                />
                <button
                  type="submit"
                  className="px-4 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black text-xs font-mono hover:bg-zinc-800 transition-colors rounded"
                >
                  KIRIM
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PatientDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] flex items-center justify-center font-mono text-xs text-zinc-500">// MEMUAT KONSOL MEDIS...</div>}>
      <PatientDashboardContent />
    </Suspense>
  );
}
