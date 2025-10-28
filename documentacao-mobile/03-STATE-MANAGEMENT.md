# Barber App - Gerenciamento de Estado

## Visão Geral

O Barber App utiliza **Pinia** como gerenciador de estado global. Cada store é responsável por um domínio específico da aplicação, mantendo dados, ações e getters relacionados.

## Estrutura das Stores

### 1. Auth Store (`stores/auth.ts`)

**Responsabilidade**: Autenticação, usuário logado e permissões

#### State
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  permissoes: Permissao[]
}
```

#### Getters
- `isLoggedIn`: Verifica se usuário está autenticado
- `currentUser`: Retorna dados do usuário atual
- `userBusinessName`: Nome da barbearia do usuário
- `userOwnerName`: Nome do proprietário/colaborador
- `isProprietario`: Verifica se é proprietário
- `isColaborador`: Verifica se é colaborador
- `permissions`: Lista de permissões do usuário

#### Actions Principais
- `init()`: Inicializa store com dados do localStorage
- `login(credentials)`: Login de proprietário
- `loginColaborador(credentials)`: Login de colaborador
- `register(userData)`: Registro de novo proprietário
- `logout()`: Logout e limpeza de dados
- `setAuthData(authResponse)`: Define dados de autenticação
- `updateProfile(updates)`: Atualiza perfil do usuário
- `refreshUser()`: Atualiza dados do usuário
- `updateProfilePhoto(fotoUrl)`: Atualiza foto de perfil
- `hasPermission(recurso, acao)`: Verifica permissão específica

#### Fluxo de Autenticação
1. **Login**: Chama API → Recebe token e dados → Salva no localStorage → Atualiza state
2. **Inicialização**: Carrega dados do localStorage → Valida token → Restaura estado
3. **Logout**: Limpa state → Remove dados do localStorage → Redireciona para login

### 2. Barbearias Store (`stores/barbearias.ts`)

**Responsabilidade**: Gerenciamento de barbearias e seleção

#### State
```typescript
interface BarbeariasState {
  barbearias: Barbearia[]
  barbeariaSelecionada: BarbeariaSelecionada | null
  isLoading: boolean
}
```

#### Getters
- `barbeariasAtivas`: Filtra barbearias ativas
- `barbeariaCompleta`: Retorna dados completos da barbearia selecionada
- `temBarbeariaSelecionada`: Verifica se há barbearia selecionada

#### Actions Principais
- `loadBarbearias()`: Carrega todas as barbearias do usuário
- `criarBarbearia(barbeariaData)`: Cria nova barbearia
- `atualizarBarbearia(id, updates)`: Atualiza dados da barbearia
- `deletarBarbearia(id)`: Remove barbearia
- `selecionarBarbearia(barbearia)`: Seleciona barbearia ativa
- `carregarBarbeariaSelecionada()`: Carrega seleção do localStorage
- `limparSelecao()`: Remove seleção
- `reset()`: Limpa todos os dados

#### Persistência
- Barbearia selecionada é salva no localStorage como `barbearia_selecionada`
- Colaboradores têm barbearia selecionada automaticamente baseada em seus dados

### 3. Clientes Store (`stores/clientes.ts`)

**Responsabilidade**: CRUD de clientes

#### State
```typescript
state: () => ({
  clientes: [] as Client[],
  isLoading: false
})
```

#### Getters
- `filteredClients(query)`: Filtra clientes por nome/telefone

#### Actions Principais
- `addClient(clientData)`: Adiciona novo cliente
- `loadClients(searchQuery)`: Carrega lista de clientes
- `updateClient(id, updates)`: Atualiza dados do cliente
- `deleteClient(id)`: Remove cliente da lista local
- `reset()`: Limpa dados

#### Mapeamento de Dados
- Converte dados da API para formato do frontend
- Campos: `nome` → `name`, `telefone` → `phone`, etc.

### 4. Colaboradores Store (`stores/colaboradores.ts`)

**Responsabilidade**: Gestão completa de colaboradores

#### State
```typescript
interface ColaboradoresState {
  colaboradores: Colaborador[]
  isLoading: boolean
}
```

#### Getters
- `colaboradoresAtivos`: Filtra colaboradores ativos
- `colaboradoresPorBarbearia(barbeariaId)`: Filtra por barbearia
- `colaboradoresAtivosPorBarbearia(barbeariaId)`: Filtra ativos por barbearia
- `colaboradorPorId(id)`: Busca colaborador por ID

#### Actions Principais
- `loadColaboradores(barbeariaId, busca)`: Carrega colaboradores
- `criarColaborador(colaboradorData)`: Cria novo colaborador
- `buscarColaborador(id, barbeariaId)`: Busca colaborador específico
- `atualizarColaborador(id, updates)`: Atualiza dados
- `deletarColaborador(id, barbeariaId)`: Remove colaborador
- `filtrarColaboradores(filtro)`: Filtro local por nome/função

#### Disponibilidade
- `definirDisponibilidade(colaboradorId, diaSemana, horarioInicio, horarioFim)`
- `listarDisponibilidades(colaboradorId)`
- `atualizarDisponibilidade(colaboradorId, disponibilidadeId, dados)`
- `deletarDisponibilidade(colaboradorId, disponibilidadeId)`

#### Serviços
- `associarServico(colaboradorId, servicoId)`
- `listarServicosColaborador(colaboradorId)`
- `desassociarServico(colaboradorId, servicoId)`

#### Permissões
- `atualizarPermissoes(colaboradorId, permissoes, barbeariaId)`
- `desativarColaborador(colaboradorId, barbeariaId)`

### 5. Serviços Store (`stores/servicos.ts`)

**Responsabilidade**: Catálogo de serviços

#### State
```typescript
state: () => ({
  servicos: [] as Service[],
  isLoading: false
})
```

#### Actions Principais
- `addService(serviceData)`: Adiciona novo serviço
- `loadServices()`: Carrega serviços da barbearia
- `updateService(id, updates)`: Atualiza serviço
- `deleteService(id)`: Remove serviço
- `reset()`: Limpa dados

#### Mapeamento de Dados
- `nome` → `name`
- `preco_padrao` → `defaultPrice`
- `percentual_comissao_executor` → `commissionPct`
- `percentual_comissao_assistente` → `commissionPctAssistente`
- `percentual_comissao_indicacao` → `commissionPctIndicador`
- `meta_diaria_qtd` → `goalDailyQty`

### 6. Produtos Store (`stores/produtos.ts`)

**Responsabilidade**: Catálogo de produtos

#### State
```typescript
state: () => ({
  produtos: [] as Product[],
  isLoading: false
})
```

#### Actions Principais
- `addProduct(productData)`: Adiciona novo produto
- `loadProducts()`: Carrega produtos da barbearia
- `updateProduct(id, updates)`: Atualiza produto
- `deleteProduct(id)`: Remove produto
- `reset()`: Limpa dados

#### Mapeamento de Dados
- `nome` → `name`
- `preco_padrao` → `defaultPrice`
- `percentual_comissao` → `commissionPct`
- `percentual_imposto` → `taxPct`
- `percentual_cartao` → `cardPct`
- `meta_diaria_qtd` → `goalDailyQty`

### 7. Atendimentos Store (`stores/atendimentos.ts`)

**Responsabilidade**: Histórico de atendimentos e agendamentos

#### State
```typescript
state: () => ({
  atendimentos: [] as Visit[],
  agendamentos: [] as Agendamento[],
  isLoading: false
})
```

#### Actions Principais
- `loadVisits()`: Carrega atendimentos
- `addVisit(visitData)`: Registra novo atendimento
- `updateVisit(id, updates)`: Atualiza atendimento
- `deleteVisit(id)`: Remove atendimento
- `loadAgendamentos(filtros)`: Carrega agendamentos
- `criarAgendamento(dados)`: Cria novo agendamento
- `atualizarStatusAgendamento(id, status, barbeariaId)`: Atualiza status
- `deletarAgendamento(id, barbeariaId)`: Remove agendamento
- `buscarAgendamento(id, barbeariaId)`: Busca agendamento específico
- `buscarHorariosDisponiveis(colaboradorId, data, servicoId)`: Horários livres

### 8. Dashboard Store (`stores/dashboard.ts`)

**Responsabilidade**: KPIs e métricas

#### State
```typescript
state: () => ({
  kpis: null as DashboardKPIs | null,
  clientsAtRisk: [] as ClientAtRisk[],
  channelStats: [] as ChannelStats[],
  isLoading: false
})
```

#### Actions Principais
- `loadDashboardKPIs()`: Carrega KPIs principais
- `loadClientsAtRisk()`: Carrega clientes em risco
- `loadChannelStats()`: Carrega estatísticas de canais
- `reset()`: Limpa dados

### 9. Comissões Store (`stores/comissoes.ts`)

**Responsabilidade**: Sistema de comissões

#### State
```typescript
state: () => ({
  vendasServicos: [] as ComissaoServico[],
  vendasProdutos: [] as ComissaoProduto[],
  debitos: [] as Debito[],
  indicacoes: [] as Indicacao[],
  resumo: null as ResumoComissoes | null,
  projecao: null as ProjecaoComissoes | null,
  isLoading: false
})
```

#### Actions Principais
- `loadVendasServicos(mes, colaboradorId)`: Carrega vendas de serviços
- `loadVendasProdutos(mes, colaboradorId)`: Carrega vendas de produtos
- `loadDebitos(mes, colaboradorId)`: Carrega débitos
- `loadIndicacoes(mes, colaboradorId)`: Carrega indicações
- `loadResumoComissoes(mes, colaboradorId)`: Carrega resumo
- `loadProjecaoComissoes(colaboradorId)`: Carrega projeção
- `loadComissoesColaborador(colaboradorId, mes)`: Carrega todas as comissões
- `loadTodasComissoes(mes)`: Carrega comissões de todos os colaboradores

#### Tratamento de Respostas
- Adapta diferentes formatos de resposta da API
- Converte arrays e objetos conforme necessário
- Trata valores string/number automaticamente

### 10. Financeiro Store (`stores/financeiro.ts`)

**Responsabilidade**: Gestão financeira

#### State
```typescript
state: () => ({
  fixed: [] as FinanceItem[],
  variable: [] as FinanceItem[],
  monthRef: '',
  defaults: {
    taxPct: 0,
    cardPct: 0,
    varPctExtra: 0
  } as FinanceDefaults,
  chairs: [] as Chair[],
  channels: [] as Channel[],
  isLoading: false
})
```

#### Actions Principais
- **Despesas Fixas**: `addFixedExpense()`, `loadFixedExpenses()`
- **Despesas Variáveis**: `addVariableExpense()`, `loadVariableExpenses()`
- **Cadeiras**: `addChair()`, `loadChairs()`, `updateChair()`, `deleteChair()`
- **Canais**: `addChannel()`, `loadChannels()`
- **Relatório**: `loadFinancialReport(month)`

### 11. Estoque Store (`stores/estoque.ts`)

**Responsabilidade**: Controle de estoque

#### State
```typescript
state: () => ({
  prateleiras: [] as Prateleira[],
  estoque: [] as EstoqueProduto[],
  movimentacoes: [] as MovimentacaoEstoque[],
  produtosEstoqueBaixo: [] as ProdutoEstoqueBaixo[],
  relatorio: null as RelatorioEstoque | null,
  isLoading: false
})
```

#### Getters
- `prateleirasAtivas`: Filtra prateleiras ativas
- `estoquePorPrateleira(prateleiraId)`: Estoque por prateleira
- `estoqueProduto(produtoId)`: Estoque de produto específico
- `quantidadeDisponivel(produtoId)`: Quantidade disponível
- `movimentacoesRecentes`: Últimas 20 movimentações
- `movimentacoesPorTipo(tipo)`: Movimentações por tipo
- `produtosEstoqueCritico`: Produtos com estoque crítico
- `totalProdutosEstoque`: Total de produtos
- `valorTotalEstoque`: Valor total do estoque

#### Actions Principais
- **Prateleiras**: `criarPrateleira()`, `listarPrateleiras()`, `atualizarPrateleira()`, `deletarPrateleira()`
- **Estoque**: `consultarEstoqueProduto()`, `carregarEstoqueAtual()`
- **Movimentações**: `registrarEntrada()`, `registrarSaida()`, `transferirEstoque()`, `ajustarEstoque()`
- **Relatórios**: `listarMovimentacoes()`, `carregarProdutosEstoqueBaixo()`, `gerarRelatorio()`
- **Utilitários**: `verificarDisponibilidade()`, `darBaixaVenda()`

### 12. Gastos Store (`stores/gastos.ts`)

**Responsabilidade**: Gastos por colaborador

#### State
```typescript
state: () => ({
  gastos: [] as GastoColaborador[],
  totais: [] as TotaisGastos[],
  isLoading: false,
  error: null as string | null
})
```

#### Getters
- `gastosPendentes`: Filtra gastos pendentes
- `gastosPagos`: Filtra gastos pagos
- `gastosAtrasados`: Filtra gastos atrasados
- `totalPendente`: Soma gastos pendentes
- `totalPago`: Soma gastos pagos
- `totalAtrasado`: Soma gastos atrasados
- `totalGeral`: Soma todos os gastos

#### Actions Principais
- `listarGastos(filtros)`: Lista gastos com filtros
- `criarGasto(gastoData)`: Cria novo gasto
- `criarGastosParcelados(dados)`: Cria gastos parcelados
- `buscarGasto(id)`: Busca gasto específico
- `atualizarGasto(id, updates)`: Atualiza gasto
- `marcarComoPago(id, dataPagamento)`: Marca como pago
- `deletarGasto(id)`: Remove gasto
- `carregarTotais(mes)`: Carrega totais por colaborador
- `carregarGastosPendentes(colaboradorId)`: Gastos pendentes
- `carregarGastosAtrasados()`: Gastos atrasados

### 13. App Store (`stores/app.ts`)

**Responsabilidade**: Estado global da aplicação

#### State
```typescript
state: () => ({
  isLoading: false,
  theme: 'light' as 'light' | 'dark',
  sidebarOpen: false,
  sidebarCollapsed: false,
  currentTab: 'dashboard' as string,
  notifications: [] as Notification[]
})
```

#### Getters
- `isDarkMode`: Verifica se está em modo escuro
- `unreadNotifications`: Conta notificações não lidas

#### Actions Principais
- `setLoading(loading)`: Define estado de loading
- `toggleTheme()`: Alterna tema claro/escuro
- `toggleSidebar()``: Alterna sidebar
- `toggleSidebarCollapse()`: Alterna colapso do sidebar
- `setCurrentTab(tab)`: Define aba atual
- `addNotification(notification)`: Adiciona notificação
- `removeNotification(id)`: Remove notificação
- `clearNotifications()`: Limpa todas as notificações

