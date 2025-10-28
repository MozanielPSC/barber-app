# Barber App - Sistema de Autenticação

## Visão Geral

O sistema de autenticação do Barber App é robusto e flexível, suportando dois tipos de usuários: **Proprietários** e **Colaboradores**. Utiliza JWT (JSON Web Tokens) para autenticação, localStorage para persistência e implementa um sistema de permissões baseado em roles (RBAC).

## Arquitetura de Autenticação

### Componentes Principais

1. **`stores/auth.ts`** - Store Pinia para gerenciamento de estado de autenticação
2. **`composables/useAuth.ts`** - Composable para métodos de autenticação
3. **`composables/usePermissions.ts`** - Composable para verificação de permissões
4. **`middleware/auth.global.ts`** - Middleware global de proteção de rotas
5. **`plugins/auth-init.client.ts`** - Plugin para inicialização da autenticação

## Tipos de Usuário

### Proprietário
- **Características**: Dono da barbearia, acesso total ao sistema
- **Login**: Email e senha
- **Permissões**: Todas as permissões por padrão
- **Funcionalidades**: Gerenciar barbearias, colaboradores, configurações

### Colaborador
- **Características**: Funcionário da barbearia com permissões limitadas
- **Login**: Email, senha e código da barbearia
- **Permissões**: Definidas pelo proprietário
- **Funcionalidades**: Acesso limitado baseado em permissões

## Fluxo de Autenticação

### 1. Login de Proprietário

```typescript
// Endpoint: POST /auth/login
const loginProprietario = async (credentials: { email: string; senha: string }) => {
  const response = await useApi<LoginResponse>('/auth/login', 'POST', credentials)
  
  // Response esperado:
  // {
  //   token: "jwt_token_here",
  //   user: {
  //     id: "user_id",
  //     email: "email@example.com",
  //     tipo: "proprietario",
  //     nome: "Nome do Proprietário",
  //     foto_perfil_url_assinada: "https://s3...",
  //     barbearias: [...]
  //   }
  // }
}
```

### 2. Login de Colaborador

```typescript
// Endpoint: POST /auth/login-colaborador
const loginColaborador = async (credentials: LoginColaboradorForm) => {
  const response = await useApi<LoginResponse>('/auth/login-colaborador', 'POST', credentials)
  
  // Response esperado:
  // {
  //   token: "jwt_token_here",
  //   user: {
  //     id: "user_id",
  //     email: "email@example.com",
  //     tipo: "colaborador",
  //     nome: "Nome do Colaborador",
  //     barbearia_id: "barbearia_id",
  //     barbearia_nome: "Nome da Barbearia",
  //     colaborador_id: "colaborador_id",
  //     foto_perfil_url_assinada: "https://s3...",
  //     permissoes: { ... }
  //   }
  // }
}
```

### 3. Registro de Nova Barbearia

```typescript
// Endpoint: POST /auth/register
const register = async (userData: RegisterForm) => {
  const response = await useApi<RegisterResponse>('/auth/register', 'POST', userData)
  
  // Response esperado:
  // {
  //   message: "Barbearia criada com sucesso",
  //   user: { ... },
  //   barbearia: { ... }
  // }
}
```

## Gerenciamento de Token

### Armazenamento
```typescript
// localStorage key
const TOKEN_KEY = 'barber_token'

// Salvar token
localStorage.setItem(TOKEN_KEY, token)

// Recuperar token
const token = localStorage.getItem(TOKEN_KEY)

// Remover token
localStorage.removeItem(TOKEN_KEY)
```

