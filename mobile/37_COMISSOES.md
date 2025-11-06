# Tela de Comissões

## Visão Geral

Visualização detalhada de comissões do colaborador logado. Mostra saldo líquido, resumo, meta mensal, breakdown por tipo, e tabelas detalhadas de serviços, produtos, débitos e indicações.

## Layout Visual

### Header
- **Título**: "Minhas Comissões"
- **Subtítulo**: "Acompanhe suas vendas, ganhos e débitos"
- **Botão**: "Ver Projeção" (gradiente roxo-azul) - navega para `/comissoes/projecao`

### Filtro de Mês
- **Card**: Select de mês/ano (últimos 12 meses)
- **Formato**: YYYY-MM

### Saldo Líquido (Destaque)
- **Card Gradiente**: Azul para roxo
- **Título**: "SALDO LÍQUIDO DO MÊS" (texto pequeno, azul claro)
- **Valor**: Grande (text-5xl), branco, bold
- **Indicadores**:
  - Entradas: Valor em verde claro
  - Saídas: Valor em vermelho claro
- **Emoji**: 💰 (se positivo) ou ⚠️ (se negativo)

### Cards de Resumo (Grid 4 colunas)
- **Total de Vendas**: 
  - Ícone: Dinheiro (azul)
  - Valor: Grande, cinza escuro
  - Subtítulo: "{X} serviços + {Y} produtos"
- **Comissões Totais**:
  - Ícone: Gráfico crescente (verde)
  - Valor: Grande, verde
  - Subtítulo: Percentual do total
- **Débitos**:
  - Ícone: Gráfico decrescente (vermelho)
  - Valor: Grande, vermelho
  - Subtítulo: "{X} registros"
- **Indicações**:
  - Ícone: Pessoas (roxo)
  - Valor: Grande, cinza escuro
  - Subtítulo: "{X} clientes ativos"

### Meta Mensal
- **Card**: Título "Meta Mensal", dias restantes
- **Barra de Progresso**: Gradiente azul-verde
- **Grid 3 colunas**:
  - Para atingir a meta: Valor necessário
  - Média diária necessária: Valor calculado
  - Média diária atual: Valor calculado

### Breakdown de Comissões
- **Card**: Título "Comissões por Tipo"
- **Lista**: Cada tipo com cor, label, valor, percentual e barra de progresso
- **Tipos**: Serviços, Produtos, Indicações, Assinaturas

### Simulador de Fidelização
- **Card**: Título "Simulador de Fidelização"
- **Input**: Quantidade de clientes (1-100)
- **Cards de Resultado**:
  - Ganho Mensal Estimado (azul)
  - Ganho Anual Estimado (verde)

### Tabelas Detalhadas (Grid 2 colunas)

#### Vendas de Serviços
- **Header**: Título + subtítulo com quantidade
- **Tabela**: Colunas (Serviço, Valor, Comissão, Data)
- **Footer**: Total de vendas e comissão

#### Vendas de Produtos
- **Header**: Título + subtítulo com quantidade
- **Tabela**: Colunas (Produto, Qtd, Valor, Comissão)
- **Footer**: Total quantidade, vendas e comissão

#### Débitos e Saídas
- **Header**: Título + descrição
- **Tabela**: Colunas (Descrição, Tipo, Data, Valor)
- **Badges de Tipo**: Produto (roxo), Adiantamento (azul), Outro (cinza)
- **Footer**: Total de débitos

#### Indicações Realizadas
- **Header**: Título + subtítulo com quantidade
- **Tabela**: Colunas (Cliente, Data Indicação, Status, Visitas)
- **Badges de Status**: Ativo (verde), Primeira Visita (amarelo), Inativo (cinza)

## Rotas da API

### GET /comissoes/vendas-servicos

**Query Params:**
- `mes` (obrigatório, formato: YYYY-MM)
- `barbearia_id` (obrigatório)
- `colaborador_id` (opcional)

