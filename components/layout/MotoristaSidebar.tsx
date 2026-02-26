import { IconSymbol } from '@/components/ui/icon-symbol';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

// Menu para motorista: funcionalidades permitidas
const menuItems: MenuItem[] = [
  { label: 'Dashboard', route: '/', icon: 'house.fill' },
  { label: 'Alunos', route: '/alunos', icon: 'person.2.fill' },
  { label: 'Financeiro', route: '/financeiro', icon: 'dollarsign.circle.fill' },
  { label: 'Contratos', route: '/contratos', icon: 'doc.text.fill' },
  { label: 'Manutenção', route: '/manutencao', icon: 'wrench.and.screwdriver.fill' },
  { label: 'Rotas', route: '/rotas', icon: 'location.fill' },
  { label: 'Relatórios', route: '/relatorios', icon: 'chart.bar.fill' },
  { label: 'Meu Perfil', route: '/perfil', icon: 'person.fill' },
];

interface MotoristaSidebarProps {
  onNavigate?: () => void;
}

export const MotoristaSidebar: React.FC<MotoristaSidebarProps> = ({ onNavigate }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname === route || pathname?.includes(route);
  };

  const handleNavigate = (route: string) => {
    if (route === '/') {
      router.replace('/');
    } else {
      router.push(route as any);
    }
    onNavigate?.();
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>Motorista</Text>
        <Text style={styles.sidebarSubtitle}>Área Restrita</Text>
      </View>
      <ScrollView style={styles.menu}>
        {menuItems.map((item) => {
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, active && styles.menuItemActive]}
              onPress={() => handleNavigate(item.route)}
              activeOpacity={0.7}
            >
              <IconSymbol
                name={item.icon as any}
                size={20}
                color={active ? AdminLTETheme.colors.sidebar.textActive : AdminLTETheme.colors.sidebar.text}
              />
              <Text
                style={[
                  styles.menuItemText,
                  active && styles.menuItemTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: AdminLTETheme.colors.sidebar.bg,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: AdminLTETheme.colors.dark,
  },
  sidebarHeader: {
    paddingHorizontal: AdminLTETheme.spacing.md,
    paddingVertical: AdminLTETheme.spacing.lg,
    backgroundColor: AdminLTETheme.colors.sidebar.hover,
    borderBottomWidth: 2,
    borderBottomColor: AdminLTETheme.colors.dark,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AdminLTETheme.colors.white,
    marginBottom: AdminLTETheme.spacing.xs,
    letterSpacing: 0.3,
  },
  sidebarSubtitle: {
    fontSize: 11,
    color: AdminLTETheme.colors.sidebar.text,
    fontWeight: '400',
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AdminLTETheme.spacing.md,
    paddingHorizontal: AdminLTETheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AdminLTETheme.colors.dark,
  },
  menuItemActive: {
    backgroundColor: AdminLTETheme.colors.sidebar.active,
    borderLeftWidth: 3,
    borderLeftColor: AdminLTETheme.colors.white,
  },
  menuItemText: {
    fontSize: 14,
    color: AdminLTETheme.colors.sidebar.text,
    marginLeft: AdminLTETheme.spacing.sm,
    fontWeight: '500',
  },
  menuItemTextActive: {
    color: AdminLTETheme.colors.sidebar.textActive,
    fontWeight: '700',
  },
});

