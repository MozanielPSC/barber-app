# Tela de Configurações do Pote (Assinaturas)

## Visão Geral

Lista e gerenciamento de configurações do pote. Permite criar, editar e excluir configurações, além de gerenciar pesos de serviços.

## Layout Visual

### Header
- **Título**: "Configurações do Pote"
- **Subtítulo**: "Gerencie as configurações de distribuição do pote"
- **Checkbox**: "Apenas ativas" (filtra configurações ativas)
- **Botão**: "Nova Configuração" (azul, com ícone Plus) - navega para `/pote/configuracoes/novo`

### Lista de Configurações
- **Loading**: Spinner com texto "Carregando configurações..."
- **Estado Vazio**: Ícone Cog6ToothIcon, título "Nenhuma configuração encontrada", mensagem contextual, botão "Nova Configuração"
- **Grid de Cards** (3 colunas):
  - **Card de Configuração**:
    - **Header**: Nome (grande), badge de status (Ativa/Inativa)
    - **Informações**:
      - Percentual Casa (percentual formatado)
      - Periodicidade (mensal, semanal, etc.)
      - Valor Ficha Padrão (se aplicável)
      - Tipo de Plano (ilimitado, fichas_fixas, valor_manual)
    - **Ações**: 
      - "Ver Detalhes" (azul) - navega para `/pote/configuracoes/{id}`
      - "Editar" (cinza) - navega para `/pote/configuracoes/{id}`
      - "Excluir" (vermelho) - com confirmação

### Página de Detalhes/Edição (`/pote/configuracoes/{id}`)
- **Header**: Nome da configuração, botão "Voltar"
- **Formulário**: Componente `FormConfiguracao` com campos editáveis
- **Seção: Pesos de Serviços** (apenas para tipos `fichas_fixas` e `valor_manual`):
  - **Título**: "Pesos de Serviços"
  - **Descrição**: Explica que configura quantas fichas cada serviço consome
  - **Lista de Serviços**:
    - Nome do serviço
    - Input number para peso (fichas), step 0.1, min 0.1
    - Botão "Remover" (se peso customizado)
  - **Estado Vazio**: "Nenhum serviço cadastrado"

## Rotas API

### GET /pote/configuracoes/{barbearia_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia

**Response:**
```json
[
  {
    "id": "string",
    "nome": "string",
    "barbearia_id": "string",
    "percentual_casa": 0.3,
    "periodicidade_distribuicao": "mensal",
    "valor_ficha_padrao": 0.00,
    "tipo_plano": "ilimitado" | "fichas_fixas" | "valor_manual",
    "ativo": true,
    "criado_em": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "atualizado_em": "YYYY-MM-DDTHH:mm:ss.sssZ"
  }
]
```

### GET /pote/configuracoes/{barbearia_id}/{configuracao_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `configuracao_id`: UUID da configuração

**Response:** Mesmo formato do array acima (objeto único)

### POST /pote/configuracoes/{barbearia_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia

**Request Body:**
```json
{
  "nome": "string",
  "percentual_casa": 0.3,
  "periodicidade_distribuicao": "mensal",
  "valor_ficha_padrao": 0.00,
  "tipo_plano": "ilimitado" | "fichas_fixas" | "valor_manual",
  "ativo": true
}
```

**Response:** Retorna a configuração criada

### PUT /pote/configuracoes/{barbearia_id}/{configuracao_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `configuracao_id`: UUID da configuração

**Request Body:** Mesmo formato do POST (todos os campos opcionais)

**Response:** Retorna a configuração atualizada

### DELETE /pote/configuracoes/{barbearia_id}/{configuracao_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `configuracao_id`: UUID da configuração

**Response:** 204 No Content

### GET /pote/pesos/{barbearia_id}/{configuracao_pote_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `configuracao_pote_id`: UUID da configuração

**Response:**
```json
[
  {
    "id": "string",
    "configuracao_pote_id": "string",
    "servico_id": "string",
    "peso_em_fichas": 1.0
  }
]
```

### POST /pote/pesos/{barbearia_id}/{configuracao_pote_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `configuracao_pote_id`: UUID da configuração

**Request Body:**
```json
{
  "servico_id": "string",
  "peso_em_fichas": 1.0
}
```

**Response:** Retorna o peso criado/atualizado

### DELETE /pote/pesos/{barbearia_id}/{configuracao_pote_id}/{servico_id}

**Path Params:**
- `barbearia_id`: UUID da barbearia
- `configuracao_pote_id`: UUID da configuração
- `servico_id`: UUID do serviço

**Response:** 204 No Content

## Stores

- `usePoteStore`:
  - `loadConfiguracoes(barbeariaId?)`: Carrega lista via `GET /pote/configuracoes/{barbearia_id}`
  - `loadConfiguracao(barbeariaId, configuracaoId)`: Busca via `GET /pote/configuracoes/{barbearia_id}/{configuracao_id}`
  - `createConfiguracao(barbeariaId, dados)`: Cria via `POST /pote/configuracoes/{barbearia_id}`
  - `updateConfiguracao(barbeariaId, configuracaoId, updates)`: Atualiza via `PUT /pote/configuracoes/{barbearia_id}/{configuracao_id}`
  - `deleteConfiguracao(barbeariaId, configuracaoId)`: Exclui via `DELETE /pote/configuracoes/{barbearia_id}/{configuracao_id}`
  - `loadPesosServicos(barbeariaId, configuracaoPoteId)`: Carrega pesos via `GET /pote/pesos/{barbearia_id}/{configuracao_pote_id}`
  - `salvarPesoServico(barbeariaId, configuracaoPoteId, servicoId, pesoEmFichas)`: Salva via `POST /pote/pesos/{barbearia_id}/{configuracao_pote_id}`
  - `deletarPesoServico(barbeariaId, configuracaoPoteId, servicoId)`: Exclui via `DELETE /pote/pesos/{barbearia_id}/{configuracao_pote_id}/{servico_id}`
  - `configuracoesAtivas`: Getter que filtra configurações ativas
- `useAppStore`: Notificações
- `usePermissions`: Verificação de permissões (canViewPote, canCreatePote, canEditPote, canDeletePote)

