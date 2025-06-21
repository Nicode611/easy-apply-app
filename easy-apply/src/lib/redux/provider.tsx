'use client';

import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { ReactNode, useRef } from 'react';

export default function ReduxProvider({
  children,
}: {
  children: ReactNode;
}) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
} 