# Tela de Cadastro de Cliente

## Visão Geral

Formulário para cadastrar novo cliente manualmente ou via áudio (IA processa).

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft
- **Título**: "Novo Cliente"
- **Subtítulo**: "Cadastre um novo cliente manualmente ou por áudio"

### Formulário (Card)
- **Seção Dados Básicos**:
  - Nome Completo * (obrigatório)
  - Telefone * (obrigatório)
- **Seção Como nos Conheceu**:
  - Origem (select: Walk-in, Indicação, Instagram, Facebook, Google, Parceria, Outro)
  - Quem Indicou? (texto opcional)
- **Seção Observações**:
  - Textarea (4 linhas)

### Separador
- Linha com texto "ou cadastre por áudio" no centro

### Cadastro por Áudio
- **Card com gradiente**: from-blue-50 to-purple-50
- **Ícone**: MicrophoneIcon em círculo azul
- **Título**: "Cadastro por Áudio"
- **Descrição**: Explicação do recurso
- **Componente**: AudioRecorder

### Botões de Ação
- **Cancelar**: Botão outline cinza
- **Salvar Cliente**: Botão azul sólido

## Validações

- Nome e telefone obrigatórios
- Mensagem de erro se campos vazios

## Rotas da API

### POST /clientes

**Request Body:**
```json
{
  "nome": "string",
  "telefone": "string",
  "origem": "string",
  "quem_indicou": "string | null",
  "observacoes": "string | null",
  "barbearia_id": "string"
}
```

### POST /clientes/clientes-audio

**Request**: FormData com arquivo de áudio

**Response**: Cliente criado (mesmo formato)

## Stores

- `useClientesStore.addClient(clientData)`
- `useAppStore.addNotification()` para mensagens

## Implementação React Native

Use `react-hook-form` para validação, `react-native-audio-recorder-player` para áudio.

