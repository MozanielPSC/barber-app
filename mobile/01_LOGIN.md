# Tela de Login - Proprietário

## Visão Geral

Tela de autenticação para proprietários de barbearias. Permite login com email e senha, além de oferecer links para registro e login de colaborador.

## Layout Visual

### Estrutura da Tela

```
┌─────────────────────────────────┐
│                                 │
│   [Background com gradiente]    │
│   [Efeitos blur animados]       │
│                                 │
│   ┌─────────────────────────┐  │
│   │   Beet Gestão           │  │
│   │   CRM + Financeiro       │  │
│   │   Gestão Profissional... │  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │                         │  │
│   │   [Formulário Login]    │  │
│   │   - Email               │  │
│   │   - Senha               │  │
│   │   - Botão Entrar        │  │
│   │                         │  │
│   │   Link: Registro        │  │
│   │   Divisor "ou"          │  │
│   │   Botão: Login Colab.   │  │
│   │                         │  │
│   └─────────────────────────┘  │
│                                 │
│   [Footer - Copyright]          │
│                                 │
└─────────────────────────────────┘
```

### Posicionamento

- **Container Principal**: Centralizado verticalmente e horizontalmente
- **Max Width**: 448px (max-w-md)
- **Padding**: 16px em todas as direções
- **Background**: Imagem de fundo com overlay de gradiente escuro

## Cores e Estilo

### Background
- **Imagem de Fundo**: `/login-bg.jpg` (opcional, pode ser gradiente puro)
- **Overlay Gradiente**: 
  - `from-slate-900/90` → `via-purple-900/80` → `to-slate-900/90`
  - Opacidade: 90% → 80% → 90%

### Efeitos Visuais
- **Blur Animado 1**: Círculo roxo (purple-500), 384px, blur-3xl, opacity-20, posição top-right
- **Blur Animado 2**: Círculo azul (blue-500), 384px, blur-3xl, opacity-20, posição bottom-left, delay 2s
- **Animação**: Pulse contínua

### Card de Login
- **Background**: `bg-white/95` (branco 95% opaco) com `backdrop-blur-xl`
- **Border**: `border-white/20` (branco 20% opaco)
- **Border Radius**: `rounded-2xl` (16px)
- **Padding**: 32px (p-8)
- **Shadow**: `shadow-2xl`

### Texto
- **Título Principal**: 
  - Cor: `text-white`
  - Tamanho: 48px (text-5xl)
  - Peso: `font-bold`
  - Tracking: `tracking-tight`
  - Drop shadow: `drop-shadow-lg`
- **Subtítulo**: 
  - Cor: `text-purple-200`
  - Tamanho: 20px (text-xl)
  - Peso: `font-semibold`
- **Descrição**: 
  - Cor: `text-purple-300/80`
  - Tamanho: 14px (text-sm)

## Componentes

### 1. Header
```tsx
<View style={styles.header}>
  <Text style={styles.title}>Beet Gestão</Text>
  <Text style={styles.subtitle}>CRM + Financeiro</Text>
  <Text style={styles.description}>Gestão Profissional para Barbearias</Text>
</View>
```

### 2. Input Email
- **Label**: "Email"
- **Tipo**: `email`
- **Placeholder**: "seu@email.com"
- **Autocomplete**: "username"
- **Estilo**: 
  - Border: 2px, `border-gray-200`
  - Border Radius: 12px
  - Padding: 16px horizontal, 12px vertical
  - Focus: ring-2, `ring-purple-500`, `border-purple-500`

### 3. Input Senha
- **Label**: "Senha"
- **Tipo**: `password` (toggleável)
- **Placeholder**: "••••••••"
- **Autocomplete**: "current-password"
- **Ícone**: Eye/EyeSlash (toggle mostrar senha)
- **Posição do ícone**: Direita, dentro do input
- **Estilo**: Mesmo do email

