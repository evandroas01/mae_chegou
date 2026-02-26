import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AdminLTETheme } from '@/constants/adminlte-theme';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ title, children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {title && (
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      )}
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AdminLTETheme.colors.white,
    borderRadius: AdminLTETheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: AdminLTETheme.spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: AdminLTETheme.spacing.lg,
    paddingVertical: AdminLTETheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    letterSpacing: 0.3,
  },
  cardBody: {
    padding: AdminLTETheme.spacing.lg,
  },
});

