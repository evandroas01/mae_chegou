import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusOnline } from '@/types/rota';

interface StatusOnlineContextType {
  statusOnline: StatusOnline;
  toggleStatus: () => Promise<void>;
  isOnline: boolean;
}

const StatusOnlineContext = createContext<StatusOnlineContextType | undefined>(undefined);

export const StatusOnlineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [statusOnline, setStatusOnline] = useState<StatusOnline>('offline');

  React.useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const stored = await AsyncStorage.getItem('@statusOnline');
      if (stored) {
        setStatusOnline(stored as StatusOnline);
      }
    } catch (error) {
      console.error('Erro ao carregar status online:', error);
    }
  };

  const toggleStatus = async () => {
    try {
      const newStatus: StatusOnline = statusOnline === 'online' ? 'offline' : 'online';
      setStatusOnline(newStatus);
      await AsyncStorage.setItem('@statusOnline', newStatus);
    } catch (error) {
      console.error('Erro ao alterar status online:', error);
    }
  };

  return (
    <StatusOnlineContext.Provider
      value={{
        statusOnline,
        toggleStatus,
        isOnline: statusOnline === 'online',
      }}
    >
      {children}
    </StatusOnlineContext.Provider>
  );
};

export const useStatusOnline = () => {
  const context = useContext(StatusOnlineContext);
  if (context === undefined) {
    throw new Error('useStatusOnline deve ser usado dentro de um StatusOnlineProvider');
  }
  return context;
};