### 4. Botão Entrar
- **Tipo**: Submit
- **Estilo**: 
  - Gradiente: `from-purple-600 to-blue-600`
  - Hover: `from-purple-700 to-blue-700`
  - Disabled: `from-gray-400 to-gray-500`
- **Texto**: "Entrar" ou "Entrando..." (loading)
- **Padding**: 14px vertical, 16px horizontal
- **Border Radius**: 12px
- **Font**: Semibold, 16px, branco
- **Efeitos**: 
  - Hover: scale 1.02
  - Active: scale 0.98
  - Shadow: `shadow-lg`

### 5. Link para Registro
- **Texto**: "Não tem conta? Registre-se aqui"
- **Cor do link**: `text-purple-600`, hover: `text-purple-700`
- **Font**: Semibold
- **Posição**: Centro, abaixo do formulário
- **Border Top**: Divisor acima do link

### 6. Divisor "ou"
- **Linha esquerda**: Border-top, `border-purple-200`
- **Texto**: "ou", cor `text-purple-400`, padding horizontal 16px
- **Linha direita**: Border-top, `border-purple-200`

### 7. Botão Login Colaborador
- **Ícone**: UserIcon (heroicons)
- **Texto**: "Login de Colaborador"
- **Estilo**: 
  - Gradiente: `from-blue-500 to-purple-600`
  - Hover: `from-blue-600 to-purple-700`
- **Layout**: Flex row, items-center, gap-12px
- **Padding**: 14px vertical, 16px horizontal
- **Border Radius**: 12px
- **Font**: Semibold, branco

### 8. Mensagem de Erro
- **Background**: `bg-red-50`
- **Border**: `border-l-4 border-red-500`
- **Texto**: `text-red-700`
- **Padding**: 16px
- **Border Radius**: 8px
- **Animação**: Shake (se disponível)
- **Ícone**: SVG de erro (opcional)

### 9. Footer
- **Texto**: "© 2024 Beet Gestão • Todos os direitos reservados"
- **Cor**: `text-purple-200/60`
- **Tamanho**: 14px
- **Posição**: Centro, abaixo do card

## Funcionalidades

### Validações
1. **Email**: 
   - Obrigatório
   - Formato válido de email
   - Autocomplete: "username"
2. **Senha**: 
   - Obrigatória
   - Autocomplete: "current-password"

### Estados
1. **Loading**: 
   - Botão desabilitado
   - Spinner animado
   - Texto "Entrando..."
2. **Erro**: 
   - Mensagem de erro exibida abaixo do formulário
   - Cor vermelha
3. **Sucesso**: 
   - Redireciona para `/dashboard`
   - Salva token e usuário no storage

### Ações
1. **Submit Form**: Chama `authStore.login(loginForm)`
2. **Toggle Senha**: Mostra/oculta senha
3. **Navegar para Registro**: `/registro`
4. **Navegar para Login Colaborador**: `/login-colaborador`

## Rotas da API

### POST /auth/login

**Request Body:**
```json
{
  "email": "string",
  "senha": "string"
}
```

**Response Success (200):**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "nome_proprietario": "string",
    "nome_barbearia": "string",
    "tipo": "proprietario",
    "foto_perfil_url_assinada": "string | null"
  },
  "token": "string",
  "permissoes": []
}
```

**Response Error (401):**
```json
{
  "message": "Credenciais inválidas"
}
```

## Stores

### useAuthStore

**Actions utilizadas:**
- `login(credentials: LoginForm)`: Realiza login
  - Retorna: `{ success: boolean, error?: string }`

**State acessado:**
- `isLoading`: Estado de carregamento

**Após login bem-sucedido:**
- Salva token no localStorage
- Salva user no localStorage
- Salva permissões no localStorage (se houver)
- Define `isAuthenticated = true`
- Carrega barbearias do usuário (se proprietário)

## Dados Mockados (para testes)

```json
{
  "email": "proprietario@exemplo.com",
  "senha": "senha123"
}
```

