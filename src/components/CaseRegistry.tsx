import { Search, Plus, Filter, ArrowRight, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { MOCK_CASES } from '../constants.ts';
import { Case } from '../types.ts';
import { cn } from '@/lib/utils.ts';

interface CaseRegistryProps {
  onSelectCase: (caseObj: Case) => void;
}

export default function CaseRegistry({ onSelectCase }: CaseRegistryProps) {
  const stats = [
    { label: 'TOTAL CASES', value: '1,284', change: '+5%', iconColor: 'bg-primary' },
    { label: 'ACTIVE CASES', value: '156', change: 'Live', iconColor: 'bg-emerald-500' },
    { label: 'COMPLETED', value: '842', change: '85%', iconColor: 'bg-blue-500' },
    { label: 'NEW TODAY', value: '12', change: '+2', iconColor: 'bg-orange-500' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Clinical Journey Registry</h1>
          <p className="text-muted-foreground mt-1">AI-powered clinical scribing and case management.</p>
        </div>
        <Button className="rounded-xl h-12 px-6 gap-2 font-semibold">
          <Plus className="w-5 h-5" />
          Create New Case
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border border-2 overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.iconColor)}>
                  <div className="w-5 h-5 bg-white/20 rounded" />
                </div>
                <Badge variant="secondary" className="bg-white/5 text-[10px] font-bold">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-3xl font-display font-bold tracking-tight">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by case ID, patient name or complaint..." 
              className="pl-12 h-14 bg-card border-2 border-border rounded-xl focus-visible:ring-primary text-base" 
            />
          </div>
          <Button variant="secondary" className="h-14 w-14 rounded-xl border-2 border-border p-0">
            <Filter className="w-5 h-5" />
          </Button>
          <div className="flex bg-card p-1 rounded-xl border-2 border-border h-14 items-center gap-1">
            <Button variant="ghost" className="rounded-lg px-6 font-bold text-xs h-full bg-primary text-white">ALL</Button>
            <Button variant="ghost" className="rounded-lg px-6 font-bold text-xs h-full text-muted-foreground">TODAY</Button>
            <Button variant="ghost" className="rounded-lg px-6 font-bold text-xs h-full text-muted-foreground">WEEK</Button>
          </div>
        </div>

        <Card className="bg-card border-none overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="hover:bg-transparent border-border border-b">
                <TableHead className="text-[10px] font-bold tracking-widest uppercase py-4">Case Details</TableHead>
                <TableHead className="text-[10px] font-bold tracking-widest uppercase">Patient</TableHead>
                <TableHead className="text-[10px] font-bold tracking-widest uppercase">Specialist</TableHead>
                <TableHead className="text-[10px] font-bold tracking-widest uppercase">Status</TableHead>
                <TableHead className="text-[10px] font-bold tracking-widest uppercase">Created At</TableHead>
                <TableHead className="text-[10px] font-bold tracking-widest uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CASES.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="group cursor-pointer hover:bg-white/[0.02] border-border"
                  onClick={() => onSelectCase(item)}
                >
                  <TableCell className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <ClipboardList className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-lg">Case #{item.id.split('-').pop()}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{item.complaint}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-border">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.patientName}`} />
                        <AvatarFallback>{item.patientName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{item.patientName}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                          {item.patientAge}Y • {item.patientGender === 'M' ? 'Male' : 'Female'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-bold text-slate-300">{item.assignedDoctor || "Unassigned"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        "rounded-md px-3 py-1 font-bold text-[10px] tracking-widest",
                        item.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        item.status === 'COMPLETED' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                        item.status === 'PROCESSING' ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                        "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                      )}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{item.createdAt}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">08:06 PM</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="group-hover:bg-primary/20 group-hover:text-primary transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
