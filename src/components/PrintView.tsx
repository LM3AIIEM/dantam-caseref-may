import React from 'react';
import { Case, CaseSheet } from '../types.ts';
import { cn } from '@/lib/utils.ts';

interface PrintViewProps {
  caseData: Case;
  summary: CaseSheet;
  showHeader: boolean;
}

const PrintView = React.forwardRef<HTMLDivElement, PrintViewProps>(({ caseData, summary, showHeader }, ref) => {
  const totalAmount = summary.treatmentPlan.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div ref={ref} className="p-20 bg-white text-slate-900 min-h-[297mm] font-sans selection:bg-primary/10 print:p-12">
      {/* Sophisticated Header */}
      {showHeader && (
        <div className="flex justify-between items-end mb-24 relative">
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-primary rounded-[20px] flex items-center justify-center font-bold text-4xl text-white shadow-xl shadow-primary/20">K</div>
              <div>
                <div className="text-4xl font-black tracking-tighter text-slate-950 leading-none">KOSMO</div>
                <div className="text-[11px] font-bold tracking-[0.5em] text-primary uppercase mt-2">Digital Studios</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 font-medium leading-relaxed tracking-wide space-y-1">
              <p>Corporate Suite 402, Jubilee Hills, Hyderabad</p>
              <p>+91 90309 77770 • concierge@kosmodental.co • kosmodental.co</p>
            </div>
          </div>
          <div className="text-right pt-2">
            <div className="text-sm font-black text-slate-950 tracking-[0.2em] uppercase mb-2">Proposed Care Plan</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest italic opacity-60">REF: {caseData.id} • {date}</div>
          </div>
          {/* Subtle Accent Line */}
          <div className="absolute -bottom-8 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/30 via-slate-100 to-transparent" />
        </div>
      )}

      {!showHeader && <div className="h-12" />}

      {/* Patient Profile */}
      <div className="mb-20">
        <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">Patient Profile</div>
        <div className="flex items-end justify-between border-b-2 border-slate-900 pb-8">
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter">{caseData.patientName}</h1>
          <div className="flex gap-10 text-xs font-bold text-slate-400 uppercase">
             <div className="flex flex-col items-end">
               <span className="text-[9px] text-slate-300 mb-1">AGE</span>
               <span className="text-slate-600">37 Years</span>
             </div>
             <div className="flex flex-col items-end">
               <span className="text-[9px] text-slate-300 mb-1">GENDER</span>
               <span className="text-slate-600">Male</span>
             </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Insights */}
      <div className="grid grid-cols-12 gap-20 mb-24">
        <div className="col-span-12 space-y-20">
          {summary.criticalAlert && (
            <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 flex items-start gap-6">
               <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">!</div>
               <div className="space-y-1">
                  <div className="text-[10px] font-black text-red-600 uppercase tracking-widest">Medical Precaution</div>
                  <p className="text-sm font-bold text-red-900/80 leading-relaxed">{summary.criticalAlert}</p>
               </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-24">
             <div className="space-y-10">
                <div className="text-[10px] font-black text-slate-950 uppercase tracking-[0.4em] pb-4 border-b border-slate-100">Care Directives</div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Primary Concerns</div>
                    <div className="flex flex-wrap gap-3">
                      {summary.chiefComplaints.map((c, i) => (
                        <span key={i} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Clinical Findings</div>
                    <ul className="space-y-3">
                       {summary.clinicalObservations.map((o, i) => (
                         <li key={i} className="text-xs font-semibold text-slate-600 flex gap-4">
                           <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {o}
                         </li>
                       ))}
                    </ul>
                  </div>
                </div>
             </div>
             <div className="space-y-10">
                <div className="text-[10px] font-black text-slate-950 uppercase tracking-[0.4em] pb-4 border-b border-slate-100">Foundation</div>
                <div className="space-y-8">
                   <div className="space-y-4">
                      <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Health Indicators</div>
                      <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
                        {summary.medicalHistory.join(' • ')}
                      </div>
                   </div>
                   <div className="p-10 bg-primary/[0.03] rounded-[40px] border border-primary/10 flex flex-col items-center justify-center text-center gap-2">
                      <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Pain Index (VAS)</div>
                      <div className="text-5xl font-black text-primary tracking-tighter">{summary.vasScore}<span className="text-xl text-primary/30">/10</span></div>
                      <div className="w-16 h-1 bg-primary/20 rounded-full mt-2" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Quotation Table */}
      <div className="mb-24 px-4">
        <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-12 text-center">Treatment Architecture & Quotation</div>
        
        <div className="space-y-8">
          {summary.treatmentPlan.map((plan, i) => (
            <div key={i} className="flex items-center justify-between py-8 border-b border-slate-100 hover:bg-slate-50/50 transition-colors px-6 rounded-2xl group">
               <div className="space-y-2">
                  <div className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{plan.procedure}</div>
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="text-slate-900 border border-slate-100 px-2 py-0.5 rounded italic">Tooth {plan.teeth}</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <span className="text-primary/70">{plan.phase}</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <span>{plan.priority} Priority</span>
                  </div>
               </div>
               <div className="text-2xl font-black text-slate-950 font-mono tracking-tighter">
                  ₹{plan.cost?.toLocaleString()}
               </div>
            </div>
          ))}

          <div className="flex justify-end pt-12">
             <div className="bg-slate-950 text-white p-12 rounded-[48px] w-full max-w-md flex items-center justify-between shadow-3xl shadow-slate-950/20">
                <div className="space-y-1">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Total Investment</div>
                   <div className="text-[11px] font-bold text-primary italic">Estimated Surgical Portfolio</div>
                </div>
                <div className="text-5xl font-black tracking-tighter italic text-primary">₹{totalAmount.toLocaleString()}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Recovery & Prognosis */}
      <div className="grid grid-cols-2 gap-24 mb-24 items-start px-4">
         <div className="space-y-10">
            <div className="text-[10px] font-black text-slate-950 uppercase tracking-[0.4em] pb-4 border-b border-slate-100">Recovery Protocol</div>
            <div className="space-y-6">
               {summary.homeCare.map((item, i) => (
                 <div key={i} className="flex gap-6 text-[13px] font-bold text-slate-600 leading-relaxed items-start group">
                    <span className="text-primary text-2xl leading-none opacity-20 group-hover:opacity-100 transition-opacity font-black italic">0{i+1}</span>
                    <span className="pt-1.5">{item}</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="space-y-10">
            <div className="text-[10px] font-black text-slate-950 uppercase tracking-[0.4em] pb-4 border-b border-slate-100">Care Prognosis</div>
            <div className="space-y-8">
               <div className="space-y-2">
                  <div className="flex items-end gap-4">
                    <span className="text-5xl font-black text-slate-950 tracking-tighter">{summary.revenueOpportunity.uptakeProbability}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase pb-2 tracking-widest italic leading-none">Probability of Success</span>
                  </div>
               </div>
               <p className="text-[11px] text-slate-400 font-semibold leading-relaxed italic uppercase tracking-wider">
                 The proposed care architecture has been optimized for minimal biological disruption and maximum aesthetic longevity.
               </p>
            </div>
         </div>
      </div>

      {/* Professional Auth */}
      <div className="flex justify-between items-center pt-20 border-t border-slate-100 mt-20">
         <div className="flex gap-4">
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-slate-200 rounded-sm opacity-50" />
            </div>
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
              Authorized Digital Record <br /> Kosmo Studios Hyderabad
            </div>
         </div>
         <div className="text-right">
            <div className="text-2xl font-black text-slate-950 italic">Dr. Kartik Raghavan</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Medical Director • MDS • Reg. #88219</div>
         </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-12 border-t border-slate-50 flex justify-center">
        <div className="text-[10px] font-black text-slate-200 uppercase tracking-[1em] italic">Kosmo Dentistry Studios</div>
      </div>
    </div>
  );
});

export default PrintView;
