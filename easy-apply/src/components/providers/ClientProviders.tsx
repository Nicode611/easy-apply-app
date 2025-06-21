'use client';

import { AuthProvider } from "@/components/auth/AuthProvider";
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/redux/store';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={makeStore()}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
} 