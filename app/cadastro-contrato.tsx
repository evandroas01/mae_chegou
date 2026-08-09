import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { api } from '@/services/api';
import { alunoService } from '@/services/alunoService';

export default function CadastroContrato() {
  const router = useRouter();
  const { id, alunoId } = useLocalSearchParams<{ id?: string; alunoId?: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    responsavelId: '',
    periodo: 'M',
    valor: '',
    vencimento: '5',
    dataInicio: new Date().toISOString().split('T')[0],
  });

  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alunoId) {
      loadAluno(alunoId);
    } else if (id) {
      loadContrato(id);
    }
  }, [id, alunoId]);

  const loadAluno = async (id: string) => {
    try {
      const data = await alunoService.getById(id);
      setAlunoSelecionado(data);
      setFormData(prev => ({
        ...prev,
        responsavelId: data.responsavel?.id || '',
        valor: data.valorMensal?.toString() || '',
        vencimento: data.datasVencimento?.[0]?.toString() || '5',
      }));
    } catch (e) {
      Alert.alert('Erro', 'Aluno não encontrado');
    }
  };

  const loadContrato = async (contratoId: string) => {
    try {
      const data = await api.get<any>(`/contratos/${contratoId}`);
      setFormData({
        responsavelId: data.responsavelId,
        periodo: data.periodo,
        valor: data.valor.toString(),
        vencimento: data.vencimento.toString(),
        dataInicio: data.dataInicio.split('T')[0],
      });
    } catch (e) {
      Alert.alert('Erro', 'Contrato não encontrado');
    }
  };

  const handleSubmit = async () => {
    if (!formData.responsavelId || !formData.valor || !formData.vencimento) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        valor: parseFloat(formData.valor.replace(',', '.')),
        vencimento: parseInt(formData.vencimento),
        alunoIds: alunoId ? [alunoId] : undefined,
      };

      if (isEdit && id) {
        await api.put(`/contratos/${id}`, payload);
      } else {
        await api.post(`/contratos`, payload);
      }
      
      Alert.alert('Sucesso', 'Contrato salvo com sucesso', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o contrato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>{isEdit ? 'Editar Contrato' : 'Novo Contrato'}</Text>
        
        {alunoSelecionado && (
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Aluno Vinculado</Text>
            <Text style={styles.infoText}>{alunoSelecionado.nome}</Text>
            <Text style={styles.infoText}>Responsável: {alunoSelecionado.responsavel?.nome}</Text>
          </Card>
        )}

        <Card title="Dados do Contrato">
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Período *</Text>
            <View style={styles.chipsRow}>
              <Chip label="Manhã" selected={formData.periodo === 'M'} onPress={() => setFormData(p => ({...p, periodo: 'M'}))} variant="primary" />
              <Chip label="Tarde" selected={formData.periodo === 'T'} onPress={() => setFormData(p => ({...p, periodo: 'T'}))} variant="primary" />
              <Chip label="Noite" selected={formData.periodo === 'N'} onPress={() => setFormData(p => ({...p, periodo: 'N'}))} variant="primary" />
            </View>
          </View>

          <Input
            label="Valor Mensal *"
            value={formData.valor}
            onChangeText={(v) => setFormData(p => ({...p, valor: v}))}
            keyboardType="decimal-pad"
            placeholder="0,00"
          />

          <Input
            label="Dia de Vencimento *"
            value={formData.vencimento}
            onChangeText={(v) => setFormData(p => ({...p, vencimento: v}))}
            keyboardType="numeric"
            placeholder="Ex: 5"
          />

          <Input
            label="Data de Início *"
            value={formData.dataInicio}
            onChangeText={(v) => setFormData(p => ({...p, dataInicio: v}))}
            placeholder="YYYY-MM-DD"
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title={isEdit ? 'Atualizar Contrato' : 'Gerar Contrato'}
            onPress={handleSubmit}
            variant="primary"
            loading={loading}
          />
        </View>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: AdminLTETheme.spacing.xl },
  pageTitle: {
    fontSize: 28, fontWeight: '700', color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.lg, letterSpacing: 0.5,
  },
  infoCard: { marginBottom: AdminLTETheme.spacing.md },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  infoText: { fontSize: 14, color: AdminLTETheme.colors.secondary },
  fieldGroup: { marginBottom: AdminLTETheme.spacing.md },
  fieldLabel: {
    fontSize: 14, fontWeight: '600', color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.sm,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: AdminLTETheme.spacing.xs },
  buttonContainer: { marginTop: AdminLTETheme.spacing.lg },
});
