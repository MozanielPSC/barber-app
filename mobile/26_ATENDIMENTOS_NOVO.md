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
- **Canal** (select):
  - Walk-in, Indicação, Instagram, Facebook, Google, Parceria, Outro
- **Checkbox**: "Cliente compareceu"
- **Status** (select):
  - Agendado, Em Andamento, Concluído, Cancelado

#### Seção: Serviços Realizados
- **Botão**: "+ Adicionar Serviço"
- **Lista de Serviços**:
  - **Serviço** (select)
  - **Preço** (input number, editável, padrão do serviço)
  - **Checkbox**: "Realizado por mim"
  - **Botão**: Remover (ícone lixeira)
- **Total de Serviços**: Soma dos preços

#### Seção: Produtos Vendidos
- **Botão**: "+ Adicionar Produto"
- **Lista de Produtos**:
  - **Produto** (select)
  - **Quantidade** (input number)
  - **Preço Unitário** (input number, editável, padrão do produto)
  - **Checkbox**: "Realizado por mim"
  - **Subtotal**: Quantidade × Preço Unitário
  - **Botão**: Remover (ícone lixeira)
- **Total de Produtos**: Soma dos subtotais

#### Seção: Pagamento
- **Forma de Pagamento *** (select):
  - Dinheiro
  - Débito
  - Crédito
  - PIX
  - Outro
- **Valor Total**: Soma de serviços + produtos
- **Desconto** (input number, opcional)
- **Valor Final**: Total - Desconto

#### Seção: Observações
- **Textarea** (4 linhas)

### Botões de Ação
- **Cancelar**: Outline cinza
- **Salvar Atendimento**: Azul sólido

## Validações

1. **Campos Obrigatórios**: Data, Cliente, Colaborador, Forma de Pagamento
2. **Serviços/Produtos**: Pelo menos um serviço ou produto deve ser adicionado
3. **Horário**: Fim deve ser maior que Início (se ambos preenchidos)
4. **Preços**: Devem ser maiores que zero

## Rotas da API

### POST /atendimentos

**Request Body:**
```json
{
  "barbearia_id": "string",
  "cliente_id": "string",
  "colaborador_id": "string",
  "data": "YYYY-MM-DD",
  "hora_inicio": "HH:MM",
  "hora_fim": "HH:MM",
  "canal": "string",
  "compareceu": true,
  "status": "concluido",
  "servicos": [
    {
      "servico_id": "string",
      "preco": 0,
      "realizado_por_mim": true
    }
  ],
  "produtos": [
    {
      "produto_id": "string",
      "quantidade": 0,
      "preco_unitario": 0,
      "realizado_por_mim": true
    }
  ],
  "forma_pagamento": "dinheiro",
  "desconto": 0,
  "observacoes": "string | null"
}
```

**Response:**
```json
{
  "id": "string",
  "total": 0,
  "mensagem": "Atendimento registrado com sucesso"
}
```

## Stores

- `useAtendimentosStore`: `criarAtendimento(payload)`
- `useClientesStore`: Lista de clientes para select
- `useColaboradoresStore`: Lista de colaboradores para select
- `useServicosStore`: Lista de serviços para select
- `useProdutosStore`: Lista de produtos para select
- `useAppStore`: Notificações


