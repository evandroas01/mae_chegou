import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useStatusOnline } from '@/contexts/StatusOnlineContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockAlunos } from '@/services/mockData';
import { PeriodoRota } from '@/types/rota';

export default function Rotas() {
  const router = useRouter();
  const { statusOnline, toggleStatus, isOnline } = useStatusOnline();
  const [periodoSelecionado, setPeriodoSelecionado] = useState<PeriodoRota>('M');
  const [rotaIniciada, setRotaIniciada] = useState(false);

  const alunosPorPeriodo = mockAlunos.filter(a => a.status === 'ativo' && a.periodo === periodoSelecionado);

  const getPeriodoLabel = (periodo: PeriodoRota) => {
    switch (periodo) {
      case 'M': return 'Manhã';
      case 'T': return 'Tarde';
      case 'N': return 'Noite';
    }
  };

  const handleIniciarRota = () => {
    if (!isOnline) {
      Alert.alert('Atenção', 'Você precisa estar online para iniciar a rota.');
      return;
    }
    Alert.alert(
      'Iniciar Rota',
      `Deseja iniciar a rota do período ${getPeriodoLabel(periodoSelecionado)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          onPress: () => {
            setRotaIniciada(true);
            // TODO: Notificar responsáveis
            Alert.alert('Sucesso', 'Rota iniciada! Os responsáveis foram notificados.');
          },
        },
      ]
    );
  };

  const handleFinalizarRota = () => {
    Alert.alert(
      'Finalizar Rota',
      'Deseja finalizar a rota atual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: () => {
            setRotaIniciada(false);
            // TODO: Notificar responsáveis
            Alert.alert('Sucesso', 'Rota finalizada! Os responsáveis foram notificados.');
          },
        },
      ]
    );
  };

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Rotas</Text>

        {/* Status Online */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <IconSymbol
                name={isOnline ? 'location.fill' : 'location.slash.fill'}
                size={24}
                color={isOnline ? AdminLTETheme.colors.success : AdminLTETheme.colors.secondary}
              />
              <View style={styles.statusText}>
                <Text style={styles.statusLabel}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
                <Text style={styles.statusSubtext}>
                  {isOnline ? 'Rota disponível para responsáveis' : 'Rota não disponível'}
                </Text>
              </View>
            </View>
            <Switch
              value={isOnline}
              onValueChange={toggleStatus}
              trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
              thumbColor={isOnline ? '#fff' : '#f4f3f4'}
            />
          </View>
        </Card>

        {/* Seletor de Período */}
        <Card title="Selecionar Período">
          <View style={styles.periodoContainer}>
            <Chip
              label="Manhã"
              selected={periodoSelecionado === 'M'}
              onPress={() => setPeriodoSelecionado('M')}
              variant="primary"
            />
            <Chip
              label="Tarde"
              selected={periodoSelecionado === 'T'}
              onPress={() => setPeriodoSelecionado('T')}
              variant="primary"
            />
            <Chip
              label="Noite"
              selected={periodoSelecionado === 'N'}
              onPress={() => setPeriodoSelecionado('N')}
              variant="primary"
            />
          </View>
        </Card>

        {/* Sequência de Rotas */}
        <Card title={`Sequência de Rotas - ${getPeriodoLabel(periodoSelecionado)}`}>
          {alunosPorPeriodo.length > 0 ? (
            <View style={styles.sequenciaContainer}>
              {alunosPorPeriodo.map((aluno, index) => (
                <View key={aluno.id} style={styles.pontoRota}>
                  <View style={styles.pontoNumero}>
                    <Text style={styles.pontoNumeroText}>{index + 1}</Text>
                  </View>
                  <View style={styles.pontoInfo}>
                    <Text style={styles.pontoNome}>{aluno.nome}</Text>
                    <Text style={styles.pontoEndereco}>
                      {aluno.enderecoContratante.rua}, {aluno.enderecoContratante.numero}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={styles.pontoRota}>
                <View style={[styles.pontoNumero, styles.pontoEscola]}>
                  <IconSymbol name="building.2.fill" size={16} color={AdminLTETheme.colors.white} />
                </View>
                <View style={styles.pontoInfo}>
                  <Text style={styles.pontoNome}>Escola</Text>
                  <Text style={styles.pontoEndereco}>
                    {alunosPorPeriodo[0]?.escola.nome}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>Nenhum aluno cadastrado para este período</Text>
          )}
        </Card>

        {/* Controles de Rota */}
        {isOnline && (
          <Card title="Controle de Rota">
            {!rotaIniciada ? (
              <Button
                title="Iniciar Rota"
                onPress={handleIniciarRota}
                variant="success"
                style={styles.rotaButton}
              />
            ) : (
              <View style={styles.rotaAtivaContainer}>
                <View style={styles.rotaAtivaInfo}>
                  <IconSymbol name="location.fill" size={24} color={AdminLTETheme.colors.success} />
                  <Text style={styles.rotaAtivaText}>Rota em andamento</Text>
                </View>
                <Button
                  title="Finalizar Rota"
                  onPress={handleFinalizarRota}
                  variant="danger"
                  style={styles.rotaButton}
                />
              </View>
            )}
          </Card>
        )}

        {/* Mapa */}
        <Card title="Mapa">
          <View style={styles.mapaPlaceholder}>
            <IconSymbol name="map.fill" size={48} color={AdminLTETheme.colors.secondary} />
            <Text style={styles.mapaText}>Mapa será exibido aqui</Text>
            <Text style={styles.mapaSubtext}>
              {isOnline ? 'Visualize o trajeto em tempo real' : 'Ative o status online para ver o mapa'}
            </Text>
          </View>
        </Card>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: AdminLTETheme.spacing.xl,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.lg,
    letterSpacing: 0.5,
  },
  statusCard: {
    marginBottom: AdminLTETheme.spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    marginLeft: AdminLTETheme.spacing.md,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
  },
  statusSubtext: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    marginTop: AdminLTETheme.spacing.xs,
  },
  periodoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.sm,
  },
  sequenciaContainer: {
    gap: AdminLTETheme.spacing.md,
  },
  pontoRota: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
  },
  pontoNumero: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AdminLTETheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AdminLTETheme.spacing.md,
  },
  pontoEscola: {
    backgroundColor: AdminLTETheme.colors.info,
  },
  pontoNumeroText: {
    color: AdminLTETheme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  pontoInfo: {
    flex: 1,
  },
  pontoNome: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  pontoEndereco: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  rotaButton: {
    marginTop: AdminLTETheme.spacing.md,
  },
  rotaAtivaContainer: {
    gap: AdminLTETheme.spacing.md,
  },
  rotaAtivaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: AdminLTETheme.spacing.sm,
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.success + '15',
    borderRadius: AdminLTETheme.borderRadius.md,
  },
  rotaAtivaText: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.success,
  },
  mapaPlaceholder: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
    padding: AdminLTETheme.spacing.xl,
  },
  mapaText: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginTop: AdminLTETheme.spacing.md,
  },
  mapaSubtext: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    marginTop: AdminLTETheme.spacing.xs,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: AdminLTETheme.colors.secondary,
    fontSize: 14,
    padding: AdminLTETheme.spacing.lg,
  },
});

