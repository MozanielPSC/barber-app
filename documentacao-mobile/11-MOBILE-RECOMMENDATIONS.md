# Barber App - Recomendações para Mobile

## Visão Geral

Este documento fornece recomendações específicas para implementar o Barber App em React Native/Expo, incluindo bibliotecas recomendadas, adaptações de UX, considerações de performance e melhores práticas para desenvolvimento mobile.

## Stack Tecnológico Recomendado

### Core Framework
- **React Native**: Framework principal
- **Expo**: Plataforma de desenvolvimento (recomendado para MVP)
- **TypeScript**: Tipagem estática (mantém consistência com o frontend)

### Navegação
- **React Navigation v6**: Biblioteca padrão para navegação
- **@react-navigation/native**: Core da navegação
- **@react-navigation/stack**: Navegação em pilha
- **@react-navigation/bottom-tabs**: Abas inferiores
- **@react-navigation/drawer**: Menu lateral (drawer)

```javascript
// Exemplo de configuração de navegação
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

// Estrutura de navegação principal
const AppNavigator = () => (
  <NavigationContainer>
    <Drawer.Navigator>
      <Drawer.Screen name="MainTabs" component={MainTabs} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  </NavigationContainer>
)
```

### Gerenciamento de Estado
- **Redux Toolkit**: Para estado global complexo
- **Zustand**: Alternativa mais simples (recomendado para MVP)
- **React Query/TanStack Query**: Para cache e sincronização de dados

```javascript
// Exemplo com Zustand
import { create } from 'zustand'

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data
      
      set({ user, token, isAuthenticated: true })
      await AsyncStorage.setItem('token', token)
    } catch (error) {
      throw error
    }
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    AsyncStorage.removeItem('token')
  }
}))
```

### UI e Componentes
- **React Native Paper**: Biblioteca Material Design
- **NativeBase**: Alternativa com componentes customizáveis
- **React Native Elements**: Componentes básicos bem estruturados

```javascript
// Exemplo com React Native Paper
import { Provider as PaperProvider, Button, Card, TextInput } from 'react-native-paper'

const LoginScreen = () => (
  <PaperProvider>
    <Card style={styles.card}>
      <Card.Content>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
        />
        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
        />
        <Button mode="contained" onPress={handleLogin}>
          Entrar
        </Button>
      </Card.Content>
    </Card>
  </PaperProvider>
)
```

### Formulários
- **React Hook Form**: Gerenciamento de formulários
- **Yup**: Validação de schemas
- **React Native Masked Text**: Máscaras de input

```javascript
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  telefone: yup.string().required('Telefone é obrigatório'),
  email: yup.string().email('Email inválido')
})

const ClienteForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  
  const onSubmit = (data) => {
    console.log(data)
  }
  
  return (
    <View>
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nome"
            value={value}
            onChangeText={onChange}
            error={!!errors.nome}
          />
        )}
      />
      {errors.nome && <Text style={styles.error}>{errors.nome.message}</Text>}
      
      <Button onPress={handleSubmit(onSubmit)}>Salvar</Button>
    </View>
  )
}
```

### Calendário e Agenda
- **react-native-calendars**: Biblioteca de calendário
- **react-native-calendar-picker**: Seletor de datas
- **react-native-super-grid**: Grid responsivo para agenda

```javascript
import { Calendar } from 'react-native-calendars'

const AgendaScreen = () => {
  const [selectedDate, setSelectedDate] = useState('')
  
  return (
    <Calendar
      onDayPress={(day) => setSelectedDate(day.dateString)}
      markedDates={{
        [selectedDate]: { selected: true, selectedColor: '#0EA5E9' }
      }}
    />
  )
}
```

### Imagens e Mídia
- **expo-image-picker**: Seleção de imagens
- **expo-image**: Componente de imagem otimizado
- **react-native-image-crop-picker**: Edição de imagens

