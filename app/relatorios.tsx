import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

type TipoRelatorio = 'financeiro' | 'alunos' | 'manutencoes';

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('financeiro');
  const [periodo, setPeriodo] = useState<'30dias' | 'trimestre' | 'ano'>('30dias');

  const handleExportarPDF = () => {
    Alert.alert('Sucesso', 'Relatório exportado com sucesso!');
  };

  return (
    <AppLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Relatórios</Text>

        <Card title="Tipo de Relatório">
          <View style={styles.chipsRow}>
            <Chip
              label="Financeiro"
              selected={tipoRelatorio === 'financeiro'}
              onPress={() => setTipoRelatorio('financeiro')}
              variant="primary"
            />
            <Chip
              label="Alunos"
              selected={tipoRelatorio === 'alunos'}
              onPress={() => setTipoRelatorio('alunos')}
              variant="primary"
            />
            <Chip
              label="Manutenções"
              selected={tipoRelatorio === 'manutencoes'}
              onPress={() => setTipoRelatorio('manutencoes')}
              variant="primary"
            />
          </View>
        </Card>

        <Card title="Período">
          <View style={styles.chipsRow}>
            <Chip
              label="Últimos 30 dias"
              selected={periodo === '30dias'}
              onPress={() => setPeriodo('30dias')}
              variant="primary"
            />
            <Chip
              label="Trimestre"
              selected={periodo === 'trimestre'}
              onPress={() => setPeriodo('trimestre')}
              variant="primary"
            />
            <Chip
              label="Ano"
              selected={periodo === 'ano'}
              onPress={() => setPeriodo('ano')}
              variant="primary"
            />
          </View>
        </Card>

        <Card title="Resumo do Relatório">
          <View style={styles.resumoItem}>
            <Text style={styles.resumoLabel}>Total de Receitas:</Text>
            <Text style={styles.resumoValue}>R$ 5.000,00</Text>
          </View>
          <View style={styles.resumoItem}>
            <Text style={styles.resumoLabel}>Total de Despesas:</Text>
            <Text style={styles.resumoValue}>R$ 2.500,00</Text>
          </View>
          <View style={styles.resumoItem}>
            <Text style={styles.resumoLabel}>Saldo:</Text>
            <Text style={[styles.resumoValue, styles.resumoSaldo]}>R$ 2.500,00</Text>
          </View>
        </Card>

        <View style={styles.actionsContainer}>
          <Button
            title="Exportar PDF"
            onPress={handleExportarPDF}
            variant="primary"
            style={styles.exportButton}
          />
          <Button
            title="Exportar CSV"
            onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve')}
            variant="secondary"
            style={styles.exportButton}
          />
        </View>
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AdminLTETheme.spacing.sm,
  },
  resumoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: AdminLTETheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  resumoLabel: {
    fontSize: 14,
    color: AdminLTETheme.colors.secondary,
  },
  resumoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
  },
  resumoSaldo: {
    color: AdminLTETheme.colors.success,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: AdminLTETheme.spacing.md,
    marginTop: AdminLTETheme.spacing.lg,
  },
  exportButton: {
    flex: 1,
  },
});

