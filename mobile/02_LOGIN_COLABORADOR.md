# Tela de Login - Colaborador

## Visão Geral

Tela de autenticação específica para colaboradores de barbearias. Requer email, senha e código da barbearia (6 caracteres) fornecido pelo proprietário.

## Layout Visual

Similar à tela de login de proprietário, mas com campo adicional para código da barbearia e informação explicativa.

## Diferenças Principais

### Campo Adicional: Código da Barbearia
- **Label**: "Código da Barbearia"
- **Tipo**: `text`
- **Max Length**: 6 caracteres
- **Placeholder**: "ABC123"
- **Auto-uppercase**: Converte automaticamente para maiúsculas
- **Hint**: "Código de 6 caracteres fornecido pelo proprietário"

### Informação Explicativa
- **Background**: `bg-blue-50`
- **Border**: `border-blue-200`
- **Ícone**: InformationCircleIcon
- **Texto**: "Colaborador, utilize o código fornecido pela sua barbearia para fazer login."

### Link para Login de Proprietário
- **Texto**: "É proprietário? Faça login aqui"
- **Navegação**: `/` (tela de login principal)

## Rotas da API

### POST /auth/login/colaborador

**Request Body:**
```json
{
  "email": "string",
  "senha": "string",
  "codigo_barbearia": "string" // 6 caracteres, maiúsculas
}
```

**Response**: Mesmo formato do login de proprietário

## Implementação React Native

```tsx
// Diferenças no componente
const [codigoBarbearia, setCodigoBarbearia] = useState('');

// Input do código
<View style={styles.inputContainer}>
  <Text style={styles.label}>Código da Barbearia</Text>
  <TextInput
    style={styles.input}
    value={codigoBarbearia}
    onChangeText={(text) => setCodigoBarbearia(text.toUpperCase())}
    placeholder="ABC123"
    placeholderTextColor="#9CA3AF"
    maxLength={6}
    autoCapitalize="characters"
  />
  <Text style={styles.hint}>
    Código de 6 caracteres fornecido pelo proprietário
  </Text>
</View>

// Info box
<View style={styles.infoBox}>
  <InformationCircleIcon size={20} color="#2563EB" />
  <Text style={styles.infoText}>
    Colaborador, utilize o código fornecido pela sua barbearia para fazer login.
  </Text>
</View>
```

