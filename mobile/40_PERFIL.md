# Tela de Perfil

## Visão Geral

Gerenciamento completo do perfil do usuário logado. Permite editar informações pessoais, alterar senha e foto de perfil.

## Layout Visual

### Header
- **Título**: "Meu Perfil"
- **Subtítulo**: Tipo de usuário (Proprietário/Colaborador)

### Card: Foto de Perfil
- **Avatar Grande**: Círculo 120px
  - Foto atual ou iniciais
  - Overlay com ícone de câmera ao hover
- **Botão**: "Alterar Foto"
  - Abre seletor de imagem (câmera/galeria)

### Card: Informações Pessoais
- **Modo Visualização**:
  - Nome (grande, bold)
  - Email
  - Telefone (se houver)
  - Nome da Barbearia (se proprietário)
  - Tipo de Usuário (badge)
  - **Botão**: "Editar Informações"

- **Modo Edição**:
  - **Nome *** (input text)
  - **Email** (input email, readonly se colaborador)
  - **Telefone** (input tel)
  - **Botões**: Cancelar, Salvar

### Card: Alterar Senha
- **Título**: "Alterar Senha"
- **Campos**:
  - **Senha Atual *** (password)
  - **Nova Senha *** (password, mínimo 6 caracteres)
  - **Confirmar Nova Senha *** (password)
- **Validação**: Nova senha deve coincidir com confirmação
- **Botão**: "Alterar Senha"

### Card: Informações do Sistema (se proprietário)
- **Código da Barbearia**: Exibido (para compartilhar com colaboradores)
- **Botão**: "Copiar Código"

## Validações

1. **Nome**: Obrigatório
2. **Email**: Formato válido (se editável)
3. **Senha**: 
   - Mínimo 6 caracteres
   - Nova senha = Confirmação
   - Senha atual deve estar correta

## Rotas da API

### GET /auth/me

**Response:**
```json
{
  "user": {
    "id": "string",
    "nome": "string",
    "email": "string",
    "telefone": "string | null",
    "tipo": "proprietario" | "colaborador",
    "foto_perfil_url_assinada": "string | null",
    "nome_barbearia": "string | null",
    "codigo_barbearia": "string | null"
  }
}
```

### PUT /auth/me

**Request Body:**
```json
{
  "nome": "string",
  "telefone": "string | null"
}
```

**Nota**: Email não pode ser alterado via esta rota.

### POST /auth/me/photo

**Request**: FormData
- `foto`: Arquivo de imagem (jpg, png, max 5MB)

**Response:**
```json
{
  "foto_perfil_url_assinada": "string"
}
```

### PUT /auth/me/password

**Request Body:**
```json
{
  "senha_atual": "string",
  "nova_senha": "string",
  "confirmar_senha": "string"
}
```

**Response:**
```json
{
  "mensagem": "Senha alterada com sucesso"
}
```

## Stores

- `useAuthStore`:
  - `fetchUserData()`: Carrega dados do usuário
  - `updateProfile(updates)`: Atualiza informações
  - `updateProfilePhoto(fotoUrl)`: Atualiza foto
  - `changePassword(data)`: Altera senha


