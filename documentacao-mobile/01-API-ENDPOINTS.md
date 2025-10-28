# Barber App - Documentação de API

## Configuração Base

### Base URL
- **Desenvolvimento**: `https://api.barber.com` (configurado via `API_BASE_URL`)
- **Produção**: Definida via variável de ambiente

### Autenticação
- **Tipo**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer {token}`
- **Storage**: Token armazenado em `localStorage` como `barber_token`

### Headers Padrão
```javascript
{
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}'
}
```

### Tratamento de Erros
- **401**: Token inválido - redirecionamento automático para login
- **403**: Sem permissão - exibição de mensagem de acesso negado
- **404**: Recurso não encontrado
- **422**: Erro de validação - exibição de erros específicos
- **500**: Erro interno do servidor

## Endpoints por Módulo

### 1. Autenticação (`/auth`)

#### Login de Proprietário
```http
POST /auth/login
Content-Type: application/json

{
  "email": "proprietario@email.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "email": "proprietario@email.com",
    "tipo": "proprietario",
    "nome_barbearia": "Barbearia do João",
    "nome_proprietario": "João Silva",
    "telefone": "11999999999",
    "endereco": "Rua das Flores, 123",
    "ativo": true,
    "criado_em": "2024-01-01T00:00:00Z",
    "atualizado_em": "2024-01-01T00:00:00Z",
    "foto_perfil_url_assinada": "https://s3.../foto.jpg"
  },
  "token": "jwt_token_aqui",
  "permissoes": []
}
```

#### Login de Colaborador
```http
POST /auth/login/colaborador
Content-Type: application/json

{
  "email": "colaborador@email.com",
  "senha": "senha123",
  "codigo_barbearia": "BARB001"
}
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "email": "colaborador@email.com",
    "tipo": "colaborador",
    "nome": "Maria Santos",
    "funcao": "Barbeiro",
    "colaborador_id": "uuid_colaborador",
    "barbearia_id": "uuid_barbearia",
    "barbearia_nome": "Barbearia do João",
    "barbearia_codigo": "BARB001",
    "ativo": true,
    "criado_em": "2024-01-01T00:00:00Z",
    "atualizado_em": "2024-01-01T00:00:00Z",
    "foto_perfil_url_assinada": "https://s3.../foto.jpg"
  },
  "token": "jwt_token_aqui",
  "permissoes": [
    {
      "id": "uuid",
      "colaborador_id": "uuid_colaborador",
      "recurso": "clientes",
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": false,
      "pode_excluir": false
    }
  ]
}
```

#### Registro de Proprietário
```http
POST /auth/register
Content-Type: application/json

{
  "email": "novo@email.com",
  "senha": "senha123",
  "confirmar_senha": "senha123",
  "nome_barbearia": "Minha Barbearia",
  "nome_proprietario": "João Silva",
  "telefone": "11999999999",
  "endereco": "Rua das Flores, 123"
}
```

#### Buscar Dados do Usuário
```http
GET /auth/me
Authorization: Bearer {token}
```

#### Buscar Dados do Colaborador
```http
GET /auth/me/colaborador
Authorization: Bearer {token}
```

#### Upload de Foto de Perfil
```http
POST /auth/foto-perfil
Authorization: Bearer {token}
Content-Type: multipart/form-data

