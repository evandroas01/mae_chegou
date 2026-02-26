import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useStatusOnline } from '@/contexts/StatusOnlineContext';
import { CAPACIDADE_VAN, mockAlunos, mockContratos, mockManutencoes } from '@/services/mockData';
import { financeiroService } from '@/services/financeiroService';
import { useRouter } from 'expo-router';
import React, { useMemo, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const isMotorista = user?.role === 'motorista';
  const isAdmin = user?.role === 'admin';
  const isResponsavel = user?.role === 'responsavel';

  // StatusOnline - sempre chamar o hook, mas usar apenas quando necessário
  const statusOnlineContext = useStatusOnline();
  const toggleStatus = statusOnlineContext.toggleStatus;
  const isOnline = statusOnlineContext.isOnline;

  // Cálculo de vagas disponíveis
  const periodoSelecionado = 'M'; // Por enquanto fixo, depois pode ser selecionável
  const alunosAtivosPorPeriodo = useMemo(() => {
    return mockAlunos.filter(
      aluno => aluno.status === 'ativo' && aluno.periodo === periodoSelecionado
    ).length;
  }, [periodoSelecionado]);

  const vagasDisponiveis = CAPACIDADE_VAN - alunosAtivosPorPeriodo;

  // Resumo financeiro do backend
  const [resumoFinanceiro, setResumoFinanceiro] = useState({
    totalReceitasMes: 0,
    inadimplencia: { valor: 0, percentual: 0 },
  });

  useEffect(() => {
    loadResumoFinanceiro();
  }, []);

  const loadResumoFinanceiro = async () => {
    try {
      const resumo = await financeiroService.getResumo();
      setResumoFinanceiro({
        totalReceitasMes: resumo.totalReceitasMes,
        inadimplencia: resumo.inadimplencia,
      });
    } catch (error) {
      console.error('Erro ao carregar resumo financeiro:', error);
    }
  };

  const receitaMensal = resumoFinanceiro.totalReceitasMes;
  const percentualInadimplencia = resumoFinanceiro.inadimplencia.percentual;

  // Próxima manutenção
  const proximaManutencao = useMemo(() => {
    const agendadas = mockManutencoes
      .filter(m => m.status === 'agendada')
      .sort((a, b) => {
        const dataA = a.dataAgendada ? new Date(a.dataAgendada).getTime() : Infinity;
        const dataB = b.dataAgendada ? new Date(b.dataAgendada).getTime() : Infinity;
        return dataA - dataB;
      });
    return agendadas[0];
  }, []);

  // Alunos por período
  const alunosPorPeriodo = useMemo(() => {
    const manha = mockAlunos.filter(a => a.status === 'ativo' && a.periodo === 'M').length;
    const tarde = mockAlunos.filter(a => a.status === 'ativo' && a.periodo === 'T').length;
    const noite = mockAlunos.filter(a => a.status === 'ativo' && a.periodo === 'N').length;
    return { manha, tarde, noite, total: manha + tarde + noite };
  }, []);

  const handleCobrarAgora = () => {
    // TODO: Implementar lógica de cobrança
    router.push('/notificacoes' as any);
  };

  const handleIniciarRota = () => {
    router.push('/rotas' as any);
  };

  const handleNovoAluno = () => {
    router.push('/cadastro-aluno' as any);
  };

  const handleNovaDespesa = () => {
    router.push('/financeiro' as any);
  };

  const handleEnviarAvisoGeral = () => {
    router.push('/notificacoes' as any);
  };

  return (
    <AppLayout>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Dashboard</Text>
          {isMotorista && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={toggleStatus}
                trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
                thumbColor={isOnline ? '#fff' : '#f4f3f4'}
              />
            </View>
          )}
        </View>

        {isOnline && isMotorista && (
          <Card style={styles.onlineCard}>
            <View style={styles.onlineContent}>
              <IconSymbol name="location.fill" size={20} color={AdminLTETheme.colors.success} />
              <Text style={styles.onlineText}>
                Rota disponível para responsáveis
              </Text>
            </View>
          </Card>
        )}

        {/* Widgets - Apenas para Motorista e Admin */}
        {!isResponsavel && (
          <View style={styles.widgetsContainer}>
            {/* Widget 1: Vagas disponíveis */}
            <TouchableOpacity
              style={styles.widgetCard}
              onPress={() => router.push('/alunos' as any)}
              activeOpacity={0.7}
            >
              <Card style={styles.widget}>
                <View style={styles.widgetHeader}>
                  <IconSymbol name="person.3.fill" size={24} color={AdminLTETheme.colors.primary} />
                  <Text style={styles.widgetValue}>{vagasDisponiveis}</Text>
                </View>
                <Text style={styles.widgetLabel}>Vagas Disponíveis</Text>
                <Text style={styles.widgetSubtext}>Período: {periodoSelecionado === 'M' ? 'Manhã' : periodoSelecionado === 'T' ? 'Tarde' : 'Noite'}</Text>
              </Card>
            </TouchableOpacity>

            {/* Widget 2: Receita mensal */}
            <Card style={styles.widgetCard}>
              <View style={styles.widgetHeader}>
                <IconSymbol name="dollarsign.circle.fill" size={24} color={AdminLTETheme.colors.success} />
                <Text style={styles.widgetValue}>R$ {receitaMensal.toFixed(2)}</Text>
              </View>
              <Text style={styles.widgetLabel}>Receita Mensal</Text>
              <Text style={styles.widgetSubtext}>Mês atual</Text>
            </Card>

            {/* Widget 3: Inadimplência */}
            <TouchableOpacity
              style={styles.widgetCard}
              onPress={handleCobrarAgora}
              activeOpacity={0.7}
            >
              <Card style={StyleSheet.flatten([styles.widget, resumoFinanceiro.inadimplencia.valor > 0 && styles.widgetAlert])}>
                <View style={styles.widgetHeader}>
                  <IconSymbol 
                    name="exclamationmark.triangle.fill" 
                    size={24} 
                    color={resumoFinanceiro.inadimplencia.valor > 0 ? AdminLTETheme.colors.danger : AdminLTETheme.colors.warning} 
                  />
                  <View>
                    <Text style={styles.widgetValue}>R$ {resumoFinanceiro.inadimplencia.valor.toFixed(2)}</Text>
                    <Text style={styles.widgetPercent}>{percentualInadimplencia.toFixed(1)}%</Text>
                  </View>
                </View>
                <Text style={styles.widgetLabel}>Inadimplência</Text>
                {resumoFinanceiro.inadimplencia.valor > 0 && (
                  <Button
                    title="Cobrar agora"
                    onPress={handleCobrarAgora}
                    variant="danger"
                    style={styles.cobrarButton}
                  />
                )}
              </Card>
            </TouchableOpacity>

            {/* Widget 4: Próxima manutenção */}
            <TouchableOpacity
              style={styles.widgetCard}
              onPress={() => router.push('/manutencao' as any)}
              activeOpacity={0.7}
            >
              <Card style={styles.widget}>
                <View style={styles.widgetHeader}>
                  <IconSymbol name="wrench.and.screwdriver.fill" size={24} color={AdminLTETheme.colors.warning} />
                  <Text style={styles.widgetValue}>
                    {proximaManutencao?.dataAgendada 
                      ? new Date(proximaManutencao.dataAgendada).toLocaleDateString('pt-BR')
                      : 'N/A'}
                  </Text>
                </View>
                <Text style={styles.widgetLabel}>Próxima Manutenção</Text>
                {proximaManutencao && (
                  <Text style={styles.widgetSubtext}>{proximaManutencao.descricao}</Text>
                )}
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {/* Widget 5: Alunos por período - Apenas para Admin */}
        {isAdmin && (
          <Card title="Alunos por Período" style={styles.chartCard}>
            <View style={styles.periodoContainer}>
              <View style={styles.periodoItem}>
                <View style={[styles.periodoBar, { height: (alunosPorPeriodo.manha / alunosPorPeriodo.total) * 100 || 0 }]} />
                <Text style={styles.periodoValue}>{alunosPorPeriodo.manha}</Text>
                <Text style={styles.periodoLabel}>Manhã</Text>
              </View>
              <View style={styles.periodoItem}>
                <View style={[styles.periodoBar, { height: (alunosPorPeriodo.tarde / alunosPorPeriodo.total) * 100 || 0 }]} />
                <Text style={styles.periodoValue}>{alunosPorPeriodo.tarde}</Text>
                <Text style={styles.periodoLabel}>Tarde</Text>
              </View>
              <View style={styles.periodoItem}>
                <View style={[styles.periodoBar, { height: (alunosPorPeriodo.noite / alunosPorPeriodo.total) * 100 || 0 }]} />
                <Text style={styles.periodoValue}>{alunosPorPeriodo.noite}</Text>
                <Text style={styles.periodoLabel}>Noite</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Atalhos - Apenas para Motorista */}
        {isMotorista && (
          <Card title="Atalhos Rápidos" style={styles.atalhosCard}>
            <View style={styles.atalhosContainer}>
              <TouchableOpacity
                style={styles.atalhoChip}
                onPress={handleIniciarRota}
                activeOpacity={0.7}
              >
                <IconSymbol name="play.circle.fill" size={20} color={AdminLTETheme.colors.primary} />
                <Text style={styles.atalhoText}>Iniciar rota</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.atalhoChip}
                onPress={handleEnviarAvisoGeral}
                activeOpacity={0.7}
              >
                <IconSymbol name="bell.fill" size={20} color={AdminLTETheme.colors.warning} />
                <Text style={styles.atalhoText}>Enviar aviso geral</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Atalhos - Apenas para Admin */}
        {isAdmin && (
          <Card title="Atalhos Rápidos" style={styles.atalhosCard}>
            <View style={styles.atalhosContainer}>
              <TouchableOpacity
                style={styles.atalhoChip}
                onPress={handleNovoAluno}
                activeOpacity={0.7}
              >
                <IconSymbol name="person.badge.plus" size={20} color={AdminLTETheme.colors.success} />
                <Text style={styles.atalhoText}>Novo aluno</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.atalhoChip}
                onPress={handleNovaDespesa}
                activeOpacity={0.7}
              >
                <IconSymbol name="minus.circle.fill" size={20} color={AdminLTETheme.colors.danger} />
                <Text style={styles.atalhoText}>Nova despesa</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Dashboard para Responsáveis */}
        {isResponsavel && (
          <>
            <Card title="Meus Filhos">
              {mockAlunos.filter(a => user?.filhosIds?.includes(a.id)).map(aluno => {
                // Mock de status do aluno (na rota/na escola/em casa)
                const statusAluno = 'na_rota'; // Pode ser: 'na_rota', 'na_escola', 'em_casa'
                const eta = statusAluno === 'na_rota' ? '5 min' : null;

                return (
                  <View key={aluno.id} style={styles.filhoCard}>
                    <View style={styles.filhoInfo}>
                      <View style={styles.filhoHeader}>
                        <Text style={styles.filhoNome}>{aluno.nome}</Text>
                        <View style={styles.filhoStatusBadge}>
                          <IconSymbol
                            name={
                              statusAluno === 'na_rota' ? 'car.fill' :
                              statusAluno === 'na_escola' ? 'building.2.fill' :
                              'house.fill'
                            }
                            size={16}
                            color={
                              statusAluno === 'na_rota' ? AdminLTETheme.colors.primary :
                              statusAluno === 'na_escola' ? AdminLTETheme.colors.info :
                              AdminLTETheme.colors.success
                            }
                          />
                          <Text style={[
                            styles.filhoStatusText,
                            {
                              color:
                                statusAluno === 'na_rota' ? AdminLTETheme.colors.primary :
                                statusAluno === 'na_escola' ? AdminLTETheme.colors.info :
                                AdminLTETheme.colors.success
                            }
                          ]}>
                            {statusAluno === 'na_rota' ? 'Na Rota' :
                             statusAluno === 'na_escola' ? 'Na Escola' :
                             'Em Casa'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.filhoEscola}>{aluno.escola.nome}</Text>
                      {eta && (
                        <View style={styles.etaContainer}>
                          <IconSymbol name="clock.fill" size={14} color={AdminLTETheme.colors.warning} />
                          <Text style={styles.etaText}>ETA: {eta}</Text>
                        </View>
                      )}
                      <View style={styles.filhoStatus}>
                        <Chip
                          label={aluno.periodo === 'M' ? 'Manhã' : aluno.periodo === 'T' ? 'Tarde' : 'Noite'}
                          selected={false}
                          variant="primary"
                        />
                        <IconSymbol
                          name={aluno.pagamento.status === 'em_dia' ? 'checkmark.circle.fill' : 'exclamationmark.triangle.fill'}
                          size={16}
                          color={aluno.pagamento.status === 'em_dia' ? AdminLTETheme.colors.success : AdminLTETheme.colors.danger}
                        />
                      </View>
                    </View>
                    <View style={styles.filhoActions}>
                      {isOnline && (
                        <Button
                          title="Ver Localização"
                          onPress={() => router.push('/localizacao' as any)}
                          variant="primary"
                          style={styles.filhoButton}
                        />
                      )}
                      <Button
                        title="Ver Contrato"
                        onPress={() => router.push('/contratos' as any)}
                        variant="secondary"
                        style={styles.filhoButton}
                      />
                      <Button
                        title="Pagar Mensalidade"
                        onPress={() => router.push('/pagamentos' as any)}
                        variant="success"
                        style={styles.filhoButton}
                      />
                    </View>
                  </View>
                );
              })}
            </Card>
          </>
        )}

        {/* Mensagem quando não houver dados */}
        {mockAlunos.length === 0 && !isResponsavel && (
          <Card style={styles.emptyCard}>
            <IconSymbol name="person.crop.circle.badge.questionmark" size={48} color={AdminLTETheme.colors.secondary} />
            <Text style={styles.emptyText}>Cadastre seu primeiro aluno</Text>
            {isAdmin && (
              <Button
                title="Cadastrar Aluno"
                onPress={handleNovoAluno}
                variant="primary"
                style={styles.emptyButton}
              />
            )}
          </Card>
        )}
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
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    letterSpacing: 0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AdminLTETheme.spacing.sm,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
  },
  onlineCard: {
    backgroundColor: AdminLTETheme.colors.success + '15',
    borderColor: AdminLTETheme.colors.success,
    borderWidth: 1,
    marginBottom: AdminLTETheme.spacing.md,
  },
  onlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AdminLTETheme.spacing.sm,
  },
  onlineText: {
    fontSize: 14,
    color: AdminLTETheme.colors.success,
    fontWeight: '600',
  },
  widgetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: AdminLTETheme.spacing.lg,
  },
  widgetCard: {
    width: '48%',
    marginBottom: AdminLTETheme.spacing.md,
  },
  widget: {
    padding: AdminLTETheme.spacing.md,
    minHeight: 120,
  },
  widgetAlert: {
    borderColor: AdminLTETheme.colors.danger,
    borderWidth: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AdminLTETheme.spacing.sm,
  },
  widgetValue: {
    fontSize: 20,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
  },
  widgetPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.danger,
  },
  widgetLabel: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    fontWeight: '500',
    marginBottom: AdminLTETheme.spacing.xs,
  },
  widgetSubtext: {
    fontSize: 10,
    color: AdminLTETheme.colors.secondary,
  },
  cobrarButton: {
    marginTop: AdminLTETheme.spacing.sm,
  },
  chartCard: {
    marginBottom: AdminLTETheme.spacing.lg,
  },
  periodoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    paddingVertical: AdminLTETheme.spacing.md,
  },
  periodoItem: {
    alignItems: 'center',
    flex: 1,
  },
  periodoBar: {
    width: 40,
    backgroundColor: AdminLTETheme.colors.primary,
    borderRadius: 4,
    marginBottom: AdminLTETheme.spacing.sm,
    minHeight: 20,
  },
  periodoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  periodoLabel: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    fontWeight: '500',
  },
  atalhosCard: {
    marginBottom: AdminLTETheme.spacing.lg,
  },
  atalhosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.sm,
  },
  atalhoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AdminLTETheme.colors.light,
    paddingHorizontal: AdminLTETheme.spacing.md,
    paddingVertical: AdminLTETheme.spacing.sm,
    borderRadius: 20,
    gap: AdminLTETheme.spacing.xs,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  atalhoText: {
    fontSize: 14,
    fontWeight: '500',
    color: AdminLTETheme.colors.dark,
  },
  emptyCard: {
    alignItems: 'center',
    padding: AdminLTETheme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: AdminLTETheme.colors.secondary,
    marginTop: AdminLTETheme.spacing.md,
    marginBottom: AdminLTETheme.spacing.lg,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
  filhoCard: {
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
    marginBottom: AdminLTETheme.spacing.md,
  },
  filhoInfo: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  filhoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AdminLTETheme.spacing.xs,
  },
  filhoNome: {
    fontSize: 18,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    flex: 1,
  },
  filhoStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AdminLTETheme.spacing.xs,
    paddingHorizontal: AdminLTETheme.spacing.sm,
    paddingVertical: AdminLTETheme.spacing.xs,
    borderRadius: AdminLTETheme.borderRadius.sm,
    backgroundColor: AdminLTETheme.colors.light,
  },
  filhoStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filhoEscola: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    marginBottom: AdminLTETheme.spacing.sm,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AdminLTETheme.spacing.xs,
    marginBottom: AdminLTETheme.spacing.sm,
  },
  etaText: {
    fontSize: 12,
    color: AdminLTETheme.colors.warning,
    fontWeight: '600',
  },
  filhoStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AdminLTETheme.spacing.sm,
  },
  filhoActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.sm,
  },
  filhoButton: {
    flex: 1,
    minWidth: 120,
  },
  rotaStatusContainer: {
    alignItems: 'center',
    padding: AdminLTETheme.spacing.lg,
  },
  rotaStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginTop: AdminLTETheme.spacing.md,
    textAlign: 'center',
  },
  rotaStatusSubtext: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    marginTop: AdminLTETheme.spacing.xs,
    textAlign: 'center',
  },
});
