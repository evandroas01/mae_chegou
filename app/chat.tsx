import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockAlunos } from '@/services/mockData';

interface Conversa {
  id: string;
  tipo: 'individual' | 'geral';
  nome: string;
  ultimaMensagem: string;
  hora: string;
  naoLidas: number;
  fixada: boolean;
}

const mockConversas: Conversa[] = [
  {
    id: '1',
    tipo: 'geral',
    nome: 'Todos os Responsáveis',
    ultimaMensagem: 'Aviso geral sobre a rota',
    hora: '10:30',
    naoLidas: 0,
    fixada: true,
  },
  {
    id: '2',
    tipo: 'individual',
    nome: 'Maria Silva',
    ultimaMensagem: 'Obrigada pela informação!',
    hora: '09:15',
    naoLidas: 2,
    fixada: false,
  },
];

export default function Chat() {
  const router = useRouter();
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState('');

  const renderConversa = ({ item }: { item: Conversa }) => (
    <TouchableOpacity
      style={styles.conversaItem}
      onPress={() => setConversaSelecionada(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.conversaAvatar}>
        <IconSymbol
          name={item.tipo === 'geral' ? 'person.3.fill' : 'person.fill'}
          size={24}
          color={AdminLTETheme.colors.white}
        />
      </View>
      <View style={styles.conversaInfo}>
        <View style={styles.conversaHeader}>
          <Text style={styles.conversaNome}>{item.nome}</Text>
          <Text style={styles.conversaHora}>{item.hora}</Text>
        </View>
        <View style={styles.conversaFooter}>
          <Text style={styles.conversaMensagem} numberOfLines={1}>
            {item.ultimaMensagem}
          </Text>
          {item.naoLidas > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.naoLidas}</Text>
            </View>
          )}
        </View>
      </View>
      {item.fixada && (
        <IconSymbol name="pin.fill" size={16} color={AdminLTETheme.colors.warning} />
      )}
    </TouchableOpacity>
  );

  const conversaAtual = mockConversas.find(c => c.id === conversaSelecionada);

  if (conversaSelecionada && conversaAtual) {
    return (
      <AppLayout>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setConversaSelecionada(null)}>
              <IconSymbol name="chevron.left" size={24} color={AdminLTETheme.colors.dark} />
            </TouchableOpacity>
            <Text style={styles.chatHeaderTitle}>{conversaAtual.nome}</Text>
            <TouchableOpacity>
              <IconSymbol name="ellipsis" size={24} color={AdminLTETheme.colors.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.mensagensContainer} contentContainerStyle={styles.mensagensContent}>
            <Card style={styles.mensagemCard}>
              <Text style={styles.mensagemTexto}>{conversaAtual.ultimaMensagem}</Text>
              <Text style={styles.mensagemHora}>{conversaAtual.hora}</Text>
            </Card>
          </ScrollView>

          <View style={styles.inputContainer}>
            <Input
              value={mensagem}
              onChangeText={setMensagem}
              placeholder="Digite sua mensagem..."
              style={styles.input}
            />
            <TouchableOpacity style={styles.sendButton}>
              <IconSymbol name="paperplane.fill" size={20} color={AdminLTETheme.colors.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Chat</Text>

        <Card title="Respostas Rápidas">
          <View style={styles.respostasContainer}>
            <TouchableOpacity style={styles.respostaChip}>
              <Text style={styles.respostaText}>Chegando em 5 minutos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.respostaChip}>
              <Text style={styles.respostaText}>Já estamos aí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.respostaChip}>
              <Text style={styles.respostaText}>Mãe, Chegou!</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <FlatList
          data={mockConversas}
          renderItem={renderConversa}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <Card>
              <Text style={styles.emptyText}>Nenhuma conversa encontrada</Text>
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
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.lg,
    letterSpacing: 0.5,
  },
  respostasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.sm,
  },
  respostaChip: {
    paddingHorizontal: AdminLTETheme.spacing.md,
    paddingVertical: AdminLTETheme.spacing.sm,
    backgroundColor: AdminLTETheme.colors.light,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  respostaText: {
    fontSize: 12,
    color: AdminLTETheme.colors.dark,
  },
  conversaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.white,
    borderRadius: AdminLTETheme.borderRadius.md,
    marginBottom: AdminLTETheme.spacing.sm,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  conversaAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AdminLTETheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AdminLTETheme.spacing.md,
  },
  conversaInfo: {
    flex: 1,
  },
  conversaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AdminLTETheme.spacing.xs,
  },
  conversaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
  },
  conversaHora: {
    fontSize: 12,
    color: AdminLTETheme.colors.secondary,
  },
  conversaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversaMensagem: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
    flex: 1,
  },
  badge: {
    backgroundColor: AdminLTETheme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: AdminLTETheme.spacing.xs,
  },
  badgeText: {
    color: AdminLTETheme.colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
  },
  mensagensContainer: {
    flex: 1,
    padding: AdminLTETheme.spacing.md,
  },
  mensagensContent: {
    paddingBottom: AdminLTETheme.spacing.md,
  },
  mensagemCard: {
    marginBottom: AdminLTETheme.spacing.sm,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  mensagemTexto: {
    fontSize: 14,
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  mensagemHora: {
    fontSize: 10,
    color: AdminLTETheme.colors.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: AdminLTETheme.spacing.md,
    backgroundColor: AdminLTETheme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: AdminLTETheme.spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AdminLTETheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: AdminLTETheme.colors.secondary,
    fontSize: 16,
    padding: AdminLTETheme.spacing.lg,
  },
});