foto: [arquivo de imagem]
```

**Resposta:**
```json
{
  "message": "Foto de perfil atualizada com sucesso",
  "foto_perfil_url_assinada": "https://s3.us-east-2.amazonaws.com/beetbarber/perfil/uuid/timestamp-filename.png?X-Amz-Algorithm=..."
}
```

### 2. Barbearias (`/barbearias`)

#### Listar Barbearias
```http
GET /barbearias
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "nome": "Barbearia Central",
    "codigo": "BARB001",
    "endereco": "Rua das Flores, 123",
    "telefone": "11999999999",
    "ativo": true,
    "criado_em": "2024-01-01T00:00:00Z",
    "atualizado_em": "2024-01-01T00:00:00Z"
  }
]
```

#### Criar Barbearia
```http
POST /barbearias
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Nova Barbearia",
  "codigo": "BARB002",
  "endereco": "Rua Nova, 456",
  "telefone": "11888888888",
  "ativo": true
}
```

#### Atualizar Barbearia
```http
PUT /barbearias/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Barbearia Atualizada",
  "endereco": "Rua Atualizada, 789"
}
```

#### Deletar Barbearia
```http
DELETE /barbearias/{id}
Authorization: Bearer {token}
```

### 3. Clientes (`/clientes`)

#### Listar Clientes
```http
GET /clientes?barbearia_id={barbearia_id}&busca={termo_busca}
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "nome": "João Silva",
    "telefone": "11999999999",
    "origem": "Instagram",
    "quem_indicou": "Maria Santos",
    "observacoes": "Cliente preferencial",
    "criado_em": "2024-01-01T00:00:00Z",
    "ultima_visita": "2024-01-15T10:00:00Z",
    "ultima_compra_produto": "2024-01-10T15:30:00Z",
    "total_visitas": 5
  }
]
```

#### Criar Cliente
```http
POST /clientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Novo Cliente",
  "telefone": "11777777777",
  "origem": "Walk-in",
  "quem_indicou": "",
  "observacoes": "Primeira visita",
  "barbearia_id": "uuid_barbearia"
}
```

#### Atualizar Cliente
```http
PUT /clientes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Cliente Atualizado",
  "telefone": "11666666666",
  "origem": "Indicação",
  "quem_indicou": "João Silva",
  "observacoes": "Cliente VIP",
  "barbearia_id": "uuid_barbearia"
}
```

#### Histórico do Cliente
```http
GET /clientes/{id}/historico?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "cliente": {
    "id": "uuid",
    "nome": "João Silva",
    "telefone": "11999999999"
  },
  "atendimentos": [
    {
      "id": "uuid",
      "data_atendimento": "2024-01-15",
      "horario_inicio": "10:00",
      "horario_fim": "11:00",
      "total": 50.00,
      "servicos": [
        {
          "nome": "Corte",
          "preco": 30.00
        }
      ],
      "produtos": [
        {
          "nome": "Pomada",
          "preco": 20.00,
          "quantidade": 1
        }
      ]
    }
  ],
  "estatisticas": {
    "total_atendimentos": 5,
    "total_gasto": 250.00,
    "ultima_visita": "2024-01-15T10:00:00Z",
    "frequencia_media_dias": 15
  }
}
```

### 4. Colaboradores (`/colaboradores`)

#### Listar Colaboradores
```http
GET /colaboradores?barbearia_id={barbearia_id}&busca={termo_busca}
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "nome": "Maria Santos",
    "funcao": "Barbeiro",
    "usuario_id": "uuid_usuario",
    "barbearia_id": "uuid_barbearia",
    "ativo": true,
    "criado_em": "2024-01-01T00:00:00Z",
    "atualizado_em": "2024-01-01T00:00:00Z",
    "permissoes": [
      {
        "recurso": "clientes",
        "pode_visualizar": true,
        "pode_criar": true,
        "pode_editar": false,
        "pode_excluir": false
      }
    ],
    "usuario": {
      "foto_perfil_url": "https://s3.../foto.jpg"
    }
  }
]
```

#### Criar Colaborador
```http
POST /colaboradores
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Novo Colaborador",
  "funcao": "Barbeiro",
  "email": "colaborador@email.com",
  "senha": "senha123",
  "barbearia_id": "uuid_barbearia",
  "permissoes": {
    "clientes": {
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": false,
      "pode_excluir": false
    }
  }
}
```

#### Atualizar Colaborador
```http
PUT /colaboradores/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Colaborador Atualizado",
  "funcao": "Barbeiro Senior",
  "barbearia_id": "uuid_barbearia"
}
```

#### Atualizar Permissões
```http
PUT /colaboradores/{id}/permissoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "barbearia_id": "uuid_barbearia",
  "permissoes": {
    "clientes": {
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": true,
      "pode_excluir": false
    },
    "agenda": {
      "pode_visualizar": true,
      "pode_criar": true,
      "pode_editar": true,
      "pode_excluir": false
    }
  }
}
```

#### Disponibilidade do Colaborador

**Definir Disponibilidade:**
```http
POST /colaboradores/{id}/disponibilidade
Authorization: Bearer {token}
Content-Type: application/json

{
  "dia_semana": 1,
  "horario_inicio": "08:00",
  "horario_fim": "18:00"
}
```

**Listar Disponibilidades:**
```http
GET /colaboradores/{id}/disponibilidade
Authorization: Bearer {token}
```

**Atualizar Disponibilidade:**
```http
PUT /colaboradores/{id}/disponibilidade/{disponibilidade_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "horario_inicio": "09:00",
  "horario_fim": "17:00",
  "ativo": true
}
```

**Deletar Disponibilidade:**
```http
DELETE /colaboradores/{id}/disponibilidade/{disponibilidade_id}
Authorization: Bearer {token}
```

#### Serviços do Colaborador

**Associar Serviço:**
```http
POST /colaboradores/{id}/servicos
Authorization: Bearer {token}
Content-Type: application/json

