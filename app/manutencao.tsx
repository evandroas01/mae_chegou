import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Input } from '@/components/ui/Input';
import { manutencaoService } from '@/services/manutencaoService';
import { Manutencao as ManutencaoType, ManutencaoTipo, ManutencaoStatus } from '@/types/manutencao';
import { maskDate, unmaskDate } from '@/utils/masks';

type AbaManutencao = 'proximas' | 'realizadas' | 'atrasadas' | 'todas';

export default function Manutencao() {
  const router = useRouter();
  const { user } = useAuth();
  const isMotorista = user?.role === 'motorista';
  const [abaAtiva, setAbaAtiva] = useState<AbaManutencao>('proximas');
  const [modalVisible, setModalVisible] = useState(false);
  const [manutencoes, setManutencoes] = useState<ManutencaoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [mockVeiculo] = useState({
    placa: 'ABC-1234',
    modelo: 'Van Escolar',
    ano: 2020,
    quilometragemAtual: 45000,
    documentos: {
      licenciamento: { numero: 'LIC-2024-001', validade: '2024-12-31' },
      seguro: { numero: 'SEG-2024-001', validade: '2024-06-30' },
      vistoriaEscolar: { numero: 'VIS-2024-001', validade: '2024-03-31' },
    },
  });

  useEffect(() => {
    loadManutencoes();
  }, []);

  const loadManutencoes = async () => {
    try {
      setLoading(true);
      const data = await manutencaoService.getAll();
      setManutencoes(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar manutenções');
    } finally {
      setLoading(false);
    }
  };

  const manutencoesFiltradas = useMemo(() => {
    switch (abaAtiva) {
      case 'proximas':
        return manutencoes.filter(m => m.status === 'agendada');
      case 'realizadas':
        return manutencoes.filter(m => m.status === 'realizada');
      case 'atrasadas':
        return manutencoes.filter(m => m.status === 'atrasada');
      default:
        return manutencoes;
    }
  }, [abaAtiva, manutencoes]);

  const getStatusDocumento = (validade: string) => {
    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diasRestantes = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) return { status: 'vencido', cor: AdminLTETheme.colors.danger };
    if (diasRestantes <= 30) return { status: 'vencendo', cor: AdminLTETheme.colors.warning };
    return { status: 'ok', cor: AdminLTETheme.colors.success };
  };

  const renderDocumento = (nome: string, documento: typeof mockVeiculo.documentos.licenciamento) => {
    const status = getStatusDocumento(documento.validade);
    return (
      <View style={styles.documentoCard}>
        <View style={styles.documentoHeader}>
          <Text style={styles.documentoNome}>{nome}</Text>
          <Chip
            label={status.status === 'ok' ? 'OK' : status.status === 'vencendo' ? 'Vencendo' : 'Vencido'}
            selected={false}
            variant={status.status === 'ok' ? 'success' : status.status === 'vencendo' ? 'warning' : 'danger'}
          />
        </View>
        <Text style={styles.documentoNumero}>Nº: {documento.numero}</Text>
        <Text style={styles.documentoValidade}>
          Validade: {new Date(documento.validade).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    );
  };

  const renderManutencao = ({ item }: { item: ManutencaoType }) => (
    <Card style={styles.manutencaoCard}>
      <View style={styles.manutencaoHeader}>
        <View style={styles.manutencaoInfo}>
          <Text style={styles.manutencaoDescricao}>{item.descricao}</Text>
          <View style={styles.manutencaoMeta}>
            <Chip
              label={item.tipo === 'preventiva' ? 'Preventiva' : 'Corretiva'}
              selected={false}
              variant="primary"
            />
            <Chip
              label={item.status === 'agendada' ? 'Agendada' : item.status === 'realizada' ? 'Realizada' : 'Atrasada'}
              selected={false}
              variant={item.status === 'agendada' ? 'warning' : item.status === 'realizada' ? 'success' : 'danger'}
            />
          </View>
        </View>
      </View>
      <View style={styles.manutencaoDetails}>
        {item.dataAgendada && (
          <Text style={styles.detailText}>
            Agendada: {new Date(item.dataAgendada).toLocaleDateString('pt-BR')}
          </Text>
        )}
        {item.dataRealizada && (
          <Text style={styles.detailText}>
            Realizada: {new Date(item.dataRealizada).toLocaleDateString('pt-BR')}
          </Text>
        )}
        <Text style={styles.detailText}>Quilometragem: {item.quilometragem.toLocaleString('pt-BR')} km</Text>
        {item.custo > 0 && (
          <Text style={styles.detailText}>Custo: R$ {item.custo.toFixed(2)}</Text>
        )}
      </View>
    </Card>
  );

  const [formData, setFormData] = useState({
    descricao: '',
    tipo: 'preventiva' as ManutencaoTipo,
    dataAgendada: '',
    quilometragem: '',
    custo: '',
    repetir: false,
    repetirTipo: 'km' as 'km' | 'meses',
    repetirIntervalo: '',
  });

  const handleSalvarManutencao = async () => {
    if (!formData.descricao.trim()) {
      Alert.alert('Erro', 'Preencha a descrição da manutenção');
      return;
    }

    if (!formData.quilometragem.trim()) {
      Alert.alert('Erro', 'Preencha a quilometragem');
      return;
    }

    try {
      // TODO: Buscar veiculoId do motorista
      const veiculoId = '1'; // Substituir por busca real do veículo do motorista

      await manutencaoService.create({
        veiculoId,
        descricao: formData.descricao,
        tipo: formData.tipo,
        dataAgendada: formData.dataAgendada ? unmaskDate(formData.dataAgendada) : undefined,
        quilometragem: parseInt(formData.quilometragem) || 0,
        custo: parseFloat(formData.custo) || 0,
        repetirTipo: formData.repetir ? formData.repetirTipo : undefined,
        repetirIntervalo: formData.repetir ? parseInt(formData.repetirIntervalo) || 0 : undefined,
      });

      setModalVisible(false);
      setFormData({
        descricao: '',
        tipo: 'preventiva',
        dataAgendada: '',
        quilometragem: '',
        custo: '',
        repetir: false,
        repetirTipo: 'km',
        repetirIntervalo: '',
      });
      
      Alert.alert('Sucesso', 'Manutenção cadastrada com sucesso!');
      loadManutencoes();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao cadastrar manutenção');
    }
  };

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Manutenção</Text>
          {isMotorista && (
            <Button
              title="Nova Manutenção"
              onPress={() => setModalVisible(true)}
              variant="primary"
              style={styles.addButton}
            />
          )}
        </View>

        {/* Informações do Veículo */}
        <Card title="Veículo">
          <View style={styles.veiculoInfo}>
            <Text style={styles.veiculoText}>
              <Text style={styles.veiculoLabel}>Placa: </Text>
              {mockVeiculo.placa}
            </Text>
            <Text style={styles.veiculoText}>
              <Text style={styles.veiculoLabel}>Modelo: </Text>
              {mockVeiculo.modelo}
            </Text>
            <Text style={styles.veiculoText}>
              <Text style={styles.veiculoLabel}>Ano: </Text>
              {mockVeiculo.ano}
            </Text>
            <Text style={styles.veiculoText}>
              <Text style={styles.veiculoLabel}>Quilometragem: </Text>
              {mockVeiculo.quilometragemAtual.toLocaleString('pt-BR')} km
            </Text>
          </View>
        </Card>

        {/* Status dos Documentos */}
        <Card title="Status dos Documentos">
          {renderDocumento('Licenciamento', mockVeiculo.documentos.licenciamento)}
          {renderDocumento('Seguro', mockVeiculo.documentos.seguro)}
          {renderDocumento('Vistoria Escolar', mockVeiculo.documentos.vistoriaEscolar)}
        </Card>

        {/* Abas de Manutenções */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, abaAtiva === 'proximas' && styles.tabActive]}
            onPress={() => setAbaAtiva('proximas')}
          >
            <Text style={[styles.tabText, abaAtiva === 'proximas' && styles.tabTextActive]}>
              Próximas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, abaAtiva === 'realizadas' && styles.tabActive]}
            onPress={() => setAbaAtiva('realizadas')}
          >
            <Text style={[styles.tabText, abaAtiva === 'realizadas' && styles.tabTextActive]}>
              Realizadas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, abaAtiva === 'atrasadas' && styles.tabActive]}
            onPress={() => setAbaAtiva('atrasadas')}
          >
            <Text style={[styles.tabText, abaAtiva === 'atrasadas' && styles.tabTextActive]}>
              Atrasadas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, abaAtiva === 'todas' && styles.tabActive]}
            onPress={() => setAbaAtiva('todas')}
          >
            <Text style={[styles.tabText, abaAtiva === 'todas' && styles.tabTextActive]}>
              Todas
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {manutencoesFiltradas.length} manutenção(ões) encontrada(s)
          </Text>
        </View>

        <FlatList
          data={manutencoesFiltradas}
          renderItem={renderManutencao}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>Nenhuma manutenção encontrada</Text>
            </Card>
          }
        />

        {/* Modal de Cadastro de Manutenção */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Nova Manutenção</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <IconSymbol name="xmark" size={24} color={AdminLTETheme.colors.dark} />
                  </TouchableOpacity>
                </View>

                <Card>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Tipo de Manutenção</Text>
                    <View style={styles.chipsRow}>
                      <Chip
                        label="Preventiva"
                        selected={formData.tipo === 'preventiva'}
                        onPress={() => setFormData({ ...formData, tipo: 'preventiva' })}
                        variant="primary"
                      />
                      <Chip
                        label="Corretiva"
                        selected={formData.tipo === 'corretiva'}
                        onPress={() => setFormData({ ...formData, tipo: 'corretiva' })}
                        variant="primary"
                      />
                    </View>
                  </View>

                  <Input
                    label="Descrição *"
                    value={formData.descricao}
                    onChangeText={(value) => setFormData({ ...formData, descricao: value })}
                    placeholder="Ex: Troca de óleo e filtros"
                  />

                  <Input
                    label="Data Agendada"
                    value={formData.dataAgendada}
                    onChangeText={(value) => setFormData({ ...formData, dataAgendada: maskDate(value) })}
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                  />

                  <Input
                    label="Quilometragem *"
                    value={formData.quilometragem}
                    onChangeText={(value) => setFormData({ ...formData, quilometragem: value })}
                    placeholder="Ex: 50000"
                    keyboardType="numeric"
                  />

                  <Input
                    label="Custo (R$)"
                    value={formData.custo}
                    onChangeText={(value) => setFormData({ ...formData, custo: value })}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                  />

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Repetir Manutenção</Text>
                    <View style={styles.switchRow}>
                      <Text style={styles.switchLabel}>
                        {formData.repetir ? 'Sim' : 'Não'}
                      </Text>
                      <TouchableOpacity
                        style={[styles.switch, formData.repetir && styles.switchActive]}
                        onPress={() => setFormData({ ...formData, repetir: !formData.repetir })}
                      >
                        <View style={[styles.switchThumb, formData.repetir && styles.switchThumbActive]} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {formData.repetir && (
                    <>
                      <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Tipo de Repetição</Text>
                        <View style={styles.chipsRow}>
                          <Chip
                            label="Por Quilometragem"
                            selected={formData.repetirTipo === 'km'}
                            onPress={() => setFormData({ ...formData, repetirTipo: 'km' })}
                            variant="primary"
                          />
                          <Chip
                            label="Por Meses"
                            selected={formData.repetirTipo === 'meses'}
                            onPress={() => setFormData({ ...formData, repetirTipo: 'meses' })}
                            variant="primary"
                          />
                        </View>
                      </View>

                      <Input
                        label={`Intervalo (${formData.repetirTipo === 'km' ? 'km' : 'meses'})`}
                        value={formData.repetirIntervalo}
                        onChangeText={(value) => setFormData({ ...formData, repetirIntervalo: value })}
                        placeholder={formData.repetirTipo === 'km' ? 'Ex: 10000' : 'Ex: 6'}
                        keyboardType="numeric"
                      />
                    </>
                  )}

                  <View style={styles.modalButtons}>
                    <Button
                      title="Cancelar"
                      onPress={() => setModalVisible(false)}
                      variant="secondary"
                      style={styles.modalButton}
                    />
                    <Button
                      title="Salvar"
                      onPress={handleSalvarManutencao}
                      variant="primary"
                      style={styles.modalButton}
                    />
                  </View>
                </Card>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
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
  veiculoInfo: {
    gap: AdminLTETheme.spacing.sm,
  },
  veiculoText: {
    fontSize: 14,
    color: AdminLTETheme.colors.dark,
  },
  veiculoLabel: {
    fontWeight: '600',
    color: AdminLTETheme.colors.secondary,
  },
  documentoCard: {
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
    marginBottom: AdminLTETheme.spacing.sm,
  },
  documentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AdminLTETheme.spacing.xs,
  },
  documentoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
  },
  documentoNumero: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  documentoValidade: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
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
    fontSize: 12,
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
  manutencaoCard: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  manutencaoHeader: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  manutencaoInfo: {
    marginBottom: AdminLTETheme.spacing.sm,
  },
  manutencaoDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  manutencaoMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.xs,
  },
  manutencaoDetails: {
    paddingTop: AdminLTETheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: AdminLTETheme.spacing.xs,
  },
  detailText: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  emptyText: {
    textAlign: 'center',
    color: AdminLTETheme.colors.secondary,
    fontSize: 16,
    padding: AdminLTETheme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AdminLTETheme.spacing.lg,
  },
  addButton: {
    minWidth: 150,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AdminLTETheme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalScroll: {
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AdminLTETheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
  },
  fieldGroup: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    color: AdminLTETheme.colors.dark,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: AdminLTETheme.colors.primary,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: AdminLTETheme.colors.white,
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: AdminLTETheme.spacing.md,
    marginTop: AdminLTETheme.spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
});

