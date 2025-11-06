# Tela de Perfil

## Visão Geral

Gerenciamento completo do perfil do usuário logado. Permite visualizar informações, editar dados pessoais, alterar senha e foto de perfil. Layout com tabs para organizar as seções.

## Layout Visual

### Header
- **Título**: "Meu Perfil"
- **Subtítulo**: "Gerencie suas informações pessoais e configurações"

### Tabs Navigation (Card)
- **Tab: Informações** (ícone UserIcon)
  - Border inferior azul quando ativa
- **Tab: Editar Perfil** (ícone PencilIcon)
  - Border inferior azul quando ativa
- **Tab: Alterar Senha** (ícone KeyIcon)
  - Border inferior azul quando ativa

### Tab: Informações (Componente `PerfilInfo`)

#### Card: Foto de Perfil
- **Avatar**: Círculo 96px (w-24 h-24), gradiente azul-roxo
  - Foto atual (se houver) ou inicial do nome
  - Botão flutuante com ícone de câmera (azul, canto inferior direito)
- **Informações**:
  - Nome (grande, bold)
  - Email
  - Tipo de usuário (Proprietário/Colaborador)
  - Badge com nome da barbearia (se houver)

#### Card: Informações Pessoais
- **Grid 2 colunas**:
  - **Nome Completo**: Label + valor
  - **Email**: Label + valor
  - **Tipo de Conta**: Label + valor
  - **Membro Desde**: Label + data formatada

#### Card: Informações do Sistema (se proprietário)
- **Código da Barbearia**: Exibido em destaque
- **Botão**: "Copiar Código"

### Tab: Editar Perfil (Componente `PerfilEdit`)

#### Formulário
- **Nome Completo *** (input text obrigatório)
- **Email *** (input email obrigatório)
- **Telefone** (input tel, apenas para colaboradores)
- **Função** (select, apenas para colaboradores):
  - Opções: Barbeiro, Manicure, Designer, Recepcionista, Assistente, Administrador
- **Status** (select, apenas para colaboradores):
  - Opções: Ativo, Inativo
- **Botão**: "Salvar Alterações" (azul, com spinner quando salvando)

### Tab: Alterar Senha (Componente `PerfilPassword`)

#### Formulário
- **Senha Atual *** (password, com botão mostrar/ocultar)
- **Nova Senha *** (password, minlength 6, com botão mostrar/ocultar)
- **Confirmar Nova Senha *** (password, com botão mostrar/ocultar)
- **Validação Visual**:
  - Lista de requisitos com checkmarks:
    - Pelo menos 6 caracteres
    - Senhas coincidem
- **Botão**: "Alterar Senha" (azul, com spinner quando processando)

### Modal: Upload de Foto (Componente `PerfilPhotoUpload`)
- **Modal**: Overlay escuro, card central
- **Preview**: Círculo 128px com preview da imagem ou ícone de câmera
- **Input File**: Hidden, aceita apenas imagens
- **Validações**:
  - Tipo: Apenas imagens
  - Tamanho: Máximo 5MB
- **Botões**: "Salvar Foto" (azul), "Cancelar" (cinza)

## Validações

1. **Nome**: Obrigatório
2. **Email**: Formato válido, obrigatório
3. **Telefone**: Opcional (apenas colaboradores)
4. **Senha**: 
   - Mínimo 6 caracteres
   - Nova senha = Confirmação
   - Senha atual deve estar correta
5. **Foto**: 
   - Apenas imagens
   - Máximo 5MB

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
    "barbearia_nome": "string | null",
    "codigo_barbearia": "string | null",
    "funcao": "string | null",
    "ativo": true,
    "criado_em": "YYYY-MM-DDTHH:mm:ss.sssZ"
  }
}
```

**Nota**: Para colaboradores, pode usar `/auth/me/colaborador` que retorna dados adicionais.

### PUT /auth/perfil

**Request Body:**
```json
{
  "nome": "string",
  "email": "string",
  "telefone": "string | null",
  "funcao": "string | null",
  "ativo": true
}
```

**Nota**: Campos `telefone`, `funcao` e `ativo` são apenas para colaboradores.

**Response:** Retorna o usuário atualizado

### POST /auth/foto-perfil

**Request**: FormData
- `foto`: Arquivo de imagem (jpg, png, max 5MB)

**Response:**
```json
{
  "foto_perfil_url_assinada": "string",
  "message": "string"
}
```

### PUT /auth/alterar-senha

**Request Body:**
```json
{
  "senha_atual": "string",
  "nova_senha": "string"
}
```

**Nota**: O campo `confirmar_senha` é validado apenas no frontend. A API recebe apenas `senha_atual` e `nova_senha`.

**Response:**
```json
{
  "mensagem": "Senha alterada com sucesso"
}
```

**Nota**: Após alterar a senha, o usuário é deslogado e redirecionado para `/login` após 2 segundos.

## Stores e Composables

- `useAuth` (composable):
  - `user`: Reativo com dados do usuário
  - `refreshUser()`: Atualiza dados do usuário via `GET /auth/me` ou `/auth/me/colaborador`
  - `updateProfilePhoto(fotoUrl)`: Atualiza URL da foto localmente
- `useApi`: Para fazer requisições diretas
- `useAppStore`: Notificações