{
  "servico_id": "uuid_servico"
}
```

**Listar Serviços:**
```http
GET /colaboradores/{id}/servicos
Authorization: Bearer {token}
```

**Desassociar Serviço:**
```http
DELETE /colaboradores/{id}/servicos/{servico_id}
Authorization: Bearer {token}
```

### 5. Serviços (`/servicos`)

#### Listar Serviços
```http
GET /servicos?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "nome": "Corte Masculino",
    "preco_padrao": "30.00",
    "percentual_comissao_executor": "0.20",
    "percentual_comissao_assistente": "0.05",
    "percentual_comissao_indicacao": "0.10",
    "meta_diaria_qtd": 10,
    "barbearia_id": "uuid_barbearia",
    "criado_em": "2024-01-01T00:00:00Z",
    "atualizado_em": "2024-01-01T00:00:00Z"
  }
]
```

#### Criar Serviço
```http
POST /servicos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Barba Completa",
  "preco_padrao": 25.00,
  "percentual_comissao_executor": 0.20,
  "percentual_comissao_assistente": 0.05,
  "percentual_comissao_indicacao": 0.10,
  "meta_diaria_qtd": 8,
  "barbearia_id": "uuid_barbearia"
}
```

#### Atualizar Serviço
```http
PUT /servicos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Barba Completa Premium",
  "preco_padrao": 30.00,
  "percentual_comissao_executor": 0.25,
  "barbearia_id": "uuid_barbearia"
}
```

#### Deletar Serviço
```http
DELETE /servicos/{id}?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

### 6. Produtos (`/produtos`)

#### Listar Produtos
```http
GET /produtos?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "nome": "Pomada Modeladora",
    "preco_padrao": "25.00",
    "percentual_comissao": "0.15",
    "percentual_imposto": "0.18",
    "percentual_cartao": "0.03",
    "meta_diaria_qtd": 5,
    "barbearia_id": "uuid_barbearia",
    "criado_em": "2024-01-01T00:00:00Z",
    "atualizado_em": "2024-01-01T00:00:00Z"
  }
]
```

#### Criar Produto
```http
POST /produtos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Shampoo Anticaspa",
  "preco_padrao": 35.00,
  "percentual_comissao": 0.15,
  "percentual_imposto": 0.18,
  "percentual_cartao": 0.03,
  "meta_diaria_qtd": 3,
  "barbearia_id": "uuid_barbearia"
}
```

#### Atualizar Produto
```http
PUT /produtos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Shampoo Anticaspa Premium",
  "preco_padrao": 40.00,
  "percentual_comissao": 0.20,
  "barbearia_id": "uuid_barbearia"
}
```

#### Deletar Produto
```http
DELETE /produtos/{id}?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

### 7. Agendamentos (`/agendamentos`)

#### Listar Agendamentos
```http
GET /agendamentos?barbearia_id={barbearia_id}&data={YYYY-MM-DD}&colaborador_id={colaborador_id}&status={status}
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "usuario_id": "uuid_usuario",
    "barbearia_id": "uuid_barbearia",
    "colaborador_id": "uuid_colaborador",
    "cliente_id": "uuid_cliente",
    "data_atendimento": "2024-01-15",
    "horario_inicio": "10:00:00",
    "horario_fim": "11:00:00",
    "duracao_minutos": 60,
    "status": "agendado",
    "origem": "Instagram",
    "observacoes": "Primeira visita",
    "cliente": {
      "id": "uuid",
      "nome": "João Silva",
      "telefone": "11999999999"
    },
    "colaborador": {
      "id": "uuid",
      "nome": "Maria Santos",
      "funcao": "Barbeiro",
      "foto_perfil_url_assinada": "https://s3.../foto.jpg",
      "usuario": {
        "foto_perfil_url": "https://s3.../foto.jpg"
      }
    },
    "servicos": [
      {
        "id": "uuid",
        "servico_id": "uuid_servico",
        "nome": "Corte Masculino",
        "preco": "30.00"
      }
    ],
    "produtos": [
      {
        "id": "uuid",
        "produto_id": "uuid_produto",
        "nome": "Pomada",
        "preco": "20.00",
        "quantidade": 1
      }
    ]
  }
]
```

#### Criar Agendamento
```http
POST /agendamentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "colaborador_id": "uuid_colaborador",
  "cliente_id": "uuid_cliente",
  "servico_id": "uuid_servico",
  "data": "2024-01-15",
  "horario_inicio": "10:00",
  "observacoes": "Primeira visita",
  "barbearia_id": "uuid_barbearia"
}
```

#### Atualizar Status do Agendamento
```http
PATCH /agendamentos/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "confirmado",
  "barbearia_id": "uuid_barbearia"
}
```

#### Buscar Agendamento por ID
```http
GET /agendamentos/{id}?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

