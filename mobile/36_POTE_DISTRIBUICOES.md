# Tela de Distribuições do Pote

## Visão Geral

Histórico de distribuições do pote processadas. Permite visualizar detalhes de cada distribuição.

## Layout Visual

### Header
- **Título**: "Distribuições"
- **Subtítulo**: "Histórico de distribuições do pote"

### Lista de Distribuições
- **Loading**: Spinner com texto "Carregando distribuições..."
- **Estado Vazio**: Ícone CurrencyDollarIcon, título "Nenhuma distribuição encontrada", mensagem "Ainda não há distribuições processadas"
- **Lista de Cards**:
  - **Card de Distribuição**:
    - **Header**: 
      - Título: "Distribuição de {data formatada}"
      - Subtítulo: "{X} colaborador(es) beneficiado(s)"
      - Badge: "Processada" (verde)
    - **Grid de Métricas** (4 colunas):
      - **Valor Total**: Valor total do pote
      - **Valor Casa**: Valor que ficou para a casa
      - **Distribuído**: Valor distribuído (verde)
      - **Total Fichas**: Quantidade total de fichas
    - **Botão**: "Ver Detalhes" (azul) - navega para `/pote/distribuicoes/{id}`

### Página de Detalhes (`/pote/distribuicoes/{id}`)
- **Header**: Informações da distribuição, botão "Voltar"
- **Resumo**: Valor total, valor casa, valor distribuído, total fichas
- **Lista de Colaboradores**: Detalhes de quanto cada colaborador recebeu

## Rotas API

### GET /pote/distribuicoes/{barbearia_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia

**Query Params:**
- `limite` (opcional: número de registros)

**Response:**
```json
[
  {
    "distribuicao": {
      "id": "string",
      "barbearia_id": "string",
      "periodo_referencia": "YYYY-MM",
      "data_distribuicao": "YYYY-MM-DDTHH:mm:ss.sssZ",
      "valor_total_pote": 0.00,
      "valor_casa": 0.00,
      "valor_distribuido": 0.00
    },
    "resumo": {
      "total_colaboradores": 0,
      "valor_total_pote": 0.00,
      "valor_casa": 0.00,
      "valor_distribuido": 0.00,
      "total_fichas": 0
    }
  }
]
```

### GET /pote/distribuicoes/{barbearia_id}/{distribuicao_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `distribuicao_id`: UUID da distribuição

**Response:** Mesmo formato do array acima (objeto único)

### GET /pote/distribuicoes/colaborador/{colaborador_id}

**Path Params:**
- `colaborador_id`: UUID do colaborador

**Query Params:**
- `limite` (opcional: número de registros)

**Response:** Array de distribuições do colaborador

### POST /pote/distribuir/{barbearia_id}/{periodo}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `periodo`: Período no formato YYYY-MM

**Response:**
```json
{
  "distribuicao": {
    "id": "string",
    "barbearia_id": "string",
    "periodo_referencia": "YYYY-MM",
    "data_distribuicao": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "valor_total_pote": 0.00,
    "valor_casa": 0.00,
    "valor_distribuido": 0.00
  },
  "resumo": {
    "total_colaboradores": 0,
    "valor_total_pote": 0.00,
    "valor_casa": 0.00,
    "valor_distribuido": 0.00,
    "total_fichas": 0
  }
}
```

**Nota**: Esta rota processa a distribuição do pote para um período específico. Deve ser chamada a partir da página de detalhes do pote (`/pote/potes/{periodo}`).

## Rotas Relacionadas (Potes)

### GET /pote/{barbearia_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia

**Query Params:**
- `limite` (opcional: número de registros)

**Response:** Array de potes por período

### GET /pote/{barbearia_id}/{periodo}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `periodo`: Período no formato YYYY-MM

**Response:** Detalhes do pote do período

### GET /pote/{barbearia_id}/{periodo}/movimentacoes

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `periodo`: Período no formato YYYY-MM

**Response:** Array de movimentações do pote

## Stores

- `usePoteStore`:
  - `loadDistribuicoes(barbeariaId?, limite?)`: Carrega lista via `GET /pote/distribuicoes/{barbearia_id}?limite={limite}`
  - `loadDistribuicao(barbeariaId, distribuicaoId)`: Busca via `GET /pote/distribuicoes/{barbearia_id}/{distribuicao_id}`
  - `loadDistribuicoesColaborador(colaboradorId, limite?)`: Carrega via `GET /pote/distribuicoes/colaborador/{colaborador_id}?limite={limite}`
  - `processarDistribuicao(barbeariaId, periodo)`: Processa via `POST /pote/distribuir/{barbearia_id}/{periodo}`
  - `loadPotes(barbeariaId?, limite?)`: Carrega potes via `GET /pote/{barbearia_id}?limite={limite}`
  - `loadPotePeriodo(barbeariaId, periodo)`: Carrega pote via `GET /pote/{barbearia_id}/{periodo}`
  - `loadMovimentacoes(barbeariaId, periodo)`: Carrega movimentações via `GET /pote/{barbearia_id}/{periodo}/movimentacoes`
- `useAppStore`: Notificações

