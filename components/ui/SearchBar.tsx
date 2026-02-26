import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { IconSymbol } from './icon-symbol';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={AdminLTETheme.colors.secondary} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <IconSymbol name="xmark.circle.fill" size={18} color={AdminLTETheme.colors.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AdminLTETheme.colors.white,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: AdminLTETheme.borderRadius.md,
    paddingHorizontal: AdminLTETheme.spacing.md,
    paddingVertical: AdminLTETheme.spacing.sm,
  },
  input: {
    flex: 1,
    marginLeft: AdminLTETheme.spacing.sm,
    fontSize: 16,
    color: AdminLTETheme.colors.dark,
  },
  clearButton: {
    padding: AdminLTETheme.spacing.xs,
  },
});