## Padrões de Implementação

### 1. Estrutura Padrão das Actions
```typescript
async nomeAction(parametros) {
  this.isLoading = true
  
  try {
    // Validação de barbearia se necessário
    const barbeariasStore = useBarbeariasStore()
    const barbeariaId = barbeariasStore.barbeariaSelecionada?.id
    
    if (!barbeariaId) {
      throw new Error('Barbearia não selecionada')
    }
    
    // Chamada da API
    const response = await useApi(endpoint, method, data)
    
    // Atualização do state
    this.atualizarState(response)
    
    return response
  } catch (error) {
    console.error('Erro na action:', error)
    throw error
  } finally {
    this.isLoading = false
  }
}
```

### 2. Mapeamento de Dados API ↔ Frontend
- **API**: snake_case (ex: `nome_barbearia`)
- **Frontend**: camelCase (ex: `nomeBarbearia`)
- Conversão automática nas actions
- Tratamento de tipos (string → number, etc.)

### 3. Persistência de Dados
- **Auth**: Token e dados do usuário no localStorage
- **Barbearias**: Barbearia selecionada no localStorage
- **Outros**: Dados mantidos apenas em memória

### 4. Tratamento de Erros
- Log de erros no console
- Propagação de erros para componentes
- Notificações via App Store
- Estados de loading consistentes

