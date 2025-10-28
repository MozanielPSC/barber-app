# Barber App - Funções Utilitárias

## Visão Geral

Este documento descreve as funções utilitárias e composables utilizados no Barber App, incluindo formatação de dados, validações, helpers de API e outras funções auxiliares que facilitam o desenvolvimento e podem ser reutilizadas na versão mobile.

## Funções de Formatação

### Formatação Monetária

```typescript
// Formatação de valores monetários
export const formatMoney = (value: number | null | undefined): string => {
  if (value == null) return "—"
  return "R$ " + (Number(value) || 0).toLocaleString("pt-BR", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })
}

// Exemplos de uso:
formatMoney(1500.50)    // "R$ 1.500,50"
formatMoney(0)          // "R$ 0,00"
formatMoney(null)       // "—"
formatMoney(undefined)  // "—"
```

### Formatação de Datas

```typescript
// Formatação de datas para exibição
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—"
  try {
    // Se a data já tem timestamp, usa diretamente
    let date: Date
    if (dateString.includes('T') || dateString.includes('Z')) {
      date = new Date(dateString)
    } else {
      // Se é apenas data (YYYY-MM-DD), adiciona horário
      date = new Date(dateString + "T00:00:00")
    }
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return "—"
    }
    
    return date.toLocaleDateString("pt-BR")
  } catch (error) {
    return "—"
  }
}

// Formatação de data e hora
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "—"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "—"
    
    return date.toLocaleString("pt-BR", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return "—"
  }
}

// Formatação de hora apenas
export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "—"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "—"
    
    return date.toLocaleTimeString("pt-BR", {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return "—"
  }
}

// Exemplos de uso:
formatDate("2024-01-20")                    // "20/01/2024"
formatDateTime("2024-01-20T14:30:00")       // "20/01/2024 14:30"
formatTime("2024-01-20T14:30:00")           // "14:30"
```

### Formatação de Percentuais

```typescript
// Formatação de percentuais
export const formatPercent = (value: number | null | undefined): string => {
  if (value == null) return "—"
  return `${(Number(value) * 100).toFixed(1)}%`
}

// Formatação de percentual com casas decimais
export const formatPercentDecimal = (value: number | null | undefined, decimals: number = 2): string => {
  if (value == null) return "—"
  return `${(Number(value) * 100).toFixed(decimals)}%`
}

// Exemplos de uso:
formatPercent(0.15)        // "15,0%"
formatPercent(0.125)       // "12,5%"
formatPercentDecimal(0.1234, 3)  // "12,340%"
```

### Formatação de Telefone

```typescript
// Formatação de telefone brasileiro
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return "—"
  
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Formata baseado no tamanho
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

// Exemplos de uso:
formatPhone("11987654321")     // "(11) 98765-4321"
formatPhone("1133334444")     // "(11) 3333-4444"
formatPhone("(11) 98765-4321") // "(11) 98765-4321"
```

### Formatação de CPF/CNPJ

```typescript
// Formatação de CPF
export const formatCPF = (cpf: string | null | undefined): string => {
  if (!cpf) return "—"
  
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  
  return cpf
}

// Formatação de CNPJ
export const formatCNPJ = (cnpj: string | null | undefined): string => {
  if (!cnpj) return "—"
  
  const cleaned = cnpj.replace(/\D/g, '')
  
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  
  return cnpj
}

// Exemplos de uso:
formatCPF("12345678901")      // "123.456.789-01"
formatCNPJ("12345678000195")  // "12.345.678/0001-95"
```

## Funções de Data e Hora

### Conversão de Datas

```typescript
// Conversão de string para Date
export const toDate = (dateString: string): Date | null => {
  if (!dateString) return null
  return new Date(dateString + (dateString.length === 10 ? "T00:00:00" : ""))
}

// Verificar se duas datas são do mesmo dia
export const sameDay = (dateA: string, dateB: string): boolean => {
  if (!dateA || !dateB) return false
  const da = toDate(dateA)
  const db = toDate(dateB)
  if (!da || !db) return false
  
  return da.getFullYear() === db.getFullYear() && 
         da.getMonth() === db.getMonth() && 
         da.getDate() === db.getDate()
}

// Verificar se uma data está no mês atual
export const inMonth = (dateString: string, referenceDate: Date = new Date()): boolean => {
  if (!dateString) return false
  const date = toDate(dateString)
  if (!date) return false
  
  return date.getFullYear() === referenceDate.getFullYear() && 
         date.getMonth() === referenceDate.getMonth()
}

// Calcular dias entre duas datas
export const daysBetween = (dateA: string, dateB: string): number => {
  const da = toDate(dateA)
  const db = toDate(dateB)
  if (!da || !db) return 0
  
  return Math.floor((db.getTime() - da.getTime()) / 86400000)
}

// Exemplos de uso:
sameDay("2024-01-20", "2024-01-20")        // true
inMonth("2024-01-15", new Date("2024-01-10"))  // true
daysBetween("2024-01-01", "2024-01-10")   // 9
```

