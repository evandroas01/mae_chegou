import { IconSymbol } from '@/components/ui/icon-symbol';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const { user, logout } = useAuth();
  const router = useRouter();

  // No Android, sempre mostrar o botão se onMenuPress for fornecido
  const showMenuButton = onMenuPress !== undefined;

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.header}>
      {showMenuButton && (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <IconSymbol name="line.3.horizontal" size={24} color={AdminLTETheme.colors.white} />
        </TouchableOpacity>
      )}
      <View style={styles.headerContent}>
        <Image
          source={require('@/assets/images/logotipo.jpg')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.headerTitle}>Mãe, Chegou!</Text>
      </View>
      {user && (
        <View style={styles.headerRight}>
          <Text style={styles.userName}>{user.nome}</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={AdminLTETheme.colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    backgroundColor: AdminLTETheme.colors.header.bg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AdminLTETheme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: AdminLTETheme.colors.header.bg,
  },
  menuButton: {
    marginRight: AdminLTETheme.spacing.lg,
    padding: AdminLTETheme.spacing.xs,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: AdminLTETheme.spacing.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: AdminLTETheme.colors.header.text,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: AdminLTETheme.spacing.md,
  },
  userName: {
    fontSize: 14,
    color: AdminLTETheme.colors.white,
    marginRight: AdminLTETheme.spacing.sm,
    fontWeight: '500',
  },
  logoutButton: {
    padding: AdminLTETheme.spacing.xs,
  },
});

