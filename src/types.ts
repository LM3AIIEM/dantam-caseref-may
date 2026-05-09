export interface Case {
  id: string;
  patientName: string;
  patientAge?: number;
  patientGender?: 'M' | 'F' | 'Other';
  assignedDoctor?: string;
  complaint: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PROCESSING' | 'DRAFT';
  createdAt: string;
  clinicalData?: CaseSheet;
  transcript?: string;
}

export interface CaseSheet {
  criticalAlert?: string;
  chiefComplaints: string[];
  vasScore: number;
  medicalHistory: string[];
  radiographicFindings: string[];
  clinicalObservations: string[];
  treatmentPlan: TreatmentPhase[];
  homeCare: string[];
  isFinalized?: boolean;
  originalAiSummary?: string; // Immutable copy of the first AI draft for audit
  revenueOpportunity: {
    amount: string;
    treatmentUrgency: 'CRITICAL' | 'MODERATE' | 'ROUTINE' | 'NEXT_APPT';
    productionValue: string;
    uptakeProbability: string;
  };
}

export interface TreatmentPhase {
  phase: string;
  procedure: string;
  teeth: string;
  priority: 'Immediate' | 'Moderate' | 'Routine' | 'Next Appt';
  cost?: number;
}