```javascript
import * as ImagePicker from 'expo-image-picker'

const PhotoUpload = () => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }
  
  return (
    <Button onPress={pickImage}>
      Selecionar Foto
    </Button>
  )
}
```

### Requisições HTTP
- **Axios**: Cliente HTTP
- **TanStack Query**: Cache e sincronização
- **React Query**: Alternativa mais simples

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.barberapp.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => api.get('/clientes').then(res => res.data)
  })
}

const useCreateCliente = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (cliente) => api.post('/clientes', cliente),
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes'])
    }
  })
}
```

### Storage
- **@react-native-async-storage/async-storage**: Armazenamento local
- **expo-secure-store**: Armazenamento seguro para tokens

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

// Para dados não sensíveis
const saveData = async (key, data) => {
  await AsyncStorage.setItem(key, JSON.stringify(data))
}

// Para dados sensíveis (tokens)
const saveToken = async (token) => {
  await SecureStore.setItemAsync('token', token)
}
```

### Notificações
- **expo-notifications**: Notificações push
- **react-native-flash-message**: Mensagens temporárias

```javascript
import * as Notifications from 'expo-notifications'
import FlashMessage from 'react-native-flash-message'

// Configurar notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

// Mostrar mensagem flash
const showMessage = (message, type = 'success') => {
  FlashMessage.show({
    message,
    type,
    duration: 3000
  })
}
```

## Adaptações de UX para Mobile

### Navegação Mobile

#### Bottom Tabs (Principais)
```javascript
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#0EA5E9',
      tabBarInactiveTintColor: '#6B7280',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB'
      }
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />
      }}
    />
    <Tab.Screen 
      name="Agenda" 
      component={AgendaScreen}
      options={{
        tabBarIcon: ({ color }) => <CalendarIcon color={color} size={24} />
      }}
    />
    <Tab.Screen 
      name="Clientes" 
      component={ClientesScreen}
      options={{
        tabBarIcon: ({ color }) => <UsersIcon color={color} size={24} />
      }}
    />
    <Tab.Screen 
      name="Produtos" 
      component={ProdutosScreen}
      options={{
        tabBarIcon: ({ color }) => <CubeIcon color={color} size={24} />
      }}
    />
  </Tab.Navigator>
)
```

#### Drawer Menu (Secundário)
```javascript
const DrawerContent = ({ navigation }) => (
  <View style={styles.drawerContainer}>
    <View style={styles.header}>
      <Image source={{ uri: user?.foto_perfil_url }} style={styles.avatar} />
      <Text style={styles.userName}>{user?.nome}</Text>
      <Text style={styles.userRole}>{user?.tipo}</Text>
    </View>
    
    <ScrollView style={styles.menuItems}>
      <DrawerItem
        label="Perfil"
        icon="account"
        onPress={() => navigation.navigate('Profile')}
      />
      <DrawerItem
        label="Configurações"
        icon="cog"
        onPress={() => navigation.navigate('Settings')}
      />
      <DrawerItem
        label="Sair"
        icon="logout"
        onPress={handleLogout}
      />
    </ScrollView>
  </View>
)
```

### Layout Responsivo

#### Adaptação de Telas
```javascript
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const isTablet = width >= 768
const isLandscape = width > height

const ResponsiveLayout = ({ children }) => (
  <View style={[
    styles.container,
    isTablet && styles.tabletContainer,
    isLandscape && styles.landscapeContainer
  ]}>
    {children}
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  tabletContainer: {
    padding: 24,
    maxWidth: 1200,
    alignSelf: 'center'
  },
  landscapeContainer: {
    flexDirection: 'row'
  }
})
```

#### Grid Responsivo
```javascript
import { FlatGrid } from 'react-native-super-grid'

const ResponsiveGrid = ({ data, renderItem }) => {
  const itemWidth = isTablet ? 200 : 150
  
  return (
    <FlatGrid
      itemDimension={itemWidth}
      data={data}
      renderItem={renderItem}
      spacing={16}
      maxItemsPerRow={isTablet ? 4 : 2}
    />
  )
}
```

