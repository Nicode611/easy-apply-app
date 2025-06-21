'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import FindJob from '@/components/page/FindJob';
import SavedAppliedJobs from "@/components/page/SavedAppliedJobs";
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  const currentView = useSelector((state: RootState) => state.dashboard.currentView);

  return (
    <DashboardLayout>
      {currentView === 'find' ? <FindJob /> : <SavedAppliedJobs />}
    </DashboardLayout>
  );
} 