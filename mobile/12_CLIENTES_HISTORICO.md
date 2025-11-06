# Tela de Histórico do Cliente

## Visão Geral

Lista completa e cronológica de histórico de atendimentos e compras do cliente. Permite visualizar todas as interações com o cliente.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft
- **Título**: "Histórico do Cliente"
- **Subtítulo**: Nome do cliente

### Resumo (Card de Estatísticas)
- **Grid 4 colunas**:
  - Total de Atendimentos (azul)
  - Atendimentos Concluídos (verde)
  - Atendimentos Cancelados (vermelho)
  - Total Gasto (roxo)
- **Grid 3 colunas**:
  - Total Gasto em Serviços
  - Total Gasto em Produtos
  - Colaboradores que Atenderam

### Timeline de Atendimentos
- **Layout**: Timeline vertical com linha conectando os atendimentos
- **Cada Item**:
  - **Ponto na Timeline**: Cor baseada no status (verde=concluído, azul=agendado, amarelo=em_andamento, vermelho=cancelado, laranja=não_compareceu)
  - **Card do Atendimento**:
    - **Header**: Avatar do colaborador (ou iniciais), nome, função, data e horário
    - **Status**: Badge colorido com o status
    - **Serviços**: Lista de serviços realizados com preços
    - **Produtos**: Lista de produtos comprados com quantidades e preços
    - **Total**: Valor total calculado (serviços + produtos)
    - **Ações**: Link para ver detalhes do atendimento
- **Ordenação**: Mais recente primeiro
- **Estado Vazio**: Ícone + mensagem "Nenhum atendimento encontrado"

## Rotas da API

### GET /clientes/{id}/historico

**Path Params:**
- `id`: UUID do cliente

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
{
  "cliente": {
    "id": "string",
    "nome": "string",
    "telefone": "string"
  },
  "estatisticas": {
    "total_atendimentos": 0,
    "atendimentos_concluidos": 0,
    "atendimentos_cancelados": 0,
    "total_gasto_geral": 0.00,
    "total_gasto_servicos": 0.00,
    "total_gasto_produtos": 0.00,
    "colaboradores_que_atenderam": 0
  },
  "atendimentos": [
    {
      "id": "string",
      "data_atendimento": "YYYY-MM-DD",
      "horario_inicio": "HH:MM:SS",
      "horario_fim": "HH:MM:SS",
      "status": "agendado" | "em_andamento" | "concluido" | "cancelado" | "nao_compareceu",
      "colaborador": {
        "id": "string",
        "nome": "string",
        "funcao": "string",
        "foto_perfil_url_assinada": "string | null"
      },
      "servicos": [
        {
          "id": "string",
          "nome": "string",
          "preco": "0.00"
        }
      ],
      "produtos": [
        {
          "id": "string",
          "nome": "string",
          "quantidade": 0,
          "preco": "0.00"
        }
      ]
    }
  ]
}
```

## Stores

- **Não há store específica**: A página faz chamada direta à API usando `useApi`
- `useAtendimentosStore`: Para navegar para detalhes do atendimento
- `useBarbeariasStore`: Para obter `barbearia_id`


