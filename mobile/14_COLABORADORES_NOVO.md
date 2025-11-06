# Tela de Cadastro de Colaborador

## Visão Geral

Formulário completo para cadastrar novo colaborador. Permite configurar acesso ao sistema e permissões detalhadas por recurso.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft
- **Título**: "Novo Colaborador"
- **Subtítulo**: "Cadastre um novo colaborador da barbearia"

### Formulário (Card)

#### Seção: Informações Básicas
- **Nome Completo *** (obrigatório)
- **Função *** (obrigatório)
  - Placeholder: "Ex: Barbeiro, Recepcionista, Gerente"
  - Info box com sugestões: "Barbeiro, Cabeleireiro, Manicure, Recepcionista, Gerente, Assistente, Estagiário"

#### Seção: Acesso ao Sistema (Opcional)
- **Toggle**: Botão "Configurar acesso" / "Ocultar"
- **Descrição**: "Preencha os campos abaixo para permitir que o colaborador acesse o sistema."
- **Campos** (se toggle ativado):
  - **Email**: Tipo email
  - **Senha**: Tipo password (toggle mostrar/ocultar), mínimo 6 caracteres
  - **Validação**: Se email preenchido, senha obrigatória (e vice-versa)

#### Seção: Permissões de Acesso
Aparece apenas se "Acesso ao Sistema" estiver ativado.

Cada recurso tem um card com grid de 4 colunas (Visualizar, Criar, Editar, Excluir):

1. **Atendimentos**
   - Default: Visualizar ✓, Criar ✓, Editar ✓, Excluir ✗

2. **Clientes**
   - Default: Visualizar ✓, Criar ✓, Editar ✓, Excluir ✗

3. **Produtos**
   - Default: Visualizar ✓, Criar ✗, Editar ✗, Excluir ✗

4. **Serviços**
   - Default: Visualizar ✓, Criar ✗, Editar ✗, Excluir ✗

5. **Financeiro**
   - Apenas: Visualizar, Editar
   - Default: Ambos ✗

6. **Configurações**
   - Apenas: Visualizar, Editar
   - Default: Ambos ✗

7. **Pote**
   - Default: Todos ✗

**Estilo dos Cards de Permissão**:
- Background: `bg-gray-50 dark:bg-gray-700/50`
- Border: `border-gray-200 dark:border-gray-600`
- Título do recurso: Font medium, bold
- Checkboxes: Rounded, cor azul quando marcado

### Botões de Ação
- **Cancelar**: Outline cinza
- **Salvar Colaborador**: Azul sólido

## Validações

1. **Campos Obrigatórios**: Nome e Função
2. **Acesso ao Sistema**: Se email preenchido, senha obrigatória (e vice-versa)
3. **Senha**: Mínimo 6 caracteres

## Rotas da API

### POST /colaboradores

**Request Body:**
```json
{
  "nome": "string",
  "funcao": "string",
  "barbearia_id": "string",
  "email": "string | null",
  "senha": "string | null",
  "permissoes": {
    "atendimentos": {
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": true,
      "pode_excluir": false
    },
    "clientes": {
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": true,
      "pode_excluir": false
    },
    "produtos": {
      "pode_visualizar": true,
      "pode_criar": false,
      "pode_editar": false,
      "pode_excluir": false
    },
    "servicos": {
      "pode_visualizar": true,
      "pode_criar": false,
      "pode_editar": false,
      "pode_excluir": false
    },
    "financeiro": {
      "pode_visualizar": false,
      "pode_editar": false
    },
    "configuracoes": {
      "pode_visualizar": false,
      "pode_editar": false
    },
    "pote": {
      "pode_visualizar": false,
      "pode_criar": false,
      "pode_editar": false,
      "pode_excluir": false
    }
  }
}
```

**Response:**
```json
{
  "id": "string",
  "nome": "string",
  "funcao": "string",
  "email": "string | null",
  "barbearia_id": "string",
  "ativo": true,
  "permissoes": {
    "atendimentos": {
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": true,
      "pode_excluir": false
    }
    // ... outros recursos
  }
}
```

**Nota**: `email`, `senha` e `permissoes` são opcionais. Se `email` e `senha` não forem fornecidos, o colaborador não terá acesso ao sistema.

## Stores

- `useColaboradoresStore`: 
  - `criarColaborador(payload)`: Cria colaborador via `POST /colaboradores`
- `useBarbeariasStore`: Para obter `barbearia_id`
- `useAppStore`: Notificações


