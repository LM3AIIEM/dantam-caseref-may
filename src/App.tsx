import { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import CaseRegistry from './components/CaseRegistry.tsx';
import CaseDetail from './components/CaseDetail.tsx';
import Login from './components/Login.tsx';
import { Case } from './types.ts';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('cases');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        {activeTab === 'cases' ? (
          selectedCase ? (
            <CaseDetail caseData={selectedCase} onBack={() => setSelectedCase(null)} />
          ) : (
            <CaseRegistry onSelectCase={setSelectedCase} />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">🚧</span>
              </div>
              <h2 className="text-2xl font-display font-bold tracking-tight">Section Under Development</h2>
              <p className="text-muted-foreground">The {activeTab} module is currently being optimized for the dental workflow. Please check back soon.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
