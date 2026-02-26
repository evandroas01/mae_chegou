import { IconSymbol } from '@/components/ui/icon-symbol';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  category?: string;
}

interface ExpandedMenuProps {
  visible: boolean;
  onClose: () => void;
}

// Menu padrão para admin
const adminMenuItems: MenuItem[] = [
  { label: 'Dashboard', route: '/', icon: 'house.fill', category: 'Principal' },
  { label: 'Alunos', route: '/alunos', icon: 'person.2.fill', category: 'Principal' },
  { label: 'Cadastrar Aluno', route: '/cadastro-aluno', icon: 'person.badge.plus.fill', category: 'Cadastros' },
  { label: 'Relatórios', route: '/relatorios', icon: 'doc.text.fill', category: 'Relatórios' },
  { label: 'Configurações', route: '/', icon: 'gearshape.fill', category: 'Configurações' },
  { label: 'Perfil', route: '/perfil', icon: 'person.fill', category: 'Configurações' },
  { label: 'Notificações', route: '/notificacoes', icon: 'bell.fill', category: 'Configurações' },
  { label: 'Ajuda', route: '/', icon: 'questionmark.circle.fill', category: 'Ajuda' },
];

// Menu para motorista
const motoristaMenuItems: MenuItem[] = [
  { label: 'Dashboard', route: '/', icon: 'house.fill', category: 'Principal' },
  { label: 'Alunos', route: '/alunos', icon: 'person.2.fill', category: 'Principal' },
  { label: 'Financeiro', route: '/financeiro', icon: 'dollarsign.circle.fill', category: 'Principal' },
  { label: 'Contratos', route: '/contratos', icon: 'doc.text.fill', category: 'Principal' },
  { label: 'Notificações', route: '/notificacoes', icon: 'bell.fill', category: 'Principal' },
  { label: 'Manutenção', route: '/manutencao', icon: 'wrench.and.screwdriver.fill', category: 'Gestão' },
  { label: 'Rotas', route: '/rotas', icon: 'location.fill', category: 'Gestão' },
  { label: 'Relatórios', route: '/relatorios', icon: 'chart.bar.fill', category: 'Relatórios' },
  { label: 'Meu Perfil', route: '/perfil', icon: 'person.fill', category: 'Configurações' },
];

// Menu para responsável
const responsavelMenuItems: MenuItem[] = [
  { label: 'Dashboard', route: '/', icon: 'house.fill', category: 'Principal' },
  { label: 'Localização', route: '/localizacao', icon: 'map.fill', category: 'Principal' },
  { label: 'Contratos', route: '/contratos', icon: 'doc.text.fill', category: 'Principal' },
  { label: 'Pagamentos', route: '/pagamentos', icon: 'dollarsign.circle.fill', category: 'Principal' },
  { label: 'Notificações', route: '/notificacoes', icon: 'bell.fill', category: 'Principal' },
  { label: 'Perfil', route: '/perfil', icon: 'person.fill', category: 'Configurações' },
];

export const ExpandedMenu: React.FC<ExpandedMenuProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // Selecionar menu baseado no role
  const getMenuItems = (): MenuItem[] => {
    if (!user) return adminMenuItems;
    switch (user.role) {
      case 'motorista':
        return motoristaMenuItems;
      case 'responsavel':
        return responsavelMenuItems;
      default:
        return adminMenuItems;
    }
  };

  const menuItems = getMenuItems();
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

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
    onClose();
  };

  const categories = Array.from(new Set(menuItems.map((item) => item.category || 'Outros')));

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.overlayAnimated,
              {
                opacity: opacityAnim,
              },
            ]}
          />
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.menu,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.menuHeader}>
              <View style={styles.menuHeaderContent}>
                <Text style={styles.menuTitle}>Menu</Text>
                <Text style={styles.menuSubtitle}>Mãe, Chegou!</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <IconSymbol name="xmark" size={24} color={AdminLTETheme.colors.white} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {menuItems
                  .filter((item) => (item.category || 'Outros') === category)
                  .map((item, index) => {
                    const active = isActive(item.route);
                    return (
                      <TouchableOpacity
                        key={`${category}-${index}`}
                        style={[styles.menuItem, active && styles.menuItemActive]}
                        onPress={() => handleNavigate(item.route)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.menuItemIcon, active && styles.menuItemIconActive]}>
                          <IconSymbol
                            name={item.icon as any}
                            size={22}
                            color={active ? AdminLTETheme.colors.white : AdminLTETheme.colors.primary}
                          />
                        </View>
                        <Text
                          style={[
                            styles.menuItemText,
                            active && styles.menuItemTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {active && (
                          <IconSymbol
                            name="chevron.right"
                            size={16}
                            color={AdminLTETheme.colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    zIndex: 999,
  },
  overlayAnimated: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '85%',
    maxWidth: 320,
    backgroundColor: AdminLTETheme.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 1000,
  },
  safeArea: {
    backgroundColor: AdminLTETheme.colors.primary,
  },
  menuHeader: {
    backgroundColor: AdminLTETheme.colors.primary,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuHeaderContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AdminLTETheme.colors.white,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
    marginLeft: 12,
  },
  menuContent: {
    flex: 1,
  },
  categorySection: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: AdminLTETheme.colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: '#E8F4FD',
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemIconActive: {
    backgroundColor: AdminLTETheme.colors.primary,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: AdminLTETheme.colors.dark,
    fontWeight: '500',
  },
  menuItemTextActive: {
    color: AdminLTETheme.colors.primary,
    fontWeight: '700',
  },
});

