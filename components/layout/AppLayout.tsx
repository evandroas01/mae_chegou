import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from './AdminLayout';
import { MotoristaLayout } from './MotoristaLayout';
import { ResponsavelLayout } from './ResponsavelLayout';
import { AlunoLayout } from './AlunoLayout';
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Componente que escolhe o layout correto baseado no tipo de usuário
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Mostrar loading enquanto carrega ou se não houver usuário
  if (isLoading || !user) {
    return null; // Será redirecionado para login pelo _layout.tsx
  }

  switch (user.role) {
    case 'admin':
      return <AdminLayout>{children}</AdminLayout>;
    case 'motorista':
      return <MotoristaLayout>{children}</MotoristaLayout>;
    case 'responsavel':
      return <ResponsavelLayout>{children}</ResponsavelLayout>;
    case 'aluno':
      return <AlunoLayout>{children}</AlunoLayout>;
    default:
      return <AdminLayout>{children}</AdminLayout>;
  }
};

