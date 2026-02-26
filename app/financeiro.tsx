import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SearchBar } from '@/components/ui/SearchBar';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { financeiroService } from '@/services/financeiroService';
import { Lancamento, LancamentoCategoria, ResumoFinanceiro } from '@/types/financeiro';

export default function Financeiro() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<'mes' | 'trimestre' | 'ano'>('mes');
  const [filtroCategoria, setFiltroCategoria] = useState<LancamentoCategoria | ''>('');
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro>({
    saldoAtual: 0,
    totalReceitasMes: 0,
    totalDespesasMes: 0,
    saldoMes: 0,
    inadimplencia: { valor: 0, percentual: 0, quantidade: 0 },
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';
  const isMotorista = user?.role === 'motorista';
  const canEdit = isAdmin || isMotorista;

  // Carregar dados do backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lancamentosData, resumoData] = await Promise.all([
        financeiroService.getAll(),
        financeiroService.getResumo(),
      ]);
      setLancamentos(lancamentosData);
      setResumo(resumoData);
    } catch (error: any) {
      console.error('Erro ao carregar dados financeiros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados financeiros.');
    } finally {
      setLoading(false);
    }
  };

  // Calcular mesAtual e anoAtual para filtros
  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  // Filtrar lançamentos
  const lancamentosFiltrados = useMemo(() => {
    return lancamentos.filter(l => {
      const matchSearch = l.descricao.toLowerCase().includes(searchText.toLowerCase());
      const matchCategoria = !filtroCategoria || l.categoria === filtroCategoria;
      
      // Filtro por período
      const data = new Date(l.data);
      let matchPeriodo = true;
      if (filtroPeriodo === 'mes') {
        matchPeriodo = data.getMonth() + 1 === mesAtual && data.getFullYear() === anoAtual;
      } else if (filtroPeriodo === 'trimestre') {
        const trimestre = Math.floor(data.getMonth() / 3) + 1;
        const trimestreAtual = Math.floor((mesAtual - 1) / 3) + 1;
        matchPeriodo = trimestre === trimestreAtual && data.getFullYear() === anoAtual;
      } else if (filtroPeriodo === 'ano') {
        matchPeriodo = data.getFullYear() === anoAtual;
      }

      return matchSearch && matchCategoria && matchPeriodo;
    });
  }, [lancamentos, searchText, filtroCategoria, filtroPeriodo, mesAtual, anoAtual]);

  const getCategoriaLabel = (categoria: LancamentoCategoria) => {
    const labels: Record<LancamentoCategoria, string> = {
      receita_recorrente: 'Receita Recorrente',
      receita_extra: 'Receita Extra',
      despesa_fixa: 'Despesa Fixa',
      despesa_variavel: 'Despesa Variável',
    };
    return labels[categoria];
  };

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

  const handleCobrarAgora = () => {
    router.push('/notificacoes' as any);
  };

  const handleAdicionarLancamento = () => {
    router.push('/financeiro/novo' as any);
  };

  const handleEditarLancamento = (id: string) => {
    router.push(`/financeiro/${id}` as any);
  };

  const handleExcluirLancamento = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este lançamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await financeiroService.delete(id);
              await loadData(); // Recarregar dados
              Alert.alert('Sucesso', 'Lançamento excluído com sucesso.');
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao excluir lançamento.');
            }
          },
        },
      ]
    );
  };

  const renderLancamento = ({ item }: { item: Lancamento }) => (
    <TouchableOpacity
      onPress={() => canEdit && handleEditarLancamento(item.id)}
      activeOpacity={canEdit ? 0.7 : 1}
    >
      <Card style={styles.lancamentoCard}>
      <View style={styles.lancamentoHeader}>
        <View style={styles.lancamentoInfo}>
          <Text style={styles.lancamentoDescricao}>{item.descricao}</Text>
          <View style={styles.lancamentoMeta}>
            <Chip
              label={getCategoriaLabel(item.categoria)}
              selected={false}
              variant="primary"
            />
            <Text style={styles.lancamentoData}>
              {new Date(item.data).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
        <View style={styles.lancamentoValor}>
          <Text style={[
            styles.valorText,
            { color: item.tipo === 'receita' ? AdminLTETheme.colors.success : AdminLTETheme.colors.danger }
          ]}>
            {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
          </Text>
          <View style={styles.statusBadge}>
            <IconSymbol
              name={item.status === 'pago' ? 'checkmark.circle.fill' : item.status === 'atrasado' ? 'exclamationmark.triangle.fill' : 'clock.fill'}
              size={12}
              color={getStatusColor(item.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status === 'pago' ? 'Pago' : item.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
            </Text>
          </View>
        </View>
      </View>
      {item.vinculadoAlunoId && (
        <Text style={styles.vinculadoText}>
          Vinculado a aluno
        </Text>
      )}
      {canEdit && (
        <View style={styles.lancamentoActions}>
          <TouchableOpacity
            onPress={() => handleEditarLancamento(item.id)}
            style={styles.actionButton}
          >
            <IconSymbol name="pencil" size={18} color={AdminLTETheme.colors.primary} />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          {isAdmin && (
            <TouchableOpacity
              onPress={() => handleExcluirLancamento(item.id)}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <IconSymbol name="trash" size={18} color={AdminLTETheme.colors.danger} />
              <Text style={[styles.actionText, { color: AdminLTETheme.colors.danger }]}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Financeiro</Text>
          {canEdit && (
            <Button
              title="Adicionar Lançamento"
              onPress={handleAdicionarLancamento}
              variant="primary"
              style={styles.addButton}
            />
          )}
        </View>

        {/* Resumo */}
        <View style={styles.resumoContainer}>
          <Card style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <IconSymbol name="dollarsign.circle.fill" size={24} color={AdminLTETheme.colors.primary} />
              <Text style={styles.resumoValue}>R$ {resumo.saldoAtual.toFixed(2)}</Text>
            </View>
            <Text style={styles.resumoLabel}>Saldo Atual</Text>
          </Card>

          <Card style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <IconSymbol name="arrow.up.circle.fill" size={24} color={AdminLTETheme.colors.success} />
              <Text style={styles.resumoValue}>R$ {resumo.totalReceitasMes.toFixed(2)}</Text>
            </View>
            <Text style={styles.resumoLabel}>Receitas (Mês)</Text>
          </Card>

          <Card style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <IconSymbol name="arrow.down.circle.fill" size={24} color={AdminLTETheme.colors.danger} />
              <Text style={styles.resumoValue}>R$ {resumo.totalDespesasMes.toFixed(2)}</Text>
            </View>
            <Text style={styles.resumoLabel}>Despesas (Mês)</Text>
          </Card>

          <Card style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <IconSymbol name="equal.circle.fill" size={24} color={AdminLTETheme.colors.info} />
              <Text style={styles.resumoValue}>R$ {resumo.saldoMes.toFixed(2)}</Text>
            </View>
            <Text style={styles.resumoLabel}>Saldo do Mês</Text>
          </Card>
        </View>

        {/* Alerta de Inadimplência */}
        {resumo.inadimplencia.valor > 0 && (
          <Card style={styles.alertCard}>
            <View style={styles.alertContent}>
              <View style={styles.alertInfo}>
                <IconSymbol name="exclamationmark.triangle.fill" size={24} color={AdminLTETheme.colors.danger} />
                <View style={styles.alertText}>
                  <Text style={styles.alertTitle}>Inadimplência</Text>
                  <Text style={styles.alertValue}>
                    R$ {resumo.inadimplencia.valor.toFixed(2)} ({resumo.inadimplencia.percentual.toFixed(1)}%)
                  </Text>
                  <Text style={styles.alertSubtext}>
                    {resumo.inadimplencia.quantidade} pagamento(s) em atraso
                  </Text>
                </View>
              </View>
              <Button
                title="Cobrar agora"
                onPress={handleCobrarAgora}
                variant="danger"
                style={styles.cobrarButton}
              />
            </View>
          </Card>
        )}

        {/* Filtros */}
        <Card title="Filtros">
          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Período:</Text>
              <View style={styles.chipsRow}>
                <Chip
                  label="Mês"
                  selected={filtroPeriodo === 'mes'}
                  onPress={() => setFiltroPeriodo('mes')}
                />
                <Chip
                  label="Trimestre"
                  selected={filtroPeriodo === 'trimestre'}
                  onPress={() => setFiltroPeriodo('trimestre')}
                />
                <Chip
                  label="Ano"
                  selected={filtroPeriodo === 'ano'}
                  onPress={() => setFiltroPeriodo('ano')}
                />
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Categoria:</Text>
              <View style={styles.chipsRow}>
                <Chip
                  label="Todas"
                  selected={filtroCategoria === ''}
                  onPress={() => setFiltroCategoria('')}
                />
                <Chip
                  label="Receita Recorrente"
                  selected={filtroCategoria === 'receita_recorrente'}
                  onPress={() => setFiltroCategoria('receita_recorrente')}
                />
                <Chip
                  label="Receita Extra"
                  selected={filtroCategoria === 'receita_extra'}
                  onPress={() => setFiltroCategoria('receita_extra')}
                />
                <Chip
                  label="Despesa Fixa"
                  selected={filtroCategoria === 'despesa_fixa'}
                  onPress={() => setFiltroCategoria('despesa_fixa')}
                />
                <Chip
                  label="Despesa Variável"
                  selected={filtroCategoria === 'despesa_variavel'}
                  onPress={() => setFiltroCategoria('despesa_variavel')}
                />
              </View>
            </View>
          </View>
        </Card>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar lançamentos..."
          onClear={() => setSearchText('')}
        />

        {/* Lista de Lançamentos */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {lancamentosFiltrados.length} lançamento(s) encontrado(s)
          </Text>
        </View>

        <FlatList
          data={lancamentosFiltrados}
          renderItem={renderLancamento}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>Nenhum lançamento encontrado</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AdminLTETheme.spacing.lg,
    flexWrap: 'wrap',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    letterSpacing: 0.5,
    flex: 1,
    minWidth: 200,
  },
  addButton: {
    minWidth: 180,
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
  alertCard: {
    backgroundColor: AdminLTETheme.colors.danger + '15',
    borderColor: AdminLTETheme.colors.danger,
    borderWidth: 1,
    marginBottom: AdminLTETheme.spacing.lg,
  },
  alertContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  alertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 200,
  },
  alertText: {
    marginLeft: AdminLTETheme.spacing.md,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  alertValue: {
    fontSize: 18,
    fontWeight: '700',
    color: AdminLTETheme.colors.danger,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  alertSubtext: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  cobrarButton: {
    minWidth: 120,
  },
  filtersContainer: {
    gap: AdminLTETheme.spacing.md,
  },
  filterGroup: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.xs,
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
  lancamentoCard: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  lancamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lancamentoInfo: {
    flex: 1,
    marginRight: AdminLTETheme.spacing.md,
  },
  lancamentoDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  lancamentoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.xs,
  },
  lancamentoData: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  lancamentoValor: {
    alignItems: 'flex-end',
  },
  valorText: {
    fontSize: 18,
    fontWeight: '700',
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
  vinculadoText: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    marginTop: AdminLTETheme.spacing.xs,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: AdminLTETheme.colors.secondary,
    fontSize: 16,
    padding: AdminLTETheme.spacing.lg,
  },
  lancamentoActions: {
    flexDirection: 'row',
    marginTop: AdminLTETheme.spacing.md,
    paddingTop: AdminLTETheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AdminLTETheme.colors.light,
    gap: AdminLTETheme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AdminLTETheme.spacing.xs,
    padding: AdminLTETheme.spacing.sm,
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  actionText: {
    fontSize: 14,
    color: AdminLTETheme.colors.primary,
    fontWeight: '500',
  },
});
