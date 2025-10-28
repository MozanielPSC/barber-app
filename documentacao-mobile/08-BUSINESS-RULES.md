# Barber App - Regras de Negócio

## Visão Geral

Este documento descreve as principais regras de negócio implementadas no Barber App, incluindo sistemas de comissões, estoque, agendamento, metas e cálculos de KPIs. Essas regras são fundamentais para a implementação correta da versão mobile.

## Sistema de Comissões

### Estrutura de Comissões

O sistema de comissões é baseado em diferentes tipos de comissão para serviços e produtos:

#### Comissões de Serviços
```typescript
interface ComissaoServico {
  executor: number        // Comissão do colaborador que executou
  assistente?: number     // Comissão do colaborador que assistiu
  indicacao?: number      // Comissão do colaborador que indicou o cliente
}
```

#### Comissões de Produtos
```typescript
interface ComissaoProduto {
  vendedor: number        // Comissão do colaborador que vendeu
}
```

### Cálculo de Comissões

#### Serviços
```typescript
// Exemplo: Corte Masculino - R$ 50,00
const servico = {
  preco_padrao: 50.00,
  percentual_comissao_executor: 0.50,    // 50%
  percentual_comissao_assistente: 0.20,  // 20%
  percentual_comissao_indicacao: 0.10    // 10%
}

// Cálculo das comissões
const comissaoExecutor = 50.00 * 0.50    // R$ 25,00
const comissaoAssistente = 50.00 * 0.20  // R$ 10,00
const comissaoIndicacao = 50.00 * 0.10   // R$ 5,00
```

#### Produtos
```typescript
// Exemplo: Shampoo - R$ 59,00
const produto = {
  preco_padrao: 59.00,
  percentual_comissao: 0.20,    // 20%
  percentual_imposto: 0.12,     // 12%
  percentual_cartao: 0.03       // 3%
}

// Cálculo da comissão
const comissaoVendedor = 59.00 * 0.20    // R$ 11,80
```

### Sistema de Débitos

#### Tipos de Débito
1. **Adiantamento**: Dinheiro adiantado ao colaborador
2. **Desconto**: Desconto aplicado em comissões
3. **Multa**: Multa por atraso ou falta
4. **Outros**: Outros tipos de débito

#### Cálculo do Saldo Líquido
```typescript
const calcularSaldoLiquido = (comissoes: number, debitos: number): number => {
  return comissoes - debitos
}

// Exemplo:
// Comissões: R$ 1.500,00
// Débitos: R$ 200,00
// Saldo Líquido: R$ 1.300,00
```

### Projeção de Comissões

#### Baseado em Metas
```typescript
const calcularProjecao = (metaDiaria: number, diasTrabalhados: number, percentualComissao: number): number => {
  const metaMensal = metaDiaria * diasTrabalhados
  return metaMensal * percentualComissao
}

// Exemplo:
// Meta diária: R$ 400,00
// Dias trabalhados: 22
// Percentual comissão: 50%
// Projeção: R$ 400 * 22 * 0.50 = R$ 4.400,00
```

## Sistema de Estoque

### Estrutura de Prateleiras

```typescript
interface Prateleira {
  id: string
  nome: string
  descricao?: string
  ativa: boolean
  barbearia_id: string
}
```

### Tipos de Movimentação

#### 1. Entrada
```typescript
interface MovimentacaoEntrada {
  produto_id: string
  prateleira_id: string
  quantidade: number
  lote?: string
  data_validade?: string
  motivo: string
  observacoes?: string
}
```

#### 2. Saída
```typescript
interface MovimentacaoSaida {
  produto_id: string
  prateleira_id: string
  quantidade: number
  motivo: string
  observacoes?: string
}
```

#### 3. Transferência
```typescript
interface MovimentacaoTransferencia {
  produto_id: string
  prateleira_origem_id: string
  prateleira_destino_id: string
  quantidade: number
  motivo: string
  observacoes?: string
}
```

#### 4. Ajuste
```typescript
interface MovimentacaoAjuste {
  produto_id: string
  prateleira_id: string
  quantidade: number  // Positiva ou negativa
  motivo: string
  observacoes?: string
}
```

### Controle de Estoque

