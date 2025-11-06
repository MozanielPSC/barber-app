# Documentação Base - Sistema de Cores e Componentes

## Visão Geral

Este documento descreve a base visual e de componentes do sistema para implementação em React Native. Todas as telas seguem este padrão de cores, tipografia e componentes reutilizáveis.

## Sistema de Cores

### Modo Claro (Light Mode)

#### Cores Principais
- **Fundo Principal**: `#FFFFFF` (branco)
- **Fundo Secundário**: `#F9FAFB` (gray-50)
- **Fundo Cards**: `#FFFFFF` (branco)
- **Bordas**: `#E5E7EB` (gray-200)
- **Texto Principal**: `#111827` (gray-900)
- **Texto Secundário**: `#6B7280` (gray-500)
- **Texto Terciário**: `#9CA3AF` (gray-400)

#### Cores de Ação
- **Primária**: `#6366F1` (indigo-500)
- **Primária Hover**: `#4F46E5` (indigo-600)
- **Sucesso**: `#10B981` (green-500)
- **Erro**: `#EF4444` (red-500)
- **Aviso**: `#F59E0B` (amber-500)
- **Info**: `#3B82F6` (blue-500)

#### Gradientes
- **Gradiente Principal**: `from-purple-600 to-blue-600` (`#9333EA` → `#2563EB`)
- **Gradiente Hover**: `from-purple-700 to-blue-700` (`#7E22CE` → `#1D4ED8`)

### Modo Escuro (Dark Mode)

#### Cores Principais
- **Fundo Principal**: `#111827` (gray-900)
- **Fundo Secundário**: `#1F2937` (gray-800)
- **Fundo Cards**: `#1F2937` (gray-800)
- **Bordas**: `#374151` (gray-700)
- **Texto Principal**: `#F9FAFB` (gray-50)
- **Texto Secundário**: `#D1D5DB` (gray-300)
- **Texto Terciário**: `#9CA3AF` (gray-400)

#### Cores de Ação (Dark)
- **Primária**: `#818CF8` (indigo-400)
- **Primária Hover**: `#6366F1` (indigo-500)
- **Sucesso**: `#34D399` (green-400)
- **Erro**: `#F87171` (red-400)
- **Aviso**: `#FBBF24` (amber-400)
- **Info**: `#60A5FA` (blue-400)

#### Cores Neon (para gráficos e destaques)
- **Verde Neon**: `#00FF88`
- **Vermelho Neon**: `#FF3366`
- **Azul Neon**: `#00AAFF`

## Tipografia

### Fontes
- **Família Principal**: Nunito Sans (ou equivalente no React Native)
- **Fallback**: System default (San Francisco no iOS, Roboto no Android)

### Tamanhos
- **H1 (Título Principal)**: 32px, font-weight: 700 (bold)
- **H2 (Subtítulo)**: 24px, font-weight: 600 (semibold)
- **H3 (Seção)**: 20px, font-weight: 600 (semibold)
- **H4 (Subseção)**: 18px, font-weight: 600 (semibold)
- **Body Large**: 16px, font-weight: 400 (regular)
- **Body**: 14px, font-weight: 400 (regular)
- **Body Small**: 12px, font-weight: 400 (regular)
- **Caption**: 11px, font-weight: 400 (regular)
- **Uppercase Labels**: 12px, font-weight: 600 (semibold), letter-spacing: 0.05em

## Espaçamentos

### Padding
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px

### Margin
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 48px

### Gap (espaçamento entre elementos)
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px

## Componentes Base Reutilizáveis

### 1. Card Container

```tsx
// React Native
import { View, StyleSheet } from 'react-native';

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', // dark: '#1F2937'
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB', // dark: '#374151'
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // Android
  },
});
```

### 2. Botão Primário

```tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PrimaryButton = ({ title, onPress, disabled, loading }) => (
  <TouchableOpacity 
    onPress={onPress} 
    disabled={disabled || loading}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={disabled 
        ? ['#9CA3AF', '#6B7280'] 
        : ['#9333EA', '#2563EB']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.button, disabled && styles.buttonDisabled]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### 3. Input Text

```tsx
import { TextInput, View, Text, StyleSheet } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, error }) => (
  <View style={styles.container}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={[styles.input, error && styles.inputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={secureTextEntry}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827', // dark: '#F9FAFB'
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB', // dark: '#374151'
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827', // dark: '#F9FAFB'
    backgroundColor: '#FFFFFF', // dark: '#1F2937'
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});
```

### 4. Badge/Status

```tsx
import { View, Text, StyleSheet } from 'react-native';

const Badge = ({ text, variant = 'default' }) => {
  const variantStyles = {
    default: { bg: '#E5E7EB', text: '#111827' },
    success: { bg: '#D1FAE5', text: '#065F46' },
    error: { bg: '#FEE2E2', text: '#991B1B' },
    warning: { bg: '#FEF3C7', text: '#92400E' },
    info: { bg: '#DBEAFE', text: '#1E40AF' },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.badgeText, { color: style.text }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
```

### 5. Loading Spinner

```tsx
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const LoadingSpinner = ({ size = 'large', color }) => (
  <View style={styles.container}>
    <ActivityIndicator 
      size={size} 
      color={color || '#6366F1'} 
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
```

### 6. Empty State

```tsx
import { View, Text, StyleSheet } from 'react-native';

const EmptyState = ({ icon, title, message }) => (
  <View style={styles.container}>
    {icon && <View style={styles.iconContainer}>{icon}</View>}
    <Text style={styles.title}>{title}</Text>
    {message && <Text style={styles.message}>{message}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827', // dark: '#F9FAFB'
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6B7280', // dark: '#D1D5DB'
    textAlign: 'center',
  },
});
```

## Gerenciamento de Tema

### Context/Store para Tema

```tsx
// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      setTheme(savedTheme || systemTheme || 'light');
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
      setTheme(systemTheme || 'light');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

### Cores por Tema

```tsx
// colors.ts
export const lightColors = {
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const darkColors = {
  background: '#111827',
  backgroundSecondary: '#1F2937',
  card: '#1F2937',
  border: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  primary: '#818CF8',
  primaryHover: '#6366F1',
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
};
```

## Bibliotecas Recomendadas

### Navegação
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`
- `@react-navigation/drawer`

### UI Components
- `react-native-paper` (Material Design components)
- `react-native-elements` (UI toolkit)
- `react-native-vector-icons` (Ícones)
- `expo-linear-gradient` (Gradientes)

### Estado
- `@reduxjs/toolkit` ou `zustand` (gerenciamento de estado)
- `react-query` ou `@tanstack/react-query` (cache e requisições)

### Utilitários
- `@react-native-async-storage/async-storage` (armazenamento local)
- `react-native-safe-area-context` (SafeArea)
- `react-native-gesture-handler` (gestos)

### Formulários
- `react-hook-form` (validação de formulários)
- `yup` (schema validation)

### Gráficos
- `react-native-chart-kit` ou `victory-native` (gráficos)

## Estrutura de Pastas Recomendada

```
src/
├── components/
│   ├── base/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   └── ...
├── screens/
│   ├── auth/
│   ├── dashboard/
│   └── ...
├── navigation/
│   ├── AppNavigator.tsx
│   └── ...
├── store/
│   ├── auth.ts
│   ├── app.ts
│   └── ...
├── services/
│   ├── api.ts
│   └── ...
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   └── ThemeContext.tsx
└── utils/
    ├── formatters.ts
    └── ...
```

## Notas Importantes

1. **Responsividade**: Use `Dimensions` do React Native para adaptar layouts
2. **Safe Area**: Sempre use `SafeAreaView` para respeitar áreas seguras do dispositivo
3. **Performance**: Use `FlatList` para listas longas, não `ScrollView` com `map`
4. **Acessibilidade**: Adicione `accessibilityLabel` em todos os elementos interativos
5. **Loading States**: Sempre mostre estados de carregamento durante requisições
6. **Error Handling**: Trate erros de forma amigável ao usuário
7. **Offline**: Considere cache local para funcionamento offline básico