#### Deletar Agendamento
```http
DELETE /agendamentos/{id}?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

#### Horários Disponíveis
```http
GET /agendamentos/horarios-disponiveis?colaborador_id={colaborador_id}&data={YYYY-MM-DD}&servico_id={servico_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "colaborador_id": "uuid",
  "data": "2024-01-15",
  "servico_id": "uuid",
  "duracao_servico": 60,
  "horarios_disponiveis": [
    {
      "horario": "09:00",
      "horario_formatado": "09:00"
    },
    {
      "horario": "10:00",
      "horario_formatado": "10:00"
    }
  ]
}
```

### 8. Atendimentos (`/atendimentos`)

#### Listar Atendimentos
```http
GET /atendimentos?barbearia_id={barbearia_id}&data_inicio={YYYY-MM-DD}&data_fim={YYYY-MM-DD}&colaborador_id={colaborador_id}
Authorization: Bearer {token}
```

#### Criar Atendimento
```http
POST /atendimentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": "2024-01-15",
  "cliente_id": "uuid_cliente",
  "horario_inicio": "10:00",
  "horario_fim": "11:00",
  "origem": "Walk-in",
  "observacoes": "Atendimento realizado",
  "compareceu": true,
  "primeira_visita": false,
  "barbearia_id": "uuid_barbearia",
  "colaborador_id": "uuid_colaborador",
  "servicos": [
    {
      "servico_id": "uuid_servico",
      "preco": 30.00,
      "colaborador_executor_id": "uuid_colaborador",
      "colaborador_assistente_id": null,
      "cliente_indicador_id": null
    }
  ],
  "produtos": [
    {
      "produto_id": "uuid_produto",
      "preco": 20.00,
      "quantidade": 1,
      "colaborador_vendedor_id": "uuid_colaborador"
    }
  ]
}
```

#### Atualizar Atendimento
```http
PUT /atendimentos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": "2024-01-15",
  "cliente_id": "uuid_cliente",
  "horario_inicio": "10:00",
  "horario_fim": "11:00",
  "origem": "Instagram",
  "observacoes": "Atendimento atualizado",
  "compareceu": true,
  "primeira_visita": false,
  "servicos": [
    {
      "id": "uuid_servico",
      "name": "Corte Masculino",
      "price": 30.00,
      "byMe": true
    }
  ],
  "produtos": [
    {
      "id": "uuid_produto",
      "name": "Pomada",
      "price": 20.00,
      "qty": 1,
      "byMe": true
    }
  ]
}
```

### 9. Comissões (`/comissoes`)

#### Comissões do Colaborador
```http
GET /comissoes/colaborador/{colaborador_id}?mes={YYYY-MM}&barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