#### Quantidade Disponível
```typescript
const calcularQuantidadeDisponivel = (produtoId: string, prateleiraId: string): number => {
  const entradas = movimentacoes.filter(m => 
    m.produto_id === produtoId && 
    m.prateleira_id === prateleiraId && 
    m.tipo === 'entrada'
  ).reduce((sum, m) => sum + m.quantidade, 0)
  
  const saidas = movimentacoes.filter(m => 
    m.produto_id === produtoId && 
    m.prateleira_id === prateleiraId && 
    m.tipo === 'saida'
  ).reduce((sum, m) => sum + m.quantidade, 0)
  
  return entradas - saidas
}
```

#### Alertas de Estoque Baixo
```typescript
const verificarEstoqueBaixo = (produto: Product, quantidadeAtual: number): boolean => {
  // Definir limite mínimo (ex: 10% do estoque inicial ou valor fixo)
  const limiteMinimo = produto.limite_minimo || 5
  return quantidadeAtual <= limiteMinimo
}
```

### Relatórios de Estoque

#### Valor Total do Estoque
```typescript
const calcularValorTotalEstoque = (estoque: EstoqueProduto[]): number => {
  return estoque.reduce((total, item) => {
    const produto = produtos.find(p => p.id === item.produto_id)
    return total + (item.quantidade_atual * (produto?.preco_padrao || 0))
  }, 0)
}
```

#### Produtos Mais Movimentados
```typescript
const getProdutosMaisMovimentados = (periodo: { inicio: string, fim: string }): Product[] => {
  const movimentacoesPeriodo = movimentacoes.filter(m => 
    m.criado_em >= periodo.inicio && m.criado_em <= periodo.fim
  )
  
  const movimentacaoPorProduto = new Map<string, number>()
  
  movimentacoesPeriodo.forEach(m => {
    const atual = movimentacaoPorProduto.get(m.produto_id) || 0
    movimentacaoPorProduto.set(m.produto_id, atual + Math.abs(m.quantidade))
  })
  
  return Array.from(movimentacaoPorProduto.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([produtoId]) => produtos.find(p => p.id === produtoId))
    .filter(Boolean)
}
```

## Sistema de Agendamento

### Estados do Agendamento

```typescript
type StatusAgendamento = 'pendente' | 'confirmado' | 'cancelado' | 'concluido' | 'nao_compareceu'
```

#### Fluxo de Estados
```
pendente → confirmado → concluido
    ↓         ↓           ↓
cancelado  cancelado   nao_compareceu
```

### Disponibilidade de Colaboradores

#### Estrutura de Disponibilidade
```typescript
interface Disponibilidade {
  id: string
  colaborador_id: string
  dia_semana: number  // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  horario_inicio: string  // "08:00"
  horario_fim: string     // "18:00"
  ativa: boolean
}
```

#### Verificação de Conflitos
```typescript
const verificarConflitoHorario = (
  colaboradorId: string,
  dataHoraInicio: string,
  dataHoraFim: string
): boolean => {
  const agendamentosExistentes = agendamentos.filter(a => 
    a.colaborador_id === colaboradorId &&
    a.status !== 'cancelado' &&
    a.data_hora_inicio < dataHoraFim &&
    a.data_hora_fim > dataHoraInicio
  )
  
  return agendamentosExistentes.length > 0
}
```

#### Validação de Disponibilidade
```typescript
const verificarDisponibilidade = (
  colaboradorId: string,
  dataHoraInicio: string,
  dataHoraFim: string
): boolean => {
  const data = new Date(dataHoraInicio)
  const diaSemana = data.getDay()
  
  const disponibilidade = disponibilidades.find(d => 
    d.colaborador_id === colaboradorId &&
    d.dia_semana === diaSemana &&
    d.ativa
  )
  
  if (!disponibilidade) return false
  
  const horarioInicio = dataHoraInicio.split('T')[1].substring(0, 5)
  const horarioFim = dataHoraFim.split('T')[1].substring(0, 5)
  
  return horarioInicio >= disponibilidade.horario_inicio &&
         horarioFim <= disponibilidade.horario_fim
}
```

### Cálculo de Duração

#### Duração de Serviços
```typescript
const calcularDuracaoServico = (servicoId: string): number => {
  const servico = servicos.find(s => s.id === servicoId)
  return servico?.duracao_minutos || 30  // Padrão: 30 minutos
}
```

