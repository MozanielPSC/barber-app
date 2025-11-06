# Tela de Gerenciamento de Barbearias

## Visão Geral

Sistema completo de gerenciamento de barbearias, incluindo seleção, listagem, cadastro, edição e exclusão. A seleção de barbearia é **crucial** para o funcionamento de todo o sistema, pois todas as operações dependem da barbearia ativa selecionada.

## Componente de Seleção de Barbearia

### SelectBarbearia.vue

**Localização**: Componente usado na Navbar e em outros lugares do sistema.

**Funcionalidade**:
- Dropdown para seleção rápida de barbearia
- Exibe barbearia selecionada atual
- Lista todas as barbearias disponíveis
- Salva seleção no localStorage
- Carrega seleção automaticamente ao iniciar

**Layout**:
- **Botão Principal**:
  - Ícone: BuildingOfficeIcon
  - Texto: Nome da barbearia selecionada ou "Selecionar Barbearia"
  - Ícone: ChevronDownIcon
  - Background: `bg-gray-100 dark:bg-gray-700`
  - Hover: `hover:bg-gray-200 dark:hover:bg-gray-600`

- **Dropdown** (absoluto, z-50):
  - Background: `bg-white dark:bg-gray-800`
  - Border: `border-gray-200 dark:border-gray-700`
  - Max height: 240px (scrollable)
  - Shadow: `shadow-xl`

- **Itens do Dropdown**:
  - Cada item mostra:
    - Ícone BuildingOfficeIcon
    - Nome da barbearia (truncate)
    - Endereço (se disponível, texto pequeno, truncate)
    - CheckIcon verde se selecionada
  - Item selecionado: `bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300`
  - Item não selecionado: `hover:bg-gray-100 dark:hover:bg-gray-700`

- **Estados**:
  - Loading: Spinner + "Carregando barbearias..."
  - Vazio: Ícone + "Nenhuma barbearia encontrada" + "Cadastre uma barbearia para começar"

**Comportamento**:
- Fecha ao clicar fora (overlay)
- Fecha ao pressionar Escape
- Ao selecionar: salva no store e localStorage, fecha dropdown
- Carrega barbearias automaticamente se não estiverem carregadas

## Listagem de Barbearias

### Página: /barbearias (BarbeariasList.vue)

**Layout**:

1. **Header com Busca e Botão**:
   - Campo de busca (MagnifyingGlassIcon)
   - Botão "Nova Barbearia" (PlusIcon, azul)

2. **Grid de Cards** (1 coluna mobile, 2 tablet, 3 desktop):
   - Cada card mostra:
     - **Nome da Barbearia** (text-lg, font-semibold)
     - **Badge "Selecionada"** (verde, CheckCircleIcon) se for a barbearia ativa
     - **Link "Ver detalhes →"** (azul)
   - Hover: shadow-lg + border azul
   - Background: `bg-white dark:bg-gray-800`

3. **Estados**:
   - **Loading**: Spinner + "Carregando..."
   - **Vazio sem busca**: Ícone BuildingStorefrontIcon + "Nenhuma barbearia cadastrada" + Botão "Cadastrar Primeira Barbearia"
   - **Vazio com busca**: "Nenhuma barbearia encontrada"

**Funcionalidades**:
- Busca em tempo real (filtra por nome)
- Cards clicáveis redirecionam para `/barbearias/{id}`
- Badge visual indica barbearia selecionada

## Cadastro de Nova Barbearia

### Página: /barbearias/novo

**Layout**:

1. **Header**:
   - Link "Voltar para Barbearias" (ArrowLeftIcon)
   - Título: "Nova Barbearia"
   - Subtítulo: "Cadastre uma nova unidade"

2. **Formulário** (card branco/cinza escuro):
   - **Nome da Barbearia** *:
     - Input texto
     - Placeholder: "Ex: Barbearia Central"
     - Obrigatório
   
   - **Código da Barbearia** *:
     - Input texto (font-mono, text-center, text-lg, tracking-widest)
     - Maxlength: 6 caracteres
     - Auto-uppercase
     - Aceita apenas A-Z e 0-9
     - Contador: "X/6" (direita)
     - Placeholder: "ABC123"
     - Obrigatório
     - Descrição: "Código único de 6 caracteres (letras e números). Será usado pelos colaboradores para fazer login."
   
   - **Endereço**:
     - Input texto
     - Placeholder: "Ex: Rua das Flores, 123 - Centro"
     - Opcional
   
   - **Telefone**:
     - Input tel
     - Placeholder: "Ex: (11) 99999-9999"
     - Opcional

