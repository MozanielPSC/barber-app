# Barber App - Visão Geral

## Descrição do Sistema

O Barber App é um sistema completo de gestão para barbearias que permite:

- **Gestão de Clientes**: Cadastro, histórico e acompanhamento de clientes
- **Agendamento**: Sistema completo de agendamentos com disponibilidade de colaboradores
- **Atendimentos**: Registro de serviços e produtos vendidos
- **Comissões**: Cálculo automático de comissões para colaboradores
- **Estoque**: Controle de produtos e movimentações
- **Financeiro**: Gestão de receitas, despesas e metas
- **Colaboradores**: Gestão de equipe com sistema de permissões
- **Dashboard**: KPIs e métricas em tempo real

## Arquitetura Geral

### Stack Tecnológico
- **Frontend**: Vue 3 + Nuxt 4
- **Estado**: Pinia (gerenciamento de estado)
- **Estilização**: Tailwind CSS
- **UI Components**: Element Plus + Heroicons
- **PWA**: Vite PWA para funcionalidade offline
- **TypeScript**: Tipagem estática completa

### Estrutura de Pastas

```
barber/
├── app.vue                 # Componente raiz
├── nuxt.config.ts         # Configuração do Nuxt
├── tailwind.config.js     # Configuração do Tailwind
├── package.json           # Dependências
├── components/            # Componentes reutilizáveis
│   ├── Navbar.vue
│   ├── Dashboard.vue
│   ├── Clients.vue
│   ├── Services.vue
│   ├── Products.vue
│   └── ...
├── pages/                 # Páginas/rotas da aplicação
│   ├── index.vue         # Dashboard
│   ├── login-colaborador.vue
│   ├── registro.vue
│   ├── agenda/
│   ├── clientes/
│   ├── atendimentos/
│   ├── colaboradores/
│   ├── servicos/
│   ├── produtos/
│   ├── comissoes/
│   ├── financeiro/
│   ├── configuracoes/
│   └── perfil/
├── stores/                # Stores Pinia
│   ├── auth.ts
│   ├── barbearias.ts
│   ├── clientes.ts
│   ├── colaboradores.ts
│   ├── servicos.ts
│   ├── produtos.ts
│   ├── atendimentos.ts
│   ├── dashboard.ts
│   ├── comissoes.ts
│   ├── financeiro.ts
│   ├── estoque.ts
│   ├── gastos.ts
│   └── app.ts
├── composables/           # Composables Vue
│   ├── useApi.ts
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   └── useBarbeariaWatch.ts
├── types/                 # Definições TypeScript
│   └── index.ts
├── utils/                 # Funções utilitárias
│   └── index.ts
├── middleware/            # Middleware de autenticação
│   └── auth.global.ts
├── layouts/               # Layouts da aplicação
│   └── default.vue
└── plugins/               # Plugins do Nuxt
    ├── auth-init.client.ts
    └── axios.client.ts
```

## Conceitos Principais

### 1. Tipos de Usuário

#### Proprietário
- Acesso total ao sistema
- Pode gerenciar múltiplas barbearias
- Define permissões para colaboradores
- Acessa relatórios financeiros completos

#### Colaborador
- Acesso limitado por permissões
- Vinculado a uma barbearia específica
- Pode visualizar suas próprias comissões
- Acesso baseado em permissões granulares

### 2. Barbearia
- Entidade central do sistema
- Cada usuário proprietário pode ter múltiplas barbearias
- Colaboradores são vinculados a uma barbearia específica
- Todos os dados são filtrados por barbearia selecionada

### 3. Sistema de Permissões (RBAC)
- **Recursos**: clientes, colaboradores, servicos, produtos, agenda, atendimentos, comissoes, financeiro, estoque, configuracoes
- **Ações**: visualizar, criar, editar, excluir
- Permissões são atribuídas por colaborador e recurso

## Fluxo de Autenticação

### 1. Login de Proprietário
```
POST /auth/login
{
  "email": "proprietario@email.com",
  "senha": "senha123"
}
```

### 2. Login de Colaborador
```
POST /auth/login/colaborador
{
  "email": "colaborador@email.com",
  "senha": "senha123",
  "codigo_barbearia": "BARB001"
}
```

### 3. Resposta de Autenticação
```json
{
  "user": {
    "id": "uuid",
    "email": "email@example.com",
    "tipo": "proprietario" | "colaborador",
    "nome_barbearia": "Nome da Barbearia",
    "barbearia_id": "uuid",
    "foto_perfil_url_assinada": "https://s3...",
    // ... outros campos
  },
  "token": "jwt_token",
  "permissoes": [
    {
      "recurso": "clientes",
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": false,
      "pode_excluir": false
    }
  ]
}
```

### 4. Gestão de Estado de Autenticação
- Token armazenado em `localStorage` como `barber_token`
- Dados do usuário em `localStorage` como `barber_user`
- Permissões em `localStorage` como `barber_permissions`
- Refresh automático de dados do usuário via `/auth/me`

## Configuração da API

### Base URL
- Configurada via variável de ambiente `API_BASE_URL`
- Exemplo: `https://api.barber.com`

### Headers Padrão
```javascript
{
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}'
}
```

### Tratamento de Erros
- 401: Redirecionamento automático para login
- Limpeza de dados de autenticação em caso de token inválido
- Notificações de erro via store `app.ts`

## Funcionalidades Principais

### Dashboard
- KPIs em tempo real (serviços, produtos, comissões)
- Gráficos de performance
- Metas diárias/semanais/mensais
- Alertas importantes

### Gestão de Clientes
- CRUD completo de clientes
- Histórico de atendimentos
- Sistema de indicações
- Análise de risco de churn

### Sistema de Agendamento
- Calendário visual com disponibilidade
- Agendamento por colaborador
- Estados: agendado, confirmado, em andamento, concluído, cancelado
- Gestão de conflitos de horário

### Atendimentos
- Registro de serviços realizados
- Venda de produtos
- Cálculo automático de comissões
- Histórico completo

### Sistema de Comissões
- Comissão por executor de serviço
- Comissão por assistente
- Comissão por indicação
- Comissão por venda de produtos
- Sistema de débitos
- Cálculo de saldo líquido

### Controle de Estoque
- Gestão de prateleiras
- Movimentações (entrada, saída, transferência, ajuste)
- Alertas de estoque baixo
- Controle de lotes e validade

### Financeiro
- Gestão de receitas e despesas
- Controle de cadeiras
- Análise de canais de aquisição
- Metas financeiras

## Considerações para Mobile

### Adaptações Necessárias
1. **Navegação**: Implementar navegação por tabs/bottom navigation
2. **Formulários**: Adaptar para telas menores com scroll
3. **Calendário**: Usar componente nativo de calendário
4. **Upload de Fotos**: Integrar com câmera/galeria
5. **Notificações**: Push notifications para lembretes
6. **Offline**: Cache de dados críticos
7. **Performance**: Lazy loading e paginação

### Bibliotecas Recomendadas
- **Navegação**: React Navigation
- **Estado**: Redux Toolkit ou Zustand
- **UI**: React Native Paper ou NativeBase
- **Formulários**: React Hook Form
- **Calendário**: react-native-calendars
- **Imagens**: expo-image-picker
- **Requisições**: Axios ou TanStack Query
- **Storage**: AsyncStorage
- **Notificações**: Expo Notifications
