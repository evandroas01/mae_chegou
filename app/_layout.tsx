import { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { CustomSplash } from '@/components/SplashScreen';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { StatusOnlineProvider } from '@/contexts/StatusOnlineContext';
import { useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';

// Manter o splash screen visível até que o app esteja pronto
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirecionar para login se não estiver autenticado
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirecionar para home se estiver autenticado e na tela de login
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="index" />
        <Stack.Screen name="alunos" />
        <Stack.Screen name="cadastro-aluno" />
        <Stack.Screen name="aluno-detalhe/[id]" />
        <Stack.Screen name="financeiro" />
        <Stack.Screen name="localizacao" />
        <Stack.Screen name="contratos" />
        <Stack.Screen name="manutencao" />
        <Stack.Screen name="rotas" />
        <Stack.Screen name="notificacoes" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="relatorios" />
        <Stack.Screen name="pagamentos" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    // Preparar recursos
    const prepare = async () => {
      try {
        // Aqui você pode carregar fontes, fazer chamadas de API, etc.
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      }
    };

    prepare();
  }, []);

  const handleSplashFinish = () => {
    setIsSplashReady(true);
  };

  if (!isSplashReady) {
    return <CustomSplash onFinish={handleSplashFinish} />;
  }

  return (
    <AuthProvider>
      <StatusOnlineProvider>
      <RootLayoutNav />
      </StatusOnlineProvider>
    </AuthProvider>
  );
}
