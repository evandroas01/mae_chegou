import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { maskDate, unmaskDate, formatDateFromBackend } from '@/utils/masks';
import { financeiroService } from '@/services/financeiroService';
import { LancamentoTipo, LancamentoCategoria } from '@/types/financeiro';

interface LancamentoFormData {
  tipo: LancamentoTipo | '';
  categoria: LancamentoCategoria | '';
  valor: string;
  data: string;
  dataVencimento: string;
  descricao: string;
  status?: 'pago' | 'pendente' | 'atrasado';
}

const TIPOS: { value: LancamentoTipo; label: string }[] = [
  { value: 'receita', label: 'Receita' },
  { value: 'despesa', label: 'Despesa' },
];

const CATEGORIAS_RECEITA: { value: LancamentoCategoria; label: string }[] = [
  { value: 'receita_recorrente', label: 'Receita Recorrente' },
  { value: 'receita_extra', label: 'Receita Extra' },
];

const CATEGORIAS_DESPESA: { value: LancamentoCategoria; label: string }[] = [
  { value: 'despesa_fixa', label: 'Despesa Fixa' },
  { value: 'despesa_variavel', label: 'Despesa Variável' },
];

export default function EditarLancamento() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LancamentoFormData, string>>>({});

  const [formData, setFormData] = useState<LancamentoFormData>({
    tipo: '',
    categoria: '',
    valor: '',
    data: '',
    dataVencimento: '',
    descricao: '',
    status: 'pendente',
  });

  useEffect(() => {
    loadLancamento();
  }, [id]);

  const loadLancamento = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const lancamento = await financeiroService.getById(id);
      
      setFormData({
        tipo: lancamento.tipo,
        categoria: lancamento.categoria,
        valor: lancamento.valor.toString().replace('.', ','),
        data: formatDateFromBackend(lancamento.data),
        dataVencimento: lancamento.dataVencimento ? formatDateFromBackend(lancamento.dataVencimento) : '',
        descricao: lancamento.descricao,
        status: lancamento.status,
      });
    } catch (error: any) {
      console.error('Erro ao carregar lançamento:', error);
      Alert.alert('Erro', 'Não foi possível carregar o lançamento.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof LancamentoFormData, value: any) => {
    let formattedValue = value;

    if (field === 'data' || field === 'dataVencimento') {
      formattedValue = maskDate(value);
    }

    if (field === 'tipo') {
      // Limpar categoria quando mudar o tipo
      setFormData((prev) => ({ ...prev, tipo: value, categoria: '' }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LancamentoFormData, string>> = {};

    if (!formData.tipo) newErrors.tipo = 'Tipo é obrigatório';
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.valor.trim()) {
      newErrors.valor = 'Valor é obrigatório';
    } else if (isNaN(parseFloat(formData.valor.replace(',', '.'))) || parseFloat(formData.valor.replace(',', '.')) <= 0) {
      newErrors.valor = 'Valor deve ser um número positivo';
    }
    if (!formData.data.trim()) {
      newErrors.data = 'Data é obrigatória';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.data)) {
      newErrors.data = 'Formato de data inválido (DD/MM/AAAA)';
    }
    if (formData.dataVencimento && !/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dataVencimento)) {
      newErrors.dataVencimento = 'Formato de data inválido (DD/MM/AAAA)';
    }
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (formData.descricao.trim().length < 3) newErrors.descricao = 'Descrição deve ter no mínimo 3 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!id) return;

    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setSaving(true);

    try {
      const lancamentoData = {
        tipo: formData.tipo,
        categoria: formData.categoria,
        valor: parseFloat(formData.valor.replace(',', '.')) || 0,
        data: unmaskDate(formData.data),
        dataVencimento: formData.dataVencimento ? unmaskDate(formData.dataVencimento) : undefined,
        descricao: formData.descricao,
        status: formData.status,
      };

      await financeiroService.update(id, lancamentoData);

      Alert.alert('Sucesso!', 'Lançamento atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao atualizar lançamento:', error);
      
      let errorMessage = 'Erro ao atualizar lançamento. Tente novamente.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.errors && Array.isArray(error.errors)) {
        const firstError = error.errors[0];
        if (firstError.msg) {
          errorMessage = firstError.msg;
        }
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </AppLayout>
    );
  }

  const categoriasDisponiveis = formData.tipo === 'receita' 
    ? CATEGORIAS_RECEITA 
    : formData.tipo === 'despesa' 
    ? CATEGORIAS_DESPESA 
    : [];

  return (
    <AppLayout>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Editar Lançamento</Text>

          <Card title="Informações do Lançamento">
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Tipo *</Text>
              <View style={styles.chipsRow}>
                {TIPOS.map((tipo) => (
                  <Chip
                    key={tipo.value}
                    label={tipo.label}
                    selected={formData.tipo === tipo.value}
                    onPress={() => handleChange('tipo', tipo.value)}
                    variant="primary"
                  />
                ))}
              </View>
              {errors.tipo && <Text style={styles.errorText}>{errors.tipo}</Text>}
            </View>

            {formData.tipo && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Categoria *</Text>
                <View style={styles.chipsRow}>
                  {categoriasDisponiveis.map((cat) => (
                    <Chip
                      key={cat.value}
                      label={cat.label}
                      selected={formData.categoria === cat.value}
                      onPress={() => handleChange('categoria', cat.value)}
                      variant="primary"
                    />
                  ))}
                </View>
                {errors.categoria && <Text style={styles.errorText}>{errors.categoria}</Text>}
              </View>
            )}

            <Input
              label="Descrição *"
              value={formData.descricao}
              onChangeText={(value) => handleChange('descricao', value)}
              placeholder="Ex: Pagamento mensalidade"
              error={errors.descricao}
            />

            <Input
              label="Valor *"
              value={formData.valor}
              onChangeText={(value) => handleChange('valor', value)}
              placeholder="0,00"
              keyboardType="decimal-pad"
              error={errors.valor}
            />

            <Input
              label="Data *"
              value={formData.data}
              onChangeText={(value) => handleChange('data', value)}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              error={errors.data}
            />

            <Input
              label="Data de Vencimento"
              value={formData.dataVencimento}
              onChangeText={(value) => handleChange('dataVencimento', value)}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              error={errors.dataVencimento}
            />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Status *</Text>
              <View style={styles.chipsRow}>
                <Chip
                  label="Pago"
                  selected={formData.status === 'pago'}
                  onPress={() => handleChange('status', 'pago')}
                  variant="primary"
                />
                <Chip
                  label="Pendente"
                  selected={formData.status === 'pendente'}
                  onPress={() => handleChange('status', 'pendente')}
                  variant="primary"
                />
                <Chip
                  label="Atrasado"
                  selected={formData.status === 'atrasado'}
                  onPress={() => handleChange('status', 'atrasado')}
                  variant="primary"
                />
              </View>
            </View>
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancelar"
              onPress={() => router.back()}
              variant="secondary"
              style={styles.button}
              disabled={saving}
            />
            <Button
              title={saving ? 'Salvando...' : 'Salvar'}
              onPress={handleSubmit}
              variant="primary"
              style={styles.button}
              disabled={saving}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: AdminLTETheme.spacing.lg,
    paddingBottom: AdminLTETheme.spacing.xl,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: AdminLTETheme.colors.secondary,
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
    gap: AdminLTETheme.spacing.xs,
  },
  errorText: {
    fontSize: 12,
    color: AdminLTETheme.colors.danger,
    marginTop: AdminLTETheme.spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: AdminLTETheme.spacing.md,
    marginTop: AdminLTETheme.spacing.lg,
  },
  button: {
    flex: 1,
  },
});

