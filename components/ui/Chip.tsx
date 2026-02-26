import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { AdminLTETheme } from '@/constants/adminlte-theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({ 
  label, 
  selected = false, 
  onPress,
  variant = 'default',
  style 
}) => {
  const getVariantColor = () => {
    if (selected) {
      switch (variant) {
        case 'primary':
          return AdminLTETheme.colors.primary;
        case 'success':
          return AdminLTETheme.colors.success;
        case 'danger':
          return AdminLTETheme.colors.danger;
        case 'warning':
          return AdminLTETheme.colors.warning;
        default:
          return AdminLTETheme.colors.primary;
      }
    }
    return '#e9ecef';
  };

  const chipContainerStyle = [
    styles.chip,
    {
      backgroundColor: getVariantColor(),
      borderColor: selected ? getVariantColor() : '#dee2e6',
    },
    style,
  ];

  const chipTextStyle = [
    styles.chipText,
    { color: selected ? AdminLTETheme.colors.white : AdminLTETheme.colors.dark },
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={chipContainerStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={chipTextStyle}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={chipContainerStyle}>
      <Text style={chipTextStyle}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: AdminLTETheme.spacing.md,
    paddingVertical: AdminLTETheme.spacing.xs,
    borderRadius: AdminLTETheme.borderRadius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginRight: AdminLTETheme.spacing.xs,
    marginBottom: AdminLTETheme.spacing.xs,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

