# Tela de Lista de Agenda

## Visão Geral

Visualização de agendamentos em formato de grade semanal (grid). Mostra colaboradores nas colunas e horários nas linhas.

## Layout Visual

### Header
- **Título**: "Agenda Semanal"
- **Subtítulo**: "Visualize e gerencie os agendamentos dos colaboradores"
- **Botão**: "Novo Agendamento" (azul, com ícone Plus)

### Componente AgendaGrid
- **Estrutura**: Grade semanal
- **Colunas**: Colaboradores
- **Linhas**: Horários do dia
- **Células**: Agendamentos (se houver)
- **Navegação**: Setas para semana anterior/próxima
- **Data Atual**: Destaque visual

### Célula de Agendamento
- **Background**: Cor baseada no status
- **Informações**: Cliente, horário, serviços
- **Click**: Abre detalhes/edita

## Rotas API

### GET /atendimentos/agendamentos/lista

**Query Params:**
- `barbearia_id` (obrigatório)
- `data` (opcional, formato: YYYY-MM-DD) - Data específica
- `data_inicio` (opcional, formato: YYYY-MM-DD) - Data inicial do intervalo
- `data_fim` (opcional, formato: YYYY-MM-DD) - Data final do intervalo
- `colaborador_id` (opcional) - Filtrar por colaborador
- `status` (opcional) - Filtrar por status: "agendado", "confirmado", "em_andamento", "concluido", "cancelado", "nao_compareceu"

**Exemplo:**
```
GET /atendimentos/agendamentos/lista?barbearia_id=uuid&data=2024-10-15&colaborador_id=uuid
```

**Response:**
```json
[
  {
    "id": "string",
    "usuario_id": "string",
    "barbearia_id": "string",
    "colaborador_id": "string",
    "cliente_id": "string",
    "data_atendimento": "2024-10-15",
    "horario_inicio": "09:00:00",
    "horario_fim": "09:30:00",
    "duracao_minutos": 30,
    "status": "agendado",
    "origem": "agendamento",
    "observacoes": "string | null",
    "cliente": {
      "id": "string",
      "nome": "string",
      "telefone": "string | null"
    },
    "colaborador": {
      "id": "string",
      "nome": "string"
    },
    "servicos": [
      {
        "id": "string",
        "servico_id": "string",
        "nome": "string",
        "preco": "50.00"
      }
    ]
  }
]
```

## Stores

- `useAtendimentosStore`: 
  - `listarAgendamentos(filters)`: Carrega agendamentos
    - Filtros: `{ barbearia_id, data?, data_inicio?, data_fim?, colaborador_id?, status? }`
- `useColaboradoresStore`: Lista colaboradores para colunas