#### Horários Disponíveis
```typescript
const gerarHorariosDisponiveis = (
  colaboradorId: string,
  data: string,
  servicoId: string
): string[] => {
  const duracao = calcularDuracaoServico(servicoId)
  const disponibilidade = getDisponibilidadeColaborador(colaboradorId, data)
  
  if (!disponibilidade) return []
  
  const horarios: string[] = []
  const inicio = disponibilidade.horario_inicio
  const fim = disponibilidade.horario_fim
  
  // Gerar slots de 30 em 30 minutos
  let horarioAtual = inicio
  while (horarioAtual < fim) {
    const dataHoraInicio = `${data}T${horarioAtual}:00`
    const dataHoraFim = `${data}T${adicionarMinutos(horarioAtual, duracao)}:00`
    
    if (!verificarConflitoHorario(colaboradorId, dataHoraInicio, dataHoraFim)) {
      horarios.push(horarioAtual)
    }
    
    horarioAtual = adicionarMinutos(horarioAtual, 30)
  }
  
  return horarios
}
```

## Sistema de Metas

### Tipos de Metas

#### Metas Diárias
```typescript
interface MetasDiarias {
  servicos: number    // Valor em reais
  produtos: number    // Valor em reais
  clientes: number    // Quantidade de clientes atendidos
}
```

#### Metas Semanais
```typescript
interface MetasSemanais {
  servicos: number
  produtos: number
  clientes: number
}
```

#### Metas Mensais
```typescript
interface MetasMensais {
  servicos: number
  produtos: number
  clientes: number
}
```

### Cálculo de Progresso

#### Progresso Diário
```typescript
const calcularProgressoDiario = (data: string, colaboradorId?: string): MetasDiarias => {
  const atendimentos = atendimentos.filter(a => 
    a.data_atendimento.startsWith(data) &&
    (!colaboradorId || a.colaborador_id === colaboradorId)
  )
  
  const servicos = atendimentos.reduce((sum, a) => 
    sum + a.servicos.reduce((sSum, s) => sSum + s.preco, 0), 0
  )
  
  const produtos = atendimentos.reduce((sum, a) => 
    sum + a.produtos.reduce((pSum, p) => pSum + (p.preco * p.quantidade), 0), 0
  )
  
  const clientes = atendimentos.length
  
  return { servicos, produtos, clientes }
}
```

#### Percentual de Atingimento
```typescript
const calcularPercentualAtingimento = (realizado: number, meta: number): number => {
  if (meta === 0) return 0
  return Math.min(100, Math.round((realizado / meta) * 100))
}
```

### Metas por Colaborador

#### Metas Individuais
```typescript
interface MetasColaborador {
  colaborador_id: string
  servicos_diarios: number
  produtos_diarios: number
  clientes_diarios: number
  percentual_comissao_servico: number
  percentual_comissao_produto: number
}
```

#### Cálculo de Bonificação
```typescript
const calcularBonificacao = (
  colaboradorId: string,
  periodo: { inicio: string, fim: string }
): number => {
  const metas = getMetasColaborador(colaboradorId)
  const realizado = calcularProgressoPeriodo(colaboradorId, periodo)
  
  let bonificacao = 0
  
  // Bonificação por serviços
  if (realizado.servicos >= metas.servicos_diarios) {
    bonificacao += metas.servicos_diarios * 0.1  // 10% de bônus
  }
  
  // Bonificação por produtos
  if (realizado.produtos >= metas.produtos_diarios) {
    bonificacao += metas.produtos_diarios * 0.1
  }
  
  return bonificacao
}
```

## Cálculo de KPIs do Dashboard

### KPIs Principais

#### Receita Total
```typescript
const calcularReceitaTotal = (periodo: { inicio: string, fim: string }): number => {
  return atendimentos
    .filter(a => a.data_atendimento >= periodo.inicio && a.data_atendimento <= periodo.fim)
    .reduce((sum, a) => sum + a.valor_total, 0)
}
```

#### Ticket Médio
```typescript
const calcularTicketMedio = (periodo: { inicio: string, fim: string }): number => {
  const atendimentos = atendimentos.filter(a => 
    a.data_atendimento >= periodo.inicio && a.data_atendimento <= periodo.fim
  )
  
  if (atendimentos.length === 0) return 0
  
  const receitaTotal = calcularReceitaTotal(periodo)
  return receitaTotal / atendimentos.length
}
```

