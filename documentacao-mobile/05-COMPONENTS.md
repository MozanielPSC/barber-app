# Barber App - Componentes Reutilizáveis

## Visão Geral

O Barber App utiliza uma arquitetura de componentes bem estruturada, com componentes reutilizáveis que seguem padrões consistentes de design e funcionalidade. Todos os componentes são desenvolvidos em Vue 3 com Composition API e TypeScript.

## Estrutura de Componentes

### Pasta de Componentes
```
components/
├── Navbar.vue              # Navegação principal
├── Dashboard.vue           # Dashboard principal
├── Clients.vue             # Lista de clientes
├── Services.vue            # Lista de serviços
├── Products.vue            # Lista de produtos
├── Visits.vue              # Lista de atendimentos
├── VisitsList.vue          # Lista detalhada de atendimentos
├── ColaboradoresList.vue   # Lista de colaboradores
├── ServicesList.vue        # Lista detalhada de serviços
├── ProductsList.vue        # Lista detalhada de produtos
├── AgendaGrid.vue          # Grid de agendamentos
├── CardColaborador.vue     # Card de colaborador
├── FormColaborador.vue     # Formulário de colaborador
├── SelectBarbearia.vue     # Seletor de barbearia
├── SelectColaborador.vue   # Seletor de colaborador
├── AudioRecorder.vue       # Gravador de áudio
├── PerfilPhotoUpload.vue   # Upload de foto de perfil
├── AcessoNegado.vue        # Página de acesso negado
├── Auth.vue                # Componente de autenticação
├── BarbeariasList.vue      # Lista de barbearias
├── Finance.vue             # Componente financeiro
└── Settings.vue            # Componente de configurações
```

## Componentes Principais

### 1. Navbar (`components/Navbar.vue`)

**Responsabilidade**: Navegação principal da aplicação

#### Funcionalidades
- Sidebar responsivo com colapso
- Menu hierárquico com submenus
- Seleção de barbearia (proprietários)
- Informações da barbearia (colaboradores)
- Controle de tema (claro/escuro)
- Navegação por permissões

#### Props
Nenhuma prop específica - utiliza stores globais

#### Estado
- `sidebarOpen`: Controla visibilidade do sidebar
- `sidebarCollapsed`: Controla estado colapsado
- `currentTab`: Aba ativa atual

#### Estrutura do Menu
```typescript
const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    icon: HomeIcon,
    permission: null // Sempre visível
  },
  {
    id: 'agenda',
    label: 'Agenda',
    route: '/agenda',
    icon: CalendarIcon,
    permission: 'agenda.visualizar'
  },
  {
    id: 'clientes',
    label: 'Clientes',
    route: '/clientes',
    icon: UsersIcon,
    permission: 'clientes.visualizar',
    subItems: [
      {
        id: 'clientes-lista',
        label: 'Lista de Clientes',
        route: '/clientes',
        icon: ListBulletIcon
      },
      {
        id: 'clientes-novo',
        label: 'Novo Cliente',
        route: '/clientes/novo',
        icon: PlusIcon
      }
    ]
  }
  // ... outros itens
]
```

#### Características
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Colapsível**: Sidebar pode ser colapsado em desktop
- **Permissões**: Itens do menu baseados em permissões do usuário
- **Submenus**: Suporte a menus hierárquicos
- **Tema**: Suporte a modo claro/escuro

### 2. Dashboard (`components/Dashboard.vue`)

**Responsabilidade**: Dashboard principal com KPIs e métricas

#### Funcionalidades
- Filtros avançados por período e colaborador
- Cards de métricas principais
- Gráficos de performance
- Clientes em risco
- Estatísticas de canais
- Metas e objetivos

#### Filtros Disponíveis
- **Período Rápido**: Hoje, Ontem, Esta Semana, Este Mês
- **Colaborador**: Todos ou colaborador específico
- **Mês**: Seleção de mês específico
- **Ano**: Input numérico para ano

#### Métricas Exibidas
- **Serviços**: Quantidade e valor total
- **Produtos**: Quantidade e valor total
- **Clientes**: Total e novos clientes
- **Comissões**: Valor total de comissões
- **Ticket Médio**: Valor médio por atendimento
- **Taxa de Conversão**: Percentual de conversão

