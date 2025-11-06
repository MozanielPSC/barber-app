# Tela de Projeção de Comissões

## Visão Geral

Projeção de comissões mensais baseada em performance atual ou do mês passado. Permite ajustar parâmetros e comparar com meta mensal.

## Layout Visual

### Header
- **Link**: "Voltar para Comissões" (azul) - navega para `/comissoes`
- **Título**: "Projeção Mensal"
- **Subtítulo**: "Veja sua performance e projete seus ganhos"

### Filtro de Base
- **Card**: Select "Base de projeção"
  - Opções: "Mês Atual (Performance até agora)", "Mês Passado (Performance completa)"

### Performance Atual (Grid 4 colunas)
- **Serviços Vendidos**:
  - Ícone: Scissors (azul)
  - Valor: Grande (text-3xl)
  - Subtítulo: "{X} dias trabalhados"
- **Produtos Vendidos**:
  - Ícone: Shopping bag (verde)
  - Valor: Grande
  - Subtítulo: "{X} unidades"
- **Indicações**:
  - Ícone: Pessoas (roxo)
  - Valor: Grande
  - Subtítulo: "{X} ativas"
- **Assinaturas**:
  - Ícone: Document (laranja)
  - Valor: Grande
  - Subtítulo: "{valor}/mês"

### Projeção do Mês (Card Gradiente)
- **Card Gradiente**: Azul → Roxo → Rosa
- **Título**: "Projeção do Mês"
- **Subtítulo**: Baseado na performance selecionada
- **Grid 2 colunas**:

#### Lado Esquerdo: Meta vs Projeção
- **Meta Mensal**:
  - Barra: 100% (gradiente amarelo-laranja)
  - Valor: Meta configurada
- **Sua Projeção**:
  - Barra: Percentual calculado (verde se >= meta, vermelho se < meta)
  - Valor: Projeção calculada
- **Diferença**:
  - Card verde se superando, vermelho se faltando
  - Valor absoluto da diferença

#### Lado Direito: Ajuste Sua Performance
- **Serviços por dia**: Input number (0-30, step 0.5)
- **Produtos por dia**: Input number (0-20, step 0.5)
- **Indicações por semana**: Input number (0-10, step 0.5)
- **Assinaturas por mês**: Input number (0-20, step 1)
- **Valores mostram**: Atual vs Ajustado

### Breakdown de Projeção
- **Card**: Título "Projeção por Tipo"
- **Lista**: Cada tipo com valor projetado e percentual

### Comparação com Meta
- **Card**: Gráfico ou tabela comparando projeção vs meta

## Rotas API

### GET /comissoes/projecao

**Query Params:**
- `barbearia_id` (obrigatório)
- `colaborador_id` (opcional)

**Response:**
```json
{
  "servicos_vendidos": 0,
  "produtos_vendidos": 0,
  "indicacoes_feitas": 0,
  "assinaturas_vendidas": 0,
  "projecao_servicos": 0,
  "projecao_produtos": 0,
  "projecao_indicacoes": 0,
  "projecao_assinaturas": 0,
  "comissao_servicos": 0.00,
  "comissao_produtos": 0.00,
  "comissao_indicacoes": 0.00,
  "comissao_assinaturas": 0.00,
  "projecao_total": 0.00
}
```

**Nota**: A projeção é calculada no frontend baseada na performance atual ou do mês passado, multiplicando pelos dias restantes do mês.

## Stores

- `useComissoesStore`:
  - `loadProjecaoComissoes(colaboradorId?)`: Carrega via `GET /comissoes/projecao?barbearia_id={id}&colaborador_id={id}`
  - `projecao`: State com os dados de projeção
  - `loadVendasServicos(mes?, colaboradorId?)`: Usado para calcular performance atual
  - `loadVendasProdutos(mes?, colaboradorId?)`: Usado para calcular performance atual
  - `loadIndicacoes(mes?, colaboradorId?)`: Usado para calcular performance atual
- `useAppStore`: Notificações

## Cálculos no Frontend

- **Dias decorridos**: Dias do mês até hoje
- **Dias restantes**: Total de dias do mês - dias decorridos
- **Serviços por dia**: `servicos_vendidos / dias_decorridos`
- **Produtos por dia**: `produtos_vendidos / dias_decorridos`
- **Indicações por semana**: `indicacoes_feitas / (dias_decorridos / 7)`
- **Projeção de serviços**: `servicos_por_dia * dias_restantes`
- **Projeção de produtos**: `produtos_por_dia * dias_restantes`
- **Projeção de indicações**: `indicacoes_por_semana * (dias_restantes / 7)`
- **Projeção total**: Soma de todas as comissões projetadas