#### Taxa de Conversão
```typescript
const calcularTaxaConversao = (periodo: { inicio: string, fim: string }): number => {
  const agendamentos = agendamentos.filter(a => 
    a.data_hora_inicio >= periodo.inicio && a.data_hora_inicio <= periodo.fim
  )
  
  const atendimentos = atendimentos.filter(a => 
    a.data_atendimento >= periodo.inicio && a.data_atendimento <= periodo.fim
  )
  
  if (agendamentos.length === 0) return 0
  
  return (atendimentos.length / agendamentos.length) * 100
}
```

#### Clientes em Risco
```typescript
const calcularClientesEmRisco = (diasChurn: number = 45): ClienteRisco[] => {
  const hoje = new Date().toISOString().split('T')[0]
  
  return clientes.map(cliente => {
    const ultimaVisita = getUltimaVisitaCliente(cliente.id)
    
    if (!ultimaVisita) {
      return { ...cliente, status: 'Perdido', diasSemVisita: null }
    }
    
    const diasSemVisita = calcularDiasEntre(ultimaVisita, hoje)
    
    let status: 'Ativo' | 'Em risco' | 'Perdido'
    if (diasSemVisita <= diasChurn) {
      status = 'Ativo'
    } else if (diasSemVisita <= diasChurn * 2) {
      status = 'Em risco'
    } else {
      status = 'Perdido'
    }
    
    return { ...cliente, status, diasSemVisita }
  }).filter(c => c.status !== 'Ativo')
}
```

### Estatísticas de Canais

#### Origem dos Clientes
```typescript
const calcularEstatisticasCanais = (periodo: { inicio: string, fim: string }): CanalStats[] => {
  const atendimentos = atendimentos.filter(a => 
    a.data_atendimento >= periodo.inicio && a.data_atendimento <= periodo.fim
  )
  
  const canais = new Map<string, number>()
  
  atendimentos.forEach(atendimento => {
    const origem = atendimento.source || 'Walk-in'
    canais.set(origem, (canais.get(origem) || 0) + 1)
  })
  
  return Array.from(canais.entries())
    .map(([nome, count]) => ({ nome, count }))
    .sort((a, b) => b.count - a.count)
}
```

## Sistema de Gastos Colaborador

### Tipos de Gasto

```typescript
type TipoGasto = 'adiantamento' | 'desconto' | 'multa' | 'outros'
type StatusGasto = 'pendente' | 'pago' | 'atrasado'
```

### Cálculo de Gastos

#### Gastos Pendentes
```typescript
const calcularGastosPendentes = (colaboradorId: string): number => {
  return gastos
    .filter(g => 
      g.colaborador_id === colaboradorId && 
      g.status === 'pendente'
    )
    .reduce((sum, g) => sum + g.valor_total, 0)
}
```

#### Gastos Atrasados
```typescript
const calcularGastosAtrasados = (colaboradorId: string): GastoColaborador[] => {
  const hoje = new Date().toISOString().split('T')[0]
  
  return gastos.filter(g => 
    g.colaborador_id === colaboradorId &&
    g.status === 'pendente' &&
    g.data_vencimento < hoje
  )
}
```

### Sistema de Parcelamento

#### Criação de Parcelas
```typescript
const criarGastosParcelados = (
  colaboradorId: string,
  valorTotal: number,
  numeroParcelas: number,
  dataPrimeiraParcela: string
): GastoColaborador[] => {
  const valorParcela = valorTotal / numeroParcelas
  const gastos: GastoColaborador[] = []
  
  for (let i = 0; i < numeroParcelas; i++) {
    const dataVencimento = adicionarMeses(dataPrimeiraParcela, i)
    
    gastos.push({
      colaborador_id: colaboradorId,
      descricao: `Parcela ${i + 1}/${numeroParcelas}`,
      valor_total: valorParcela,
      data_vencimento: dataVencimento,
      status: 'pendente'
    })
  }
  
  return gastos
}
```

## Sistema Financeiro

### Despesas Fixas vs Variáveis

#### Despesas Fixas
```typescript
interface DespesaFixa {
  id: string
  nome: string
  valor_mensal: number
  categoria: string
  ativa: boolean
}
```

#### Despesas Variáveis
```typescript
interface DespesaVariavel {
  id: string
  nome: string
  valor: number
  data: string
  categoria: string
  observacoes?: string
}
```

