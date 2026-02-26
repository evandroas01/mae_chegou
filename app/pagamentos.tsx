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
import { mockLancamentos, mockAlunos } from '@/services/mockData';
import { Lancamento } from '@/types/financeiro';

export default function Pagamentos() {
  const router = useRouter();
  const { user } = useAuth();
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pago' | 'pendente' | 'atrasado'>('todos');

  // Filtrar pagamentos dos filhos do responsável
  const pagamentos = useMemo(() => {
    if (!user?.filhosIds) return [];
    
    return mockLancamentos
      .filter(l => {
        if (l.tipo !== 'receita') return false;
        if (!l.vinculadoAlunoId) return false;
        return user.filhosIds?.includes(l.vinculadoAlunoId);
      })
      .sort((a, b) => {
        const dataA = new Date(a.dataVencimento || a.data).getTime();
        const dataB = new Date(b.dataVencimento || b.data).getTime();
        return dataB - dataA;
      });
  }, [user]);

  const pagamentosFiltrados = useMemo(() => {
    if (filtroStatus === 'todos') return pagamentos;
    return pagamentos.filter(p => p.status === filtroStatus);
  }, [pagamentos, filtroStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return AdminLTETheme.colors.success;
      case 'atrasado':
        return AdminLTETheme.colors.danger;
      default:
        return AdminLTETheme.colors.warning;
    }
  };

  const handleGerarBoleto = (pagamento: Lancamento) => {
    Alert.alert('Boleto', 'Funcionalidade de geração de boleto em desenvolvimento');
  };

  const handleGerarPIX = (pagamento: Lancamento) => {
    Alert.alert('PIX', 'Funcionalidade de geração de PIX em desenvolvimento');
  };

  const handleGerarRecibo = (pagamento: Lancamento) => {
    if (pagamento.status !== 'pago') {
      Alert.alert('Atenção', 'Apenas pagamentos confirmados podem gerar recibo');
      return;
    }
    Alert.alert('Recibo', 'Funcionalidade de geração de recibo em desenvolvimento');
  };

  const renderPagamento = ({ item }: { item: Lancamento }) => {
    const aluno = mockAlunos.find(a => a.id === item.vinculadoAlunoId);

    return (
      <Card style={styles.pagamentoCard}>
        <View style={styles.pagamentoHeader}>
          <View style={styles.pagamentoInfo}>
            <Text style={styles.pagamentoDescricao}>{item.descricao}</Text>
            {aluno && (
              <Text style={styles.pagamentoAluno}>{aluno.nome}</Text>
            )}
            <View style={styles.pagamentoMeta}>
              <Text style={styles.pagamentoData}>
                Vencimento: {item.dataVencimento ? new Date(item.dataVencimento).toLocaleDateString('pt-BR') : 'N/A'}
              </Text>
              {item.dataPagamento && (
                <Text style={styles.pagamentoData}>
                  Pago em: {new Date(item.dataPagamento).toLocaleDateString('pt-BR')}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.pagamentoValor}>
            <Text style={styles.valorText}>R$ {item.valor.toFixed(2)}</Text>
            <View style={styles.statusBadge}>
              <IconSymbol
                name={item.status === 'pago' ? 'checkmark.circle.fill' : item.status === 'atrasado' ? 'exclamationmark.triangle.fill' : 'clock.fill'}
                size={16}
                color={getStatusColor(item.status)}
              />
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status === 'pago' ? 'Pago' : item.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pagamentoActions}>
          {item.status === 'pendente' || item.status === 'atrasado' ? (
            <>
              <Button
                title="Gerar Boleto"
                onPress={() => handleGerarBoleto(item)}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title="Gerar PIX"
                onPress={() => handleGerarPIX(item)}
                variant="primary"
                style={styles.actionButton}
              />
            </>
          ) : (
            <Button
              title="Gerar Recibo"
              onPress={() => handleGerarRecibo(item)}
              variant="success"
              style={styles.actionButton}
            />
          )}
        </View>
      </Card>
    );
  };

  const totalPendente = pagamentos
    .filter(p => p.status === 'pendente' || p.status === 'atrasado')
    .reduce((sum, p) => sum + p.valor, 0);

  const totalPago = pagamentos
    .filter(p => p.status === 'pago')
    .reduce((sum, p) => sum + p.valor, 0);

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Pagamentos</Text>

        {/* Resumo */}
        <View style={styles.resumoContainer}>
          <Card style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <IconSymbol name="arrow.up.circle.fill" size={24} color={AdminLTETheme.colors.success} />
              <Text style={styles.resumoValue}>R$ {totalPago.toFixed(2)}</Text>
            </View>
            <Text style={styles.resumoLabel}>Total Pago</Text>
          </Card>

          <Card style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <IconSymbol name="clock.fill" size={24} color={AdminLTETheme.colors.warning} />
              <Text style={styles.resumoValue}>R$ {totalPendente.toFixed(2)}</Text>
            </View>
            <Text style={styles.resumoLabel}>Total Pendente</Text>
          </Card>
        </View>

        {/* Filtros */}
        <Card title="Filtros">
          <View style={styles.chipsRow}>
            <Chip
              label="Todos"
              selected={filtroStatus === 'todos'}
              onPress={() => setFiltroStatus('todos')}
            />
            <Chip
              label="Pago"
              selected={filtroStatus === 'pago'}
              onPress={() => setFiltroStatus('pago')}
            />
            <Chip
              label="Pendente"
              selected={filtroStatus === 'pendente'}
              onPress={() => setFiltroStatus('pendente')}
            />
            <Chip
              label="Atrasado"
              selected={filtroStatus === 'atrasado'}
              onPress={() => setFiltroStatus('atrasado')}
            />
          </View>
        </Card>

        {/* Lista de Pagamentos */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {pagamentosFiltrados.length} pagamento(s) encontrado(s)
          </Text>
        </View>

        <FlatList
          data={pagamentosFiltrados}
          renderItem={renderPagamento}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>Nenhum pagamento encontrado</Text>
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
  resumoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: AdminLTETheme.spacing.lg,
  },
  resumoCard: {
    width: '48%',
    padding: AdminLTETheme.spacing.md,
    marginBottom: AdminLTETheme.spacing.md,
    minHeight: 100,
  },
  resumoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AdminLTETheme.spacing.sm,
  },
  resumoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginLeft: AdminLTETheme.spacing.sm,
  },
  resumoLabel: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    fontWeight: '500',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.sm,
  },
  resultsHeader: {
    marginBottom: AdminLTETheme.spacing.md,
    marginTop: AdminLTETheme.spacing.sm,
  },
  resultsText: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    fontWeight: '500',
  },
  pagamentoCard: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  pagamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AdminLTETheme.spacing.md,
  },
  pagamentoInfo: {
    flex: 1,
    marginRight: AdminLTETheme.spacing.md,
  },
  pagamentoDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  pagamentoAluno: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  pagamentoMeta: {
    gap: AdminLTETheme.spacing.xs,
  },
  pagamentoData: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  pagamentoValor: {
    alignItems: 'flex-end',
  },
  valorText: {
    fontSize: 18,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AdminLTETheme.spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  pagamentoActions: {
    flexDirection: 'row',
    gap: AdminLTETheme.spacing.sm,
    paddingTop: AdminLTETheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: AdminLTETheme.colors.secondary,
    fontSize: 16,
    padding: AdminLTETheme.spacing.lg,
  },
});