### Gestos e Interações

#### Swipe Actions
```javascript
import { SwipeRow } from 'react-native-swipe-list-view'

const SwipeableItem = ({ item, onEdit, onDelete }) => (
  <SwipeRow
    leftOpenValue={75}
    rightOpenValue={-75}
    left={
      <View style={styles.leftSwipe}>
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Text style={styles.swipeText}>Editar</Text>
        </TouchableOpacity>
      </View>
    }
    right={
      <View style={styles.rightSwipe}>
        <TouchableOpacity onPress={() => onDelete(item)}>
          <Text style={styles.swipeText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    }
  >
    <View style={styles.itemContent}>
      <Text>{item.nome}</Text>
    </View>
  </SwipeRow>
)
```

#### Pull to Refresh
```javascript
const ListWithRefresh = () => {
  const [refreshing, setRefreshing] = useState(false)
  
  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  )
}
```

### Inputs Mobile-First

#### Teclado Otimizado
```javascript
const PhoneInput = () => {
  return (
    <TextInput
      label="Telefone"
      value={phone}
      onChangeText={setPhone}
      keyboardType="phone-pad"
      placeholder="(11) 99999-9999"
      maxLength={15}
    />
  )
}

const MoneyInput = () => {
  return (
    <TextInput
      label="Valor"
      value={money}
      onChangeText={setMoney}
      keyboardType="numeric"
      placeholder="R$ 0,00"
    />
  )
}
```

#### Date Picker
```javascript
import DateTimePicker from '@react-native-community/datetimepicker'

const DatePicker = ({ value, onChange }) => {
  const [show, setShow] = useState(false)
  
  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <TextInput
          label="Data"
          value={formatDate(value)}
          editable={false}
          right={<TextInput.Icon icon="calendar" />}
        />
      </TouchableOpacity>
      
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShow(false)
            onChange(selectedDate)
          }}
        />
      )}
    </View>
  )
}
```

## Considerações de Performance

### Otimização de Listas

#### FlatList Otimizada
```javascript
const OptimizedList = ({ data }) => {
  const renderItem = useCallback(({ item }) => (
    <ListItem item={item} />
  ), [])
  
  const keyExtractor = useCallback((item) => item.id.toString(), [])
  
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), [])
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
    />
  )
}
```

#### Virtualização
```javascript
import { VirtualizedList } from 'react-native'

const VirtualizedDataList = ({ data }) => {
  const getItem = (data, index) => data[index]
  const getItemCount = (data) => data.length
  
  return (
    <VirtualizedList
      data={data}
      getItem={getItem}
      getItemCount={getItemCount}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  )
}
```

### Cache e Sincronização

#### React Query Configuration
```javascript
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

// Cache offline
const useOfflineQuery = (queryKey, queryFn) => {
  return useQuery({
    queryKey,
    queryFn,
    networkMode: 'offlineFirst',
    staleTime: Infinity,
  })
}
```

#### AsyncStorage Cache
```javascript
const useCachedData = (key, fetcher) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Tentar carregar do cache primeiro
        const cached = await AsyncStorage.getItem(key)
        if (cached) {
          setData(JSON.parse(cached))
        }
        
        // Buscar dados atualizados
        const freshData = await fetcher()
        setData(freshData)
        
        // Salvar no cache
        await AsyncStorage.setItem(key, JSON.stringify(freshData))
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [key, fetcher])
  
  return { data, loading }
}
```

### Lazy Loading

#### Component Lazy Loading
```javascript
import { lazy, Suspense } from 'react'
import { View, ActivityIndicator } from 'react-native'

const LazyScreen = lazy(() => import('./HeavyScreen'))

const App = () => (
  <Suspense fallback={
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#0EA5E9" />
    </View>
  }>
    <LazyScreen />
  </Suspense>
)
```