### Manipulação de Horários

```typescript
// Adicionar minutos a um horário
export const addMinutes = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  
  const newHours = Math.floor(totalMinutes / 60)
  const newMins = totalMinutes % 60
  
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
}

// Adicionar meses a uma data
export const addMonths = (dateString: string, months: number): string => {
  const date = new Date(dateString)
  date.setMonth(date.getMonth() + months)
  return date.toISOString().split('T')[0]
}

// Gerar array de horários entre dois horários
export const generateTimeSlots = (startTime: string, endTime: string, intervalMinutes: number = 30): string[] => {
  const slots: string[] = []
  let currentTime = startTime
  
  while (currentTime < endTime) {
    slots.push(currentTime)
    currentTime = addMinutes(currentTime, intervalMinutes)
  }
  
  return slots
}

// Exemplos de uso:
addMinutes("09:00", 30)                    // "09:30"
addMonths("2024-01-15", 1)                 // "2024-02-15"
generateTimeSlots("08:00", "18:00", 30)    // ["08:00", "08:30", "09:00", ...]
```

## Funções de Validação

### Validação de Email

```typescript
// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Exemplos de uso:
isValidEmail("user@example.com")     // true
isValidEmail("invalid-email")        // false
isValidEmail("")                     // false
```

### Validação de Telefone

```typescript
// Validação de telefone brasileiro
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 11
}

// Exemplos de uso:
isValidPhone("(11) 98765-4321")      // true
isValidPhone("11987654321")         // true
isValidPhone("123")                 // false
```

### Validação de CPF

```typescript
// Validação de CPF
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
    return false
  }
  
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(10))) return false
  
  return true
}

// Exemplos de uso:
isValidCPF("123.456.789-09")         // true (CPF válido)
isValidCPF("111.111.111-11")        // false (CPF inválido)
```

### Validação de Senha

```typescript
// Validação de senha
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

// Validação de senha forte
export const isStrongPassword = (password: string): boolean => {
  // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return strongRegex.test(password)
}

// Exemplos de uso:
isValidPassword("123456")            // true
isValidPassword("12345")             // false
isStrongPassword("Password123")      // true
isStrongPassword("password")         // false
```

## Funções de Array e Objeto

### Operações com Arrays

```typescript
// Soma de array com função opcional
export const sum = <T>(arr: T[], fn?: (item: T) => number): number => {
  return arr.reduce((acc, item) => acc + (fn ? fn(item) : Number(item) || 0), 0)
}

// Agrupar array por propriedade
export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Remover duplicatas de array
export const unique = <T>(arr: T[]): T[] => {
  return [...new Set(arr)]
}

// Ordenar array por propriedade
export const sortBy = <T>(arr: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// Exemplos de uso:
sum([1, 2, 3, 4])                    // 10
sum(products, p => p.price)          // Soma dos preços
groupBy(users, 'role')               // { admin: [...], user: [...] }
unique([1, 2, 2, 3, 3, 3])          // [1, 2, 3]
sortBy(users, 'name', 'asc')        // Usuários ordenados por nome
```

### Operações com Objetos

```typescript
// Deep clone de objeto
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

// Merge de objetos
export const merge = <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
  return Object.assign(target, ...sources)
}

// Verificar se objeto está vazio
export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

// Exemplos de uso:
const cloned = deepClone(user)       // Clone profundo do usuário
const merged = merge({a: 1}, {b: 2}) // {a: 1, b: 2}
isEmpty({})                          // true
isEmpty([])                          // true
isEmpty(null)                        // true
```

## Funções de Geração de IDs

### Geração de IDs Únicos

```typescript
// Geração de ID único
export const generateId = (): string => {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Geração de UUID v4
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Geração de código alfanumérico
export const generateCode = (length: number = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Exemplos de uso:
generateId()                         // "abc123def456"
generateUUID()                       // "550e8400-e29b-41d4-a716-446655440000"
generateCode(8)                      // "ABC12345"
```

## Composables Principais

### useApi Composable

