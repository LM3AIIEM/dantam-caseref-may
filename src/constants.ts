import { Case } from './types.ts';

export const MOCK_CASES: Case[] = [
  {
    id: 'KSM-2024-0082',
    patientName: 'Rajesh Shetty',
    patientAge: 42,
    patientGender: 'M',
    assignedDoctor: 'Dr. Kartik Raghavan',
    complaint: 'Sharp pain in upper right molar...',
    status: 'ACTIVE',
    createdAt: 'Apr 6, 2026',
    clinicalData: {
      criticalAlert: 'Patient has documented Penicillin Allergy. Auto-adjusted treatment logic.',
      chiefComplaints: [
        'Sharp pain in 36 region',
        'Difficulty in chewing on left side',
        'Sensitivity to cold'
      ],
      vasScore: 8,
      medicalHistory: [
        'Penicillin Allergy (Severe)',
        'Hypertensive (on medication)',
        'No other systemic issues'
      ],
      radiographicFindings: [
        'Vertical bone loss (35-37)',
        'Periapical abscess (36)',
        'Deep Distal caries (36)'
      ],
      clinicalObservations: [
        'Percussion positive (36)',
        'Grade 1 Mobility (36, 37)',
        'Generalized Calc. Deposits'
      ],
      treatmentPlan: [
        { phase: 'URGENT', procedure: 'RCT (Symptomatic)', teeth: '36', priority: 'Immediate', cost: 12000 },
        { phase: 'PHASE 1', procedure: 'Scaling & Root Planing', teeth: 'Full Arch', priority: 'Moderate', cost: 4500 },
        { phase: 'PHASE 1', procedure: 'PRR Restoration', teeth: '37', priority: 'Routine', cost: 3500 },
        { phase: 'PHASE 2', procedure: 'Zirconia Crown', teeth: '36', priority: 'Next Appt', cost: 12500 }
      ],
      homeCare: [
        'Warm saline rinses (3x daily)',
        'Avoid hard pressure (LLQ)'
      ],
      revenueOpportunity: {
        amount: '₹32,500.00',
        treatmentUrgency: 'CRITICAL',
        productionValue: 'RCT + Zirconia + SRP',
        uptakeProbability: '85%'
      }
    },
    transcript: "Patient presents with acute pulpitic pain in 36. OPG reveals periapical radiolucency and deep distal caries compromising the pulp chamber. Mobility Grade 1 on 36 and 37. Generalized horizontal bone loss observed, indicative of Stage II Periodontitis. Plan: Emergency access opening and RCT on 36. Core build-up followed by Zirconia crown. 37 shows pit and fissure caries, plan for preventive resin restoration. Full mouth scaling and root planing required. Patient is allergic to Penicillin – prescribe Clindamycin 300mg TDS for 5 days. Advise on tobacco cessation."
  },
  {
    id: 'KSM-2024-0083',
    patientName: 'Anita Sharma',
    patientAge: 29,
    patientGender: 'F',
    assignedDoctor: 'Dr. Sarah Ahmed',
    complaint: 'Wisdom tooth extraction followup',
    status: 'COMPLETED',
    createdAt: 'Apr 6, 2026'
  },
  {
    id: 'KSM-2024-0084',
    patientName: 'Rahul Verma',
    patientAge: 35,
    patientGender: 'M',
    assignedDoctor: 'Dr. Kartik Raghavan',
    complaint: 'Orthodontic consultation',
    status: 'PROCESSING',
    createdAt: 'Apr 4, 2026'
  }
];
