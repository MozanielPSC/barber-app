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

### GET /agenda

**Query Params:**
- `barbearia_id` (obrigatório)
- `data_inicio` (opcional, formato: YYYY-MM-DD)
- `data_fim` (opcional)
- `colaborador_id` (opcional)

**Response:**
```json
[
  {
    "id": "string",
    "cliente_id": "string",
    "cliente_nome": "string",
    "colaborador_id": "string",
    "colaborador_nome": "string",
    "data_hora": "string",
    "servicos": [
      {
        "id": "string",
        "nome": "string",
        "preco": 0
      }
    ],
    "status": "agendado" | "em_andamento" | "concluido" | "cancelado"
  }
]
```

## Stores

- `useAtendimentosStore`: 
  - `loadAgendamentos(filters)`: Carrega agendamentos
- `useColaboradoresStore`: Lista colaboradores para colunas

## Implementação React Native

Use `react-native-calendars` ou componente customizado de grid. Para grade semanal, crie grid manual com `View` e `FlatList`.

```tsx
const AgendaScreen = () => {
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [agendamentos, setAgendamentos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda Semanal</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NovoAgendamento')}>
          <PlusIcon />
          <Text>Novo Agendamento</Text>
        </TouchableOpacity>
      </View>

      {/* Navegação de Semana */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity onPress={previousWeek}>
          <ChevronLeftIcon />
        </TouchableOpacity>
        <Text>{formatWeekRange(weekStart)}</Text>
        <TouchableOpacity onPress={nextWeek}>
          <ChevronRightIcon />
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <ScrollView horizontal>
        <View style={styles.grid}>
          {/* Header com colaboradores */}
          <View style={styles.gridHeader}>
            <View style={styles.timeColumn} />
            {colaboradores.map(colab => (
              <View key={colab.id} style={styles.colaboradorColumn}>
                <Text>{colab.nome}</Text>
              </View>
            ))}
          </View>

          {/* Linhas de horário */}
          {timeSlots.map(time => (
            <View key={time} style={styles.gridRow}>
              <Text style={styles.timeCell}>{time}</Text>
              {colaboradores.map(colab => {
                const agendamento = findAgendamento(time, colab.id);
                return (
                  <TouchableOpacity
                    key={colab.id}
                    style={styles.cell}
                    onPress={() => agendamento && openDetails(agendamento)}
                  >
                    {agendamento && (
                      <AgendamentoCard agendamento={agendamento} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
```