### Headers de Autenticação
```typescript
// Headers automáticos para requisições autenticadas
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Validação de Token
```typescript
// Endpoint: GET /auth/me
const validateToken = async () => {
  try {
    const response = await useApi<User>('/auth/me', 'GET')
    return response
  } catch (error) {
    // Token inválido - fazer logout
    logout()
    throw error
  }
}
```

## Sistema de Permissões (RBAC)

### Estrutura de Permissões

```typescript
interface Permissoes {
  dashboard: {
    visualizar: boolean
  }
  agenda: {
    visualizar: boolean
    criar: boolean
    editar: boolean
    deletar: boolean
  }
  clientes: {
    visualizar: boolean
    criar: boolean
    editar: boolean
    deletar: boolean
  }
  colaboradores: {
    visualizar: boolean
    criar: boolean
    editar: boolean
    deletar: boolean
    gerenciar_permissoes: boolean
    gerenciar_disponibilidade: boolean
    gerenciar_servicos: boolean
  }
  servicos: {
    visualizar: boolean
    criar: boolean
    editar: boolean
    deletar: boolean
  }
  produtos: {
    visualizar: boolean
    criar: boolean
    editar: boolean
    deletar: boolean
  }
  estoque: {
    visualizar: boolean
    gerenciar_prateleiras: boolean
    gerenciar_movimentacoes: boolean
    gerar_relatorios: boolean
  }
  financeiro: {
    visualizar: boolean
    gerenciar_despesas: boolean
    gerenciar_cadeiras: boolean
    gerenciar_canais: boolean
    gerar_relatorios: boolean
  }
  comissoes: {
    visualizar: boolean
    gerenciar_debitos: boolean
  }
  gastos_colaborador: {
    visualizar: boolean
    criar: boolean
    editar: boolean
    deletar: boolean
    marcar_pago: boolean
  }
  configuracoes: {
    gerenciar_barbearia: boolean
    gerenciar_metas: boolean
  }
}
```

### Verificação de Permissões

```typescript
// Verificar permissão específica
const hasPermission = (recurso: string, acao: 'visualizar' | 'criar' | 'editar' | 'excluir' = 'visualizar'): boolean => {
  const user = authStore.currentUser
  if (!user) return false
  
  // Proprietários têm todas as permissões
  if (user.tipo === 'proprietario') return true
  
  // Colaboradores verificam permissões específicas
  if (user.tipo === 'colaborador' && user.permissoes) {
    const modulo = user.permissoes[recurso as keyof Permissoes]
    return modulo?.[acao] || false
  }
  
  return false
}