#### Image Lazy Loading
```javascript
import { Image } from 'expo-image'

const LazyImage = ({ uri, placeholder }) => (
  <Image
    source={{ uri }}
    placeholder={placeholder}
    contentFit="cover"
    transition={200}
    style={styles.image}
  />
)
```

## Autenticação Mobile

### Implementação com Expo Secure Store

```javascript
import * as SecureStore from 'expo-secure-store'
import * as LocalAuthentication from 'expo-local-authentication'

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data
      
      // Salvar token de forma segura
      await SecureStore.setItemAsync('token', token)
      await SecureStore.setItemAsync('user', JSON.stringify(user))
      
      setUser(user)
      setIsAuthenticated(true)
      
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  const logout = async () => {
    await SecureStore.deleteItemAsync('token')
    await SecureStore.deleteItemAsync('user')
    setUser(null)
    setIsAuthenticated(false)
  }
  
  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('token')
      const userData = await SecureStore.getItemAsync('user')
      
      if (token && userData) {
        // Validar token com o servidor
        const response = await api.get('/auth/me')
        setUser(response.data.user)
        setIsAuthenticated(true)
      }
    } catch (error) {
      // Token inválido, fazer logout
      await logout()
    }
  }
  
  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
```

### Biometria

```javascript
const useBiometricAuth = () => {
  const [isAvailable, setIsAvailable] = useState(false)
  
  useEffect(() => {
    checkBiometricAvailability()
  }, [])
  
  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled = await LocalAuthentication.isEnrolledAsync()
    setIsAvailable(hasHardware && isEnrolled)
  }
  
  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Use sua biometria para entrar',
        fallbackLabel: 'Usar senha',
      })
      
      return result.success
    } catch (error) {
      console.error('Erro na autenticação biométrica:', error)
      return false
    }
  }
  
  return {
    isAvailable,
    authenticate
  }
}
```

## Upload de Imagens

### Implementação com Expo

```javascript
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false)
  
  const pickAndUploadImage = async () => {
    try {
      // Solicitar permissão
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (permissionResult.granted === false) {
        throw new Error('Permissão negada para acessar a galeria')
      }
      
      // Selecionar imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })
      
      if (result.canceled) return null
      
      // Redimensionar imagem
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500, height: 500 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      )
      
      // Upload
      setUploading(true)
      const uploadResult = await uploadImage(manipulatedImage.uri)
      
      return uploadResult
    } catch (error) {
      console.error('Erro no upload:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }
  
  const uploadImage = async (uri) => {
    const formData = new FormData()
    formData.append('foto', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    })
    
    const response = await api.post('/auth/foto-perfil', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  }
  
  return {
    pickAndUploadImage,
    uploading
  }
}
```

## Notificações Push

### Configuração com Expo

```javascript
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('')
  
  useEffect(() => {
    registerForPushNotifications()
  }, [])
  
  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      console.log('Notificações push não funcionam em simulador')
      return
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permissão para notificações negada')
      return
    }
    
    const token = await Notifications.getExpoPushTokenAsync()
    setExpoPushToken(token.data)
    
    // Enviar token para o servidor
    await api.post('/notifications/register', {
      token: token.data,
      platform: Platform.OS
    })
  }
  
  const scheduleNotification = async (title, body, data) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Imediato
    })
  }
  
  return {
    expoPushToken,
    scheduleNotification
  }
}
```

## Testes Mobile

### Testes Unitários

```javascript
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (component) => {
  const queryClient = createTestQueryClient()
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('LoginScreen', () => {
  test('deve fazer login com credenciais válidas', async () => {
    const mockLogin = jest.fn()
    const { getByPlaceholderText, getByText } = renderWithProviders(
      <LoginScreen onLogin={mockLogin} />
    )
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com')
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password123')
    fireEvent.press(getByText('Entrar'))
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123'
      })
    })
  })
})
```

### Testes de Integração

