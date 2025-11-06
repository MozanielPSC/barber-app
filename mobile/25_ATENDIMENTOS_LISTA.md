# Tela de Lista de Atendimentos

## Visão Geral

Lista de atendimentos realizados com busca por cliente e filtros rápidos. Cards clicáveis que navegam para detalhes.

## Layout Visual

### Header
- **Busca**: Input com ícone de lupa à esquerda, placeholder "Buscar por cliente..."
- **Botão**: "Novo Atendimento" (azul, com ícone Plus) - navega para `/atendimentos/novo`

### Filtros Rápidos
Botões de filtro:
- **Todos**: Mostra todos os atendimentos
- **Hoje**: Filtra atendimentos de hoje
- **Esta Semana**: Filtra últimos 7 dias
- **Este Mês**: Filtra mês atual
- **Compareceram**: Filtra apenas atendimentos onde cliente compareceu
- **Faltaram**: Filtra apenas atendimentos onde cliente não compareceu

### Lista de Atendimentos
- **Estado Vazio**: Ícone CalendarDaysIcon, título "Nenhum atendimento encontrado", mensagem, botão "Adicionar Primeiro Atendimento"
- **Cards de Atendimentos** (clicáveis, navegam para `/atendimentos/{id}`):
  - **Header**: Ícone circular (gradiente azul-roxo), nome do cliente, data formatada, horário de início (se houver)
  - **Serviços**: Lista de badges azuis com nomes dos serviços
  - **Produtos**: Lista de badges roxos com nomes e quantidades dos produtos
  - **Footer**: 
    - Badges de status: "Compareceu" (verde) / "Não compareceu" (amarelo), "1ª Visita" (índigo)
    - Total do atendimento (grande, bold)
  - **Hover**: Shadow aumentada, borda muda de cor

**Ordenação**: Por data (mais recente primeiro)

## Rotas API

### GET /atendimentos

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
[
  {
    "id": "string",
    "data_atendimento": "YYYY-MM-DD",
    "horario_inicio": "HH:MM",
    "horario_fim": "HH:MM",
    "cliente_id": "string",
    "origem": "string",
    "observacoes": "string | null",
    "duracao_minutos": 0,
    "compareceu": true,
    "primeira_visita": true,
    "colaborador": {
      "id": "string",
      "nome": "string"
    },
    "servicos": [
      {
        "servico_id": "string",
        "nome": "string",
        "preco": 0,
        "feito_por_mim": true,
        "colaborador_executor_id": "string",
        "colaborador_assistente_id": "string",
        "cliente_indicador_id": "string"
      }
    ],
    "produtos": [
      {
        "produto_id": "string",
        "nome": "string",
        "preco": 0,
        "quantidade": 0,
        "vendido_por_mim": true,
        "colaborador_vendedor_id": "string"
      }
    ]
  }
]
```

## Stores

- `useAtendimentosStore`:
  - `loadVisits()`: Carrega lista via `GET /atendimentos?barbearia_id={id}`
  - `visitsToday`: Getter que filtra atendimentos de hoje
  - `visitsThisMonth`: Getter que filtra atendimentos do mês atual
- `useClientesStore`: Para buscar nomes dos clientes

