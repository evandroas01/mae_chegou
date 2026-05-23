# Diagrama C4 — Contexto (Nível 1) — cheguei_mae

> Gerado pelo **Arquiteto** do Reversa em 2026-05-18

---

## Diagrama

```mermaid
C4Context
    title Mãe, Chegou! — System Context Diagram

    Enterprise_Boundary(b0, "Transporte Escolar") {

        Person(motorista, "Motorista", "Profissional de transporte escolar. Gerencia alunos, rotas, veículos, finanças e contratos.")
        Person(responsavel, "Responsável", "Pai, mãe ou tutor legal. Acompanha localização do veículo, recebe notificações, assina contratos.")
        Person(admin, "Administrador", "Acesso total ao tenant. Pode criar, editar e deletar todos os recursos.")
        Person(aluno, "Aluno", "Estudante transportado. Role existente no sistema mas sem telas dedicadas.")

        System(maechegou, "Mãe, Chegou!", "Sistema de gestão de transporte escolar. App mobile React Native + API REST Express + MySQL.")
    }

    System_Ext(maps, "Google Maps / Apple Maps", "Plataforma de mapas para renderização de rotas e marcadores.")
    System_Ext(gps, "GPS do Dispositivo", "Sensor de localização do smartphone via Expo Location.")
    System_Ext(mysql, "MySQL 8.0", "SGBD relacional hospedado em container Docker.")

    Rel(motorista, maechegou, "Gerencia alunos, rotas, finanças", "Mobile App")
    Rel(responsavel, maechegou, "Acompanha localização, recebe notificações", "Mobile App")
    Rel(admin, maechegou, "Administra o sistema", "Mobile App / Web")
    Rel_Back(maechegou, maps, "Renderiza mapas", "SDK nativo")
    Rel_Back(maechegou, gps, "Obtém coordenadas", "Expo Location API")
    Rel(maechegou, mysql, "CRUD de dados", "mysql2, TCP:3306")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## Atores e Responsabilidades

| Ator | Ações Principais | Canal |
|------|------------------|-------|
| **Motorista** | Cadastrar alunos, criar rotas, registrar finanças, enviar notificações, gerenciar veículos e manutenções | App Mobile (React Native) |
| **Responsável** | Visualizar dados dos filhos, rastrear motorista em tempo real, receber notificações, assinar contratos | App Mobile (React Native) |
| **Admin** | Acesso total: criar/editar/deletar qualquer recurso do tenant | App Mobile / Web |
| **Aluno** | 🔴 Sem funcionalidades implementadas | — |

## Sistemas Externos

| Sistema | Tipo de Integração | Status |
|---------|-------------------|--------|
| Google Maps / Apple Maps | SDK nativo via `react-native-maps` | 🟢 Implementado |
| GPS do Dispositivo | `expo-location` (permissão `ACCESS_FINE_LOCATION`) | 🟢 Implementado |
| MySQL 8.0 | Driver `mysql2` via TCP (porta 3306) | 🟢 Implementado |
| Gateway de Pagamento | 🔴 Não implementado | Planejado (PIX, boleto) |
| Push Notifications | 🔴 Não implementado | Planejado |
