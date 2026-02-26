import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { SearchBar } from '@/components/ui/SearchBar';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Aluno } from '@/types/aluno';
import { alunoService } from '@/services/alunoService';

export default function Alunos() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [filtroEscola, setFiltroEscola] = useState<string>('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<'M' | 'T' | ''>('');
  const [filtroStatus, setFiltroStatus] = useState<'ativo' | 'inativo' | ''>('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlunos();
  }, []);

  const loadAlunos = async () => {
    try {
      setLoading(true);
      const data = await alunoService.getAll();
      setAlunos(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const escolas = useMemo(() => {
    const escolasUnicas = Array.from(new Set(
      alunos
        .filter(a => a.escola?.nome)
        .map(a => a.escola.nome)
    ));
    return escolasUnicas;
  }, [alunos]);

  // Filtrar alunos baseado no tipo de usuário
  const alunosFiltrados = useMemo(() => {
    let alunosDisponiveis = alunos;

    // Motorista só vê seus próprios alunos
    if (user?.role === 'motorista' && user.alunosIds) {
      alunosDisponiveis = alunos.filter(aluno => user.alunosIds?.includes(aluno.id));
    }

    // Responsável só vê seus filhos
    if (user?.role === 'responsavel' && user.filhosIds) {
      alunosDisponiveis = alunos.filter(aluno => user.filhosIds?.includes(aluno.id));
    }

    // Aplicar filtros de busca
    return alunosDisponiveis.filter(aluno => {
      const escolaNome = aluno.escola?.nome || '';
      const matchSearch = aluno.nome.toLowerCase().includes(searchText.toLowerCase()) ||
                         escolaNome.toLowerCase().includes(searchText.toLowerCase());
      const matchEscola = !filtroEscola || escolaNome === filtroEscola;
      const matchPeriodo = !filtroPeriodo || aluno.periodo === filtroPeriodo;
      const matchStatus = !filtroStatus || aluno.status === filtroStatus;

      return matchSearch && matchEscola && matchPeriodo && matchStatus;
    });
  }, [searchText, filtroEscola, filtroPeriodo, filtroStatus, user, alunos]);

  const getPeriodoLabel = (periodo: string) => {
    switch (periodo) {
      case 'M': return 'Manhã';
      case 'T': return 'Tarde';
      default: return periodo;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'ativo' ? AdminLTETheme.colors.success : AdminLTETheme.colors.secondary;
  };

  const getPagamentoIcon = (status: string) => {
    return status === 'em_dia' ? 'checkmark.circle.fill' : 'exclamationmark.triangle.fill';
  };

  const getPagamentoColor = (status: string) => {
    return status === 'em_dia' ? AdminLTETheme.colors.success : AdminLTETheme.colors.danger;
  };

  const renderAluno = ({ item }: { item: Aluno }) => (
    <Card style={styles.alunoCard}>
      <View style={styles.alunoHeader}>
        <View style={styles.alunoInfo}>
          <Text style={styles.alunoNome}>{item.nome || 'Sem nome'}</Text>
          <View style={styles.alunoMeta}>
            <Text style={styles.alunoEscola}>{item.escola?.nome || 'Escola não informada'}</Text>
            <View style={styles.chipsContainer}>
              <Chip
                label={getPeriodoLabel(item.periodo || '')}
                selected={false}
                variant="primary"
              />
              <Chip
                label={item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                selected={false}
                variant={item.status === 'ativo' ? 'success' : 'default'}
              />
            </View>
          </View>
        </View>
        <View style={styles.alunoActions}>
          <IconSymbol
            name={getPagamentoIcon(item.pagamento?.status || 'em_dia')}
            size={20}
            color={getPagamentoColor(item.pagamento?.status || 'em_dia')}
          />
        </View>
      </View>

      <View style={styles.alunoActionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/aluno-detalhe/${item.id}` as any)}
        >
          <IconSymbol name="eye.fill" size={16} color={AdminLTETheme.colors.primary} />
          <Text style={styles.actionText}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="doc.text.fill" size={16} color={AdminLTETheme.colors.info} />
          <Text style={styles.actionText}>Contrato</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="message.fill" size={16} color={AdminLTETheme.colors.success} />
          <Text style={styles.actionText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>
            {user?.role === 'motorista' ? 'Meus Alunos' : user?.role === 'responsavel' ? 'Meus Filhos' : 'Alunos'}
          </Text>
          {user?.role === 'motorista' && (
            <Button
              title="Cadastrar Novo Aluno"
              onPress={() => router.push('/cadastro-aluno' as any)}
              variant="primary"
              style={styles.cadastrarButton}
            />
          )}
        </View>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nome ou escola..."
          onClear={() => setSearchText('')}
        />

        <Card title="Filtros">
          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Escola:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
                <Chip
                  label="Todas"
                  selected={filtroEscola === ''}
                  onPress={() => setFiltroEscola('')}
                />
                {escolas.map(escola => (
                  <Chip
                    key={escola}
                    label={escola}
                    selected={filtroEscola === escola}
                    onPress={() => setFiltroEscola(escola)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Período:</Text>
              <View style={styles.chipsRow}>
                <Chip
                  label="Todos"
                  selected={filtroPeriodo === ''}
                  onPress={() => setFiltroPeriodo('')}
                />
                <Chip
                  label="Manhã"
                  selected={filtroPeriodo === 'M'}
                  onPress={() => setFiltroPeriodo('M')}
                />
                <Chip
                  label="Tarde"
                  selected={filtroPeriodo === 'T'}
                  onPress={() => setFiltroPeriodo('T')}
                />
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.chipsRow}>
                <Chip
                  label="Todos"
                  selected={filtroStatus === ''}
                  onPress={() => setFiltroStatus('')}
                />
                <Chip
                  label="Ativo"
                  selected={filtroStatus === 'ativo'}
                  onPress={() => setFiltroStatus('ativo')}
                />
                <Chip
                  label="Inativo"
                  selected={filtroStatus === 'inativo'}
                  onPress={() => setFiltroStatus('inativo')}
                />
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {alunosFiltrados.length} aluno{alunosFiltrados.length !== 1 ? 's' : ''} encontrado{alunosFiltrados.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <FlatList
          data={alunosFiltrados}
          renderItem={renderAluno}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>Nenhum aluno encontrado</Text>
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
  headerContainer: {
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
    marginRight: AdminLTETheme.spacing.md,
  },
  cadastrarButton: {
    minWidth: 180,
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
  alunoCard: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  alunoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: AdminLTETheme.spacing.md,
  },
  alunoInfo: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  alunoEscola: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  alunoMeta: {
    marginTop: AdminLTETheme.spacing.xs,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: AdminLTETheme.spacing.xs,
  },
  alunoActions: {
    padding: AdminLTETheme.spacing.xs,
  },
  alunoActionsRow: {
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
  },
  actionText: {
    fontSize: 12,
    color: AdminLTETheme.colors.dark,
    marginLeft: AdminLTETheme.spacing.xs,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: AdminLTETheme.colors.secondary,
    fontSize: 16,
    padding: AdminLTETheme.spacing.lg,
  },
});

