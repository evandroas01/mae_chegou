import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { AdminLTETheme } from '@/constants/adminlte-theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: AdminLTETheme.borderRadius.md,
    paddingHorizontal: AdminLTETheme.spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: AdminLTETheme.colors.white,
    color: AdminLTETheme.colors.dark,
    minHeight: 44,
  },
  inputError: {
    borderColor: AdminLTETheme.colors.danger,
    borderWidth: 2,
  },
  errorText: {
    color: AdminLTETheme.colors.danger,
    fontSize: 12,
    marginTop: AdminLTETheme.spacing.xs,
    fontWeight: '500',
  },
});

