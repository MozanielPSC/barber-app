# Tela de Cadastro de Serviço

## Visão Geral

Formulário completo para cadastrar novo serviço com configuração de comissões.

## Layout Visual

### Header
- **Botão Voltar**: Ícone ArrowLeft
- **Título**: "Novo Serviço"
- **Subtítulo**: "Cadastre um novo serviço do catálogo"

### Formulário (Card)

#### Seção: Informações do Serviço
- **Nome do Serviço** * (obrigatório)
  - Placeholder: "Ex: Corte Masculino, Barba, Degradê"
- **Preço Padrão (R$)** * (obrigatório)
  - Tipo: number, min="0", step="0.01"
- **Meta Diária (quantidade)** (opcional)
  - Tipo: number, min="0", step="1"
  - Info box: Explica que a meta é usada para acompanhar desempenho no dashboard

#### Seção: Comissões

**Comissão Principal**:
- **Percentual de Comissão (%)**: number, min="0", max="100", step="1"
- **Preview**: Card azul mostrando "Comissão por serviço" com valor calculado

**Comissão Assistente (Opcional)**:
- **Percentual para Assistente (%)**: number, min="0", max="100", step="1"
- **Preview**: Card verde mostrando "Comissão assistente" com valor calculado

**Comissão Indicador (Opcional)**:
- **Percentual para Indicador (%)**: number, min="0", max="100", step="1"
- **Preview**: Card roxo mostrando "Comissão indicador" com valor calculado

### Botões de Ação
- **Cancelar**: Outline cinza
- **Salvar Serviço**: Azul sólido

## Validações

- Nome e Preço Padrão obrigatórios
- Percentuais de comissão são opcionais (podem ser 0)

## Rotas API

### POST /servicos

**Request Body:**
```json
{
  "nome": "string",
  "preco_padrao": 0.00,
  "percentual_comissao_executor": 0.5,
  "percentual_comissao_assistente": 0.1,
  "percentual_comissao_indicacao": 0.05,
  "meta_diaria_qtd": 10,
  "barbearia_id": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "nome": "string",
  "preco_padrao": "0.00",
  "percentual_comissao_executor": 0.5,
  "percentual_comissao_assistente": 0.1,
  "percentual_comissao_indicacao": 0.05,
  "meta_diaria_qtd": 10
}
```

## Stores

- `useServicosStore`: 
  - `addService(data)`: Cria serviço via `POST /servicos`
- `useBarbeariasStore`: Para obter `barbearia_id`
- `useAppStore`: Notificações

