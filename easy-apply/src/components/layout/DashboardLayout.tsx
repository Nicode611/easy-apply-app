import { ReactNode } from 'react';
import Header from './Header';
import AnimatedBackground from '../ui/AnimatedBackground';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen bg-lightBg relative overflow-y-auto flex flex-col">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 