```typescript
// Composable para requisições HTTP
export const useApi = async <T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown,
  options: ApiOptions = {}
): Promise<T> => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  const url = `${config.public.apiBase}${endpoint}`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  // Adicionar token de autenticação se disponível
  if (authStore.token) {
    headers.Authorization = `Bearer ${authStore.token}`
  }
  
  // Se body é FormData, remover Content-Type para o browser definir
  if (body instanceof FormData) {
    delete headers['Content-Type']
  }
  
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body)
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token inválido - fazer logout
        authStore.logout()
        throw new Error('Sessão expirada')
      }
      
      if (response.status === 403) {
        throw new Error('Acesso negado')
      }
      
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Erro ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
```

### useAuth Composable

```typescript
// Composable para autenticação
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
// Composable para verificação de permissões
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

### useBarbeariaWatch Composable

```typescript
// Composable para reatividade de barbearia
export const useBarbeariaWatch = () => {
  const barbeariasStore = useBarbeariasStore()
  
  // Watcher para mudanças na barbearia selecionada
  watch(
    () => barbeariasStore.barbeariaSelecionada,
    (novaBarbearia) => {
      if (novaBarbearia) {
        // Recarregar dados quando barbearia muda
        // Exemplo: recarregar clientes, colaboradores, etc.
        console.log('Barbearia mudou para:', novaBarbearia.nome)
      }
    },
    { immediate: true }
  )
  
  return {
    barbeariaSelecionada: computed(() => barbeariasStore.barbeariaSelecionada),
    barbeariaSelecionadaId: computed(() => barbeariasStore.barbeariaSelecionadaId)
  }
}
```

## Funções de Máscara e Input

### Máscaras de Input

```typescript
// Máscara para telefone
export const phoneMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  } else {
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }
}

// Máscara para CPF
export const cpfMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
}

// Máscara para CNPJ
export const cnpjMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
}

// Máscara para CEP
export const cepMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  return cleaned.replace(/(\d{5})(\d{0,3})/, '$1-$2')
}

// Máscara para dinheiro
export const moneyMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  const number = parseInt(cleaned) / 100
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Exemplos de uso:
phoneMask("11987654321")     // "(11) 98765-4321"
cpfMask("12345678901")       // "123.456.789-01"
cnpjMask("12345678000195")   // "12.345.678/0001-95"
cepMask("01234567")          // "01234-567"
moneyMask("150000")          // "R$ 1.500,00"
```

### Formatação de Input

```typescript
// Formatação de input de porcentagem
export const formatPercentInput = (value: string): string => {
  // Remove caracteres não numéricos exceto vírgula e ponto
  let cleaned = value.replace(/[^\d,.]/g, '')
  
  // Substitui vírgula por ponto
  cleaned = cleaned.replace(',', '.')
  
  // Remove pontos extras, mantendo apenas o último
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limita a 2 casas decimais
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + '.' + parts[1].substring(0, 2)
  }
  
  return cleaned
}

// Formatação de input de dinheiro
export const formatMoneyInput = (value: string): string => {
  // Remove tudo exceto números
  const cleaned = value.replace(/\D/g, '')
  
  // Converte para centavos
  const cents = parseInt(cleaned) || 0
  
  // Formata como moeda
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Exemplos de uso:
formatPercentInput("15,5")          // "15.5"
formatPercentInput("15,50")         // "15.50"
formatMoneyInput("1500")            // "15,00"
formatMoneyInput("150000")          // "1.500,00"
```

## Funções de Storage

### LocalStorage

```typescript
// Chave de storage
export const STORAGE_KEY = "barber_app_data"

// Salvar no localStorage
export const saveToStorage = (key: string, data: any): void => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error)
  }
}

// Carregar do localStorage
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === 'undefined') return defaultValue
    
    const raw = localStorage.getItem(key)
    if (!raw) return defaultValue
    
    return JSON.parse(raw)
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error)
    return defaultValue
  }
}

// Remover do localStorage
export const removeFromStorage = (key: string): void => {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Erro ao remover do localStorage:', error)
  }
}

// Exemplos de uso:
saveToStorage('user_preferences', { theme: 'dark' })
const preferences = loadFromStorage('user_preferences', { theme: 'light' })
removeFromStorage('temp_data')
```

### SessionStorage

```typescript
// Salvar no sessionStorage
export const saveToSession = (key: string, data: any): void => {
  try {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar no sessionStorage:', error)
  }
}

// Carregar do sessionStorage
export const loadFromSession = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === 'undefined') return defaultValue
    
    const raw = sessionStorage.getItem(key)
    if (!raw) return defaultValue
    
    return JSON.parse(raw)
  } catch (error) {
    console.error('Erro ao carregar do sessionStorage:', error)
    return defaultValue
  }
}