3. **Botões** (border-top):
   - **Cadastrar Barbearia** (azul, CheckIcon):
     - Desabilitado durante salvamento
     - Texto muda para "Salvando..." durante salvamento
   - **Cancelar** (cinza): Link para `/barbearias`

**Validações**:
- Código deve ter exatamente 6 caracteres
- Nome obrigatório
- Código obrigatório

**Comportamento**:
- Ao salvar com sucesso: Notificação de sucesso + redireciona para `/barbearias`
- Se for a primeira barbearia: Seleciona automaticamente após criação
- Em caso de erro: Notificação de erro com mensagem da API

## Edição de Barbearia

### Página: /barbearias/{id}

**Layout**:

1. **Header**:
   - Link "Voltar para Barbearias" (ArrowLeftIcon)
   - Título: "Editar Barbearia" (modo edição) ou "Detalhes da Barbearia" (modo visualização)
   - Subtítulo: Nome da barbearia
   - **Botões de Ação** (direita):
     - **Selecionar** (verde, CheckCircleIcon): Só aparece se não for a barbearia selecionada
     - **Editar** (azul, PencilIcon): Só aparece no modo visualização
     - **Excluir** (vermelho, TrashIcon): Só aparece no modo visualização

2. **Modo Visualização**:
   - **Banner de Status** (se for a barbearia selecionada):
     - Background: `bg-green-50 dark:bg-green-900/20`
     - Border: `border-green-200 dark:border-green-800`
     - Ícone: CheckCircleIcon (verde)
     - Texto: "Esta é a barbearia ativa no sistema"
   
   - **Informações**:
     - Nome (label + valor grande)

3. **Modo Edição**:
   - **Formulário**:
     - **Nome da Barbearia** *:
       - Input texto
       - Placeholder: "Ex: Barbearia Central"
       - Obrigatório
   
   - **Botões** (border-top):
     - **Salvar Alterações** (azul, CheckIcon):
       - Desabilitado durante salvamento
       - Texto muda para "Salvando..." durante salvamento
     - **Cancelar** (cinza): Volta para modo visualização

**Comportamento**:
- Ao entrar na página: Carrega barbearias do store
- Ao clicar "Selecionar": Seleciona barbearia + notificação de sucesso
- Ao salvar edição: Atualiza no store + atualiza seleção se for a barbearia ativa + notificação de sucesso + volta para modo visualização
- Ao cancelar edição: Restaura valores originais + volta para modo visualização
- Em caso de erro: Notificação de erro

## Exclusão de Barbearia

### Página: /barbearias/{id}

**Funcionalidade**:
- Botão "Excluir" (vermelho, TrashIcon) no header
- Confirmação obrigatória: `confirm('Tem certeza que deseja excluir esta barbearia? Esta ação não pode ser desfeita.')`

**Comportamento**:
- Remove barbearia do store
- Se era a barbearia selecionada:
  - Se há outras barbearias: Seleciona a primeira automaticamente
  - Se não há outras: Limpa seleção
- Redireciona para `/barbearias`
- Notificação de sucesso ou erro

## Rotas da API

### GET /barbearias

**Query Params**: Nenhum

**Response**:
```json
[
  {
    "id": "string",
    "nome": "string",
    "codigo": "string",
    "endereco": "string | null",
    "telefone": "string | null",
    "ativo": true,
    "criado_em": "string (ISO 8601)",
    "atualizado_em": "string (ISO 8601)"
  }
]
```

**Nota**: Retorna apenas barbearias do usuário logado (proprietário) ou a barbearia do colaborador.

### POST /barbearias

**Body**:
```json
{
  "nome": "string (obrigatório)",
  "codigo": "string (obrigatório, exatamente 6 caracteres, A-Z0-9)",
  "endereco": "string | null",
  "telefone": "string | null",
  "ativo": true
}
```

