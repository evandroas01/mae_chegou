import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockContratos, mockAlunos } from '@/services/mockData';
import { Contrato } from '@/types/contrato';

type PeriodoTab = 'M' | 'T' | 'N';

export default function Contratos() {
  const router = useRouter();
  const { user } = useAuth();
  const [periodoAtivo, setPeriodoAtivo] = useState<PeriodoTab>('M');
  const isResponsavel = user?.role === 'responsavel';

  const contratosPorPeriodo = useMemo(() => {
    let contratos = mockContratos.filter(c => c.periodo === periodoAtivo);
    
    // Se for responsável, filtrar apenas seus contratos
    if (isResponsavel && user?.filhosIds) {
      contratos = contratos.filter(c => 
        c.alunoIds.some(alunoId => user.filhosIds?.includes(alunoId))
      );
    }
    
    return contratos;
  }, [periodoAtivo, isResponsavel, user]);

  const getStatusAssinaturaColor = (status: string) => {
    switch (status) {
      case 'assinado':
        return AdminLTETheme.colors.success;
      case 'pendente':
        return AdminLTETheme.colors.warning;
      default:
        return AdminLTETheme.colors.secondary;
    }
  };

  const getStatusPagamentoColor = (status: string) => {
    return status === 'em_dia' ? AdminLTETheme.colors.success : AdminLTETheme.colors.danger;
  };

  const handleAssinar = (contrato: Contrato) => {
    Alert.alert(
      'Assinar Contrato',
      `Deseja assinar o contrato ${contrato.numero}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Assinar',
          onPress: () => {
            Alert.alert('Sucesso', 'Contrato assinado com sucesso!');
          },
        },
      ]
    );
  };

  const handleBaixarPDF = (contrato: Contrato) => {
    Alert.alert('Em desenvolvimento', 'Funcionalidade em breve');
  };

  const renderContrato = ({ item }: { item: Contrato }) => {
    const responsavel = mockAlunos.find(a => a.contratoId === item.id)?.responsavel;
    const alunos = mockAlunos.filter(a => item.alunoIds.includes(a.id));

    return (
      <Card style={styles.contratoCard}>
        <View style={styles.contratoHeader}>
          <View style={styles.contratoInfo}>
            <Text style={styles.contratoNumero}>{item.numero}</Text>
            {!isResponsavel && (
              <Text style={styles.contratoResponsavel}>
                {responsavel?.nome || 'Responsável não encontrado'}
              </Text>
            )}
            <Text style={styles.contratoAlunos}>
              {alunos.map(a => a.nome).join(', ')}
            </Text>
          </View>
          <View style={styles.contratoStatus}>
            <View style={styles.statusRow}>
              <IconSymbol
                name={item.statusAssinatura === 'assinado' ? 'checkmark.circle.fill' : 'clock.fill'}
                size={16}
                color={getStatusAssinaturaColor(item.statusAssinatura)}
              />
              <Text style={[styles.statusText, { color: getStatusAssinaturaColor(item.statusAssinatura) }]}>
                {item.statusAssinatura === 'assinado' ? 'Assinado' : 'Pendente'}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <IconSymbol
                name={item.statusPagamento === 'em_dia' ? 'checkmark.circle.fill' : 'exclamationmark.triangle.fill'}
                size={16}
                color={getStatusPagamentoColor(item.statusPagamento)}
              />
              <Text style={[styles.statusText, { color: getStatusPagamentoColor(item.statusPagamento) }]}>
                {item.statusPagamento === 'em_dia' ? 'Em Dia' : 'Atrasado'}
              </Text>
            </View>
            {item.periodoAtraso && item.periodoAtraso > 0 && (
              <Text style={styles.periodoAtraso}>
                {item.periodoAtraso} período(s) em atraso
              </Text>
            )}
          </View>
        </View>

        <View style={styles.contratoValor}>
          <Text style={styles.valorLabel}>Valor:</Text>
          <Text style={styles.valorText}>R$ {item.valor.toFixed(2)}</Text>
        </View>

        <View style={styles.contratoActions}>
          {isResponsavel ? (
            <>
              {item.statusAssinatura === 'pendente' && (
                <Button
                  title="Assinar Contrato"
                  onPress={() => handleAssinar(item)}
                  variant="primary"
                  style={styles.actionButtonFull}
                />
              )}
              <Button
                title="Baixar PDF"
                onPress={() => handleBaixarPDF(item)}
                variant="secondary"
                style={styles.actionButtonFull}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/aluno-detalhe/${alunos[0]?.id}` as any)}
              >
                <IconSymbol name="eye.fill" size={16} color={AdminLTETheme.colors.primary} />
                <Text style={styles.actionText}>Ver Aluno</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <IconSymbol name="message.fill" size={16} color={AdminLTETheme.colors.success} />
                <Text style={styles.actionText}>Mensagem</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve')}
              >
                <IconSymbol name="doc.text.fill" size={16} color={AdminLTETheme.colors.info} />
                <Text style={styles.actionText}>PDF</Text>
              </TouchableOpacity>
              {item.statusAssinatura === 'pendente' && (
                <TouchableOpacity style={styles.actionButton}>
                  <IconSymbol name="paperplane.fill" size={16} color={AdminLTETheme.colors.warning} />
                  <Text style={styles.actionText}>Reenviar</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </Card>
    );
  };

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Contratos</Text>

        {/* Abas de Período - Apenas para não responsáveis */}
        {!isResponsavel && (
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, periodoAtivo === 'M' && styles.tabActive]}
              onPress={() => setPeriodoAtivo('M')}
            >
              <Text style={[styles.tabText, periodoAtivo === 'M' && styles.tabTextActive]}>
                Manhã
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, periodoAtivo === 'T' && styles.tabActive]}
              onPress={() => setPeriodoAtivo('T')}
            >
              <Text style={[styles.tabText, periodoAtivo === 'T' && styles.tabTextActive]}>
                Tarde
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, periodoAtivo === 'N' && styles.tabActive]}
              onPress={() => setPeriodoAtivo('N')}
            >
              <Text style={[styles.tabText, periodoAtivo === 'N' && styles.tabTextActive]}>
                Noite
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {contratosPorPeriodo.length} contrato(s) encontrado(s)
          </Text>
        </View>

        <FlatList
          data={contratosPorPeriodo}
          renderItem={renderContrato}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>Nenhum contrato encontrado para este período</Text>
            </Card>
          }
        />
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: AdminLTETheme.colors.white,
    borderRadius: AdminLTETheme.borderRadius.md,
    padding: AdminLTETheme.spacing.xs,
    marginBottom: AdminLTETheme.spacing.lg,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: AdminLTETheme.spacing.sm,
    alignItems: 'center',
    borderRadius: AdminLTETheme.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: AdminLTETheme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: AdminLTETheme.colors.secondary,
  },
  tabTextActive: {
    color: AdminLTETheme.colors.white,
    fontWeight: '700',
  },
  resultsHeader: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  resultsText: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    fontWeight: '500',
  },
  contratoCard: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  contratoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AdminLTETheme.spacing.md,
  },
  contratoInfo: {
    flex: 1,
    marginRight: AdminLTETheme.spacing.md,
  },
  contratoNumero: {
    fontSize: 18,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  contratoResponsavel: {
    fontSize: 14,
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  contratoAlunos: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  contratoStatus: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AdminLTETheme.spacing.xs,
    gap: AdminLTETheme.spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  periodoAtraso: {
    fontSize: 11,
    color: AdminLTETheme.colors.danger,
    marginTop: AdminLTETheme.spacing.xs,
    fontWeight: '600',
  },
  contratoValor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: AdminLTETheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    marginBottom: AdminLTETheme.spacing.md,
  },
  valorLabel: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
  },
  valorText: {
    fontSize: 16,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
  },
  contratoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: AdminLTETheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AdminLTETheme.spacing.xs,
    paddingHorizontal: AdminLTETheme.spacing.sm,
    gap: AdminLTETheme.spacing.xs,
  },
  actionText: {
    fontSize: 12,
    color: AdminLTETheme.colors.dark,
    fontWeight: '500',
  },
  actionButtonFull: {
    flex: 1,
    marginHorizontal: AdminLTETheme.spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: AdminLTETheme.colors.secondary,
    fontSize: 16,
    padding: AdminLTETheme.spacing.lg,
  },
});

