import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  CirclePlay,
  Share2,
  Download,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ClipboardList,
  Heart,
  MessageSquare,
  IndianRupee,
  ShieldCheck,
  FileText,
  Upload,
  Play,
  Trash2,
  AudioLines,
  FileAudio,
  Printer,
  X,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Case, CaseSheet, TreatmentPhase } from '../types.ts';
import { cn } from '@/lib/utils.ts';
import { motion, AnimatePresence } from 'motion/react';
import { summarizeConsultation } from '../services/aiService.ts';
import { useReactToPrint } from 'react-to-print';
import PrintView from './PrintView.tsx';

interface CaseDetailProps {
  caseData: Case;
  onBack: () => void;
}

export default function CaseDetail({ caseData, onBack }: CaseDetailProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<CaseSheet | undefined>(caseData.clinicalData);
  const [transcript, setTranscript] = useState(caseData.transcript || "");
  const [isFinalized, setIsFinalized] = useState(caseData.clinicalData?.isFinalized || false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [originalAiDraft, setOriginalAiDraft] = useState<CaseSheet | undefined>(undefined);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedAuditSummary, setSelectedAuditSummary] = useState<CaseSheet | null>(null);
  const [recordings, setRecordings] = useState<any[]>([
    { id: '1', name: 'Initial Consultation', date: 'May 7, 2026', time: '10:13 AM', size: '1168.5 KB', duration: '1:12', status: 'ready', aiAuditSummary: null }
  ]);

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    const newRec = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Session Record #${recordings.length + 1}`,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
      duration: formatTime(recordingSeconds),
      status: 'ready',
      aiAuditSummary: null
    };
    setRecordings([newRec, ...recordings]);
    setIsRecording(false);
  };

  const handleAnalyzeRecording = (id: string, customText?: string) => {
    setIsSummarizing(true);
    const textToAnalyze = customText || transcript || "Patient presents for comprehensive diagnostic evaluation. Primary focus on restorative longevity and symptom relief.";
    
    summarizeConsultation(textToAnalyze).then(res => {
      // Attach the transcript used for this specific audit record
      const auditWithTranscript = { ...res, archivedTranscript: textToAnalyze };
      
      setRecordings(prev => prev.map(r => 
        r.id === id ? { ...r, aiAuditSummary: auditWithTranscript } : r
      ));

      if (!originalAiDraft) {
        setOriginalAiDraft(auditWithTranscript);
      }
      setSummary(res);
      setIsSummarizing(false);
    });
  };

  const handleRemoveRecording = (id: string) => {
    setRecordings(prev => prev.map(r => 
      r.id === id ? { ...r, isDeleted: true } : r
    ));
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `CaseSheet_${caseData.id}`,
  });

  const handleUpdateCost = (index: number, cost: string) => {
    if (!summary) return;
    const newPlan = [...summary.treatmentPlan];
    newPlan[index] = { ...newPlan[index], cost: parseFloat(cost) || 0 };
    setSummary({ ...summary, treatmentPlan: newPlan });
  };

  const calculateTotalCost = () => {
    if (!summary) return 0;
    return summary.treatmentPlan.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  };

  const handleFinalize = () => {
    if (!summary) return;
    setIsFinalized(true);
    setSummary({ ...summary, isFinalized: true });
    
    // Redirect to Charlie platform after finalization
    setTimeout(() => {
      window.location.href = "https://charlie.dantam.app";
    }, 1500);
  };

  const totalCost = calculateTotalCost();
  const showRevenueDetail = totalCost > 0;

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 -mt-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="rounded-xl hover:bg-white/5">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Registry
          </Button>
          <div className="h-8 w-[1px] bg-border" />
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">CLINICAL CASE SHEET</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest tracking-tighter">ID: {caseData.id}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {summary && (
            <Button 
               onClick={() => setShowPrintModal(true)}
               variant="outline" 
               className="rounded-xl border-2 border-primary/30 h-11 px-4 gap-2 text-primary hover:bg-primary/10"
            >
              <Printer className="w-4 h-4" />
              Patient Copy
            </Button>
          )}
          <Button variant="outline" className="rounded-xl border-2 border-border h-11 px-4 gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" className="rounded-xl border-2 border-border h-11 px-4 gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Patient & Doctor Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/30 border-2 border-border p-6 rounded-[24px] relative overflow-hidden group">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Patient Profile</div>
              <h2 className="text-2xl font-black text-slate-200 tracking-tight">{caseData.patientName}</h2>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase">
                <span>{caseData.patientAge || 37} Years</span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span>{caseData.patientGender === 'M' ? 'Male' : caseData.patientGender === 'F' ? 'Female' : 'Others'}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <Activity className="w-32 h-32 -mr-8 -mt-8" />
          </div>
        </Card>

        <Card className="bg-primary/[0.03] border-2 border-primary/20 p-6 rounded-[24px] relative overflow-hidden group">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-primary uppercase tracking-widest">Assigned Specialist</div>
              <h2 className="text-2xl font-black text-slate-200 tracking-tight">{caseData.assignedDoctor || "Unassigned"}</h2>
              <div className="text-xs font-bold text-slate-400 uppercase">
                Medical Director • Reg #88219
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <Stethoscope className="w-32 h-32 -mr-8 -mt-8" />
          </div>
        </Card>
      </div>

      {/* Audio Recordings Management */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-widest uppercase">
            <Mic className="w-4 h-4" />
            Audio Recordings ({recordings.length})
          </div>
          <div className="flex gap-3">
            <Button 
               variant="outline" 
               className="h-9 px-4 rounded-xl border-2 border-border gap-2 text-xs font-bold bg-white/5"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button 
               onClick={() => isRecording ? handleStopRecording() : handleStartRecording()}
               variant="outline" 
               className={cn(
                 "h-9 px-4 rounded-xl border-2 gap-2 text-xs font-bold transition-all duration-300",
                 isRecording 
                   ? "border-red-500 text-white bg-red-600 hover:bg-red-700 animate-pulse" 
                   : "border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
               )}
            >
              {isRecording ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  STOP {formatTime(recordingSeconds)}
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Record
                </>
              )}
            </Button>
          </div>
        </div>

        <Card className="bg-card/30 border-2 border-border rounded-[24px] overflow-hidden p-6">
          <div className="space-y-4">
            {recordings.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <FileAudio className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-300 font-bold">No recordings found</p>
                  <p className="text-muted-foreground text-xs">Start a record or upload one to begin analysis</p>
                </div>
              </div>
            ) : (
              recordings.map((rec) => (
                <div key={rec.id} className={cn(
                  "bg-slate-900/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between group transition-all",
                  rec.isDeleted ? "opacity-60 grayscale-[0.5]" : "hover:border-white/10"
                )}>
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-transform",
                      rec.isDeleted ? "bg-red-500/10 text-red-400" : "bg-white/5 text-primary group-hover:scale-110"
                    )}>
                      {rec.isDeleted ? <Trash2 className="w-6 h-6" /> : <AudioLines className="w-6 h-6" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-black text-slate-200 tracking-tight">{rec.name}</div>
                        {rec.isDeleted && <span className="text-[8px] font-black bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full tracking-widest uppercase">Removed</span>}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rec.date} • {rec.time}</span>
                         <span>{rec.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Mock Player Control */}
                    <div className={cn(
                      "hidden md:flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/5",
                      rec.isDeleted && "opacity-20 pointer-events-none"
                    )}>
                      <Play className="w-4 h-4 text-primary fill-primary" />
                      <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-primary" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{rec.duration}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {rec.aiAuditSummary && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedAuditSummary(rec.aiAuditSummary);
                            setShowAuditModal(true);
                          }}
                          className="h-9 w-9 text-blue-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl"
                          title="View Original AI Audit"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleAnalyzeRecording(rec.id)}
                        disabled={isSummarizing || rec.isDeleted || !!rec.aiAuditSummary}
                        className={cn(
                          "rounded-xl px-4 py-2 h-9 text-xs font-black gap-2 border",
                          (rec.aiAuditSummary || rec.isDeleted) 
                            ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed" 
                            : "bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                        )}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isSummarizing ? "ANALYSING..." : rec.isDeleted ? "LOCKED" : rec.aiAuditSummary ? "ANALYSED" : "ANALYSE"}
                      </Button>
                      {!rec.isDeleted && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveRecording(rec.id)}
                          className="h-9 w-9 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      {/* Manual Scribe / Transcription Interface */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">
          <FileText className="w-3.5 h-3.5" />
          Transcription Workspace
        </div>
        <Card className="bg-[#0F1219] border-2 border-border rounded-[32px] overflow-hidden group shadow-2xl">
          <div className="p-8 space-y-6">
            <textarea 
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste raw dental transcript, dictation notes, or clinical observations here for AI analysis..."
              className="w-full h-48 bg-transparent border-none focus:ring-0 text-lg text-slate-300 font-medium leading-relaxed resize-none placeholder:text-slate-700 custom-scrollbar"
            />
            
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  transcript.length > 50 ? "bg-green-500 animate-pulse" : "bg-slate-700"
                )} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {transcript.length} Characters Inputted
                </span>
              </div>
              
              <Button 
                onClick={() => handleAnalyzeRecording('manual')}
                disabled={transcript.length < 20 || isSummarizing}
                className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 h-12 font-black flex items-center gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                {isSummarizing ? "ANALYSING..." : "GENERATE CASE SHEET"}
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Case Sheet Content */}
      <AnimatePresence mode="wait">
        {summary && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-20"
          >
            {/* Critical Alert */}
            {summary.criticalAlert && (
              <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-[24px] flex gap-6 items-start relative overflow-hidden group">
                <div className="p-3 bg-destructive/10 rounded-2xl text-destructive">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1 relative z-10">
                  <div className="text-[10px] font-bold text-destructive tracking-widest uppercase">Critical Alert</div>
                  <p className="text-slate-300 font-medium leading-relaxed max-w-2xl">
                    {summary.criticalAlert}
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <AlertCircle className="w-32 h-32 -mr-8 -mt-8" />
                </div>
              </div>
            )}

            {/* Chief Complaints & VAS Score */}
            <div className="grid grid-cols-3 gap-6">
              <Card className="col-span-2 bg-card/50 border-2 border-border p-8 rounded-[24px] space-y-6">
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-primary">
                  <MessageSquare className="w-4 h-4" />
                  Chief Complaints
                </div>
                <div className="flex flex-wrap gap-3">
                  {summary.chiefComplaints.map((complaint, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/5 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium border border-white/10">
                      {complaint}
                    </Badge>
                  ))}
                </div>
              </Card>
              <Card className="bg-card/50 border-2 border-border p-8 rounded-[24px] space-y-6 flex flex-col justify-center items-center text-center">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7C3AED]">Pain Intensity (VAS)</div>
                <div className="relative flex items-center justify-center">
                  <div className="text-6xl font-display font-bold text-primary">{summary.vasScore}</div>
                  <div className="text-xl text-muted-foreground font-bold mt-4 ml-1">/10</div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${(summary.vasScore / 10) * 100}%` }}
                  />
                </div>
              </Card>
            </div>

            {/* Findings & Observations */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-card/50 border-2 border-border p-8 rounded-[24px] space-y-6">
                <div className="text-[10px] uppercase font-bold tracking-widest text-primary">Radiographic Findings</div>
                <ul className="space-y-4">
                  {summary.radiographicFindings.map((finding, i) => (
                    <li key={i} className="flex gap-3 items-center text-slate-300 font-medium group">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="bg-card/50 border-2 border-border p-8 rounded-[24px] space-y-6">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#7C3AED]">Clinical Observations</div>
                <ul className="space-y-4">
                  {summary.clinicalObservations.map((obs, i) => (
                    <li key={i} className="flex gap-3 items-center text-slate-300 font-medium group">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 group-hover:bg-indigo-500 transition-colors" />
                      {obs}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Treatment Plan Table */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mr-2">Treatment Plan</div>
                {!isFinalized && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 rounded-full px-3 py-1 font-bold text-[10px] tracking-widest">
                    DRAFT MODE
                  </Badge>
                )}
              </div>
              <Card className="border-2 border-border rounded-[24px] overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow className="border-border">
                      <TableHead className="text-[10px] font-bold tracking-widest uppercase py-6 pl-8 w-32">Phase</TableHead>
                      <TableHead className="text-[10px] font-bold tracking-widest uppercase">Procedure</TableHead>
                      <TableHead className="text-[10px] font-bold tracking-widest uppercase">Teeth</TableHead>
                      <TableHead className="text-[10px] font-bold tracking-widest uppercase">Priority</TableHead>
                      <TableHead className="text-[10px] font-bold tracking-widest uppercase text-right pr-8">Service Cost (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.treatmentPlan.map((plan, i) => (
                      <TableRow key={i} className="border-border group hover:bg-white/[0.01]">
                        <TableCell className="pl-8 font-bold text-[10px] tracking-widest uppercase text-primary py-5">
                          {plan.phase}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-200">{plan.procedure}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">{plan.teeth}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "rounded-lg px-4 py-1 font-bold text-[10px] uppercase tracking-tighter",
                              plan.priority === 'Immediate' ? "bg-red-500/10 text-red-500" :
                              plan.priority === 'Moderate' ? "bg-orange-500/10 text-orange-500" :
                              plan.priority === 'Routine' ? "bg-blue-500/10 text-blue-500" :
                              "bg-purple-500/10 text-purple-500"
                            )}
                          >
                            {plan.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          {isFinalized ? (
                            <span className="font-bold text-slate-200">₹{plan.cost?.toLocaleString() || '0'}</span>
                          ) : (
                            <div className="flex justify-end">
                              <Input 
                                type="number"
                                placeholder="0"
                                value={plan.cost || ""}
                                onChange={(e) => handleUpdateCost(i, e.target.value)}
                                className="w-24 h-9 bg-white/5 border-border rounded-lg text-right font-mono font-bold text-slate-200"
                              />
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </section>

            {/* Medical History & Home Care */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-[#1E1B4B]/10 border border-[#1E1B4B]/30 p-8 rounded-[24px] space-y-6 relative overflow-hidden">
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-primary text-[#8B5CF6]">
                  <Heart className="w-4 h-4" />
                  Medical History Comments
                </div>
                <div className="space-y-4">
                  {summary.medicalHistory.map((history, i) => (
                    <div key={i} className="flex gap-3 items-start text-slate-300 font-medium group text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      {history}
                    </div>
                  ))}
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Heart className="w-32 h-32 -mr-8 -mt-8" />
                </div>
              </Card>

              <Card className="bg-[#451A03]/10 border border-[#451A03]/30 p-8 rounded-[24px] space-y-6 relative overflow-hidden">
                <div className="text-[10px] uppercase font-bold tracking-widest text-orange-500">Home Care Actions</div>
                <ul className="space-y-3">
                  {summary.homeCare.map((action, i) => (
                    <li key={i} className="flex gap-3 items-center text-slate-300 font-medium">
                      <ChevronRight className="w-4 h-4 text-orange-500" />
                      {action}
                    </li>
                  ))}
                </ul>
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Clock className="w-32 h-32 -mr-8 -mt-8" />
                </div>
              </Card>
            </div>

            {/* Patient Education Path */}
            <Card className="bg-primary/5 border-2 border-primary/20 p-8 rounded-[24px] group cursor-pointer hover:bg-primary/10 transition-all">
              <div className="text-[10px] uppercase font-bold tracking-widest text-primary mb-6">Patient Education Path</div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <CirclePlay className="w-8 h-8 fill-primary/20" />
                </div>
                <div>
                  <div className="font-display font-bold text-lg">Visualizing the RCT Process</div>
                  <p className="text-sm text-muted-foreground">Personalized animation synced to medical history</p>
                </div>
              </div>
            </Card>

            {/* Revenue Opportunity */}
            <Card className={cn(
              "border-2 rounded-[24px] transition-all duration-500",
              showRevenueDetail ? "bg-[#052E16]/20 border-emerald-500/20 shadow-xl shadow-emerald-500/5" : "bg-white/5 border-white/10 opacity-60 grayscale"
            )}>
               <CardContent className="p-8">
                {showRevenueDetail ? (
                  <>
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-2">Clinical Revenue Opportunity</div>
                        <div className="text-5xl font-display font-bold tracking-tight text-white mb-6">₹{totalCost.toLocaleString()}.00</div>
                        <div className="h-[1px] w-full bg-emerald-500/20" />
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-2">Treatment Urgency</div>
                        <Badge className="bg-red-500 text-white rounded-full px-6 py-2 tracking-widest text-[10px]">CRITICAL</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-12">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-2">Production Value</div>
                        <div className="text-lg font-bold text-white tracking-widest uppercase">{summary.revenueOpportunity.productionValue}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-2">Uptake Probability</div>
                        <div className="flex items-center gap-3">
                          <span className="text-4xl font-display font-bold text-emerald-500">{summary.revenueOpportunity.uptakeProbability}</span>
                          <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <IndianRupee className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-xl">Revenue Analysis Pending</h3>
                      <p className="text-muted-foreground text-sm max-w-xs mx-auto">Please add service costs to the treatment plan to calculate the total clinical revenue opportunity.</p>
                    </div>
                  </div>
                )}
               </CardContent>
            </Card>

            {/* Finalization Section */}
            {!isFinalized ? (
              <div className="pb-10 pt-4">
                <Button 
                  onClick={handleFinalize}
                  size="lg"
                  disabled={!showRevenueDetail}
                  className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-xl font-bold gap-3 shadow-xl shadow-primary/20"
                >
                  <ShieldCheck className="w-6 h-6" />
                  FINALIZE CASE SHEET & SYNC TO RECORDS
                </Button>
                <div className="text-center mt-4 flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  Drafting mode active. All entries are editable before record syncing.
                </div>
              </div>
            ) : (
              <Card className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-[24px] flex items-center justify-center gap-4 text-blue-400 font-bold tracking-widest uppercase text-sm mb-10">
                <ShieldCheck className="w-6 h-6" />
                Medical Record Synchronized & Finalized
              </Card>
            )}

          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAuditModal && selectedAuditSummary && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#0F1219] border-2 border-blue-500/20 w-full max-w-5xl max-h-[90vh] rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-blue-500/5">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-200 uppercase tracking-[0.2em] text-base">AI Accountability Log</h3>
                      <p className="text-[10px] text-blue-400/60 font-bold uppercase tracking-widest mt-1">Immutable Baseline Record • Forensic Clinical Audit</p>
                    </div>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setShowAuditModal(false)} className="rounded-full hover:bg-white/10 h-10 w-10">
                   <X className="w-6 h-6 text-slate-400" />
                 </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar">
                {/* Raw Transcript Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-3 py-1 bg-blue-500/10 rounded-full">Audio Data</div>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  <div className="bg-slate-900/80 border border-white/5 p-8 rounded-3xl">
                    <div className="text-[9px] font-black text-slate-500 uppercase mb-4 tracking-widest">Transcription Snapshot (Archived)</div>
                    <p className="text-base text-slate-300 leading-relaxed font-medium italic">
                      "{(selectedAuditSummary as any).archivedTranscript || transcript || "No transcription data captured for this audit log."}"
                    </p>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-16">
                  {/* Itemized Details */}
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Diagnostic Baseline</div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                           <div className="text-[9px] font-bold text-blue-400/60 uppercase">Chief Complaints</div>
                           <div className="flex flex-wrap gap-2">
                             {selectedAuditSummary.chiefComplaints.map((c, i) => (
                               <span key={i} className="text-[11px] font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{c}</span>
                             ))}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="text-[9px] font-bold text-blue-400/60 uppercase">Clinical Observations</div>
                           <ul className="space-y-2">
                             {selectedAuditSummary.clinicalObservations.map((o, i) => (
                               <li key={i} className="text-xs text-slate-400 flex gap-3">
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 mt-1.5" /> {o}
                               </li>
                             ))}
                           </ul>
                        </div>
                        <div className="space-y-2">
                           <div className="text-[9px] font-bold text-blue-400/60 uppercase">Radiographic Findings</div>
                           <ul className="space-y-2">
                             {selectedAuditSummary.radiographicFindings.map((f, i) => (
                               <li key={i} className="text-xs text-slate-400 flex gap-3 italic">
                                 <span className="text-blue-500/50">+</span> {f}
                               </li>
                             ))}
                           </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Medical Profile</div>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <div className="text-[9px] font-bold text-blue-400/60 uppercase tracking-widest">Indicators</div>
                            <div className="flex flex-wrap gap-1">
                              {selectedAuditSummary.medicalHistory.map((h, i) => (
                                <span key={i} className="text-[10px] text-slate-400">/ {h}</span>
                              ))}
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-1">
                            <div className="text-[9px] font-bold text-blue-400/60 uppercase tracking-widest">Pain Index</div>
                            <div className="text-3xl font-black text-blue-400">{selectedAuditSummary.vasScore}<span className="text-sm opacity-30">/10</span></div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Architecture (No Pricing) */}
                  <div className="space-y-12">
                     <div className="space-y-6">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Treatment Architecture</div>
                        <div className="space-y-4">
                           {selectedAuditSummary.treatmentPlan.map((p, i) => (
                             <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 group">
                                <div className="text-sm font-black text-slate-200 group-hover:text-blue-400 transition-colors">{p.procedure}</div>
                                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                   <span>Tooth {p.teeth} • {p.phase}</span>
                                   <span className="text-blue-400/40">Audit Verified</span>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Post-Care Directives</div>
                        <div className="space-y-3">
                           {selectedAuditSummary.homeCare.map((item, i) => (
                             <div key={i} className="text-xs text-slate-400 flex gap-3 italic">
                                <span className="text-blue-500/50 font-bold">»</span> {item}
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-500/5 border-t border-white/5 flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Archive ID: SIG-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                    <span className="text-[9px] text-blue-400/40 font-bold uppercase tracking-widest">Digital Fingerprint Verified 102.5.10.2</span>
                 </div>
                 <Button onClick={() => setShowAuditModal(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-10 h-12 tracking-widest uppercase text-xs">
                   Terminate Audit View
                 </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showPrintModal && summary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="w-full max-w-5xl h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
            >
               {/* Modal Header/Toolbar */}
               <div className="bg-slate-900 px-8 py-4 flex items-center justify-between text-white border-b border-white/10">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-lg">K</div>
                      <span className="font-display font-bold tracking-tight">Print Preview</span>
                    </div>
                    <div className="h-6 w-[1px] bg-white/20" />
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div 
                        onClick={() => setIncludeHeader(!includeHeader)}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-colors",
                          includeHeader ? "bg-primary" : "bg-white/20"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-3 h-3 bg-white rounded-full transition-transform",
                          includeHeader ? "left-6" : "left-1"
                        )} />
                      </div>
                      <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">Include Clinic Header</span>
                    </label>
                 </div>
                 <div className="flex items-center gap-3">
                   <Button 
                    onClick={() => handlePrint()}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 font-bold h-10 gap-2"
                   >
                     <Printer className="w-4 h-4" />
                     Print Document
                   </Button>
                   <Button 
                    variant="ghost" 
                    onClick={() => setShowPrintModal(false)}
                    className="text-white/50 hover:text-white hover:bg-white/10 rounded-xl"
                   >
                     <X className="w-5 h-5" />
                   </Button>
                 </div>
               </div>

               {/* Modal Body - Scrollable Preview */}
               <div className="flex-1 overflow-y-auto bg-slate-100 p-8 flex justify-center custom-scrollbar">
                  <div className="shadow-2xl overflow-hidden rounded-sm min-h-max mb-20 origin-top">
                    <PrintView 
                      ref={printRef} 
                      caseData={caseData} 
                      summary={summary} 
                      showHeader={includeHeader} 
                    />
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
