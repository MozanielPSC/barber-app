# Tela de Dashboard

## Visão Geral

Tela principal do sistema após login. Exibe KPIs (métricas-chave) de serviços, produtos e indicações, com filtros por período e colaborador.

## Layout Visual

### Estrutura
1. **Filtros Avançados** (card no topo)
   - Filtros rápidos (Hoje, Semana, Mês, Ano)
   - Filtros detalhados (Colaborador, Mês, Ano)
   - Botão limpar filtros

2. **Cards de Métricas** (grid 3 colunas)
   - Card Serviços
   - Card Produtos  
   - Card Indicações

3. **Cada Card contém**:
   - Ícone com cor temática
   - Título e período
   - Valor principal (grande)
   - Meta e barra de progresso
   - Comissão do colaborador

## Cores dos Cards

- **Serviços**: Azul (`bg-blue-100`, `text-blue-600`)
- **Produtos**: Roxo (`bg-purple-100`, `text-purple-600`)
- **Indicações**: Verde (`bg-green-100`, `text-green-600`)

## Rotas da API

### GET /dashboard/kpis

**Query Params:**
- `colaborador_id` (opcional)
- `mes` (opcional, formato: YYYY-MM)
- `ano` (opcional)

**Response:**
```json
{
  "servicesToday": 0,
  "productsToday": 0,
  "servicesMonth": 0,
  "productsMonth": 0,
  "commissionToday": 0,
  "commissionMonth": 0,
  "servicesProgress": 0,
  "productsProgress": 0,
  "indicationsCount": 0
}
```

## Stores

- `useDashboardStore`: Carrega KPIs
- `useColaboradoresStore`: Lista colaboradores para filtro
- `useAppStore`: Notificações

## Implementação React Native

Use `FlatList` para os cards, `Picker` para selects, e `ProgressBar` para barras de progresso.

