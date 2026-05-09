import React, { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.tsx';
import { Stethoscope, Lock, Mail } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/20">K</div>
          <span className="font-display text-3xl font-bold tracking-tight">KOSMO</span>
        </div>

        <Card className="bg-card border-none shadow-2xl relative overflow-hidden">
          <CardHeader className="space-y-2 p-8 pb-4">
            <CardTitle className="text-3xl font-display font-bold">Welcome Doctor</CardTitle>
            <CardDescription className="text-muted-foreground text-lg">Enter your credentials to access the registry.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="doctor@kosmo.com" 
                    className="pl-12 h-14 bg-white/5 border-border rounded-xl text-lg focus-visible:ring-primary"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    className="pl-12 h-14 bg-white/5 border-border rounded-xl text-lg focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                  <input type="checkbox" className="rounded border-border bg-white/5 text-primary focus:ring-primary h-4 w-4" />
                  Remember me
                </label>
                <a href="#" className="text-primary hover:underline font-medium">Forgot password?</a>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl text-lg font-bold tracking-tight bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Login to Registry"}
              </Button>
            </form>
          </CardContent>
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Stethoscope className="w-48 h-48 -mr-12 -mt-12" />
          </div>
        </Card>

        <p className="mt-8 text-center text-muted-foreground text-sm">
          Secure biometric login available on mobile devices.
        </p>
      </motion.div>
    </div>
  );
}
