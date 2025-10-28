# Barber App - Tema e Design System

## Visão Geral

O Barber App utiliza **Tailwind CSS** como framework de estilização, com um design system bem definido que inclui paleta de cores personalizada, tipografia, espaçamentos e componentes reutilizáveis. O sistema suporta modo claro e escuro.

## Configuração do Tailwind

### Arquivo de Configuração (`tailwind.config.js`)

```javascript
export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        barber: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f7b977',
          400: '#f39340',
          500: '#f0731a',
          600: '#e15a10',
          700: '#bb4410',
          800: '#953616',
          900: '#782e15',
        }
      },
      fontFamily: {
        sans: ['Nunito Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        nunito: ['Nunito Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

## Paleta de Cores

### Cor Primária

#### Primary (Azul)
A aplicação utiliza uma paleta azul como cor principal do sistema.

```css
primary-50:  #f0f9ff  /* Backgrounds muito claros */
primary-100: #e0f2fe  /* Backgrounds claros */
primary-200: #bae6fd  /* Bordas claras */
primary-300: #7dd3fc  /* Elementos secundários */
primary-400: #38bdf8  /* Hover states */
primary-500: #0ea5e9  /* Cor principal */
primary-600: #0284c7  /* Estados ativos */
primary-700: #0369a1  /* Textos em fundos claros */
primary-800: #075985  /* Textos importantes */
primary-900: #0c4a6e  /* Textos principais */
```

> **Nota:** Existe uma paleta "barber" (laranja) definida no `tailwind.config.js`, mas ela não é utilizada atualmente na aplicação. O design utiliza apenas a paleta azul (primary) e cores padrão do Tailwind.

### Cores do Sistema

#### Cores Neutras (Gray)
- **50-100**: Backgrounds e superfícies
- **200-300**: Bordas e divisores
- **400-500**: Textos secundários
- **600-700**: Textos principais
- **800-900**: Textos importantes e títulos

#### Cores Semânticas
- **Green**: Sucesso, confirmação, valores positivos
- **Red**: Erro, alerta, valores negativos
- **Yellow**: Aviso, atenção
- **Blue**: Informação, links

### Modo Escuro

O sistema utiliza a classe `dark:` do Tailwind para modo escuro:

```css
/* Exemplo de uso */
.element {
  @apply bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100;
}
```

## Tipografia

### Fonte Principal
- **Família**: Nunito Sans
- **Fallbacks**: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif

### Hierarquia Tipográfica

#### Títulos
```css
/* H1 - Títulos principais */
.text-5xl .font-bold .tracking-tight

/* H2 - Títulos de seção */
.text-2xl .font-bold

/* H3 - Subtítulos */
.text-xl .font-semibold

/* H4 - Títulos de card */
.text-lg .font-medium
```

#### Textos
```css
/* Texto principal */
.text-base .font-normal

/* Texto secundário */
.text-sm .text-gray-600

/* Texto pequeno */
.text-xs .text-gray-500

/* Labels */
.text-sm .font-medium .text-gray-700
```

## Espaçamentos e Grid

### Sistema de Espaçamento
Baseado no sistema de espaçamento do Tailwind (4px = 1 unit):

```css
/* Espaçamentos comuns */
.p-1   /* 4px */
.p-2   /* 8px */
.p-3   /* 12px */
.p-4   /* 16px */
.p-6   /* 24px */
.p-8   /* 32px */
.p-12  /* 48px */
.p-16  /* 64px */
```

### Grid System
```css
/* Grid responsivo */
.grid .grid-cols-1 .md:grid-cols-2 .lg:grid-cols-3 .xl:grid-cols-4

/* Gaps */
.gap-2  /* 8px */
.gap-4  /* 16px */
.gap-6  /* 24px */
.gap-8  /* 32px */
```

## Componentes de UI Padrão

### 1. Botões

#### Botão Primário
```vue
<button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
  Botão Primário
</button>
```

#### Botão Secundário
```vue
<button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">
  Botão Secundário
</button>
```

#### Botão de Perigo
```vue
<button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
  Excluir
</button>
```

#### Botão de Sucesso
```vue
<button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
  Confirmar
</button>
```

### 2. Inputs

#### Input Padrão
```vue
<input 
  class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
  placeholder="Digite aqui..."
/>
```

#### Input com Ícone
```vue
<div class="relative">
  <input 
    class="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    placeholder="Buscar..."
  />
  <SearchIcon class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
</div>
```

#### Textarea
```vue
<textarea 
  class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
  rows="3"
  placeholder="Digite sua mensagem..."
></textarea>
```

### 3. Cards

#### Card Padrão
```vue
<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
    Título do Card
  </h3>
  <p class="text-gray-600 dark:text-gray-400">
    Conteúdo do card...
  </p>
</div>
```

#### Card com Ações
```vue
<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      Card com Ações
    </h3>
    <div class="flex space-x-2">
      <button class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
        <EditIcon class="h-4 w-4" />
      </button>
      <button class="p-2 text-gray-400 hover:text-red-600">
        <TrashIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
  <p class="text-gray-600 dark:text-gray-400">
    Conteúdo do card...
  </p>
</div>
```

### 4. Badges

#### Badge de Status
```vue
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
  Ativo
</span>
```

#### Badge de Contagem
```vue
<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
  5