#### Características
- **Filtros Dinâmicos**: Aplicação automática de filtros
- **Gráficos Interativos**: Visualizações de dados
- **Responsivo**: Adapta-se a diferentes telas
- **Tempo Real**: Atualização automática de dados

### 3. SelectBarbearia (`components/SelectBarbearia.vue`)

**Responsabilidade**: Seletor de barbearia para proprietários

#### Funcionalidades
- Dropdown com lista de barbearias
- Seleção visual com ícones
- Informações adicionais (endereço)
- Estado de loading
- Fechamento por overlay ou Escape

#### Props
Nenhuma prop específica - utiliza `useBarbeariasStore`

#### Emits
Nenhum emit específico - atualiza store diretamente

#### Características
- **Dropdown Customizado**: Interface personalizada
- **Busca Visual**: Fácil identificação de barbearias
- **Estado Persistente**: Seleção salva no localStorage
- **Responsivo**: Funciona em diferentes tamanhos

### 4. SelectColaborador (`components/SelectColaborador.vue`)

**Responsabilidade**: Seletor de colaborador reutilizável

#### Props
```typescript
interface Props {
  modelValue: Colaborador | null
  placeholder?: string
  disabled?: boolean
  barbeariaId?: string
}
```

#### Emits
```typescript
interface Emits {
  'update:modelValue': [colaborador: Colaborador | null]
}
```

#### Funcionalidades
- Dropdown com lista de colaboradores
- Filtro por barbearia específica
- Exibição de foto de perfil ou ícone padrão
- Informações do colaborador (nome, função)
- Estado de loading e vazio
- Suporte a v-model

#### Características
- **Reutilizável**: Usado em múltiplas telas
- **Filtrado**: Apenas colaboradores ativos da barbearia
- **Visual**: Fotos de perfil dos colaboradores
- **Acessível**: Suporte a teclado e screen readers

### 5. AgendaGrid (`components/AgendaGrid.vue`)

**Responsabilidade**: Grid de agendamentos com calendário visual

#### Funcionalidades
- Visualização em grid dos agendamentos
- Filtros por data e colaborador
- Estados visuais dos agendamentos
- Criação rápida de agendamentos
- Navegação entre datas
- Informações detalhadas em hover

#### Props
```typescript
interface Props {
  agendamentos: Agendamento[]
  colaboradores: Colaborador[]
  dataSelecionada: string
  colaboradorSelecionado?: string
}
```

#### Emits
```typescript
interface Emits {
  'novo-agendamento': [data: string, horario: string]
  'editar-agendamento': [agendamento: Agendamento]
  'mudar-data': [data: string]
  'mudar-colaborador': [colaboradorId: string]
}
```

#### Características
- **Visual**: Grid intuitivo com cores por status
- **Interativo**: Cliques para ações rápidas
- **Responsivo**: Adapta-se a diferentes telas
- **Filtros**: Múltiplos filtros disponíveis

### 6. CardColaborador (`components/CardColaborador.vue`)

**Responsabilidade**: Card individual de colaborador

#### Props
```typescript
interface Props {
  colaborador: Colaborador
  showActions?: boolean
  compact?: boolean
}
```

#### Emits
```typescript
interface Emits {
  'editar': [colaborador: Colaborador]
  'deletar': [colaborador: Colaborador]
  'visualizar': [colaborador: Colaborador]
}
```

#### Funcionalidades
- Exibição de informações do colaborador
- Foto de perfil ou ícone padrão
- Ações contextuais (editar, deletar, visualizar)
- Estados visuais (ativo/inativo)
- Informações de permissões

#### Características
- **Reutilizável**: Usado em listas e seleções
- **Flexível**: Diferentes tamanhos e ações
- **Visual**: Fotos e indicadores de status
- **Interativo**: Ações contextuais

### 7. FormColaborador (`components/FormColaborador.vue`)

**Responsabilidade**: Formulário completo de colaborador

#### Props
```typescript
interface Props {
  colaborador?: Colaborador
  isEditing?: boolean
  barbeariaId?: string
}
```

#### Emits
```typescript
interface Emits {
  'submit': [dados: ColaboradorForm]
  'cancel': []
  'success': [colaborador: Colaborador]
}
```

#### Funcionalidades
- Formulário completo de colaborador
- Validação de campos obrigatórios
- Criação de usuário (opcional)
- Definição de permissões
- Configuração de disponibilidade
- Upload de foto de perfil

