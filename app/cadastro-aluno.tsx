import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Permissions } from '@/types/user';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { maskDate, maskCPF, maskPhone, maskCEP, unmaskDate } from '@/utils/masks';
import { alunoService } from '@/services/alunoService';
import { responsavelService } from '@/services/responsavelService';
import { User } from '@/types/user';

interface AlunoFormData {
  // Dados do Aluno
  nome: string;
  dataNascimento: string;
  serie: string;
  turma: string;
  periodo: 'M' | 'T' | '';
  status: 'ativo' | 'inativo';
  
  // Responsável
  responsavelNome: string;
  responsavelCpf: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  
  // Endereço Contratante
  enderecoContratanteRua: string;
  enderecoContratanteNumero: string;
  enderecoContratanteComplemento: string;
  enderecoContratanteBairro: string;
  enderecoContratanteCidade: string;
  enderecoContratanteEstado: string;
  enderecoContratanteCep: string;
  
  // Endereço Saída
  usarMesmoEndereco: boolean;
  enderecoSaidaRua: string;
  enderecoSaidaNumero: string;
  enderecoSaidaComplemento: string;
  enderecoSaidaBairro: string;
  enderecoSaidaCidade: string;
  enderecoSaidaEstado: string;
  enderecoSaidaCep: string;
  
  // Escola
  escolaNome: string;
  escolaEndereco: string;
  
  // Financeiro
  valorMensal: string;
  formaPagamento: 'debito' | 'credito' | 'pix' | 'boleto' | '';
  diasSemana: string[];
  datasVencimento: string;
  statusPagamento: 'em_dia' | 'atrasado';
}

const PERIODOS = [
  { value: 'M', label: 'Manhã' },
  { value: 'T', label: 'Tarde' },
];