**Response:**
```json
[
  {
    "id": "string",
    "atendimento_servico": {
      "nome": "string"
    },
    "valor_servico": "0.00",
    "valor_comissao": "0.00",
    "percentual": "0.00",
    "data_atendimento": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "colaborador_id": "string",
    "colaborador": {
      "nome": "string"
    }
  }
]
```

**Nota**: A resposta pode vir como array direto ou dentro de `{ comissoes: [] }`.

### GET /comissoes/vendas-produtos

**Query Params:**
- `mes` (obrigatório, formato: YYYY-MM)
- `barbearia_id` (obrigatório)
- `colaborador_id` (opcional)

**Response:**
```json
[
  {
    "id": "string",
    "atendimento_produto": {
      "nome": "string"
    },
    "valor_produto": "0.00",
    "quantidade": 1,
    "valor_comissao": "0.00",
    "percentual": "0.00",
    "data_atendimento": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "colaborador_id": "string",
    "colaborador": {
      "nome": "string"
    }
  }
]
```

### GET /comissoes/debitos

**Query Params:**
- `mes` (obrigatório, formato: YYYY-MM)
- `barbearia_id` (obrigatório)
- `colaborador_id` (opcional)

**Response:**
```json
[
  {
    "id": "string",
    "descricao": "string",
    "tipo": "Produto" | "Adiantamento" | "Outro",
    "valor_comissao": "0.00",
    "data_atendimento": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "colaborador_id": "string"
  }
]
```

### GET /comissoes/indicacoes

**Query Params:**
- `mes` (obrigatório, formato: YYYY-MM)
- `barbearia_id` (obrigatório)
- `colaborador_id` (opcional)

**Response:**
```json
[
  {
    "id": "string",
    "cliente": "string",
    "data_atendimento": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "status": "Ativo" | "Primeira Visita" | "Inativo",
    "visitas": 1,
    "colaborador_id": "string"
  }
]
```

### GET /comissoes/resumo

**Query Params:**
- `mes` (obrigatório, formato: YYYY-MM)
- `barbearia_id` (obrigatório)
- `colaborador_id` (opcional)

**Response:**
```json
{
  "total_vendas": 0.00,
  "total_comissoes": 0.00,
  "total_debitos": 0.00,
  "saldo_liquido": 0.00,
  "vendas_servicos": 0.00,
  "vendas_produtos": 0.00,
  "comissao_servicos": 0.00,
  "comissao_produtos": 0.00,
  "indicacoes_count": 0,
  "indicacoes_ativas": 0
}
```

**Nota**: A resposta pode vir como array `[{ total_vendas, total_comissao, total_debitos, total_quantidade }]` ou como objeto.

## Stores

- `useComissoesStore`:
  - `loadVendasServicos(mes?, colaboradorId?)`: Carrega via `GET /comissoes/vendas-servicos?mes={mes}&barbearia_id={id}&colaborador_id={id}`
  - `loadVendasProdutos(mes?, colaboradorId?)`: Carrega via `GET /comissoes/vendas-produtos?mes={mes}&barbearia_id={id}&colaborador_id={id}`
  - `loadDebitos(mes?, colaboradorId?)`: Carrega via `GET /comissoes/debitos?mes={mes}&barbearia_id={id}&colaborador_id={id}`
  - `loadIndicacoes(mes?, colaboradorId?)`: Carrega via `GET /comissoes/indicacoes?mes={mes}&barbearia_id={id}&colaborador_id={id}`
  - `loadResumoComissoes(mes?, colaboradorId?)`: Carrega via `GET /comissoes/resumo?mes={mes}&barbearia_id={id}&colaborador_id={id}`
  - `loadComissoesColaborador(colaboradorId, mes?)`: Carrega todas as comissões de um colaborador (chama todas as rotas acima)
  - `loadTodasComissoes(mes?)`: Carrega todas as comissões (sem filtrar por colaborador)
  - `setMesSelecionado(mes)`: Define o mês selecionado
  - `mesSelecionado`: State com o mês atual (YYYY-MM)
- `useAuth`: Para obter `user` e verificar se é colaborador
- `usePermissions`: Para verificar `isColaborador`
- `useAppStore`: Notificações


