import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { alunoService } from '@/services/alunoService';
import { maskPhone, maskCPF, maskDate, unmaskDate } from '@/utils/masks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Aluno } from '@/types/aluno';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, Switch } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function Perfil() {
  const { user, updateUser } = useAuth();
  const isResponsavel = user?.role === 'responsavel';
  const isMotorista = user?.role === 'motorista';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  
  // Campos do motorista (mockados por enquanto - podem ser adicionados ao backend depois)
  const [cnhNumero, setCnhNumero] = useState('');
  const [cnhValidade, setCnhValidade] = useState('');
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [pix, setPix] = useState('');
  
  // Vagas por período
  const [vagasManha, setVagasManha] = useState('15');
  const [vagasTarde, setVagasTarde] = useState('15');
  const [vagasNoite, setVagasNoite] = useState('15');
  
  // Alunos vinculados (para responsável)
  const [alunosVinculados, setAlunosVinculados] = useState<Aluno[]>([]);
  
  // Campos do responsável
  const [receberNotificacoes, setReceberNotificacoes] = useState(true);
  const [receberNotificacoesRotas, setReceberNotificacoesRotas] = useState(true);
  const [receberNotificacoesCobrancas, setReceberNotificacoesCobrancas] = useState(true);
  const [lgpdConsentimento, setLgpdConsentimento] = useState(true);
  const [compartilharDados, setCompartilharDados] = useState(true);

  useEffect(() => {
    loadUserData();
    loadVagas();
    if (isResponsavel) {
      loadAlunosVinculados();
    }
  }, [isResponsavel]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userData = await userService.getMe();
      setNome(userData.nome || '');
      setEmail(userData.email || '');
      setTelefone(userData.telefone ? maskPhone(userData.telefone) : '');
      setCpf(userData.cpf ? maskCPF(userData.cpf) : '');
    } catch (error: any) {
      console.error('Erro ao carregar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  const loadVagas = async () => {
    try {
      const storedVagas = await AsyncStorage.getItem(`@vagas_${user?.id}`);
      if (storedVagas) {
        const vagas = JSON.parse(storedVagas);
        setVagasManha(vagas.manha?.toString() || '15');
        setVagasTarde(vagas.tarde?.toString() || '15');
        setVagasNoite(vagas.noite?.toString() || '15');
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
    }
  };

  const saveVagas = async () => {
    try {
      const vagas = {
        manha: parseInt(vagasManha) || 15,
        tarde: parseInt(vagasTarde) || 15,
        noite: parseInt(vagasNoite) || 15,
      };
      await AsyncStorage.setItem(`@vagas_${user?.id}`, JSON.stringify(vagas));
    } catch (error) {
      console.error('Erro ao salvar vagas:', error);
    }
  };

  const loadAlunosVinculados = async () => {
    try {
      const alunos = await alunoService.getAll();
      // Filtrar alunos vinculados ao responsável logado
      if (user?.filhosIds && user.filhosIds.length > 0) {
        const vinculados = alunos.filter(aluno => user.filhosIds?.includes(aluno.id));
        setAlunosVinculados(vinculados);
      } else {
        // Se não houver filhosIds, buscar por responsavelId
        const vinculados = alunos.filter(aluno => aluno.responsavelId === user?.id);
        setAlunosVinculados(vinculados);
      }
    } catch (error) {
      console.error('Erro ao carregar alunos vinculados:', error);
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Erro', 'Nome e email são obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      const updates: any = {
        nome: nome.trim(),
        email: email.trim(),
      };

      if (telefone) {
        updates.telefone = telefone.replace(/\D/g, '');
      }

      if (cpf) {
        updates.cpf = cpf.replace(/\D/g, '');
      }

      const updatedUser = await userService.update(updates);
      
      // Salvar vagas se for motorista
      if (isMotorista) {
        await saveVagas();
      }
      
      // Atualizar o contexto com os novos dados
      if (updateUser) {
        updateUser(updatedUser);
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', error.message || 'Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Meu Perfil</Text>

        <Card title="Dados Pessoais">
          <View style={styles.fotoContainer}>
            <View style={styles.foto}>
              <IconSymbol name="person.fill" size={48} color={AdminLTETheme.colors.secondary} />
            </View>
            <TouchableOpacity 
              style={styles.fotoButton}
              onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve')}
            >
              <Text style={styles.fotoButtonText}>Alterar Foto</Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Nome *"
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome completo"
          />

          <Input
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Telefone"
            value={telefone}
            onChangeText={(value) => setTelefone(maskPhone(value))}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
          />

          <Input
            label="CPF"
            value={cpf}
            onChangeText={(value) => setCpf(maskCPF(value))}
            placeholder="000.000.000-00"
            keyboardType="numeric"
          />
        </Card>

        {/* Campos específicos do Motorista */}
        {isMotorista && (
          <>
            <Card title="CNH">
              <Input
                label="Número da CNH *"
                value={cnhNumero}
                onChangeText={setCnhNumero}
                placeholder="Número da CNH"
              />

              <Input
                label="Validade *"
                value={cnhValidade}
                onChangeText={setCnhValidade}
                placeholder="DD/MM/AAAA"
              />

              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve')}
              >
                <IconSymbol name="doc.fill" size={20} color={AdminLTETheme.colors.primary} />
                <Text style={styles.uploadButtonText}>Upload de CNH</Text>
              </TouchableOpacity>
            </Card>

            <Card title="Escolas que Atende">
              <View style={styles.escolaItem}>
                <Text style={styles.escolaNome}>Escola Municipal São Paulo</Text>
                <TouchableOpacity>
                  <IconSymbol name="xmark.circle.fill" size={20} color={AdminLTETheme.colors.danger} />
                </TouchableOpacity>
              </View>
              <Button
                title="Adicionar Escola"
                onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve')}
                variant="secondary"
                style={styles.addButton}
              />
            </Card>

            <Card title="Vagas por Período">
              <View style={styles.vagasContainer}>
                <View style={styles.vagaItem}>
                  <Text style={styles.vagaLabel}>Manhã</Text>
                  <Input
                    value={vagasManha}
                    onChangeText={setVagasManha}
                    keyboardType="numeric"
                    style={styles.vagaInput}
                  />
                </View>
                <View style={styles.vagaItem}>
                  <Text style={styles.vagaLabel}>Tarde</Text>
                  <Input
                    value={vagasTarde}
                    onChangeText={setVagasTarde}
                    keyboardType="numeric"
                    style={styles.vagaInput}
                  />
                </View>
                <View style={styles.vagaItem}>
                  <Text style={styles.vagaLabel}>Noite</Text>
                  <Input
                    value={vagasNoite}
                    onChangeText={setVagasNoite}
                    keyboardType="numeric"
                    style={styles.vagaInput}
                  />
                </View>
              </View>
            </Card>

            <Card title="Dados Bancários">
              <Input
                label="Banco"
                value={banco}
                onChangeText={setBanco}
                placeholder="Nome do banco"
              />

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Input
                    label="Agência"
                    value={agencia}
                    onChangeText={setAgencia}
                    placeholder="0000-0"
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Input
                    label="Conta"
                    value={conta}
                    onChangeText={setConta}
                    placeholder="00000-0"
                  />
                </View>
              </View>

              <Input
                label="PIX"
                value={pix}
                onChangeText={setPix}
                placeholder="Chave PIX"
              />
            </Card>

            <Card title="Documentos">
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve')}
              >
                <IconSymbol name="doc.fill" size={20} color={AdminLTETheme.colors.primary} />
                <Text style={styles.uploadButtonText}>Adicionar Documento</Text>
              </TouchableOpacity>
            </Card>
          </>
        )}

        {/* Campos específicos do Responsável */}
        {isResponsavel && (
          <>
            <Card title="Alunos Vinculados">
              {alunosVinculados.length > 0 ? (
                alunosVinculados.map((aluno) => (
                  <View key={aluno.id} style={styles.alunoItem}>
                    <View style={styles.alunoInfo}>
                      <IconSymbol name="person.fill" size={24} color={AdminLTETheme.colors.primary} />
                      <View style={styles.alunoDetails}>
                        <Text style={styles.alunoNome}>{aluno.nome}</Text>
                        <Text style={styles.alunoMeta}>
                          {aluno.escola?.nome || 'Escola não informada'} • {aluno.serie}ª série • Período: {
                            aluno.periodo === 'M' ? 'Manhã' : aluno.periodo === 'T' ? 'Tarde' : 'Noite'
                          }
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // Navegar para detalhes do aluno
                        Alert.alert('Aluno', `Ver detalhes de ${aluno.nome}?`, [
                          { text: 'Cancelar', style: 'cancel' },
                          { 
                            text: 'Ver Detalhes', 
                            onPress: () => {
                              // TODO: Navegar para tela de detalhes do aluno
                              Alert.alert('Em desenvolvimento', 'Tela de detalhes do aluno será implementada em breve.');
                            }
                          },
                        ]);
                      }}
                    >
                      <IconSymbol name="chevron.right" size={20} color={AdminLTETheme.colors.secondary} />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyAlunos}>
                  <IconSymbol name="person.slash.fill" size={48} color={AdminLTETheme.colors.secondary} />
                  <Text style={styles.emptyAlunosText}>Nenhum aluno vinculado</Text>
                  <Text style={styles.emptyAlunosSubtext}>Entre em contato com o motorista para vincular um aluno ao seu perfil.</Text>
                </View>
              )}
            </Card>

            <Card title="Preferências de Notificação">
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <IconSymbol name="bell.fill" size={20} color={AdminLTETheme.colors.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Receber Notificações</Text>
                    <Text style={styles.preferenceSubtext}>Ativar todas as notificações do app</Text>
                  </View>
                </View>
                <Switch
                  value={receberNotificacoes}
                  onValueChange={setReceberNotificacoes}
                  trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <IconSymbol name="location.fill" size={20} color={AdminLTETheme.colors.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Notificações de Rotas</Text>
                    <Text style={styles.preferenceSubtext}>Avisos sobre início e fim de rota</Text>
                  </View>
                </View>
                <Switch
                  value={receberNotificacoesRotas}
                  onValueChange={setReceberNotificacoesRotas}
                  trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <IconSymbol name="dollarsign.circle.fill" size={20} color={AdminLTETheme.colors.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Notificações de Cobranças</Text>
                    <Text style={styles.preferenceSubtext}>Lembretes de pagamentos e vencimentos</Text>
                  </View>
                </View>
                <Switch
                  value={receberNotificacoesCobrancas}
                  onValueChange={setReceberNotificacoesCobrancas}
                  trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
                />
              </View>
            </Card>

            <Card title="LGPD - Consentimentos">
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <IconSymbol name="checkmark.shield.fill" size={20} color={AdminLTETheme.colors.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Consentimento LGPD</Text>
                    <Text style={styles.preferenceSubtext}>Autorizo o tratamento dos meus dados pessoais</Text>
                  </View>
                </View>
                <Switch
                  value={lgpdConsentimento}
                  onValueChange={setLgpdConsentimento}
                  trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <IconSymbol name="hand.raised.fill" size={20} color={AdminLTETheme.colors.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Compartilhar Dados</Text>
                    <Text style={styles.preferenceSubtext}>Permitir compartilhamento com motorista</Text>
                  </View>
                </View>
                <Switch
                  value={compartilharDados}
                  onValueChange={setCompartilharDados}
                  trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
                />
              </View>

              <TouchableOpacity style={styles.lgpdButton}>
                <Text style={styles.lgpdButtonText}>Ver Política de Privacidade</Text>
                <IconSymbol name="chevron.right" size={16} color={AdminLTETheme.colors.primary} />
              </TouchableOpacity>
            </Card>
          </>
        )}

        <Button
          title={saving ? 'Salvando...' : 'Salvar Alterações'}
          onPress={handleSalvar}
          variant="primary"
          style={styles.saveButton}
          disabled={saving || loading}
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
  fotoContainer: {
    alignItems: 'center',
    marginBottom: AdminLTETheme.spacing.lg,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AdminLTETheme.colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: AdminLTETheme.spacing.md,
  },
  fotoButton: {
    paddingHorizontal: AdminLTETheme.spacing.md,
    paddingVertical: AdminLTETheme.spacing.sm,
    backgroundColor: AdminLTETheme.colors.primary,
    borderRadius: AdminLTETheme.borderRadius.md,
  },
  fotoButtonText: {
    color: AdminLTETheme.colors.white,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: AdminLTETheme.spacing.sm,
  },
  uploadButtonText: {
    fontSize: 14,
    color: AdminLTETheme.colors.dark,
    fontWeight: '500',
  },
  escolaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
    marginBottom: AdminLTETheme.spacing.sm,
  },
  escolaNome: {
    fontSize: 14,
    color: AdminLTETheme.colors.dark,
  },
  addButton: {
    marginTop: AdminLTETheme.spacing.sm,
  },
  vagasContainer: {
    gap: AdminLTETheme.spacing.md,
  },
  vagaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AdminLTETheme.spacing.md,
  },
  vagaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    width: 80,
  },
  vagaInput: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: AdminLTETheme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  saveButton: {
    marginTop: AdminLTETheme.spacing.lg,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AdminLTETheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: AdminLTETheme.spacing.md,
  },
  preferenceText: {
    marginLeft: AdminLTETheme.spacing.md,
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  preferenceSubtext: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  lgpdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
    marginTop: AdminLTETheme.spacing.md,
  },
  lgpdButtonText: {
    fontSize: 14,
    color: AdminLTETheme.colors.primary,
    fontWeight: '500',
  },
  alunoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: AdminLTETheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  alunoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: AdminLTETheme.spacing.md,
  },
  alunoDetails: {
    marginLeft: AdminLTETheme.spacing.md,
    flex: 1,
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  alunoMeta: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  emptyAlunos: {
    alignItems: 'center',
    paddingVertical: AdminLTETheme.spacing.xl,
  },
  emptyAlunosText: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginTop: AdminLTETheme.spacing.md,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  emptyAlunosSubtext: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
    textAlign: 'center',
    paddingHorizontal: AdminLTETheme.spacing.md,
  },
});

