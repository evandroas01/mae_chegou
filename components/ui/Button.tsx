import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { AdminLTETheme } from '@/constants/adminlte-theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const getButtonColor = () => {
    switch (variant) {
      case 'secondary':
        return AdminLTETheme.colors.secondary;
      case 'success':
        return AdminLTETheme.colors.success;
      case 'danger':
        return AdminLTETheme.colors.danger;
      default:
        return AdminLTETheme.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getButtonColor() },
        (disabled || loading) && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: AdminLTETheme.spacing.md,
    paddingHorizontal: AdminLTETheme.spacing.lg,
    borderRadius: AdminLTETheme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: AdminLTETheme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

