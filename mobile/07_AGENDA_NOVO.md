# Tela de Criar Agendamento

## Visão Geral

Formulário para criar novo agendamento futuro.

## Campos

- Cliente * (select/busca)
- Colaborador * (select)
- Data e Hora *
- Serviços (lista)
- Observações

## Rotas API

### POST /atendimentos/agendamento

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

**Validações Automáticas:**
- ✅ Colaborador existe
- ✅ Cliente existe
- ✅ Serviço existe
- ✅ Colaborador oferece o serviço
- ✅ Horário está dentro do expediente do colaborador
- ✅ Não há conflito com outros agendamentos
- ✅ Calcula automaticamente o horário de fim baseado na duração do serviço

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
  "cliente": {
    "id": "uuid",
    "nome": "João Silva",
    "telefone": "11999999999"
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

### GET /atendimentos/colaborador/{id}/disponibilidade

**Query Params:**
- `data` (obrigatório): YYYY-MM-DD
- `servico_id` (obrigatório): UUID do serviço
- `intervalo` (opcional): Intervalo em minutos (padrão: 30)

**Response:**
```json
{
  "colaborador_id": "uuid",
  "data": "2024-10-15",
  "horarios_disponiveis": [
    {
      "horario": "09:00:00",
      "horario_formatado": "09:00"
    },
    {
      "horario": "09:30:00",
      "horario_formatado": "09:30"
    }
  ]
}
```