```javascript
import { render, fireEvent, waitFor } from '@testing-library/react-native'

describe('ClienteForm', () => {
  test('deve criar cliente com dados válidos', async () => {
    const mockOnSubmit = jest.fn()
    const { getByPlaceholderText, getByText } = render(
      <ClienteForm onSubmit={mockOnSubmit} />
    )
    
    fireEvent.changeText(getByPlaceholderText('Nome'), 'João Silva')
    fireEvent.changeText(getByPlaceholderText('Telefone'), '11987654321')
    fireEvent.changeText(getByPlaceholderText('Email'), 'joao@example.com')
    fireEvent.press(getByText('Salvar'))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nome: 'João Silva',
        telefone: '11987654321',
        email: 'joao@example.com'
      })
    })
  })
})
```

## Deploy e Distribuição

### Build com Expo

```json
{
  "expo": {
    "name": "Barber App",
    "slug": "barber-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.barberapp.mobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.barberapp.mobile"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### EAS Build

```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Configurar projeto
eas build:configure

# Build para desenvolvimento
eas build --platform ios --profile development

# Build para produção
eas build --platform all --profile production
```

## Considerações de Segurança

### Validação de Dados

```javascript
import * as yup from 'yup'

const clienteSchema = yup.object({
  nome: yup.string().required().min(2).max(100),
  telefone: yup.string().required().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/),
  email: yup.string().email().optional(),
})

const validateCliente = async (data) => {
  try {
    await clienteSchema.validate(data)
    return { isValid: true, errors: {} }
  } catch (error) {
    return { isValid: false, errors: { [error.path]: error.message } }
  }
}
```

### Sanitização de Inputs

```javascript
import DOMPurify from 'isomorphic-dompurify'

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim())
  }
  return input
}

const sanitizeFormData = (data) => {
  const sanitized = {}
  Object.entries(data).forEach(([key, value]) => {
    sanitized[key] = sanitizeInput(value)
  })
  return sanitized
}
```

## Monitoramento e Analytics

### Crashlytics

```javascript
import crashlytics from '@react-native-firebase/crashlytics'

const logError = (error, context = {}) => {
  crashlytics().recordError(error)
  crashlytics().setAttributes(context)
}

const setUserContext = (user) => {
  crashlytics().setUserId(user.id)
  crashlytics().setAttributes({
    email: user.email,
    tipo: user.tipo
  })
}
```

### Analytics

```javascript
import analytics from '@react-native-firebase/analytics'

const trackEvent = (eventName, parameters = {}) => {
  analytics().logEvent(eventName, parameters)
}

const trackScreen = (screenName) => {
  analytics().setCurrentScreen(screenName)
}

// Exemplos de uso
trackEvent('cliente_criado', { 
  colaborador_id: user.colaborador_id,
  barbearia_id: user.barbearia_id 
})

trackScreen('agenda_screen')
```

## Checklist de Implementação

### Fase 1 - MVP (4-6 semanas)
- [ ] Configuração do projeto Expo
- [ ] Navegação básica (Stack + Tabs)
- [ ] Autenticação (login/logout)
- [ ] Dashboard básico
- [ ] Lista de clientes
- [ ] Formulário de cliente
- [ ] Lista de agendamentos
- [ ] Formulário de agendamento

### Fase 2 - Funcionalidades Core (6-8 semanas)
- [ ] Sistema de comissões
- [ ] Gestão de produtos/serviços
- [ ] Upload de foto de perfil
- [ ] Notificações push
- [ ] Modo offline básico
- [ ] Sincronização de dados

### Fase 3 - Funcionalidades Avançadas (4-6 semanas)
- [ ] Sistema de estoque
- [ ] Relatórios financeiros
- [ ] Gestão de colaboradores
- [ ] Configurações avançadas
- [ ] Biometria
- [ ] Performance otimizada

### Fase 4 - Polimento (2-4 semanas)
- [ ] Testes automatizados
- [ ] Deploy para stores
- [ ] Monitoramento e analytics
- [ ] Documentação
- [ ] Treinamento de usuários
