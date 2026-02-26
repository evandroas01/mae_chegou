import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Chip } from '@/components/ui/Chip';
import { Aluno } from '@/types/aluno';

// Mock data - substituir por busca real
const getAlunoMock = (id: string): Aluno | null => {
  return {
    id: '1',
    nome: 'João Silva',
    dataNascimento: '2010-05-15',
    serie: '5º Ano',
    turma: 'A',
    periodo: 'M',
    status: 'ativo',
    escola: { nome: 'Escola Municipal São Paulo', endereco: 'Rua A, 123' },
    responsavel: { nome: 'Maria Silva', cpf: '123.456.789-00', telefone: '(11) 98765-4321', email: 'maria@email.com' },
    enderecoContratante: { rua: 'Rua B', numero: '456', bairro: 'Centro', cidade: 'São Paulo', estado: 'SP', cep: '01000-000' },
    valorMensal: 250,
    formaPagamento: 'pix',
    diasSemana: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
    datasVencimento: [5],
    pagamento: { status: 'em_dia', ultimoPagamento: '2024-01-05' },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };
};

type TabType = 'dados' | 'contrato' | 'pagamentos' | 'anexos';

export default function AlunoDetalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('dados');

  const aluno = getAlunoMock(id || '1');

  if (!aluno) {
    return (
      <AppLayout>
        <Card>
          <Text>Aluno não encontrado</Text>
        </Card>
      </AppLayout>
    );
  }

  const getPeriodoLabel = (periodo: string) => {
    switch (periodo) {
      case 'M': return 'Manhã';
      case 'T': return 'Tarde';
      default: return periodo;
    }
  };

  const getDiasSemanaLabel = (dias: string[]) => {
    const diasMap: Record<string, string> = {
      'segunda': 'Seg',
      'terca': 'Ter',
      'quarta': 'Qua',
      'quinta': 'Qui',
      'sexta': 'Sex',
      'sabado': 'Sáb',
      'domingo': 'Dom',
    };
    return dias.map(d => diasMap[d] || d).join(', ');
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'dados', label: 'Dados' },
    { id: 'contrato', label: 'Contrato' },
    { id: 'pagamentos', label: 'Pagamentos' },
    { id: 'anexos', label: 'Anexos' },
  ];

  const renderCabeçalho = () => (
    <Card style={styles.headerCard}>
      <View style={styles.headerRow}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerNome}>{aluno.nome}</Text>
          <Text style={styles.headerEscola}>{aluno.escola.nome}</Text>
          <View style={styles.headerChips}>
            <Chip label={aluno.turma} selected={false} />
            <Chip label={getPeriodoLabel(aluno.periodo)} selected={false} variant="primary" />
          </View>
        </View>
      </View>

      <View style={styles.headerDetails}>
        <View style={styles.headerDetailItem}>
          <Text style={styles.headerDetailLabel}>Responsável</Text>
          <Text style={styles.headerDetailValue}>{aluno.responsavel.nome}</Text>
          <Text style={styles.headerDetailSubValue}>{aluno.responsavel.telefone}</Text>
        </View>
        <View style={styles.headerDetailItem}>
          <Text style={styles.headerDetailLabel}>Valor Mensal</Text>
          <Text style={styles.headerDetailValue}>R$ {aluno.valorMensal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.headerActions}>
        <Button
          title="Editar"
          onPress={() => router.push(`/cadastro-aluno?id=${aluno.id}` as any)}
          variant="primary"
          style={styles.headerButton}
        />
        <Button
          title={aluno.status === 'ativo' ? 'Tornar Inativo' : 'Tornar Ativo'}
          onPress={() => {}}
          variant={aluno.status === 'ativo' ? 'danger' : 'success'}
          style={styles.headerButton}
        />
        <TouchableOpacity style={styles.chatButton}>
          <IconSymbol name="message.fill" size={20} color={AdminLTETheme.colors.white} />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderDados = () => (
    <Card title="Dados do Aluno">
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Data de Nascimento:</Text>
        <Text style={styles.dataValue}>
          {new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Série:</Text>
        <Text style={styles.dataValue}>{aluno.serie}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Turma:</Text>
        <Text style={styles.dataValue}>{aluno.turma}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Período:</Text>
        <Text style={styles.dataValue}>{getPeriodoLabel(aluno.periodo)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Status:</Text>
        <Chip
          label={aluno.status === 'ativo' ? 'Ativo' : 'Inativo'}
          selected={false}
          variant={aluno.status === 'ativo' ? 'success' : 'default'}
        />
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Responsável</Text>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Nome:</Text>
        <Text style={styles.dataValue}>{aluno.responsavel.nome}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>CPF:</Text>
        <Text style={styles.dataValue}>{aluno.responsavel.cpf}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Telefone:</Text>
        <Text style={styles.dataValue}>{aluno.responsavel.telefone}</Text>
      </View>
      {aluno.responsavel.email && (
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Email:</Text>
          <Text style={styles.dataValue}>{aluno.responsavel.email}</Text>
        </View>
      )}

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Endereço do Contratante</Text>
      <Text style={styles.dataValue}>
        {aluno.enderecoContratante.rua}, {aluno.enderecoContratante.numero}
        {aluno.enderecoContratante.complemento && ` - ${aluno.enderecoContratante.complemento}`}
      </Text>
      <Text style={styles.dataValue}>
        {aluno.enderecoContratante.bairro} - {aluno.enderecoContratante.cidade}/{aluno.enderecoContratante.estado}
      </Text>
      <Text style={styles.dataValue}>CEP: {aluno.enderecoContratante.cep}</Text>

      {aluno.enderecoSaida && (
        <>
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>Endereço de Saída</Text>
          <Text style={styles.dataValue}>
            {aluno.enderecoSaida.rua}, {aluno.enderecoSaida.numero}
          </Text>
          <Text style={styles.dataValue}>
            {aluno.enderecoSaida.bairro} - {aluno.enderecoSaida.cidade}/{aluno.enderecoSaida.estado}
          </Text>
        </>
      )}

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Escola</Text>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Nome:</Text>
        <Text style={styles.dataValue}>{aluno.escola.nome}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Endereço:</Text>
        <Text style={styles.dataValue}>{aluno.escola.endereco}</Text>
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Financeiro</Text>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Valor Mensal:</Text>
        <Text style={styles.dataValue}>R$ {aluno.valorMensal.toFixed(2)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Forma de Pagamento:</Text>
        <Text style={styles.dataValue}>{aluno.formaPagamento.toUpperCase()}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Dias da Semana:</Text>
        <Text style={styles.dataValue}>{getDiasSemanaLabel(aluno.diasSemana)}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Dia(s) de Vencimento:</Text>
        <Text style={styles.dataValue}>{aluno.datasVencimento.join(', ')}</Text>
      </View>
      <View style={styles.dataRow}>
        <Text style={styles.dataLabel}>Status Pagamento:</Text>
        <View style={styles.statusContainer}>
          <IconSymbol
            name={aluno.pagamento.status === 'em_dia' ? 'checkmark.circle.fill' : 'exclamationmark.triangle.fill'}
            size={16}
            color={aluno.pagamento.status === 'em_dia' ? AdminLTETheme.colors.success : AdminLTETheme.colors.danger}
          />
          <Text style={[styles.dataValue, { marginLeft: 8 }]}>
            {aluno.pagamento.status === 'em_dia' ? 'Em Dia' : 'Atrasado'}
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderContrato = () => (
    <Card title="Contrato">
      {aluno.contratoId ? (
        <View>
          <Text style={styles.infoText}>Contrato vinculado: #{aluno.contratoId}</Text>
          <Button
            title="Ver Contrato"
            onPress={() => {}}
            variant="primary"
            style={styles.contractButton}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.infoText}>Nenhum contrato vinculado</Text>
          <Button
            title="Criar Contrato"
            onPress={() => {}}
            variant="primary"
            style={styles.contractButton}
          />
        </View>
      )}
    </Card>
  );

  const renderPagamentos = () => (
    <Card title="Histórico de Pagamentos">
      <Text style={styles.infoText}>Último pagamento: {aluno.pagamento.ultimoPagamento ? new Date(aluno.pagamento.ultimoPagamento).toLocaleDateString('pt-BR') : 'N/A'}</Text>
      <Text style={styles.emptyText}>Histórico completo em desenvolvimento...</Text>
    </Card>
  );

  const renderAnexos = () => (
    <Card title="Anexos">
      <Text style={styles.infoText}>Comprovantes e arquivos</Text>
      <Text style={styles.emptyText}>Área de anexos em desenvolvimento...</Text>
    </Card>
  );

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {renderCabeçalho()}

        <View style={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'dados' && renderDados()}
        {activeTab === 'contrato' && renderContrato()}
        {activeTab === 'pagamentos' && renderPagamentos()}
        {activeTab === 'anexos' && renderAnexos()}
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
  headerCard: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  headerRow: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  headerInfo: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  headerNome: {
    fontSize: 24,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  headerEscola: {
    fontSize: 16,
    color: AdminLTETheme.colors.secondary,
    marginBottom: AdminLTETheme.spacing.sm,
  },
  headerChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: AdminLTETheme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: AdminLTETheme.spacing.md,
  },
  headerDetailItem: {
    alignItems: 'center',
  },
  headerDetailLabel: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  headerDetailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
  },
  headerDetailSubValue: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    marginTop: AdminLTETheme.spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: AdminLTETheme.spacing.sm,
    flexWrap: 'wrap',
  },
  headerButton: {
    flex: 1,
    minWidth: 120,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AdminLTETheme.colors.success,
    paddingVertical: AdminLTETheme.spacing.md,
    paddingHorizontal: AdminLTETheme.spacing.lg,
    borderRadius: AdminLTETheme.borderRadius.md,
    gap: AdminLTETheme.spacing.xs,
  },
  chatButtonText: {
    color: AdminLTETheme.colors.white,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: AdminLTETheme.colors.white,
    borderRadius: AdminLTETheme.borderRadius.md,
    padding: AdminLTETheme.spacing.xs,
    marginBottom: AdminLTETheme.spacing.md,
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
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AdminLTETheme.spacing.md,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    flex: 2,
    textAlign: 'right',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: AdminLTETheme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  contractButton: {
    marginTop: AdminLTETheme.spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    marginBottom: AdminLTETheme.spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: AdminLTETheme.spacing.lg,
  },
});

