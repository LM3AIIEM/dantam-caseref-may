import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  CreditCard, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'cases', label: 'Cases', icon: ClipboardList },
    { id: 'billings', label: 'Billings', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 sidebar-gradient border-r border-border h-screen flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2 mt-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl">K</div>
        <span className="font-display text-xl font-bold tracking-tight">KOSMO</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="mt-auto flex items-center gap-3 px-3 py-3 text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
}