### 5. Validações
- Verificação de barbearia selecionada
- Validação de parâmetros obrigatórios
- Tratamento de respostas vazias/nulas

## Fluxo de Dados

### 1. Inicialização da Aplicação
```
1. Auth Store init() → Carrega dados do localStorage
2. Se colaborador → Seleciona barbearia automaticamente
3. Se proprietário → Carrega barbearias disponíveis
4. Componentes carregam dados específicos conforme necessário
```

### 2. Mudança de Barbearia
```
1. Usuário seleciona nova barbearia
2. Barbearias Store atualiza seleção
3. Watchers detectam mudança
4. Stores específicas recarregam dados
5. Componentes se atualizam automaticamente
```

### 3. Operações CRUD
```
1. Usuário executa ação (criar/editar/deletar)
2. Componente chama action da store
3. Store valida dados e chama API
4. API processa e retorna resposta
5. Store atualiza state local
6. Componente reage à mudança
7. Notificação de sucesso/erro
```

## Composables Relacionados

### 1. useBarbeariaWatch
- Detecta mudanças na barbearia selecionada
- Executa callbacks de recarregamento
- Usado em páginas que dependem da barbearia

### 2. useAuth
- Expõe métodos da Auth Store
- Facilita uso em componentes
- Inclui refreshUser, updateProfilePhoto

### 3. usePermissions
- Verifica permissões do usuário
- Computed properties para recursos específicos
- Usado em componentes condicionais

## Considerações para Mobile

### 1. Adaptações Necessárias
- **Estado**: Usar Redux Toolkit ou Zustand
- **Persistência**: AsyncStorage ao invés de localStorage
- **Watchers**: Implementar com useEffect/useMemo
- **Notificações**: Sistema nativo de notificações

### 2. Bibliotecas Recomendadas
- **Redux Toolkit**: Para gerenciamento de estado complexo
- **Zustand**: Alternativa mais simples
- **React Query**: Para cache e sincronização de dados
- **AsyncStorage**: Para persistência local

### 3. Estrutura Sugerida
```typescript
// Redux Toolkit
interface RootState {
  auth: AuthState
  barbearias: BarbeariasState
  clientes: ClientesState
  // ... outros slices
}

// Actions
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    }
  }
})
```