#### Campos do Formulário
- **Dados Básicos**: Nome, função
- **Usuário**: Email, senha (opcional)
- **Permissões**: Por recurso (visualizar, criar, editar, excluir)
- **Disponibilidade**: Dias da semana e horários
- **Serviços**: Associação com serviços

#### Características
- **Completo**: Todos os campos necessários
- **Validação**: Validação client-side e server-side
- **Flexível**: Criação e edição
- **Permissões**: Sistema granular de permissões

### 8. AudioRecorder (`components/AudioRecorder.vue`)

**Responsabilidade**: Gravador de áudio para observações

#### Props
```typescript
interface Props {
  maxDuration?: number
  autoStart?: boolean
  disabled?: boolean
}
```

#### Emits
```typescript
interface Emits {
  'recording-start': []
  'recording-stop': [audioBlob: Blob]
  'recording-error': [error: string]
}
```

#### Funcionalidades
- Gravação de áudio via navegador
- Controle de duração máxima
- Visualização de tempo de gravação
- Playback do áudio gravado
- Controles de play/pause/stop

#### Características
- **Nativo**: Usa Web Audio API
- **Responsivo**: Interface adaptável
- **Acessível**: Controles por teclado
- **Flexível**: Configurável via props

### 9. PerfilPhotoUpload (`components/PerfilPhotoUpload.vue`)

**Responsabilidade**: Upload de foto de perfil com preview

#### Props
```typescript
interface Props {
  currentPhoto?: string
  disabled?: boolean
}
```

#### Emits
```typescript
interface Emits {
  'uploaded': [photoUrl: string]
  'close': []
  'error': [error: string]
}
```

#### Funcionalidades
- Upload de arquivo de imagem
- Preview da imagem selecionada
- Validação de tipo e tamanho
- Upload para S3
- Feedback visual de progresso

#### Validações
- **Tipo**: Apenas imagens (jpg, png, gif)
- **Tamanho**: Máximo 5MB
- **Dimensões**: Mínimo 100x100px

#### Características
- **S3 Integration**: Upload direto para S3
- **Preview**: Visualização antes do upload
- **Validação**: Validação client-side
- **Progresso**: Feedback visual do upload

### 10. AcessoNegado (`components/AcessoNegado.vue`)

**Responsabilidade**: Página de acesso negado

#### Funcionalidades
- Mensagem de acesso negado
- Informações sobre permissões necessárias
- Botão para voltar
- Contato com administrador

#### Características
- **Informativo**: Explica o motivo do acesso negado
- **Ação**: Botão para voltar ou contatar admin
- **Visual**: Design consistente com o app

## Componentes de Lista

### 1. Clients (`components/Clients.vue`)

**Responsabilidade**: Lista de clientes com filtros e ações

#### Funcionalidades
- Lista paginada de clientes
- Busca por nome ou telefone
- Filtros por origem e status
- Ações: visualizar, editar, deletar
- Indicadores de última visita

#### Características
- **Paginada**: Suporte a paginação
- **Filtros**: Múltiplos filtros disponíveis
- **Busca**: Busca em tempo real
- **Ações**: Ações contextuais por item

### 2. Services (`components/Services.vue`)

**Responsabilidade**: Lista de serviços com filtros

#### Funcionalidades
- Lista de serviços da barbearia
- Busca por nome
- Filtros por preço e comissão
- Ações: visualizar, editar, deletar
- Indicadores de metas

#### Características
- **Ordenação**: Por nome, preço, comissão
- **Filtros**: Faixas de preço e comissão
- **Metas**: Indicadores visuais de metas

### 3. Products (`components/Products.vue`)

**Responsabilidade**: Lista de produtos com filtros

#### Funcionalidades
- Lista de produtos da barbearia
- Busca por nome
- Filtros por preço e categoria
- Ações: visualizar, editar, deletar
- Indicadores de estoque

#### Características
- **Estoque**: Indicadores de estoque baixo
- **Categorias**: Filtro por categoria
- **Preços**: Filtros por faixa de preço

### 4. Visits (`components/Visits.vue`)

**Responsabilidade**: Lista de atendimentos

#### Funcionalidades
- Lista de atendimentos realizados
- Filtros por data e colaborador
- Busca por cliente
- Status dos atendimentos
- Valores e comissões

