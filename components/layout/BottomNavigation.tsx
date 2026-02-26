import { IconSymbol } from '@/components/ui/icon-symbol';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { Permissions } from '@/types/user';
import { usePathname, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BottomNavItem {
  label: string;
  route: string;
  icon: string;
  requiresPermission?: keyof typeof Permissions.admin;
}

interface BottomNavigationProps {}

const allBottomNavItems: BottomNavItem[] = [
  { label: 'Home', route: '/', icon: 'house.fill' },
  { label: 'Alunos', route: '/alunos', icon: 'person.2.fill' },
  { label: 'Financeiro', route: '/financeiro', icon: 'dollarsign.circle.fill' },
  { label: 'Rotas', route: '/rotas', icon: 'location.fill' },
  { label: 'Perfil', route: '/perfil', icon: 'person.fill' },
  { label: 'Localização', route: '/localizacao', icon: 'map.fill' },
  { label: 'Contratos', route: '/contratos', icon: 'doc.text.fill' },
  { label: 'Pagamentos', route: '/pagamentos', icon: 'dollarsign.circle.fill' },
  { label: 'Notificações', route: '/notificacoes', icon: 'bell.fill' },
  { label: 'Chat', route: '/chat', icon: 'message.fill' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // Filtrar itens baseado nas permissões do usuário
  const bottomNavItems = useMemo(() => {
    if (!user) return [];
    
    // Para responsável, mostrar Dashboard, Localização, Contratos, Pagamentos e Perfil (máximo 5 itens)
    if (user.role === 'responsavel') {
      const responsavelRoutes = ['/', '/localizacao', '/contratos', '/pagamentos', '/perfil'];
      return allBottomNavItems.filter(item => responsavelRoutes.includes(item.route));
    }
    
    // Para motorista, mostrar Dashboard, Alunos, Financeiro, Rotas e Perfil
    if (user.role === 'motorista') {
      return allBottomNavItems.filter(item => {
        return item.route === '/' || 
               item.route === '/alunos' || 
               item.route === '/financeiro' || 
               item.route === '/rotas' || 
               item.route === '/perfil';
      });
    }
    
    return allBottomNavItems.filter(item => {
      if (!item.requiresPermission) return true;
      const permission = item.requiresPermission as keyof typeof Permissions.admin;
      return Permissions[user.role]?.[permission] ?? false;
    });
  }, [user]);

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname === route || pathname?.includes(route);
  };

  const handlePress = (item: BottomNavItem) => {
    if (item.route) {
      if (item.route === '/') {
        router.replace('/');
      } else {
        router.push(item.route as any);
      }
    }
  };

  return (
    <View style={styles.container}>
      {bottomNavItems.map((item, index) => {
        const active = isActive(item.route);

        return (
          <TouchableOpacity
            key={index}
            style={[styles.item, active && styles.itemActive]}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
              <IconSymbol
                name={item.icon as any}
                size={24}
                color={
                  active
                    ? AdminLTETheme.colors.white
                    : AdminLTETheme.colors.secondary
                }
              />
            </View>
            <Text
              style={[
                styles.label,
                active && styles.labelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AdminLTETheme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 12,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  itemActive: {
    // Estilo adicional quando ativo
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: AdminLTETheme.colors.primary,
    transform: [{ scale: 1.05 }],
  },
  label: {
    fontSize: 11,
    color: AdminLTETheme.colors.secondary,
    fontWeight: '500',
    marginTop: 2,
  },
  labelActive: {
    color: AdminLTETheme.colors.primary,
    fontWeight: '700',
  },
});

