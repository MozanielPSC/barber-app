# Tela de Lista de Serviços

## Visão Geral

Lista de serviços cadastrados em formato de tabela editável inline. Permite edição direta nos campos e adição de novos serviços.

## Layout Visual

### Header
- **Título**: "Catálogo — Serviços"
- **Botão**: "+ Adicionar serviço" (só se tiver permissão)

### Tabela (Desktop)
- **Colunas**:
  1. Nome (input editável)
  2. Preço (R$) (input number)
  3. % Comissão (input number, 0-1)
  4. % Assistente (input number, 0-1)
  5. % Indicador (input number, 0-1)
  6. Meta q/dia (input number)
  7. Ações (botão salvar/excluir)

- **Estilo**: 
  - Background: `bg-gray-900/50` com `backdrop-blur-sm`
  - Tabela: Borda `border-gray-800`
  - Header: `bg-gray-800`, sticky
  - Rows: Hover `bg-gray-800/30`
  - Inputs: `bg-gray-800`, `border-gray-700`, texto branco

### Cards (Mobile)
- Cards individuais com mesmos campos
- Botões de ação em cada card

## Funcionalidades

- **Edição Inline**: Campos editáveis diretamente na tabela
- **Auto-save**: Salva automaticamente ao sair do campo (ou botão salvar)
- **Adicionar**: Botão adiciona nova linha vazia
- **Excluir**: Botão de exclusão em cada linha

## Rotas API

### GET /servicos

**Query Params:**
- `barbearia_id` (obrigatório)

**Response:**
```json
[
  {
    "id": "string",
    "nome": "string",
    "preco_padrao": 0,
    "percentual_comissao": 0,
    "percentual_comissao_assistente": 0,
    "percentual_comissao_indicador": 0,
    "meta_diaria": 0
  }
]
```

### POST /servicos

**Request Body:**
```json
{
  "nome": "string",
  "preco_padrao": 0,
  "percentual_comissao": 0,
  "percentual_comissao_assistente": 0,
  "percentual_comissao_indicador": 0,
  "meta_diaria": 0,
  "barbearia_id": "string"
}
```

### PUT /servicos/{id}

**Request Body**: Mesmo formato do POST

### DELETE /servicos/{id}

**Query Params:**
- `barbearia_id` (obrigatório)

## Stores

- `useServicosStore`:
  - `loadServicos()`: Carrega lista
  - `addServico(data)`: Adiciona
  - `updateServico(id, data)`: Atualiza
  - `deleteServico(id)`: Exclui

## Implementação React Native

Use `FlatList` com `renderItem` customizado ou `SectionList` para tabela. Para edição inline, use `TextInput` dentro dos itens da lista.

```tsx
const ServicesScreen = () => {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo — Serviços</Text>
        <TouchableOpacity onPress={handleAdd}>
          <Text>+ Adicionar serviço</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        renderItem={({ item }) => (
          <ServiceRow 
            service={item} 
            isEditing={editingId === item.id}
            onEdit={setEditingId}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
```