const DIAS_SEMANA = [
  { value: 'segunda', label: 'Segunda' },
  { value: 'terca', label: 'Terça' },
  { value: 'quarta', label: 'Quarta' },
  { value: 'quinta', label: 'Quinta' },
  { value: 'sexta', label: 'Sexta' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];

const FORMAS_PAGAMENTO = [
  { value: 'debito', label: 'Débito' },
  { value: 'credito', label: 'Crédito' },
  { value: 'pix', label: 'PIX' },
  { value: 'boleto', label: 'Boleto' },
];

export default function CadastroAluno() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  // Verificar se o usuário tem permissão para cadastrar/editar alunos
  React.useEffect(() => {
    if (user && !Permissions[user.role].canCreateAluno && !Permissions[user.role].canEditAluno) {
      Alert.alert('Acesso Negado', 'Você não tem permissão para acessar esta funcionalidade.');
      router.replace('/');
    }
  }, [user, router]);

  // Se não tiver permissão, não renderizar nada (será redirecionado)
  if (user && !Permissions[user.role].canCreateAluno && !Permissions[user.role].canEditAluno) {
    return null;
  }

  const [formData, setFormData] = useState<AlunoFormData>({
    nome: '',
    dataNascimento: '',
    serie: '',
    turma: '',
    periodo: '',
    status: 'ativo',
    responsavelNome: '',
    responsavelCpf: '',
    responsavelTelefone: '',
    responsavelEmail: '',
    enderecoContratanteRua: '',
    enderecoContratanteNumero: '',
    enderecoContratanteComplemento: '',
    enderecoContratanteBairro: '',
    enderecoContratanteCidade: '',
    enderecoContratanteEstado: '',
    enderecoContratanteCep: '',
    usarMesmoEndereco: false,
    enderecoSaidaRua: '',
    enderecoSaidaNumero: '',
    enderecoSaidaComplemento: '',
    enderecoSaidaBairro: '',
    enderecoSaidaCidade: '',
    enderecoSaidaEstado: '',
    enderecoSaidaCep: '',
    escolaNome: '',
    escolaEndereco: '',
    valorMensal: '',
    formaPagamento: '',
    diasSemana: [],
    datasVencimento: '',
    statusPagamento: 'em_dia',
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [responsaveis, setResponsaveis] = useState<User[]>([]);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState<string>('');
  const [usarResponsavelExistente, setUsarResponsavelExistente] = useState(false);

  // Carregar responsáveis vinculados ao motorista
  useEffect(() => {
    if (user?.role === 'motorista' && !isEdit) {
      loadResponsaveis();
    }
  }, [user, isEdit]);

  // Carregar dados se estiver editando
  useEffect(() => {
    if (isEdit) {
      // Aqui você carregaria os dados do aluno
      // Por enquanto, deixamos vazio para criar novo
    }
  }, [isEdit]);

  const loadResponsaveis = async () => {
    try {
      const responsaveisData = await responsavelService.getByMotorista();
      setResponsaveis(responsaveisData);
    } catch (error) {
      console.error('Erro ao carregar responsáveis:', error);
    }
  };

  const handleSelecionarResponsavel = (responsavelId: string) => {
    setResponsavelSelecionado(responsavelId);
    const responsavel = responsaveis.find(r => r.id === responsavelId);
    if (responsavel) {
      setFormData(prev => ({
        ...prev,
        responsavelNome: responsavel.nome || '',
        responsavelCpf: responsavel.cpf ? maskCPF(responsavel.cpf) : '',
        responsavelTelefone: responsavel.telefone ? maskPhone(responsavel.telefone) : '',
        responsavelEmail: responsavel.email || '',
      }));
    }
  };

  const handleChange = (field: keyof AlunoFormData, value: any) => {
    let formattedValue = value;
    
    // Aplicar máscaras conforme o tipo de campo
    if (field === 'dataNascimento') {
      formattedValue = maskDate(value);
    } else if (field === 'responsavelCpf') {
      formattedValue = maskCPF(value);
    } else if (field === 'responsavelTelefone') {
      formattedValue = maskPhone(value);
    } else if (field === 'enderecoContratanteCep' || field === 'enderecoSaidaCep') {
      formattedValue = maskCEP(value);
    }
    
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleDiaSemana = (dia: string) => {
    setFormData((prev) => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia)
        ? prev.diasSemana.filter(d => d !== dia)
        : [...prev.diasSemana, dia],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.dataNascimento.trim()) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      // Validar formato de data DD/MM/AAAA
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(formData.dataNascimento)) {
        newErrors.dataNascimento = 'Data inválida. Use o formato DD/MM/AAAA';
      } else {
        const [, day, month, year] = formData.dataNascimento.match(dateRegex)!;
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
          newErrors.dataNascimento = 'Data inválida';
        }
      }
    }
    if (!formData.serie.trim()) newErrors.serie = 'Série é obrigatória';
    if (!formData.turma.trim()) newErrors.turma = 'Turma é obrigatória';
    if (!formData.periodo) newErrors.periodo = 'Período é obrigatório';
    if (usarResponsavelExistente && !responsavelSelecionado) {
      newErrors.responsavelSelecionado = 'Selecione um responsável';
    } else {
      if (!formData.responsavelNome.trim()) newErrors.responsavelNome = 'Nome do responsável é obrigatório';
      if (!formData.responsavelCpf.trim()) newErrors.responsavelCpf = 'CPF é obrigatório';
      if (!formData.responsavelTelefone.trim()) newErrors.responsavelTelefone = 'Telefone é obrigatório';
    }
    if (!formData.enderecoContratanteRua.trim()) newErrors.enderecoContratanteRua = 'Rua é obrigatória';
    if (!formData.enderecoContratanteNumero.trim()) newErrors.enderecoContratanteNumero = 'Número é obrigatório';
    if (!formData.escolaNome.trim()) newErrors.escolaNome = 'Nome da escola é obrigatório';
    if (!formData.escolaEndereco.trim()) newErrors.escolaEndereco = 'Endereço da escola é obrigatório';
    if (!formData.valorMensal.trim()) newErrors.valorMensal = 'Valor mensal é obrigatório';
    if (!formData.formaPagamento) newErrors.formaPagamento = 'Forma de pagamento é obrigatória';
    if (formData.diasSemana.length === 0) newErrors.diasSemana = 'Selecione pelo menos um dia da semana';
    if (!formData.datasVencimento.trim()) newErrors.datasVencimento = 'Data(s) de vencimento é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setLoading(true);

    try {
      // Converter data de DD/MM/AAAA para YYYY-MM-DD
      const dataNascimentoFormatada = unmaskDate(formData.dataNascimento);
      
      // Remover máscaras de CPF, telefone e CEP
      const cpfLimpo = formData.responsavelCpf.replace(/\D/g, '');
      const telefoneLimpo = formData.responsavelTelefone.replace(/\D/g, '');
      const cepLimpo = formData.enderecoContratanteCep.replace(/\D/g, '');
      const cepSaidaLimpo = formData.enderecoSaidaCep.replace(/\D/g, '');

      // Preparar dados para envio
      const alunoData = {
        nome: formData.nome,
        dataNascimento: dataNascimentoFormatada,
        serie: formData.serie,
        turma: formData.turma,
        periodo: formData.periodo,
        status: formData.status,
        escola: {
          nome: formData.escolaNome,
          endereco: formData.escolaEndereco,
        },
        responsavel: usarResponsavelExistente && responsavelSelecionado ? {
          id: responsavelSelecionado,
        } : {
          nome: formData.responsavelNome,
          cpf: cpfLimpo,
          telefone: telefoneLimpo,
          email: formData.responsavelEmail || undefined,
        },
        enderecoContratante: {
          rua: formData.enderecoContratanteRua,
          numero: formData.enderecoContratanteNumero,
          complemento: formData.enderecoContratanteComplemento || undefined,
          bairro: formData.enderecoContratanteBairro,
          cidade: formData.enderecoContratanteCidade,
          estado: formData.enderecoContratanteEstado,
          cep: cepLimpo,
        },
        enderecoSaida: formData.usarMesmoEndereco ? undefined : {
          rua: formData.enderecoSaidaRua,
          numero: formData.enderecoSaidaNumero,
          complemento: formData.enderecoSaidaComplemento || undefined,
          bairro: formData.enderecoSaidaBairro,
          cidade: formData.enderecoSaidaCidade,
          estado: formData.enderecoSaidaEstado,
          cep: cepSaidaLimpo,
        },
        valorMensal: parseFloat(formData.valorMensal.replace(',', '.')) || 0,
        formaPagamento: formData.formaPagamento,
        diasSemana: formData.diasSemana,
        datasVencimento: formData.datasVencimento.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d)),
      };

      console.log('[CadastroAluno] Enviando dados:', JSON.stringify(alunoData, null, 2));
      
      if (isEdit && id) {
        await alunoService.update(id, alunoData);
      } else {
        const resultado = await alunoService.create(alunoData);
        console.log('[CadastroAluno] Aluno criado com sucesso:', resultado);
      }

      Alert.alert(
        'Sucesso!',
        `Aluno ${isEdit ? 'atualizado' : 'cadastrado'} com sucesso!`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (!isEdit) {
                // Perguntar se quer criar contrato
                Alert.alert(
                  'Contrato',
                  'Deseja criar um contrato para este aluno agora?',
                  [
                    { text: 'Depois', onPress: () => router.back() },
                    { text: 'Criar Agora', onPress: () => {
                      // Navegar para criar contrato
                      router.back();
                    }},
                  ]
                );
              } else {
                router.back();
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Erro ao salvar aluno:', error);
      
      // Extrair mensagem de erro mais detalhada
      let errorMessage = 'Erro ao salvar aluno. Tente novamente.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.errors && Array.isArray(error.errors)) {
        const firstError = error.errors[0];
        if (firstError.msg) {
          errorMessage = firstError.msg;
        } else if (typeof firstError === 'string') {
          errorMessage = firstError;
        }
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>
            {isEdit ? 'Editar Aluno' : 'Cadastrar Aluno'}
          </Text>

          <Card title="Dados do Aluno">
            <Input
              label="Nome do Aluno *"
              value={formData.nome}
              onChangeText={(value) => handleChange('nome', value)}
              placeholder="Digite o nome completo"
              error={errors.nome}
            />

            <Input
              label="Data de Nascimento *"
              value={formData.dataNascimento}
              onChangeText={(value) => handleChange('dataNascimento', value)}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              error={errors.dataNascimento}
            />

            <View style={styles.row}>
              <View style={[styles.halfWidth, styles.halfWidthLeft]}>
                <Input
                  label="Série *"
                  value={formData.serie}
                  onChangeText={(value) => handleChange('serie', value)}
                  placeholder="Ex: 5º Ano"
                  error={errors.serie}
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label="Turma *"
                  value={formData.turma}
                  onChangeText={(value) => handleChange('turma', value)}
                  placeholder="Ex: A"
                  error={errors.turma}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Período *</Text>
              <View style={styles.chipsRow}>
                {PERIODOS.map(periodo => (
                  <Chip
                    key={periodo.value}
                    label={periodo.label}
                    selected={formData.periodo === periodo.value}
                    onPress={() => handleChange('periodo', periodo.value)}
                    variant="primary"
                  />
                ))}
              </View>
              {errors.periodo && <Text style={styles.errorText}>{errors.periodo}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.chipsRow}>
                <Chip
                  label="Ativo"
                  selected={formData.status === 'ativo'}
                  onPress={() => handleChange('status', 'ativo')}
                  variant="success"
                />
                <Chip
                  label="Inativo"
                  selected={formData.status === 'inativo'}
                  onPress={() => handleChange('status', 'inativo')}
                  variant="default"
                />
              </View>
            </View>
          </Card>

          <Card title="Responsável">
            {!isEdit && responsaveis.length > 0 && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Usar responsável existente</Text>
                <View style={styles.chipsRow}>
                  <Chip
                    label="Sim"
                    selected={usarResponsavelExistente}
                    onPress={() => setUsarResponsavelExistente(true)}
                    variant="primary"
                  />
                  <Chip
                    label="Criar novo"
                    selected={!usarResponsavelExistente}
                    onPress={() => {
                      setUsarResponsavelExistente(false);
                      setResponsavelSelecionado('');
                      setFormData(prev => ({
                        ...prev,
                        responsavelNome: '',
                        responsavelCpf: '',
                        responsavelTelefone: '',
                        responsavelEmail: '',
                      }));
                    }}
                    variant="primary"
                  />
                </View>
              </View>
            )}

            {usarResponsavelExistente && responsaveis.length > 0 ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Selecione o Responsável *</Text>
                <ScrollView style={styles.responsaveisList} nestedScrollEnabled>
                  {responsaveis.map((resp) => (
                    <TouchableOpacity
                      key={resp.id}
                      style={[
                        styles.responsavelItem,
                        responsavelSelecionado === resp.id && styles.responsavelItemSelected,
                      ]}
                      onPress={() => handleSelecionarResponsavel(resp.id)}
                    >
                      <View style={styles.responsavelInfo}>
                        <IconSymbol
                          name={responsavelSelecionado === resp.id ? 'checkmark.circle.fill' : 'circle'}
                          size={20}
                          color={responsavelSelecionado === resp.id ? AdminLTETheme.colors.success : AdminLTETheme.colors.secondary}
                        />
                        <View style={styles.responsavelDetails}>
                          <Text style={styles.responsavelNome}>{resp.nome}</Text>
                          <Text style={styles.responsavelMeta}>
                            {resp.cpf ? maskCPF(resp.cpf) : ''} • {resp.telefone ? maskPhone(resp.telefone) : ''}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {errors.responsavelSelecionado && (
                  <Text style={styles.errorText}>{errors.responsavelSelecionado}</Text>
                )}
              </View>
            ) : (
              <>
                <Input
                  label="Nome do Responsável *"
                  value={formData.responsavelNome}
                  onChangeText={(value) => handleChange('responsavelNome', value)}
                  placeholder="Nome completo"
                  error={errors.responsavelNome}
                />

                <View style={styles.row}>
                  <View style={[styles.halfWidth, styles.halfWidthLeft]}>
                    <Input
                      label="CPF *"
                      value={formData.responsavelCpf}
                      onChangeText={(value) => handleChange('responsavelCpf', value)}
                      placeholder="000.000.000-00"
                      keyboardType="numeric"
                      error={errors.responsavelCpf}
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Input
                      label="Telefone *"
                      value={formData.responsavelTelefone}
                      onChangeText={(value) => handleChange('responsavelTelefone', value)}
                      placeholder="(00) 00000-0000"
                      keyboardType="phone-pad"
                      error={errors.responsavelTelefone}
                    />
                  </View>
                </View>

                <Input
                  label="Email"
                  value={formData.responsavelEmail}
                  onChangeText={(value) => handleChange('responsavelEmail', value)}
                  placeholder="email@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.responsavelEmail}
                />
              </>
            )}
          </Card>

          <Card title="Endereço do Contratante">
            <View style={styles.row}>
              <View style={[styles.twoThirds, { marginRight: AdminLTETheme.spacing.md }]}>
                <Input
                  label="Rua *"
                  value={formData.enderecoContratanteRua}
                  onChangeText={(value) => handleChange('enderecoContratanteRua', value)}
                  placeholder="Nome da rua"
                  error={errors.enderecoContratanteRua}
                />
              </View>
              <View style={styles.oneThird}>
                <Input
                  label="Número *"
                  value={formData.enderecoContratanteNumero}
                  onChangeText={(value) => handleChange('enderecoContratanteNumero', value)}
                  placeholder="Nº"
                  error={errors.enderecoContratanteNumero}
                />
              </View>
            </View>

            <Input
              label="Complemento"
              value={formData.enderecoContratanteComplemento}
              onChangeText={(value) => handleChange('enderecoContratanteComplemento', value)}
              placeholder="Apto, Bloco, etc"
            />

            <Input
              label="Bairro"
              value={formData.enderecoContratanteBairro}
              onChangeText={(value) => handleChange('enderecoContratanteBairro', value)}
              placeholder="Bairro"
            />

            <View style={styles.row}>
              <View style={[styles.halfWidth, styles.halfWidthLeft]}>
                <Input
                  label="Cidade"
                  value={formData.enderecoContratanteCidade}
                  onChangeText={(value) => handleChange('enderecoContratanteCidade', value)}
                  placeholder="Cidade"
                />
              </View>
              <View style={[styles.halfWidth, { marginLeft: AdminLTETheme.spacing.md }]}>
                <Input
                  label="Estado"
                  value={formData.enderecoContratanteEstado}
                  onChangeText={(value) => handleChange('enderecoContratanteEstado', value)}
                  placeholder="UF"
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <Input
              label="CEP"
              value={formData.enderecoContratanteCep}
              onChangeText={(value) => handleChange('enderecoContratanteCep', value)}
              placeholder="00000-000"
              keyboardType="numeric"
            />
          </Card>

          <Card title="Endereço de Saída">
            <View style={styles.checkboxRow}>
              <Chip
                label="Usar mesmo endereço"
                selected={formData.usarMesmoEndereco}
                onPress={() => {
                  handleChange('usarMesmoEndereco', !formData.usarMesmoEndereco);
                  if (!formData.usarMesmoEndereco) {
                    // Copiar dados do endereço contratante
                    handleChange('enderecoSaidaRua', formData.enderecoContratanteRua);
                    handleChange('enderecoSaidaNumero', formData.enderecoContratanteNumero);
                    handleChange('enderecoSaidaBairro', formData.enderecoContratanteBairro);
                    handleChange('enderecoSaidaCidade', formData.enderecoContratanteCidade);
                    handleChange('enderecoSaidaEstado', formData.enderecoContratanteEstado);
                    handleChange('enderecoSaidaCep', formData.enderecoContratanteCep);
                  }
                }}
                variant="primary"
              />
            </View>

            {!formData.usarMesmoEndereco && (
              <>
                <View style={styles.row}>
                  <View style={[styles.twoThirds, { marginRight: AdminLTETheme.spacing.md }]}>
                    <Input
                      label="Rua"
                      value={formData.enderecoSaidaRua}
                      onChangeText={(value) => handleChange('enderecoSaidaRua', value)}
                      placeholder="Nome da rua"
                    />
                  </View>
                  <View style={styles.oneThird}>
                    <Input
                      label="Número"
                      value={formData.enderecoSaidaNumero}
                      onChangeText={(value) => handleChange('enderecoSaidaNumero', value)}
                      placeholder="Nº"
                    />
                  </View>
                </View>

                <Input
                  label="Complemento"
                  value={formData.enderecoSaidaComplemento}
                  onChangeText={(value) => handleChange('enderecoSaidaComplemento', value)}
                  placeholder="Apto, Bloco, etc"
                />

                <Input
                  label="Bairro"
                  value={formData.enderecoSaidaBairro}
                  onChangeText={(value) => handleChange('enderecoSaidaBairro', value)}
                  placeholder="Bairro"
                />

                <View style={styles.row}>
                  <View style={[styles.halfWidth, styles.halfWidthLeft]}>
                    <Input
                      label="Cidade"
                      value={formData.enderecoSaidaCidade}
                      onChangeText={(value) => handleChange('enderecoSaidaCidade', value)}
                      placeholder="Cidade"
                    />
                  </View>
                  <View style={[styles.halfWidth, { marginLeft: AdminLTETheme.spacing.md }]}>
                    <Input
                      label="Estado"
                      value={formData.enderecoSaidaEstado}
                      onChangeText={(value) => handleChange('enderecoSaidaEstado', value)}
                      placeholder="UF"
                      maxLength={2}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>

                <Input
                  label="CEP"
                  value={formData.enderecoSaidaCep}
                  onChangeText={(value) => handleChange('enderecoSaidaCep', value)}
                  placeholder="00000-000"
                  keyboardType="numeric"
                />
              </>
            )}
          </Card>

          <Card title="Escola">
            <Input
              label="Nome da Escola *"
              value={formData.escolaNome}
              onChangeText={(value) => handleChange('escolaNome', value)}
              placeholder="Nome completo da escola"
              error={errors.escolaNome}
            />

            <Input
              label="Endereço da Escola *"
              value={formData.escolaEndereco}
              onChangeText={(value) => handleChange('escolaEndereco', value)}
              placeholder="Endereço completo"
              error={errors.escolaEndereco}
            />
          </Card>

          <Card title="Financeiro">
            <Input
              label="Valor Mensal *"
              value={formData.valorMensal}
              onChangeText={(value) => handleChange('valorMensal', value)}
              placeholder="0,00"
              keyboardType="decimal-pad"
              error={errors.valorMensal}
            />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Forma de Pagamento *</Text>
              <View style={styles.chipsRow}>
                {FORMAS_PAGAMENTO.map(forma => (
                  <Chip
                    key={forma.value}
                    label={forma.label}
                    selected={formData.formaPagamento === forma.value}
                    onPress={() => handleChange('formaPagamento', forma.value)}
                    variant="primary"
                  />
                ))}
              </View>
              {errors.formaPagamento && <Text style={styles.errorText}>{errors.formaPagamento}</Text>}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Dias da Semana *</Text>
              <View style={styles.chipsRow}>
                {DIAS_SEMANA.map(dia => (
                  <Chip
                    key={dia.value}
                    label={dia.label}
                    selected={formData.diasSemana.includes(dia.value)}
                    onPress={() => toggleDiaSemana(dia.value)}
                    variant={formData.diasSemana.includes(dia.value) ? 'primary' : 'default'}
                  />
                ))}
              </View>
              {errors.diasSemana && <Text style={styles.errorText}>{errors.diasSemana}</Text>}
            </View>

            <Input
              label="Dia(s) de Vencimento *"
              value={formData.datasVencimento}
              onChangeText={(value) => handleChange('datasVencimento', value)}
              placeholder="Ex: 5, 10, 15 ou apenas 5"
              keyboardType="numeric"
              error={errors.datasVencimento}
            />
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              title={isEdit ? 'Atualizar Aluno' : 'Cadastrar Aluno'}
              onPress={handleSubmit}
              variant="primary"
              loading={loading}
              style={styles.submitButton}
            />
            <Button
              title="Cancelar"
              onPress={() => router.back()}
              variant="secondary"
              style={StyleSheet.flatten([styles.cancelButton, { marginTop: AdminLTETheme.spacing.md }])}
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
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xl,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
  },
  halfWidth: {
    flex: 1,
  },
  halfWidthLeft: {
    marginRight: AdminLTETheme.spacing.md,
  },
  twoThirds: {
    flex: 2,
  },
  oneThird: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: AdminLTETheme.spacing.xs,
  },
  checkboxRow: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  errorText: {
    color: AdminLTETheme.colors.danger,
    fontSize: 12,
    marginTop: AdminLTETheme.spacing.xs,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: AdminLTETheme.spacing.lg,
    marginBottom: AdminLTETheme.spacing.xl,
  },
  submitButton: {
    marginBottom: 0,
  },
  cancelButton: {
    marginBottom: 0,
  },
  responsaveisList: {
    maxHeight: 200,
    marginTop: AdminLTETheme.spacing.sm,
  },
  responsavelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
    marginBottom: AdminLTETheme.spacing.sm,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  responsavelItemSelected: {
    borderColor: AdminLTETheme.colors.primary,
    backgroundColor: AdminLTETheme.colors.primary + '10',
  },
  responsavelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  responsavelDetails: {
    marginLeft: AdminLTETheme.spacing.md,
    flex: 1,
  },
  responsavelNome: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  responsavelMeta: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
});
