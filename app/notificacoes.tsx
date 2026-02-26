import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, FlatList, Switch, Modal } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { notificacaoService } from '@/services/notificacaoService';

type TipoEnvio = 'todos' | 'especifico';
type TipoNotificacao = 'rota' | 'cobranca' | 'aviso';

interface NotificacaoItem {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
}

interface ResponsavelSelecionado {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
}

export default function Notificacoes() {
  const router = useRouter();
  const { user } = useAuth();
  const isResponsavel = user?.role === 'responsavel';
  const isMotorista = user?.role === 'motorista';
  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>('todos');
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoNotificacao | 'todas'>('todas');
  const [modalSelecaoVisible, setModalSelecaoVisible] = useState(false);
  const [responsaveisSelecionados, setResponsaveisSelecionados] = useState<ResponsavelSelecionado[]>([]);
  const [responsaveisDisponiveis, setResponsaveisDisponiveis] = useState<ResponsavelSelecionado[]>([]);
  const [notificacoes, setNotificacoes] = useState<NotificacaoItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isMotorista) {
      loadResponsaveis();
    }
    if (isResponsavel) {
      loadNotificacoes();
    }
  }, [isMotorista, isResponsavel]);

  const loadResponsaveis = async () => {
    try {
      const data = await notificacaoService.getResponsaveisDisponiveis();
      setResponsaveisDisponiveis(data);
    } catch (error: any) {
      console.error('Erro ao carregar responsáveis:', error);
    }
  };

  const loadNotificacoes = async () => {
    try {
      setLoading(true);
      const data = await notificacaoService.getAll();
      // Converter formato da API para o formato da tela
      const formatted = data.map((n: any) => ({
        id: n.id,
        tipo: 'aviso' as TipoNotificacao,
        titulo: n.titulo,
        mensagem: n.mensagem,
        data: n.createdAt,
        lida: n.lida || false,
      }));
      setNotificacoes(formatted);
    } catch (error: any) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleResponsavel = (responsavel: ResponsavelSelecionado) => {
    setResponsaveisSelecionados(prev => {
      const existe = prev.find(r => r.id === responsavel.id);
      if (existe) {
        return prev.filter(r => r.id !== responsavel.id);
      } else {
        return [...prev, responsavel];
      }
    });
  };

  const handleEnviar = async () => {
    if (!titulo.trim() || !mensagem.trim()) {
      Alert.alert('Erro', 'Preencha título e mensagem');
      return;
    }

    if (tipoEnvio === 'especifico' && responsaveisSelecionados.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um responsável');
      return;
    }

    try {
      setLoading(true);
      await notificacaoService.create({
        tipo: tipoEnvio,
        titulo,
        mensagem,
        enviarAgora: true,
        destinatarioIds: tipoEnvio === 'especifico' 
          ? responsaveisSelecionados.map(r => r.id)
          : undefined,
      });

      const destinatarios = tipoEnvio === 'todos' 
        ? 'todos os responsáveis' 
        : `${responsaveisSelecionados.length} responsável(is)`;

      Alert.alert(
        'Sucesso',
        `Notificação enviada para ${destinatarios}!`,
        [{ 
          text: 'OK',
          onPress: () => {
            setTitulo('');
            setMensagem('');
            setResponsaveisSelecionados([]);
            setTipoEnvio('todos');
          }
        }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao enviar notificação');
    } finally {
      setLoading(false);
    }
  };

  const notificacoesFiltradas = useMemo(() => {
    if (filtroTipo === 'todas') return notificacoes;
    return notificacoes.filter(n => n.tipo === filtroTipo);
  }, [filtroTipo, notificacoes]);

  const getTipoIcon = (tipo: TipoNotificacao) => {
    switch (tipo) {
      case 'rota':
        return 'location.fill';
      case 'cobranca':
        return 'dollarsign.circle.fill';
      case 'aviso':
        return 'bell.fill';
    }
  };

  const getTipoColor = (tipo: TipoNotificacao) => {
    switch (tipo) {
      case 'rota':
        return AdminLTETheme.colors.primary;
      case 'cobranca':
        return AdminLTETheme.colors.danger;
      case 'aviso':
        return AdminLTETheme.colors.warning;
    }
  };

  const renderNotificacao = ({ item }: { item: NotificacaoItem }) => (
    <Card style={StyleSheet.flatten([styles.notificacaoCard, !item.lida && styles.notificacaoNaoLida])}>
      <View style={styles.notificacaoHeader}>
        <View style={[styles.notificacaoIcon, { backgroundColor: getTipoColor(item.tipo) + '15' }]}>
          <IconSymbol
            name={getTipoIcon(item.tipo)}
            size={20}
            color={getTipoColor(item.tipo)}
          />
        </View>
        <View style={styles.notificacaoContent}>
          <View style={styles.notificacaoTitleRow}>
            <Text style={styles.notificacaoTitulo}>{item.titulo}</Text>
            {!item.lida && <View style={styles.badgeNaoLida} />}
          </View>
          <Text style={styles.notificacaoMensagem}>{item.mensagem}</Text>
          <Text style={styles.notificacaoData}>
            {new Date(item.data).toLocaleString('pt-BR')}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Notificações</Text>

        {/* Para Responsáveis: Mostrar histórico */}
        {isResponsavel ? (
          <>
            <Card title="Filtros">
              <View style={styles.chipsRow}>
                <Chip
                  label="Todas"
                  selected={filtroTipo === 'todas'}
                  onPress={() => setFiltroTipo('todas')}
                />
                <Chip
                  label="Rotas"
                  selected={filtroTipo === 'rota'}
                  onPress={() => setFiltroTipo('rota')}
                />
                <Chip
                  label="Cobranças"
                  selected={filtroTipo === 'cobranca'}
                  onPress={() => setFiltroTipo('cobranca')}
                />
                <Chip
                  label="Avisos"
                  selected={filtroTipo === 'aviso'}
                  onPress={() => setFiltroTipo('aviso')}
                />
              </View>
            </Card>

            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {notificacoesFiltradas.length} notificação(ões) encontrada(s)
              </Text>
            </View>

            <FlatList
              data={notificacoesFiltradas}
              renderItem={renderNotificacao}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <Card>
                  <Text style={styles.emptyText}>Nenhuma notificação encontrada</Text>
                </Card>
              }
            />
          </>
        ) : (
          <>
            {/* Para Motoristas/Admin: Criar notificações */}
            <Card title="Nova Notificação">
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tipo de Envio</Text>
            <View style={styles.chipsRow}>
              <Chip
                label="Para todos"
                selected={tipoEnvio === 'todos'}
                onPress={() => setTipoEnvio('todos')}
                variant="primary"
              />
              <Chip
                label="Específico"
                selected={tipoEnvio === 'especifico'}
                onPress={() => setTipoEnvio('especifico')}
                variant="primary"
              />
            </View>
          </View>

          {tipoEnvio === 'especifico' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Selecionar Responsáveis</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => setModalSelecaoVisible(true)}
              >
                <Text style={styles.selectButtonText}>
                  {responsaveisSelecionados.length > 0
                    ? `${responsaveisSelecionados.length} responsável(is) selecionado(s)`
                    : 'Selecionar responsáveis...'}
                </Text>
                <IconSymbol name="chevron.right" size={16} color={AdminLTETheme.colors.secondary} />
              </TouchableOpacity>
              {responsaveisSelecionados.length > 0 && (
                <View style={styles.selectedChips}>
                  {responsaveisSelecionados.map(resp => (
                    <Chip
                      key={resp.id}
                      label={resp.nome}
                      selected={true}
                      onPress={() => toggleResponsavel(resp)}
                      variant="primary"
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          <Input
            label="Título *"
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Digite o título da notificação"
          />

          <Input
            label="Mensagem *"
            value={mensagem}
            onChangeText={setMensagem}
            placeholder="Digite a mensagem"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <View style={styles.buttonRow}>
            <Button
              title="Enviar Agora"
              onPress={handleEnviar}
              variant="primary"
              style={styles.button}
            />
            <Button
              title="Agendar"
              onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade de agendamento em breve')}
              variant="secondary"
              style={styles.button}
            />
          </View>
        </Card>

        <Card title="Templates">
          <Text style={styles.infoText}>Templates salvos aparecerão aqui</Text>
          <Button
            title="Criar Template"
            onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade de templates em breve')}
            variant="secondary"
            style={styles.templateButton}
          />
        </Card>

        <Card title="Gatilhos Automáticos">
          <View style={styles.gatilhoItem}>
            <View style={styles.gatilhoInfo}>
              <IconSymbol name="bell.fill" size={20} color={AdminLTETheme.colors.primary} />
              <View style={styles.gatilhoText}>
                <Text style={styles.gatilhoTitle}>Cobrança de Inadimplentes</Text>
                <Text style={styles.gatilhoSubtext}>Envia notificação quando houver pagamentos em atraso</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
            />
          </View>

          <View style={styles.gatilhoItem}>
            <View style={styles.gatilhoInfo}>
              <IconSymbol name="location.fill" size={20} color={AdminLTETheme.colors.primary} />
              <View style={styles.gatilhoText}>
                <Text style={styles.gatilhoTitle}>Início de Rota</Text>
                <Text style={styles.gatilhoSubtext}>Notifica quando a rota for iniciada</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
            />
          </View>

          <View style={styles.gatilhoItem}>
            <View style={styles.gatilhoInfo}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={AdminLTETheme.colors.primary} />
              <View style={styles.gatilhoText}>
                <Text style={styles.gatilhoTitle}>Fim de Rota</Text>
                <Text style={styles.gatilhoSubtext}>Notifica quando a rota for finalizada</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: AdminLTETheme.colors.success }}
            />
          </View>
        </Card>
          </>
        )}

        {/* Modal de Seleção de Responsáveis */}
        {isMotorista && (
          <Modal
            visible={modalSelecaoVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalSelecaoVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Selecionar Responsáveis</Text>
                  <TouchableOpacity onPress={() => setModalSelecaoVisible(false)}>
                    <IconSymbol name="xmark" size={24} color={AdminLTETheme.colors.dark} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScroll}>
                  {responsaveisDisponiveis.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>Nenhum responsável disponível</Text>
                    </View>
                  ) : (
                    <>
                      <View style={styles.modalActions}>
                        <TouchableOpacity
                          onPress={() => {
                            if (responsaveisSelecionados.length === responsaveisDisponiveis.length) {
                              setResponsaveisSelecionados([]);
                            } else {
                              setResponsaveisSelecionados([...responsaveisDisponiveis]);
                            }
                          }}
                        >
                          <Text style={styles.selectAllText}>
                            {responsaveisSelecionados.length === responsaveisDisponiveis.length
                              ? 'Desmarcar Todos'
                              : 'Selecionar Todos'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <FlatList
                        data={responsaveisDisponiveis}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                          const selecionado = responsaveisSelecionados.find(r => r.id === item.id);
                          return (
                            <TouchableOpacity
                              style={[
                                styles.responsavelItem,
                                selecionado && styles.responsavelItemSelected
                              ]}
                              onPress={() => toggleResponsavel(item)}
                            >
                              <View style={styles.responsavelInfo}>
                                <Text style={styles.responsavelNome}>{item.nome}</Text>
                                <Text style={styles.responsavelDetails}>
                                  {item.telefone} • CPF: {item.cpf}
                                </Text>
                              </View>
                              {selecionado && (
                                <IconSymbol
                                  name="checkmark.circle.fill"
                                  size={24}
                                  color={AdminLTETheme.colors.primary}
                                />
                              )}
                            </TouchableOpacity>
                          );
                        }}
                        scrollEnabled={false}
                      />
                    </>
                  )}

                  <View style={styles.modalFooter}>
                    <Button
                      title="Confirmar"
                      onPress={() => {
                        if (responsaveisSelecionados.length === 0) {
                          Alert.alert('Atenção', 'Selecione pelo menos um responsável');
                          return;
                        }
                        setModalSelecaoVisible(false);
                      }}
                      variant="primary"
                    />
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
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
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.lg,
    letterSpacing: 0.5,
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
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectButtonText: {
    fontSize: 14,
    color: AdminLTETheme.colors.dark,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: AdminLTETheme.spacing.md,
    marginTop: AdminLTETheme.spacing.lg,
  },
  button: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    marginBottom: AdminLTETheme.spacing.md,
  },
  templateButton: {
    marginTop: AdminLTETheme.spacing.md,
  },
  gatilhoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AdminLTETheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  gatilhoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: AdminLTETheme.spacing.md,
  },
  gatilhoText: {
    marginLeft: AdminLTETheme.spacing.md,
    flex: 1,
  },
  gatilhoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  gatilhoSubtext: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
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
  notificacaoCard: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  notificacaoNaoLida: {
    borderLeftWidth: 4,
    borderLeftColor: AdminLTETheme.colors.primary,
    backgroundColor: AdminLTETheme.colors.primary + '05',
  },
  notificacaoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificacaoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AdminLTETheme.spacing.md,
  },
  notificacaoContent: {
    flex: 1,
  },
  notificacaoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AdminLTETheme.spacing.xs,
  },
  notificacaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    flex: 1,
  },
  badgeNaoLida: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AdminLTETheme.colors.primary,
  },
  notificacaoMensagem: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    marginBottom: AdminLTETheme.spacing.xs,
    lineHeight: 20,
  },
  notificacaoData: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  emptyText: {
    textAlign: 'center',
    color: AdminLTETheme.colors.secondary,
    fontSize: 16,
    padding: AdminLTETheme.spacing.lg,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.xs,
    marginTop: AdminLTETheme.spacing.sm,
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
  modalScroll: {
    maxHeight: '80%',
    paddingHorizontal: AdminLTETheme.spacing.lg,
  },
  modalActions: {
    paddingVertical: AdminLTETheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: AdminLTETheme.spacing.md,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.primary,
  },
  responsavelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: AdminLTETheme.borderRadius.md,
    marginBottom: AdminLTETheme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  responsavelItemSelected: {
    borderColor: AdminLTETheme.colors.primary,
    backgroundColor: AdminLTETheme.colors.primary + '10',
  },
  responsavelInfo: {
    flex: 1,
  },
  responsavelNome: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  responsavelDetails: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  emptyContainer: {
    padding: AdminLTETheme.spacing.xl,
    alignItems: 'center',
  },
  modalFooter: {
    padding: AdminLTETheme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    marginTop: AdminLTETheme.spacing.md,
  },
});