#### Características
- **Filtros**: Por data, colaborador, cliente
- **Status**: Indicadores visuais de status
- **Valores**: Exibição de valores e comissões

## Padrões de Design

### 1. Estrutura de Componentes
```vue
<template>
  <!-- Estrutura HTML -->
</template>

<script setup>
// Imports
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  // Definição de props
})

// Emits
const emit = defineEmits(['event-name'])

// Estado reativo
const state = ref('')

// Computed properties
const computed = computed(() => {
  // Lógica computada
})

// Métodos
const method = () => {
  // Lógica do método
}

// Lifecycle
onMounted(() => {
  // Inicialização
})
</script>

<style scoped>
/* Estilos específicos do componente */
</style>
```

### 2. Padrões de Props
- **Props Obrigatórias**: Sem valor padrão
- **Props Opcionais**: Com valor padrão definido
- **Props Boolean**: Padrão `false`
- **Props String**: Padrão `''` ou string descritiva
- **Props Number**: Padrão `0` ou `null`
- **Props Object**: Padrão `null` ou `{}`

### 3. Padrões de Emits
- **Nomenclatura**: kebab-case para eventos
- **Payload**: Objeto com dados relevantes
- **Validação**: Validação de dados antes do emit

### 4. Padrões de Estilo
- **Tailwind CSS**: Classes utilitárias
- **Scoped Styles**: Estilos específicos do componente
- **Dark Mode**: Suporte a tema escuro
- **Responsivo**: Mobile-first approach

## Considerações para Mobile

### 1. Adaptações Necessárias
- **Touch Targets**: Mínimo 44px para elementos tocáveis
- **Gestos**: Suporte a swipe, pull-to-refresh
- **Navegação**: Bottom tabs ao invés de sidebar
- **Formulários**: Campos maiores e mais espaçados

### 2. Componentes Mobile-Specific
- **Bottom Navigation**: Navegação inferior
- **Drawer**: Menu lateral deslizante
- **Floating Action Button**: Botão de ação flutuante
- **Pull to Refresh**: Atualização por gesto

### 3. Bibliotecas Recomendadas
- **React Native Elements**: Componentes base
- **NativeBase**: Biblioteca de componentes
- **React Native Paper**: Material Design
- **React Native Vector Icons**: Ícones

### 4. Padrões de Navegação Mobile
```typescript
// Bottom Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Agenda" component={AgendaScreen} />
    <Tab.Screen name="Clientes" component={ClientesScreen} />
    <Tab.Screen name="Perfil" component={PerfilScreen} />
  </Tab.Navigator>
)

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={TabNavigator} />
    <Drawer.Screen name="Servicos" component={ServicosScreen} />
    <Drawer.Screen name="Produtos" component={ProdutosScreen} />
  </Drawer.Navigator>
)
```

## Acessibilidade

### 1. Padrões de Acessibilidade
- **ARIA Labels**: Labels descritivos para screen readers
- **Keyboard Navigation**: Navegação por teclado
- **Focus Management**: Gerenciamento de foco
- **Color Contrast**: Contraste adequado de cores

### 2. Implementação
```vue
<template>
  <button
    :aria-label="buttonLabel"
    :aria-expanded="isOpen"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
  >
    {{ buttonText }}
  </button>
</template>
```

### 3. Testes de Acessibilidade
- **Screen Readers**: Teste com leitores de tela
- **Keyboard Only**: Navegação apenas por teclado
- **Color Blind**: Teste para daltonismo
- **Motor Impairment**: Teste para limitações motoras

## Performance

### 1. Otimizações
- **Lazy Loading**: Carregamento sob demanda
- **Memoização**: Uso de `computed` e `watch`
- **Virtual Scrolling**: Para listas grandes
- **Image Optimization**: Otimização de imagens

### 2. Bundle Size
- **Tree Shaking**: Remoção de código não utilizado
- **Code Splitting**: Divisão do código
- **Dynamic Imports**: Imports dinâmicos
- **Minification**: Minificação do código

### 3. Runtime Performance
- **Debouncing**: Para inputs de busca
- **Throttling**: Para eventos frequentes
- **Caching**: Cache de dados e componentes
- **Optimistic Updates**: Atualizações otimistas