### Cálculo de Lucro

#### Lucro Bruto
```typescript
const calcularLucroBruto = (periodo: { inicio: string, fim: string }): number => {
  const receita = calcularReceitaTotal(periodo)
  const despesasFixas = calcularDespesasFixas(periodo)
  const despesasVariaveis = calcularDespesasVariaveis(periodo)
  
  return receita - despesasFixas - despesasVariaveis
}
```

#### Margem de Lucro
```typescript
const calcularMargemLucro = (periodo: { inicio: string, fim: string }): number => {
  const receita = calcularReceitaTotal(periodo)
  const lucro = calcularLucroBruto(periodo)
  
  if (receita === 0) return 0
  
  return (lucro / receita) * 100
}
```

### Cadeiras e Canais

#### Custo por Cadeira
```typescript
interface Cadeira {
  id: string
  nome: string
  custo_mensal: number
  ativa: boolean
}
```

#### Custo por Canal
```typescript
interface Canal {
  id: string
  nome: string
  custo_mensal: number
  ativo: boolean
}
```

## Validações de Negócio

### Validações de Agendamento

```typescript
const validarAgendamento = (agendamento: AgendamentoForm): string[] => {
  const erros: string[] = []
  
  // Verificar se colaborador está disponível
  if (!verificarDisponibilidade(agendamento.colaborador_id, agendamento.data_hora_inicio, agendamento.data_hora_fim)) {
    erros.push('Colaborador não está disponível neste horário')
  }
  
  // Verificar conflitos
  if (verificarConflitoHorario(agendamento.colaborador_id, agendamento.data_hora_inicio, agendamento.data_hora_fim)) {
    erros.push('Já existe um agendamento neste horário')
  }
  
  // Verificar se data não é no passado
  if (new Date(agendamento.data_hora_inicio) < new Date()) {
    erros.push('Não é possível agendar no passado')
  }
  
  return erros
}
```

### Validações de Estoque

```typescript
const validarMovimentacaoEstoque = (movimentacao: MovimentacaoEstoque): string[] => {
  const erros: string[] = []
  
  // Verificar se produto existe
  const produto = produtos.find(p => p.id === movimentacao.produto_id)
  if (!produto) {
    erros.push('Produto não encontrado')
  }
  
  // Verificar quantidade disponível para saída
  if (movimentacao.tipo === 'saida') {
    const quantidadeDisponivel = calcularQuantidadeDisponivel(movimentacao.produto_id, movimentacao.prateleira_id)
    if (quantidadeDisponivel < movimentacao.quantidade) {
      erros.push('Quantidade insuficiente em estoque')
    }
  }
  
  // Verificar se prateleira existe e está ativa
  const prateleira = prateleiras.find(p => p.id === movimentacao.prateleira_id)
  if (!prateleira || !prateleira.ativa) {
    erros.push('Prateleira não encontrada ou inativa')
  }
  
  return erros
}
```

### Validações de Comissão

```typescript
const validarComissao = (comissao: ComissaoForm): string[] => {
  const erros: string[] = []
  
  // Verificar se colaborador existe
  const colaborador = colaboradores.find(c => c.id === comissao.colaborador_id)
  if (!colaborador) {
    erros.push('Colaborador não encontrado')
  }
  
  // Verificar se valor é positivo
  if (comissao.valor_comissao <= 0) {
    erros.push('Valor da comissão deve ser positivo')
  }
  
  // Verificar se percentual está dentro do limite
  if (comissao.percentual && (comissao.percentual < 0 || comissao.percentual > 1)) {
    erros.push('Percentual deve estar entre 0 e 100%')
  }
  
  return erros
}
```

## Considerações para Mobile

### Otimizações de Performance

#### Cache de Cálculos
```typescript
// Cache de KPIs para evitar recálculos
const kpiCache = new Map<string, { data: any, timestamp: number }>()

const getCachedKPI = (key: string, calculateFn: () => any): any => {
  const cached = kpiCache.get(key)
  const now = Date.now()
  
  // Cache válido por 5 minutos
  if (cached && (now - cached.timestamp) < 300000) {
    return cached.data
  }
  
  const data = calculateFn()
  kpiCache.set(key, { data, timestamp: now })
  return data
}
```