#### Todas as Comissões (Proprietário)
```http
GET /comissoes/todas?mes={YYYY-MM}&barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

#### Vendas de Serviços
```http
GET /comissoes/vendas-servicos?mes={YYYY-MM}&colaborador_id={colaborador_id}&barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "comissoes": [
    {
      "id": "uuid",
      "barbearia_id": "uuid_barbearia",
      "colaborador_id": "uuid_colaborador",
      "atendimento_id": "uuid_atendimento",
      "atendimento_servico_id": "uuid_servico",
      "tipo_comissao": "executor",
      "valor_servico": "100.00",
      "percentual": "0.20",
      "valor_comissao": "20.00",
      "data_atendimento": "2024-01-15",
      "data_registro": "2024-01-15T10:00:00Z",
      "status": "pendente",
      "observacoes": null,
      "colaborador": {
        "id": "uuid",
        "nome": "Maria Santos"
      },
      "atendimento": {
        "id": "uuid",
        "data_atendimento": "2024-01-15"
      },
      "atendimento_servico": {
        "id": "uuid",
        "nome": "Corte",
        "preco": "100.00"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

#### Vendas de Produtos
```http
GET /comissoes/vendas-produtos?mes={YYYY-MM}&colaborador_id={colaborador_id}&barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

#### Débitos
```http
GET /comissoes/debitos?mes={YYYY-MM}&colaborador_id={colaborador_id}&barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

#### Indicações
```http
GET /comissoes/indicacoes?mes={YYYY-MM}&colaborador_id={colaborador_id}&barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

#### Resumo de Comissões
```http
GET /comissoes/resumo?mes={YYYY-MM}&colaborador_id={colaborador_id}&barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "colaborador_id": "uuid",
    "nome_colaborador": "Maria Santos",
    "total_comissao": 150.00,
    "total_quantidade": 5
  }
]
```

#### Projeção de Comissões
```http
GET /comissoes/projecao/{colaborador_id}?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

### 10. Financeiro (`/financeiro`)

#### Despesas Fixas
```http
GET /financeiro/despesas-fixas?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

```http
POST /financeiro/despesas-fixas
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoria": "Aluguel",
  "valor": 2000.00,
  "mes_referencia": "2024-01",
  "barbearia_id": "uuid_barbearia"
}
```

#### Despesas Variáveis
```http
GET /financeiro/despesas-variaveis?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

```http
POST /financeiro/despesas-variaveis
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoria": "Marketing",
  "valor": 500.00,
  "mes_referencia": "2024-01",
  "barbearia_id": "uuid_barbearia"
}
```

#### Cadeiras
```http
GET /financeiro/cadeiras?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

```http
POST /financeiro/cadeiras
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Cadeira 1",
  "custo_mensal": 300.00,
  "barbearia_id": "uuid_barbearia",
  "colaborador_id": "uuid_colaborador"
}
```

#### Canais
```http
GET /financeiro/canais?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

```http
POST /financeiro/canais
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Instagram",
  "gasto": 200.00,
  "mes_referencia": "2024-01",
  "barbearia_id": "uuid_barbearia"
}
```

#### Relatório Financeiro
```http
GET /financeiro/relatorio?mes={YYYY-MM}&barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "receita_servicos": 5000.00,
  "receita_produtos": 1000.00,
  "comissoes_servicos": 1000.00,
  "comissoes_produtos": 150.00,
  "impostos": 900.00,
  "taxas_cartao": 150.00,
  "despesas_fixas": 2000.00,
  "despesas_variaveis": 500.00,
  "margem_contribuicao": 4000.00,
  "lucro_liquido": 1500.00,
  "custo_cadeiras": 300.00,
  "dias_break_even": 15,
  "novos_clientes": 20,
  "gasto_marketing": 200.00,
  "cac": 10.00,
  "ltv_90d": 300.00,
  "payback_dias": 30
}
```

### 11. Estoque (`/estoque`)

#### Prateleiras
```http
GET /estoque/prateleiras?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

```http
POST /estoque/prateleiras
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Prateleira Principal",
  "localizacao": "Sala de Estoque",
  "capacidade_maxima": 100,
  "barbearia_id": "uuid_barbearia"
}
```

#### Produtos em Estoque
```http
GET /estoque/produtos?barbearia_id={barbearia_id}&prateleira_id={prateleira_id}
Authorization: Bearer {token}
```

#### Movimentações de Estoque
```http
GET /estoque/movimentacoes?barbearia_id={barbearia_id}&produto_id={produto_id}&tipo={tipo}&data_inicio={YYYY-MM-DD}&data_fim={YYYY-MM-DD}
Authorization: Bearer {token}
```

#### Entrada de Estoque
```http
POST /estoque/entrada
Authorization: Bearer {token}
Content-Type: application/json

{
  "produto_id": "uuid_produto",
  "prateleira_id": "uuid_prateleira",
  "quantidade": 10,
  "lote": "LOTE001",
  "data_validade": "2025-12-31",
  "motivo": "Compra",
  "observacoes": "Fornecedor ABC",
  "barbearia_id": "uuid_barbearia"
}
```

#### Saída de Estoque
```http
POST /estoque/saida
Authorization: Bearer {token}
Content-Type: application/json

{
  "produto_id": "uuid_produto",
  "prateleira_id": "uuid_prateleira",
  "quantidade": 2,
  "motivo": "Venda",
  "observacoes": "Venda para cliente",
  "barbearia_id": "uuid_barbearia"
}
```

#### Transferência de Estoque
```http
POST /estoque/transferencia
Authorization: Bearer {token}
Content-Type: application/json

