import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { AdminLTETheme } from '@/constants/adminlte-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      router.replace('/');
    } else {
      Alert.alert('Erro', 'Email ou senha incorretos');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logotipo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Sistema de Gestão de Transporte Escolar</Text>
        </View>

        <Card style={styles.loginCard}>
          <Text style={styles.loginTitle}>Entrar</Text>
          
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.button}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AdminLTETheme.colors.light,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: AdminLTETheme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: AdminLTETheme.spacing.xl,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: AdminLTETheme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: AdminLTETheme.colors.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginCard: {
    padding: AdminLTETheme.spacing.xl,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: AdminLTETheme.colors.dark,
    marginBottom: AdminLTETheme.spacing.lg,
    textAlign: 'center',
  },
  input: {
    marginBottom: AdminLTETheme.spacing.md,
  },
  button: {
    marginTop: AdminLTETheme.spacing.md,
  },
});