**Response**:
```json
{
  "id": "string",
  "nome": "string",
  "codigo": "string",
  "endereco": "string | null",
  "telefone": "string | null",
  "ativo": true,
  "criado_em": "string (ISO 8601)",
  "atualizado_em": "string (ISO 8601)"
}
```

### PUT /barbearias/{id}

**Path Params**:
- `id`: ID da barbearia

**Body**:
```json
{
  "nome": "string",
  "codigo": "string",
  "endereco": "string | null",
  "telefone": "string | null",
  "ativo": true
}
```

**Response**:
```json
{
  "id": "string",
  "nome": "string",
  "codigo": "string",
  "endereco": "string | null",
  "telefone": "string | null",
  "ativo": true,
  "criado_em": "string (ISO 8601)",
  "atualizado_em": "string (ISO 8601)"
}
```

### DELETE /barbearias/{id}

**Path Params**:
- `id`: ID da barbearia

**Response**: 204 No Content (sem body)

## Stores

### useBarbeariasStore

**State**:
```typescript
{
  barbearias: Barbearia[],
  barbeariaSelecionada: BarbeariaSelecionada | null,
  isLoading: boolean
}
```

**Getters**:
- `barbeariasAtivas`: Filtra apenas barbearias com `ativo === true`
- `barbeariaCompleta`: Retorna objeto completo da barbearia selecionada
- `temBarbeariaSelecionada`: Boolean indicando se há barbearia selecionada

**Actions**:

#### loadBarbearias()
Carrega todas as barbearias do usuário.
- Se não há barbearia selecionada e há barbearias: Seleciona a primeira automaticamente
- Retorna: `Barbearia[]`

#### criarBarbearia(barbeariaData)
Cria nova barbearia.
- Adiciona à lista de barbearias
- Se é a primeira barbearia: Seleciona automaticamente
- Retorna: `Barbearia`

#### atualizarBarbearia(id, updates)
Atualiza barbearia existente.
- Atualiza na lista
- Se é a barbearia selecionada: Atualiza também a seleção
- Retorna: `Barbearia`

#### deletarBarbearia(id)
Deleta barbearia.
- Remove da lista
- Se era a selecionada:
  - Se há outras: Seleciona a primeira
  - Se não há: Limpa seleção
- Retorna: `true`

#### selecionarBarbearia(barbearia)
Seleciona uma barbearia como ativa.
- Atualiza `barbeariaSelecionada`
- Salva no localStorage como `'barbearia_selecionada'`
- **Crucial**: Todas as operações do sistema usam `barbeariaSelecionada.id` como `barbearia_id`

#### carregarBarbeariaSelecionada()
Carrega seleção do localStorage.
- Tenta carregar de `localStorage.getItem('barbearia_selecionada')`
- Se não tem e é colaborador: Seleciona automaticamente a barbearia do colaborador (de `user.barbearia_id`)

#### limparSelecao()
Limpa seleção atual.
- Remove do state e localStorage

#### reset()
Reset completo do store.
- Limpa todas as barbearias e seleção

## Persistência da Seleção

A barbearia selecionada é salva em:
- **localStorage**: Chave `'barbearia_selecionada'`
- **Formato**: `JSON.stringify({ id, nome, codigo? })`

Ao iniciar o app:
1. Tenta carregar do localStorage
2. Se não tem e é colaborador: Usa `user.barbearia_id`
3. Se não tem e há barbearias: Seleciona a primeira

## Importância da Seleção

A seleção de barbearia é **crucial** porque:
- Todas as rotas da API requerem `barbearia_id` como parâmetro
- O `barbearia_id` vem de `barbeariaSelecionada.id`
- Sem seleção, o sistema não pode funcionar corretamente
- O componente `SelectBarbearia` deve estar sempre visível na navbar para permitir troca rápida

## Permissões

- **Proprietários**: Podem ver todas as suas barbearias, criar, editar e excluir
- **Colaboradores**: Veem apenas sua barbearia (definida em `user.barbearia_id`), não podem criar/editar/excluir
