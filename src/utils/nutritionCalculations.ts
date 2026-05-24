/**
 * Kumpulan fungsi perhitungan gizi klinis berdasarkan panduan Kemenkes RI / PAGT Indonesia.
 */

export interface LabData {
  eGFR?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  uricAcid?: number;
  serumPotassium?: number;
}

export interface NutrientRecommendations {
  protein: number; // gram
  sodium: number; // mg
  potassium: number; // mg
  phosphorus: number; // mg
  purine: number; // mg
  fluid: number; // ml
}

/**
 * Menghitung Berat Badan Ideal (BBI) menggunakan rumus Broca Modifikasi Kemenkes
 */
export function calculateBBI(height: number, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    return height >= 160 ? (height - 100) * 0.9 : height - 100;
  } else {
    return height >= 150 ? (height - 100) * 0.9 : height - 100;
  }
}

/**
 * Menghitung Indeks Massa Tubuh (IMT / BMI)
 */
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Number((weight / (heightM * heightM)).toFixed(1));
}

/**
 * Mendapatkan Klasifikasi Status Gizi berdasarkan standar Kemenkes RI
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Kekurangan berat badan (Kurus)';
  if (bmi >= 18.5 && bmi < 25.0) return 'Normal (Ideal)';
  if (bmi >= 25.0 && bmi < 27.0) return 'Kelebihan berat badan (Gemuk tingkat ringan)';
  return 'Obesitas (Gemuk tingkat berat)';
}

/**
 * Menghitung Basal Metabolic Rate (BMR) menggunakan rumus Harris-Benedict
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return 66.5 + 13.7 * weight + 5.0 * height - 6.8 * age;
  } else {
    return 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
  }
}

/**
 * Menghitung Total Energy Expenditure (TEE)
 * @param bmr Basal Metabolic Rate
 * @param activityFactor Faktor Aktivitas (misal: bedrest = 1.1, ringan = 1.2, sedang = 1.3)
 * @param stressFactor Faktor Stres Penyakit (misal: normal = 1.0, hipertensi = 1.1, ginjal = 1.2)
 */
export function calculateTEE(bmr: number, activityFactor: number, stressFactor: number): number {
  return Math.round(bmr * activityFactor * stressFactor);
}

/**
 * Menghitung pembatasan zat gizi makro dan mikro otomatis berdasarkan penyakit & data lab
 */
export function getNutrientRecommendations(
  disease: 'kidney' | 'hypertension' | 'gout' | 'none',
  bbi: number,
  labData: LabData
): NutrientRecommendations {
  // Rekomendasi dasar (Normal)
  const recommendations: NutrientRecommendations = {
    protein: Math.round(bbi * 1.0), // 1.0 g / kg BBI
    sodium: 2000,                  // 2000 mg (standar)
    potassium: 3500,               // 3500 mg
    phosphorus: 1000,              // 1000 mg
    purine: 300,                   // 300 mg
    fluid: 2000,                   // 2000 ml
  };

  switch (disease) {
    case 'kidney':
      // Gagal Ginjal Non-Dialisis (CKD)
      if (labData.eGFR !== undefined && labData.eGFR < 60) {
        recommendations.protein = Math.round(bbi * 0.6); // Batasan protein ketat 0.6 g/kg
        recommendations.phosphorus = 800;               // Batasan fosfor 800 mg
        recommendations.fluid = 1500;                   // Batasan cairan default 1500 ml
      } else {
        recommendations.protein = Math.round(bbi * 0.8);
      }
      
      // Jika kalium darah tinggi (hyperkalemia)
      if (labData.serumPotassium !== undefined && labData.serumPotassium > 5.0) {
        recommendations.potassium = 2000; // Batasan kalium ketat
      }
      break;

    case 'hypertension':
      // Hipertensi - pembatasan natrium
      if (labData.bpSystolic !== undefined && labData.bpSystolic >= 140) {
        recommendations.sodium = 800; // Diet Rendah Garam II
      } else {
        recommendations.sodium = 1200; // Diet Rendah Garam III
      }
      break;

    case 'gout':
      // Asam Urat - batasi purin, naikkan cairan untuk melarutkan asam urat
      recommendations.purine = 150; // Rendah purin < 150 mg
      recommendations.fluid = 3000; // Hidrasi tinggi 3 Liter
      break;

    default:
      break;
  }

  return recommendations;
}