{
  "produto_id": "uuid_produto",
  "prateleira_origem_id": "uuid_prateleira_origem",
  "prateleira_destino_id": "uuid_prateleira_destino",
  "quantidade": 5,
  "motivo": "Reorganização",
  "observacoes": "Movimentação interna",
  "barbearia_id": "uuid_barbearia"
}
```

#### Ajuste de Estoque
```http
POST /estoque/ajuste
Authorization: Bearer {token}
Content-Type: application/json

{
  "produto_id": "uuid_produto",
  "prateleira_id": "uuid_prateleira",
  "quantidade_nova": 8,
  "motivo": "Inventário",
  "observacoes": "Ajuste após contagem",
  "barbearia_id": "uuid_barbearia"
}
```

#### Alertas de Estoque Baixo
```http
GET /estoque/alertas?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "nome": "Pomada Modeladora",
    "quantidade_atual": 2,
    "estoque_minimo": 5,
    "prateleira_id": "uuid_prateleira",
    "prateleira_nome": "Prateleira Principal",
    "alerta": "critico"
  }
]
```

### 12. Gastos (`/gastos`)

#### Listar Gastos
```http
GET /gastos?barbearia_id={barbearia_id}&colaborador_id={colaborador_id}&mes={YYYY-MM}&status={status}
Authorization: Bearer {token}
```

#### Criar Gasto
```http
POST /gastos
Authorization: Bearer {token}
Content-Type: application/json

{
  "colaborador_id": "uuid_colaborador",
  "descricao": "Compra de produtos",
  "valor_total": 100.00,
  "data_vencimento": "2024-01-31",
  "observacoes": "Produtos para estoque",
  "barbearia_id": "uuid_barbearia"
}
```

#### Criar Gasto Parcelado
```http
POST /gastos/parcelado
Authorization: Bearer {token}
Content-Type: application/json

{
  "colaborador_id": "uuid_colaborador",
  "descricao": "Curso de especialização",
  "valor_total": 600.00,
  "numero_parcelas": 6,
  "data_vencimento_primeira": "2024-01-31",
  "observacoes": "Curso de barbearia avançada",
  "barbearia_id": "uuid_barbearia"
}
```

#### Marcar como Pago
```http
PATCH /gastos/{id}/pagar
Authorization: Bearer {token}
Content-Type: application/json

{
  "data_pagamento": "2024-01-15",
  "observacoes": "Pago via PIX"
}
```

### 13. Dashboard (`/dashboard`)

#### KPIs do Dashboard
```http
GET /dashboard/kpis?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "revenue": 5000.00,
  "services": 25,
  "products": 10,
  "clients": 15,
  "avgTicket": 200.00,
  "conversionRate": 0.75
}
```

#### Clientes em Risco
```http
GET /dashboard/clients-at-risk?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "João Silva",
    "lastVisit": "2024-01-01T10:00:00Z",
    "daysSinceLastVisit": 30
  }
]
```

#### Estatísticas de Canais
```http
GET /dashboard/channel-stats?barbearia_id={barbearia_id}
Authorization: Bearer {token}
```

**Resposta:**
```json
[
  {
    "channel": "Instagram",
    "clients": 10,
    "revenue": 2000.00,
    "conversionRate": 0.80
  }
]
```

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Requisição inválida
- **401**: Não autenticado
- **403**: Sem permissão
- **404**: Recurso não encontrado
- **422**: Erro de validação
- **500**: Erro interno do servidor

## Paginação

Para endpoints que retornam listas, use os parâmetros:
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)

**Resposta com paginação:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": false
}
```

## Filtros e Busca

### Parâmetros Comuns
- `barbearia_id`: ID da barbearia (obrigatório para a maioria dos endpoints)
- `busca`: Termo de busca para filtros de texto
- `data_inicio` / `data_fim`: Filtros de data
- `status`: Filtro por status
- `colaborador_id`: Filtro por colaborador
- `cliente_id`: Filtro por cliente

### Exemplos de Uso
```http
GET /clientes?barbearia_id=uuid&busca=João&page=1&limit=10
GET /atendimentos?barbearia_id=uuid&data_inicio=2024-01-01&data_fim=2024-01-31&colaborador_id=uuid
GET /comissoes/vendas-servicos?mes=2024-01&colaborador_id=uuid&barbearia_id=uuid
```