#### Lazy Loading de Dados
```typescript
// Carregar dados sob demanda
const loadDataOnDemand = async (endpoint: string, params: any) => {
  const cacheKey = `${endpoint}_${JSON.stringify(params)}`
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  
  const data = await api.get(endpoint, { params })
  cache.set(cacheKey, data)
  return data
}
```

### Sincronização Offline

#### Queue de Operações
```typescript
interface OfflineOperation {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  endpoint: string
  data: any
  timestamp: number
}

const offlineQueue: OfflineOperation[] = []

const addToOfflineQueue = (operation: Omit<OfflineOperation, 'id' | 'timestamp'>) => {
  const op: OfflineOperation = {
    ...operation,
    id: generateId(),
    timestamp: Date.now()
  }
  
  offlineQueue.push(op)
  saveOfflineQueue()
}

const syncOfflineQueue = async () => {
  if (!navigator.onLine) return
  
  for (const operation of offlineQueue) {
    try {
      await api.request(operation.type, operation.endpoint, operation.data)
      removeFromOfflineQueue(operation.id)
    } catch (error) {
      console.error('Erro ao sincronizar operação:', error)
    }
  }
}
```

### Validações Locais

#### Validação de Formulários
```typescript
const validateForm = (form: any, rules: ValidationRules): ValidationResult => {
  const errors: string[] = []
  
  Object.entries(rules).forEach(([field, rule]) => {
    const value = form[field]
    
    if (rule.required && !value) {
      errors.push(`${rule.label} é obrigatório`)
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors.push(`${rule.label} deve ter pelo menos ${rule.minLength} caracteres`)
    }
    
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors.push(`${rule.label} tem formato inválido`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
```

## Testes de Regras de Negócio

### Testes Unitários

```typescript
describe('Sistema de Comissões', () => {
  test('deve calcular comissão de serviço corretamente', () => {
    const servico = { preco_padrao: 50, percentual_comissao_executor: 0.5 }
    const comissao = calcularComissaoServico(servico)
    expect(comissao).toBe(25)
  })
  
  test('deve calcular saldo líquido corretamente', () => {
    const comissoes = 1000
    const debitos = 200
    const saldo = calcularSaldoLiquido(comissoes, debitos)
    expect(saldo).toBe(800)
  })
})

describe('Sistema de Estoque', () => {
  test('deve calcular quantidade disponível corretamente', () => {
    const movimentacoes = [
      { tipo: 'entrada', quantidade: 100 },
      { tipo: 'saida', quantidade: 30 },
      { tipo: 'entrada', quantidade: 20 }
    ]
    const disponivel = calcularQuantidadeDisponivel(movimentacoes)
    expect(disponivel).toBe(90)
  })
})
```

### Testes de Integração

```typescript
describe('Fluxo de Agendamento', () => {
  test('deve criar agendamento com validações', async () => {
    const agendamento = {
      cliente_id: 'cliente1',
      colaborador_id: 'colaborador1',
      servico_id: 'servico1',
      data_hora_inicio: '2024-01-20T10:00:00',
      data_hora_fim: '2024-01-20T10:30:00'
    }
    
    const erros = validarAgendamento(agendamento)
    expect(erros).toHaveLength(0)
    
    const resultado = await criarAgendamento(agendamento)
    expect(resultado.id).toBeDefined()
  })
})
```

## Monitoramento e Logs

### Logs de Negócio

```typescript
const logBusinessEvent = (event: string, data: any) => {
  console.log(`[BUSINESS] ${event}:`, {
    timestamp: new Date().toISOString(),
    data,
    user: getCurrentUser()?.id
  })
}

// Exemplos de uso
logBusinessEvent('AGENDAMENTO_CRIADO', { agendamentoId: '123', clienteId: '456' })
logBusinessEvent('ESTOQUE_BAIXO', { produtoId: '789', quantidade: 2 })
logBusinessEvent('COMISSAO_CALCULADA', { colaboradorId: '101', valor: 150.50 })
```

### Métricas de Performance

```typescript
const performanceMetrics = {
  calculosComissao: 0,
  calculosEstoque: 0,
  validacoesAgendamento: 0,
  tempoMedioCalculo: 0
}

const measurePerformance = (operation: string, fn: () => any) => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  performanceMetrics[operation]++
  performanceMetrics.tempoMedioCalculo = 
    (performanceMetrics.tempoMedioCalculo + (end - start)) / 2
  
  return result
}
