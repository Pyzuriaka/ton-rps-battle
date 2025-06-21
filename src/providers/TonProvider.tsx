
import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

interface TonProviderProps {
  children: ReactNode;
}

const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;

export const TonProvider = ({ children }: TonProviderProps) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
};