// Exemplos de uso
hasPermission('clientes', 'visualizar')  // Pode ver clientes?
hasPermission('servicos', 'criar')        // Pode criar serviços?
hasPermission('financeiro', 'editar')    // Pode editar financeiro?
```

### Permissões Especiais

#### Comissões
```typescript
const canViewComissoes = computed(() => {
  // Colaboradores sempre podem ver suas próprias comissões
  if (authStore.isColaborador) {
    return true
  }
  // Proprietários precisam de permissão específica
  return hasPermission('comissoes', 'visualizar')
})
```

#### Dashboard
```typescript
const canViewDashboard = computed(() => {
  // Todos os usuários autenticados podem ver o dashboard
  return authStore.isLoggedIn
})
```

## Middleware de Proteção de Rotas

### Implementação (`middleware/auth.global.ts`)

```typescript
export default defineNuxtRouteMiddleware((to) => {
  // Só executa no cliente
  if (!import.meta.client) return

  const token = localStorage.getItem('barber_token')
  const isAuthenticated = !!token
  
  // Rotas públicas
  const publicRoutes = ['/', '/registro', '/login-colaborador']
  const isPublicRoute = publicRoutes.includes(to.path)
  
  // Se estiver logado e tentar acessar rotas públicas, vai pro dashboard
  if (isAuthenticated && isPublicRoute) {
    return navigateTo('/dashboard')
  }
  
  // Se não estiver logado e tentar acessar rota protegida, vai pro login
  if (!isAuthenticated && !isPublicRoute) {
    return navigateTo('/')
  }
})
```

### Rotas Protegidas vs Públicas

#### Rotas Públicas
- `/` - Login de proprietário
- `/registro` - Registro de nova barbearia
- `/login-colaborador` - Login de colaborador

#### Rotas Protegidas
- Todas as outras rotas requerem autenticação
- Verificação adicional de permissões em componentes específicos

## Upload de Foto de Perfil

### Implementação

```typescript
// Endpoint: POST /auth/foto-perfil
const uploadProfilePhoto = async (file: File) => {
  const formData = new FormData()
  formData.append('foto', file)
  
  const response = await useApi<{ foto_perfil_url_assinada: string }>('/auth/foto-perfil', 'POST', formData)
  
  // Atualizar estado local
  authStore.updateProfilePhoto(response.foto_perfil_url_assinada)
  
  return response
}
```

### Processo de Upload
1. **Seleção**: Usuário seleciona arquivo de imagem
2. **Validação**: Verificar tipo e tamanho do arquivo
3. **Upload**: Enviar como FormData para API
4. **Processamento**: Backend salva no S3 e retorna URL assinada
5. **Atualização**: Frontend atualiza estado e exibe nova foto

### URL Assinada
```typescript
// Exemplo de URL retornada
const fotoUrl = "https://s3.us-east-2.amazonaws.com/beetbarber/perfil/user_id/timestamp-filename.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=...&X-Amz-Date=20250119T234331Z&X-Amz-Expires=3600&X-Amz-Signature=...&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
```

## Composables de Autenticação

### useAuth Composable

```typescript
export const useAuth = () => {
  const authStore = useAuthStore()

  // Estado reativo
  const isAuthenticated = computed(() => authStore.isLoggedIn)
  const user = computed(() => authStore.currentUser)
  const isLoading = computed(() => authStore.isLoading)
  const token = computed(() => authStore.token)
  const isProprietario = computed(() => authStore.isProprietario)
  const isColaborador = computed(() => authStore.isColaborador)
  const permissions = computed(() => authStore.permissions)

  // Métodos de autenticação
  const login = async (credentials: { email: string; senha: string }) => {
    return await authStore.login(credentials)
  }

  const loginColaborador = async (credentials: LoginColaboradorForm) => {
    return await authStore.loginColaborador(credentials)
  }

  const register = async (userData: any) => {
    return await authStore.register(userData)
  }

  const logout = async () => {
    authStore.logout()
    await navigateTo('/')
  }

  const updateProfile = async (updates: any) => {
    return await authStore.updateProfile(updates)
  }

  // Verificar permissões
  const hasPermission = (recurso: string, acao: 'visualizar' | 'criar' | 'editar' | 'excluir' = 'visualizar') => {
    return authStore.hasPermission(recurso, acao)
  }

  // Headers para requisições autenticadas
  const getAuthHeaders = () => {
    if (!token.value) return {}
    
    return {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json'
    }
  }

  return {
    // Estado
    isAuthenticated,
    user,
    isLoading,
    token,
    isProprietario,
    isColaborador,
    permissions,
    
    // Métodos
    login,
    loginColaborador,
    register,
    logout,
    updateProfile,
    hasPermission,
    getAuthHeaders
  }
}
```

### usePermissions Composable

```typescript
export const usePermissions = () => {
  const authStore = useAuthStore()

  // Verificação genérica
  const hasPermission = (recurso: string, acao: 'visualizar' | 'criar' | 'editar' | 'excluir' = 'visualizar'): boolean => {
    return authStore.hasPermission(recurso, acao)
  }

  // Verificação múltipla
  const hasAllPermissions = (recurso: string, acoes: Array<'visualizar' | 'criar' | 'editar' | 'excluir'>): boolean => {
    return acoes.every(acao => hasPermission(recurso, acao))
  }

  const hasAnyPermission = (recurso: string, acoes: Array<'visualizar' | 'criar' | 'editar' | 'excluir'>): boolean => {
    return acoes.some(acao => hasPermission(recurso, acao))
  }

  // Permissões específicas por módulo
  const canViewClientes = computed(() => hasPermission('clientes', 'visualizar'))
  const canCreateClientes = computed(() => hasPermission('clientes', 'criar'))
  const canEditClientes = computed(() => hasPermission('clientes', 'editar'))
  const canDeleteClientes = computed(() => hasPermission('clientes', 'excluir'))

  // ... outras permissões específicas

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canViewClientes,
    canCreateClientes,
    canEditClientes,
    canDeleteClientes,
    // ... outras permissões
  }
}
```

## Inicialização da Autenticação

### Plugin de Inicialização (`plugins/auth-init.client.ts`)

```typescript
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Inicializar autenticação ao carregar a aplicação
  authStore.init()
})
```

### Processo de Inicialização
1. **Carregar Token**: Recuperar token do localStorage
2. **Validar Token**: Fazer requisição para `/auth/me`
3. **Atualizar Estado**: Carregar dados do usuário se token válido
4. **Redirecionar**: Navegar para rota apropriada baseada no estado

## Tratamento de Erros

### Erros de Autenticação
```typescript
// Token expirado ou inválido
if (error.status === 401) {
  authStore.logout()
  navigateTo('/')
}

