import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rotaService } from '@/services/rotaService';
import { veiculoService } from '@/services/veiculoService';
import { localizacaoService } from '@/services/localizacaoService';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';

interface StatusOnlineContextType {
  statusOnline: StatusOnline;
  toggleStatus: () => Promise<void>;
  isOnline: boolean;
  currentLocation: Location.LocationObject | null;
}

const StatusOnlineContext = createContext<StatusOnlineContextType | undefined>(undefined);

export const StatusOnlineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [statusOnline, setStatusOnline] = useState<StatusOnline>('offline');
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [veiculoId, setVeiculoId] = useState<string | null>(null);

  const locationSub = useRef<Location.LocationSubscription | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const latestLocationRef = useRef<Location.LocationObject | null>(null);
  const veiculoIdRef = useRef<string | null>(null);

  // Keep latestLocationRef in sync to avoid stale closures in watch/heartbeat callbacks
  useEffect(() => {
    latestLocationRef.current = currentLocation;
  }, [currentLocation]);

  // Keep veiculoIdRef in sync to avoid stale closures
  useEffect(() => {
    veiculoIdRef.current = veiculoId;
  }, [veiculoId]);

  // Load initial online status
  useEffect(() => {
    loadStatus();
  }, []);

  // Automatically fetch vehicle if user is motorista and goes online
  useEffect(() => {
    if (user?.role === 'motorista' && statusOnline === 'online') {
      loadVeiculo();
    } else {
      setVeiculoId(null);
    }
  }, [user?.id, user?.role, statusOnline]);

  // Manage location tracking lifecycle reactively - ONLY for motorista
  useEffect(() => {
    if (statusOnline === 'online' && user && user.role === 'motorista') {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [statusOnline, user?.id, user?.role]);

  const loadStatus = async () => {
    try {
      const stored = await AsyncStorage.getItem('@statusOnline');
      if (stored === 'online') {
        setStatusOnline('online');
      }
    } catch (error) {
      console.error('Erro ao carregar status online:', error);
    }
  };

  const loadVeiculo = async () => {
    try {
      const veiculos = await veiculoService.getByMotorista();
      if (veiculos.length > 0) {
        setVeiculoId(veiculos[0].id);
        console.log('[StatusOnlineContext] Veículo carregado para tracking:', veiculos[0].id);
      }
    } catch (error) {
      console.error('[StatusOnlineContext] Erro ao carregar veículo:', error);
    }
  };

  const sendLocation = async (loc: Location.LocationObject) => {
    const activeVeiculoId = veiculoIdRef.current;
    if (!activeVeiculoId || !loc) return;

    try {
      await localizacaoService.saveLocalizacao({
        veiculoId: activeVeiculoId,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        velocidade: loc.coords.speed || undefined,
        direcao: loc.coords.heading || undefined,
      });
      console.log('[StatusOnlineContext] Localização física enviada:', loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      console.error('[StatusOnlineContext] Erro ao enviar localização:', error);
    }
  };

  const startTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão de localização negada');
        setStatusOnline('offline');
        await AsyncStorage.setItem('@statusOnline', 'offline');
        return;
      }

      // Stop any existing tracking
      stopTracking();

      // Retrieve and send immediate location
      try {
        const initialLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCurrentLocation(initialLoc);
        latestLocationRef.current = initialLoc;
        if (user?.role === 'motorista') {
          await sendLocation(initialLoc);
        }
      } catch (err) {
        console.warn('[StatusOnlineContext] Erro ao obter posição inicial:', err);
      }

      // Start watcher
      locationSub.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 3,
        },
        async (location) => {
          setCurrentLocation(location);
          latestLocationRef.current = location;
          if (user?.role === 'motorista') {
            await sendLocation(location);
          }
        }
      );

      // Start heartbeat backup loop if user is driver
      if (user?.role === 'motorista') {
        heartbeatIntervalRef.current = setInterval(async () => {
          if (latestLocationRef.current) {
            await sendLocation(latestLocationRef.current);
          }
        }, 3000);
      }
    } catch (e) {
      console.error('[StatusOnlineContext] Erro no tracking de localização:', e);
    }
  };

  const stopTracking = () => {
    if (locationSub.current) {
      locationSub.current.remove();
      locationSub.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  const toggleStatus = async () => {
    try {
      const newStatus: StatusOnline = statusOnline === 'online' ? 'offline' : 'online';
      
      if (newStatus === 'online') {
        await rotaService.putOnline();
      } else {
        await rotaService.putOffline();
      }

      setStatusOnline(newStatus);
      await AsyncStorage.setItem('@statusOnline', newStatus);
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Synchronize state on database mismatch
        setStatusOnline(statusOnline === 'online' ? 'offline' : 'online');
        await AsyncStorage.setItem('@statusOnline', statusOnline === 'online' ? 'offline' : 'online');
      } else {
        console.error('Erro ao alterar status online:', error);
        alert(error.response?.data?.error || 'Erro ao alterar status online');
      }
    }
  };

  return (
    <StatusOnlineContext.Provider
      value={{
        statusOnline,
        toggleStatus,
        isOnline: statusOnline === 'online',
        currentLocation,
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

