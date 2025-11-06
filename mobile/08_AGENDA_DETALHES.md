# Tela de Detalhes do Agendamento

## Visão Geral

Detalhes do agendamento com opções de editar, cancelar ou converter em atendimento.

## Layout

- Informações do agendamento
- Botões: Editar, Cancelar, Iniciar Atendimento

## Rotas API

### GET /atendimentos/{id}

**Path Params:**
- `id`: UUID do agendamento

**Response:**
```json
{
  "id": "uuid",
  "usuario_id": "uuid",
  "barbearia_id": "uuid",
  "colaborador_id": "uuid",
  "cliente_id": "uuid",
  "data_atendimento": "2024-10-15",
  "horario_inicio": "09:00:00",
  "horario_fim": "09:30:00",
  "duracao_minutos": 30,
  "status": "agendado",
  "origem": "agendamento",
  "observacoes": "string | null",
  "cliente": {
    "id": "uuid",
    "nome": "João Silva",
    "telefone": "11999999999"
  },
  "colaborador": {
    "id": "uuid",
    "nome": "Carlos"
  },
  "servicos": [
    {
      "id": "uuid",
      "servico_id": "uuid",
      "nome": "Corte de Cabelo",
      "preco": "50.00"
    }
  ]
}
```

### PATCH /atendimentos/{id}/status

**Path Params:**
- `id`: UUID do agendamento

**Body:**
```json
{
  "status": "confirmado" | "em_andamento" | "concluido" | "cancelado" | "nao_compareceu",
  "barbearia_id": "uuid"
}
```

**Status Válidos:**
- `agendado` - Cliente agendou
- `confirmado` - Agendamento confirmado
- `em_andamento` - Atendimento iniciado (converte em atendimento)
- `concluido` - Atendimento finalizado
- `cancelado` - Agendamento cancelado
- `nao_compareceu` - Cliente não compareceu

**Response:** Retorna o agendamento atualizado

### PUT /atendimentos/{id}

**Path Params:**
- `id`: UUID do agendamento

**Body:**
```json
{
  "colaborador_id": "uuid",
  "cliente_id": "uuid",
  "servico_id": "uuid",
  "data": "2024-10-15",
  "horario_inicio": "09:00",
  "observacoes": "string | null",
  "barbearia_id": "uuid"
}
```

**Response:** Retorna o agendamento atualizado

### DELETE /atendimentos/{id}

**Path Params:**
- `id`: UUID do agendamento

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:** 204 No Content