// Acesso negado
if (error.status === 403) {
  // Mostrar mensagem de acesso negado
  // Redirecionar para dashboard ou página de erro
}
```

### Validação de Formulários
```typescript
// Validação de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de senha
const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

// Validação de código da barbearia
const isValidBarbeariaCode = (code: string): boolean => {
  return code.length >= 4
}
```

## Segurança

### Boas Práticas Implementadas

1. **JWT Tokens**: Tokens seguros com expiração
2. **HTTPS**: Todas as requisições em HTTPS
3. **Validação de Entrada**: Validação tanto no frontend quanto backend
4. **Sanitização**: Sanitização de dados de entrada
5. **Rate Limiting**: Limitação de tentativas de login
6. **Logs de Segurança**: Log de tentativas de acesso

### Headers de Segurança
```typescript
// Headers recomendados para produção
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

## Implementação em React Native

### AsyncStorage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage'

// Salvar token
await AsyncStorage.setItem('barber_token', token)

// Recuperar token
const token = await AsyncStorage.getItem('barber_token')

// Remover token
await AsyncStorage.removeItem('barber_token')
```

### Context de Autenticação
```javascript
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data
      
      await AsyncStorage.setItem('barber_token', token)
      setToken(token)
      setUser(user)
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    await AsyncStorage.removeItem('barber_token')
    setToken(null)
    setUser(null)
  }

  const hasPermission = (resource, action = 'visualizar') => {
    if (!user) return false
    if (user.tipo === 'proprietario') return true
    if (user.tipo === 'colaborador' && user.permissoes) {
      const module = user.permissoes[resource]
      return module?.[action] || false
    }
    return false
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Interceptor Axios
```javascript
// Adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = AsyncStorage.getItem('barber_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido - fazer logout
      await AsyncStorage.removeItem('barber_token')
      // Redirecionar para login
    }
    return Promise.reject(error)
  }
)
```

### Navegação Protegida
```javascript
const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, hasPermission } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDenied />
  }
  
  return children
}
```

## Considerações de Performance

### Otimizações Implementadas
1. **Lazy Loading**: Carregamento sob demanda de componentes
2. **Memoização**: Uso de `computed` para evitar recálculos
3. **Debounce**: Debounce em campos de busca
4. **Cache**: Cache de dados do usuário
5. **Prefetch**: Pré-carregamento de rotas importantes

### Monitoramento
```typescript
// Métricas de autenticação
const authMetrics = {
  loginAttempts: 0,
  loginSuccess: 0,
  loginFailures: 0,
  tokenRefresh: 0,
  logoutCount: 0
}
```

## Testes

### Testes de Autenticação
```typescript
describe('Authentication', () => {
  test('should login successfully with valid credentials', async () => {
    const credentials = { email: 'test@example.com', senha: 'password123' }
    const result = await authStore.login(credentials)
    
    expect(result.token).toBeDefined()
    expect(result.user.email).toBe(credentials.email)
  })

  test('should reject invalid credentials', async () => {
    const credentials = { email: 'invalid@example.com', senha: 'wrong' }
    
    await expect(authStore.login(credentials)).rejects.toThrow()
  })

  test('should check permissions correctly', () => {
    const user = { tipo: 'colaborador', permissoes: { clientes: { visualizar: true } } }
    authStore.setUser(user)
    
    expect(authStore.hasPermission('clientes', 'visualizar')).toBe(true)
    expect(authStore.hasPermission('clientes', 'criar')).toBe(false)
  })
})
```

## Troubleshooting

### Problemas Comuns

1. **Token Expirado**
   - Sintoma: Redirecionamento automático para login
   - Solução: Implementar refresh token ou re-login

2. **Permissões Não Funcionando**
   - Sintoma: Usuário não consegue acessar funcionalidades
   - Solução: Verificar estrutura de permissões no backend

3. **Foto de Perfil Não Carrega**
   - Sintoma: Imagem não exibe
   - Solução: Verificar URL assinada e configuração S3

4. **Logout Não Funciona**
   - Sintoma: Usuário permanece logado
   - Solução: Limpar localStorage e estado da aplicação
