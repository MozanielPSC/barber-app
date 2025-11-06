# Tela de Criar Atendimento

## Visão Geral

Formulário completo para registrar novo atendimento realizado. Permite adicionar múltiplos serviços e produtos, configurar comissões e forma de pagamento.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft
- **Título**: "Novo Atendimento"
- **Subtítulo**: "Registre um novo atendimento realizado"

### Formulário (Card)

#### Seção: Informações Básicas
- **Data *** (date picker)
- **Cliente *** (select com busca)
  - Formato: "Nome — Telefone"
- **Colaborador *** (select)

#### Seção: Horário
- **Início** (time picker)
- **Fim** (time picker)

#### Seção: Origem e Status
- **Canal** (select, padrão: "Walk-in"):
  - Walk-in, Indicação, Instagram, Facebook, Google, Parceria, Outro
- **Checkbox**: "Cliente compareceu" (padrão: true)
- **Checkbox**: "Primeira visita" (padrão: false)

#### Seção: Serviços
- **Botão**: "Adicionar" (azul, com ícone Plus)
- **Lista de Serviços**:
  - **Serviço *** (select, obrigatório)
  - **Preço**: Exibido (readonly, cinza, padrão do serviço)
  - **Executor** (select, opcional): Colaborador que executou o serviço
  - **Assistente** (select, opcional): Colaborador que assistiu
  - **Quem Indicou** (select, opcional): Cliente que indicou
  - **Botão**: Remover (ícone XMarkIcon, vermelho)
- **Estado Vazio**: "Nenhum serviço adicionado"

#### Seção: Produtos
- **Botão**: "Adicionar" (roxo, com ícone Plus)
- **Lista de Produtos**:
  - **Produto *** (select, obrigatório)
  - **Preço**: Exibido (readonly, cinza, padrão do produto)
  - **Quantidade *** (input number, mínimo 1, obrigatório)
  - **Vendedor** (select, opcional): Colaborador que vendeu
  - **Botão**: Remover (ícone XMarkIcon, vermelho)
- **Estado Vazio**: "Nenhum produto adicionado"

#### Seção: Total
- **Card com gradiente** (azul-roxo):
  - **Label**: "Total do Atendimento"
  - **Valor**: Soma de serviços + produtos (grande, bold, azul)

#### Seção: Observações
- **Textarea** (4 linhas)

### Botões de Ação
- **Cancelar**: Outline cinza
- **Salvar Atendimento**: Azul sólido

## Validações

1. **Campos Obrigatórios**: Data, Cliente, Colaborador
2. **Serviços/Produtos**: Pelo menos um serviço ou produto deve ser adicionado
3. **Serviços**: Serviço obrigatório em cada item
4. **Produtos**: Produto e quantidade obrigatórios em cada item (quantidade >= 1)

## Rotas da API

### POST /atendimentos

**Request Body:**
```json
{
  "barbearia_id": "string",
  "cliente_id": "string",
  "colaborador_id": "string",
  "data": "YYYY-MM-DD",
  "horario_inicio": "HH:MM",
  "horario_fim": "HH:MM",
  "origem": "string",
  "compareceu": true,
  "primeira_visita": true,
  "observacoes": "string | null",
  "servicos": [
    {
      "servico_id": "string",
      "nome": "string",
      "preco": 0,
      "colaborador_executor_id": "string | null",
      "colaborador_assistente_id": "string | null",
      "cliente_indicador_id": "string | null"
    }
  ],
  "produtos": [
    {
      "produto_id": "string",
      "nome": "string",
      "preco": 0,
      "quantidade": 0,
      "colaborador_vendedor_id": "string | null",
      "prateleira_id": "string"
    }
  ]
}
```

**Nota**: 
- `horario_inicio` e `horario_fim` são opcionais
- `origem` é opcional (padrão: "Walk-in")
- `compareceu` é opcional (padrão: true)
- `primeira_visita` é opcional (padrão: false)
- `observacoes` é opcional
- `servicos` e `produtos` são arrays (pelo menos um deve ter itens)
- Para produtos, `prateleira_id` é necessário para dar baixa no estoque

**Response:**
```json
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
  "servicos": [...],
  "produtos": [...]
}
```

**Nota**: Após criar o atendimento, o sistema automaticamente dá baixa no estoque para produtos vendidos (se `prateleira_id` foi fornecido).

## Stores

- `useAtendimentosStore`: 
  - `addVisit(visitData)`: Cria atendimento via `POST /atendimentos`, dá baixa no estoque automaticamente
- `useClientesStore`: Lista de clientes para select
- `useColaboradoresStore`: Lista de colaboradores para select (executor, assistente, vendedor)
- `useServicosStore`: Lista de serviços para select
- `useProdutosStore`: Lista de produtos para select
- `useEstoqueStore`: Para dar baixa automática em produtos vendidos
- `useAppStore`: Notificações