// Exemplos de uso:
saveToSession('current_form', formData)
const formData = loadFromSession('current_form', {})
```

## Funções de Debounce e Throttle

### Debounce

```typescript
// Debounce para evitar muitas chamadas
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Exemplo de uso:
const debouncedSearch = debounce((query: string) => {
  // Fazer busca
  console.log('Buscando:', query)
}, 300)

// Uso em input
// debouncedSearch(inputValue)
```

### Throttle

```typescript
// Throttle para limitar frequência de chamadas
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Exemplo de uso:
const throttledScroll = throttle(() => {
  // Processar scroll
  console.log('Scroll event')
}, 100)

// Uso em scroll
// window.addEventListener('scroll', throttledScroll)
```

## Funções de URL e Query

### Manipulação de Query Parameters

```typescript
// Obter query parameters
export const getQueryParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  
  return result
}

// Definir query parameters
export const setQueryParams = (params: Record<string, string>): void => {
  if (typeof window === 'undefined') return
  
  const url = new URL(window.location.href)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
  })
  
  window.history.replaceState({}, '', url.toString())
}

// Exemplos de uso:
const params = getQueryParams()        // { page: "1", search: "barber" }
setQueryParams({ page: "2", filter: "active" })
```

## Implementação em React Native

### AsyncStorage

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage'

// Salvar dados
export const saveToAsyncStorage = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar no AsyncStorage:', error)
  }
}

// Carregar dados
export const loadFromAsyncStorage = async (key: string, defaultValue: any = null) => {
  try {
    const raw = await AsyncStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch (error) {
    console.error('Erro ao carregar do AsyncStorage:', error)
    return defaultValue
  }
}

// Remover dados
export const removeFromAsyncStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error('Erro ao remover do AsyncStorage:', error)
  }
}
```

### Formatação para React Native

```javascript
// Formatação de moeda para React Native
export const formatMoneyRN = (value) => {
  if (value == null) return "—"
  return "R$ " + (Number(value) || 0).toLocaleString("pt-BR", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })
}

// Formatação de data para React Native
export const formatDateRN = (dateString) => {
  if (!dateString) return "—"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "—"
    
    return date.toLocaleDateString("pt-BR")
  } catch (error) {
    return "—"
  }
}

// Máscara de telefone para React Native
export const phoneMaskRN = (value) => {
  const cleaned = value.replace(/\D/g, '')
  
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  } else {
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }
}
```

### Debounce para React Native

```javascript
import { useCallback, useRef } from 'react'

export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null)
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay])
  
  return debouncedCallback
}

// Exemplo de uso:
const debouncedSearch = useDebounce((query) => {
  // Fazer busca
  console.log('Buscando:', query)
}, 300)
```

## Testes das Funções Utilitárias

### Testes Unitários

```typescript
describe('Funções Utilitárias', () => {
  describe('formatMoney', () => {
    test('deve formatar valores monetários corretamente', () => {
      expect(formatMoney(1500.50)).toBe('R$ 1.500,50')
      expect(formatMoney(0)).toBe('R$ 0,00')
      expect(formatMoney(null)).toBe('—')
    })
  })
  
  describe('formatDate', () => {
    test('deve formatar datas corretamente', () => {
      expect(formatDate('2024-01-20')).toBe('20/01/2024')
      expect(formatDate('2024-01-20T14:30:00')).toBe('20/01/2024')
      expect(formatDate(null)).toBe('—')
    })
  })
  
  describe('isValidEmail', () => {
    test('deve validar emails corretamente', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })
  
  describe('phoneMask', () => {
    test('deve aplicar máscara de telefone corretamente', () => {
      expect(phoneMask('11987654321')).toBe('(11) 98765-4321')
      expect(phoneMask('1133334444')).toBe('(11) 3333-4444')
    })
  })
})
```

## Considerações de Performance

### Otimizações

```typescript
// Memoização de funções custosas
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Exemplo de uso:
const expensiveCalculation = memoize((n: number) => {
  // Cálculo custoso
  return n * n * n
})
```

### Lazy Loading

```typescript
// Carregamento sob demanda
export const lazyLoad = <T>(loader: () => Promise<T>) => {
  let promise: Promise<T> | null = null
  
  return () => {
    if (!promise) {
      promise = loader()
    }
    return promise
  }
}

// Exemplo de uso:
const lazyData = lazyLoad(() => import('./heavy-module'))
const data = await lazyData()
```
