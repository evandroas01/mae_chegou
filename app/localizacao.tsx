import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useStatusOnline } from '@/contexts/StatusOnlineContext';
import { Permissions } from '@/types/user';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Platform, Alert, Text, ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region, Marker } from 'react-native-maps';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { localizacaoService } from '@/services/localizacaoService';
import { veiculoService } from '@/services/veiculoService';
import { rotaService } from '@/services/rotaService';
import { LocalizacaoVeiculo } from '@/types/localizacao';

export default function Localizacao() {
  const { user } = useAuth();
  const router = useRouter();
  const statusOnlineContext = useStatusOnline();
  const isResponsavel = user?.role === 'responsavel';
  const isOnline = statusOnlineContext.isOnline;

  // Verificar se o usuário tem permissão para ver o mapa
  useEffect(() => {
    if (user) {
      const canView = Permissions[user.role].canViewMap || 
                     (user.role === 'responsavel' && Permissions[user.role].canViewRastreio);
      if (!canView) {
        Alert.alert('Acesso Negado', 'Você não tem permissão para acessar esta funcionalidade.');
        router.replace('/');
      }
    }
  }, [user, router]);

  // Se não tiver permissão, não renderizar nada (será redirecionado)
  if (user) {
    const canView = Permissions[user.role].canViewMap || 
                   (user.role === 'responsavel' && Permissions[user.role].canViewRastreio);
    if (!canView) {
      return null;
    }
  }
  const { currentLocation } = useStatusOnline();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [veiculoLocation, setVeiculoLocation] = useState<LocalizacaoVeiculo | null>(null);
  const [motoristaOnline, setMotoristaOnline] = useState<boolean>(false);
  const [veiculoId, setVeiculoId] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -23.55052, // São Paulo (fallback)
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    // Verificar se está rodando na web (mapas não funcionam na web)
    if (Platform.OS === 'web') {
      setMapError('Mapas não estão disponíveis na versão web. Use o app móvel.');
      return;
    }

    (async () => {
      try {
        if (user?.role === 'motorista') {
          // Solicitar permissão de localização apenas se for motorista
          const { status } = await Location.requestForegroundPermissionsAsync();
          
          if (status !== 'granted') {
            Alert.alert(
              'Permissão Negada',
              'A permissão de localização foi negada. O mapa será exibido com uma localização padrão.',
            );
            return;
          }

          // Obter localização atual
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          setLocation(currentLocation);

          // Atualizar região do mapa para a localização do usuário
          const newRegion: Region = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setRegion(newRegion);

          // Animar o mapa para a localização do usuário
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        }
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        setMapError('Não foi possível obter sua localização. Verifique se o GPS está ativado.');
      }
    })();
  }, [user?.role]);

  // Buscar veículo do motorista
  useEffect(() => {
    if (user?.role === 'motorista' && isOnline) {
      loadVeiculo();
    }
  }, [user, isOnline]);

  const loadVeiculo = async () => {
    try {
      const veiculos = await veiculoService.getByMotorista();
      if (veiculos.length > 0) {
        setVeiculoId(veiculos[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar veículo:', error);
    }
  };

  // Sincronizar localização local com a do contexto global em tempo real
  useEffect(() => {
    if (currentLocation) {
      setLocation(currentLocation);

      // Se for motorista, atualiza a região do mapa conforme se move
      if (user?.role === 'motorista') {
        const newRegion: Region = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    }
  }, [currentLocation, user?.role]);

  // Buscar localização do motorista (responsável)
  useEffect(() => {
    if (isResponsavel) {
      loadLocalizacaoMotorista();

      // Buscar localização periodicamente a cada 3 segundos
      const interval = setInterval(() => {
        loadLocalizacaoMotorista();
      }, 3000); // 3 segundos

      return () => clearInterval(interval);
    } else {
      setVeiculoLocation(null);
    }
  }, [isResponsavel]);

  const loadLocalizacaoMotorista = async () => {
    try {
      const statusRes = await rotaService.getMotoristaStatus();
      setMotoristaOnline(statusRes.statusOnline);

      if (statusRes.statusOnline) {
        const localizacao = await localizacaoService.getLocalizacaoMotorista();
        if (localizacao) {
          setVeiculoLocation(localizacao);
          
          // Atualizar região do mapa para a localização do veículo
          const newRegion: Region = {
            latitude: localizacao.latitude,
            longitude: localizacao.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setRegion(newRegion);

          // Animar o mapa para a localização do veículo
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        }
      } else {
        setVeiculoLocation(null);
      }
    } catch (error) {
      console.error('Erro ao carregar localização do motorista:', error);
      setMotoristaOnline(false);
      setVeiculoLocation(null);
    }
  };

  // Coords do veículo para o marcador
  const veiculoCoords = veiculoLocation ? {
    latitude: veiculoLocation.latitude,
    longitude: veiculoLocation.longitude,
  } : null;

  // Se houver erro ou estiver na web, mostrar mensagem
  if (mapError || Platform.OS === 'web') {
    return (
      <AppLayout>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.pageTitle}>Localização</Text>
          <Card>
            <View style={styles.errorContainer}>
              <IconSymbol name="map.fill" size={48} color={AdminLTETheme.colors.secondary} />
              <Text style={styles.errorText}>
                {mapError || 'Mapas não estão disponíveis na versão web. Use o app móvel.'}
              </Text>
            </View>
          </Card>
        </ScrollView>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.pageTitle}>Localização</Text>

        {/* Status Online/Offline para Responsável */}
        {isResponsavel && (
          <Card style={styles.statusCard}>
            <View style={styles.statusRow}>
              <IconSymbol
                name={motoristaOnline ? 'location.fill' : 'location.slash.fill'}
                size={24}
                color={motoristaOnline ? AdminLTETheme.colors.success : AdminLTETheme.colors.secondary}
              />
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>
                  {motoristaOnline ? 'Motorista Online' : 'Motorista Offline'}
                </Text>
                <Text style={styles.statusSubtext}>
                  {motoristaOnline 
                    ? 'A localização do veículo está disponível' 
                    : 'A localização não está disponível no momento'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Avisos */}
        {isResponsavel && isOnline && (
          <Card title="Avisos Recentes" style={styles.avisosCard}>
            <View style={styles.avisoItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={AdminLTETheme.colors.success} />
              <View style={styles.avisoContent}>
                <Text style={styles.avisoText}>Rota iniciada às 07:30</Text>
                <Text style={styles.avisoTime}>Há 15 minutos</Text>
              </View>
            </View>
            <View style={styles.avisoItem}>
              <IconSymbol name="bell.fill" size={20} color={AdminLTETheme.colors.warning} />
              <View style={styles.avisoContent}>
                <Text style={styles.avisoText}>Chegando em 5 minutos</Text>
                <Text style={styles.avisoTime}>Há 2 minutos</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Mapa */}
        <Card title="Mapa" style={styles.mapCard}>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.map}
              initialRegion={region}
              showsUserLocation={user?.role === 'motorista'}
              showsMyLocationButton={user?.role === 'motorista'}
              zoomEnabled={true}
              scrollEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
            >
              {veiculoCoords && (
                <Marker
                  coordinate={veiculoCoords}
                  title="Veículo Escolar"
                  description={`Localização atualizada em ${new Date(veiculoLocation!.timestamp).toLocaleTimeString('pt-BR')}`}
                >
                  <View style={styles.markerContainer}>
                    <IconSymbol name="car.fill" size={32} color={AdminLTETheme.colors.primary} />
                  </View>
                </Marker>
              )}
            </MapView>
          </View>
        </Card>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.lg,
    letterSpacing: 0.5,
  },
  statusCard: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusInfo: {
    marginLeft: AdminLTETheme.spacing.md,
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  statusSubtext: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  avisosCard: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  avisoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AdminLTETheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avisoContent: {
    marginLeft: AdminLTETheme.spacing.md,
    flex: 1,
  },
  avisoText: {
    fontSize: 14,
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  avisoTime: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  mapCard: {
    marginBottom: AdminLTETheme.spacing.lg,
  },
  mapContainer: {
    height: 400,
    borderRadius: AdminLTETheme.borderRadius.md,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: AdminLTETheme.colors.primary,
  },
  errorContainer: {
    alignItems: 'center',
    padding: AdminLTETheme.spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: AdminLTETheme.colors.secondary,
    textAlign: 'center',
    marginTop: AdminLTETheme.spacing.md,
  },
});

