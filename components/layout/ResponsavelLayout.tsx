import { AdminLTETheme } from '@/constants/adminlte-theme';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomNavigation } from './BottomNavigation';
import { ExpandedMenu } from './ExpandedMenu';
import { Header } from './Header';
import { ResponsavelSidebar } from './ResponsavelSidebar';

interface ResponsavelLayoutProps {
  children: React.ReactNode;
}

export const ResponsavelLayout: React.FC<ResponsavelLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenuOpen, setExpandedMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const { width } = Dimensions.get('window');
      setIsMobile(width < 768 || Platform.OS === 'android');
    };

    updateDimensions();
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    
    return () => subscription?.remove();
  }, []);

  const handleMenuPress = () => {
    if (isMobile) {
      setExpandedMenuOpen(true);
    } else {
      setSidebarOpen(true);
    }
  };
  const handleCloseExpandedMenu = () => setExpandedMenuOpen(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header onMenuPress={isMobile ? handleMenuPress : undefined} />
        <View style={styles.contentContainer}>
          {!isMobile && (
            <View style={styles.sidebarContainer}>
              <ResponsavelSidebar />
            </View>
          )}
          {isMobile && (
            <>
              <Modal
                visible={sidebarOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSidebarOpen(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.mobileSidebar}>
                    <ResponsavelSidebar onNavigate={() => setSidebarOpen(false)} />
                  </View>
                  <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSidebarOpen(false)}
                  />
                </View>
              </Modal>
              <ExpandedMenu visible={expandedMenuOpen} onClose={handleCloseExpandedMenu} />
            </>
          )}
          <View style={[styles.mainContent, isMobile && styles.mainContentMobile]}>
            {children}
          </View>
        </View>
        {isMobile && (
          <BottomNavigation />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AdminLTETheme.colors.light,
  },
  container: {
    flex: 1,
    backgroundColor: AdminLTETheme.colors.light,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    // Sidebar visible on desktop
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mobileSidebar: {
    width: 200,
    height: '100%',
  },
  mainContent: {
    flex: 1,
    padding: AdminLTETheme.spacing.xl,
    maxWidth: 1600,
    width: '100%',
    alignSelf: 'center',
  },
  mainContentMobile: {
    paddingBottom: 80, // Espaço para o bottom navigation
  },
});