</span>
```

### 5. Notificações

#### Notificação de Sucesso
```vue
<div class="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
  <div class="flex items-center">
    <CheckCircleIcon class="h-5 w-5 mr-2" />
    Operação realizada com sucesso!
  </div>
</div>
```

#### Notificação de Erro
```vue
<div class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
  <div class="flex items-center">
    <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
    Ocorreu um erro na operação.
  </div>
</div>
```

#### Notificação de Aviso
```vue
<div class="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
  <div class="flex items-center">
    <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
    Atenção: Verifique os dados informados.
  </div>
</div>
```

### 6. Modais

#### Modal Padrão
```vue
<div class="fixed inset-0 z-50 overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen px-4">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
    <!-- Modal -->
    <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Título do Modal
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Conteúdo do modal...
        </p>
        <div class="flex justify-end space-x-3">
          <button class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            Cancelar
          </button>
          <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 7. Dropdowns

#### Dropdown Padrão
```vue
<div class="relative">
  <button class="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600">
    <span>Opções</span>
    <ChevronDownIcon class="h-4 w-4" />
  </button>
  
  <div class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
    <div class="py-1">
      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
        Opção 1
      </button>
      <button class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
        Opção 2
      </button>
    </div>
  </div>
</div>
```

## Ícones

### Biblioteca de Ícones
- **Heroicons**: Biblioteca principal de ícones
- **Versão**: Outline e Solid
- **Tamanhos**: 16px (h-4 w-4), 20px (h-5 w-5), 24px (h-6 w-6)

### Ícones Mais Utilizados
```vue
<!-- Navegação -->
<HomeIcon class="h-5 w-5" />
<CalendarIcon class="h-5 w-5" />
<UsersIcon class="h-5 w-5" />
<UserGroupIcon class="h-5 w-5" />

<!-- Ações -->
<PlusIcon class="h-5 w-5" />
<EditIcon class="h-5 w-5" />
<TrashIcon class="h-5 w-5" />
<SearchIcon class="h-5 w-5" />

<!-- Estados -->
<CheckCircleIcon class="h-5 w-5" />
<ExclamationTriangleIcon class="h-5 w-5" />
<XCircleIcon class="h-5 w-5" />

<!-- Interface -->
<ChevronDownIcon class="h-5 w-5" />
<ChevronLeftIcon class="h-5 w-5" />
<ChevronRightIcon class="h-5 w-5" />
<XMarkIcon class="h-5 w-5" />
```

## Layouts Responsivos

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Padrões de Layout

#### Container Responsivo
```vue
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Conteúdo -->
</div>
```

#### Grid Responsivo
```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- Cards -->
</div>
```

#### Sidebar Responsivo
```vue
<div class="flex h-screen">
  <!-- Sidebar -->
  <div class="hidden lg:flex lg:w-64 lg:flex-col">
    <!-- Conteúdo do sidebar -->
  </div>
  
  <!-- Conteúdo principal -->
  <div class="flex-1 overflow-hidden">
    <!-- Conteúdo principal -->
  </div>
</div>
```

## Animações e Transições

### Transições Padrão
```css
/* Transição suave */
transition-all duration-200

/* Transição rápida */
transition-colors duration-150

/* Transição lenta */
transition-all duration-300

/* Easing personalizado */
transition-all duration-300 ease-in-out
```

### Animações Customizadas
```css
/* Pulse para loading */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Shake para erros */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

## Estados de Loading

### Spinner Padrão
```vue
<div class="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
```

### Skeleton Loading
```vue
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
</div>
```

### Loading Overlay
```vue
<div class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
  <div class="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
</div>
```

## Considerações para Mobile

### Touch Targets
- **Mínimo**: 44px x 44px para elementos tocáveis
- **Recomendado**: 48px x 48px para melhor usabilidade

### Espaçamentos Mobile
```css
/* Padding mobile */
.p-4   /* 16px - padrão */
.p-6   /* 24px - espaçamento maior */

/* Margin mobile */
.m-4   /* 16px - padrão */
.m-6   /* 24px - espaçamento maior */
```

### Tipografia Mobile
```css
/* Títulos mobile */
.text-2xl .font-bold  /* H1 mobile */
.text-xl .font-semibold  /* H2 mobile */
.text-lg .font-medium  /* H3 mobile */

/* Texto mobile */
.text-base .font-normal  /* Texto principal */
.text-sm .text-gray-600  /* Texto secundário */
```

## Implementação em React Native

### Cores para React Native
```javascript
const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
}
```

### Componentes React Native
```javascript
// Botão primário
const PrimaryButton = ({ title, onPress }) => (
  <TouchableOpacity
    style={{
      backgroundColor: colors.primary[600],
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
    }}
    onPress={onPress}
  >
    <Text style={{ color: 'white', fontWeight: '500', textAlign: 'center' }}>
      {title}
    </Text>
  </TouchableOpacity>
)

// Card
const Card = ({ children }) => (
  <View
    style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 24,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}
  >
    {children}
  </View>
)
```

### Bibliotecas Recomendadas
- **React Native Paper**: Componentes Material Design
- **NativeBase**: Biblioteca de componentes
- **React Native Vector Icons**: Ícones
- **React Native Linear Gradient**: Gradientes
- **React Native Reanimated**: Animações avançadas
