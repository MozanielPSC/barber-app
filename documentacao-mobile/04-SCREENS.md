# Barber App - Telas e Navegação

## Visão Geral

O Barber App utiliza **Nuxt.js** com roteamento baseado em arquivos. Cada arquivo na pasta `pages/` representa uma rota da aplicação. A navegação é controlada por permissões e tipo de usuário (proprietário/colaborador).

## Estrutura de Navegação

### Layout Principal
- **Layout**: `layouts/default.vue`
- **Navbar**: `components/Navbar.vue` (navegação principal)
- **Middleware**: `middleware/auth.global.ts` (autenticação global)

### Mapa de Rotas

```
/                           # Login de proprietário
/login-colaborador          # Login de colaborador  
/registro                   # Registro de proprietário
/dashboard                  # Dashboard principal
├── /agenda                 # Sistema de agendamentos
│   ├── /                  # Lista de agendamentos
│   ├── /novo              # Novo agendamento
│   └── /[id]              # Detalhes do agendamento
├── /clientes              # Gestão de clientes
│   ├── /                  # Lista de clientes
│   ├── /novo              # Novo cliente
│   ├── /[id]              # Detalhes do cliente
│   └── /historico-[id]    # Histórico do cliente
├── /atendimentos          # Histórico de atendimentos
│   ├── /                  # Lista de atendimentos
│   ├── /novo              # Novo atendimento
│   └── /[id]              # Detalhes do atendimento
├── /colaboradores         # Gestão de colaboradores
│   ├── /                  # Lista de colaboradores
│   ├── /novo              # Novo colaborador
│   └── /[id]              # Detalhes do colaborador
├── /servicos              # Catálogo de serviços
│   ├── /                  # Lista de serviços
│   ├── /novo              # Novo serviço
│   └── /[id]              # Detalhes do serviço
├── /produtos              # Catálogo de produtos
│   ├── /                  # Lista de produtos
│   ├── /novo              # Novo produto
│   └── /[id]              # Detalhes do produto
├── /estoque               # Controle de estoque
│   ├── /                  # Visão geral do estoque
│   ├── /prateleiras       # Gestão de prateleiras
│   │   ├── /              # Lista de prateleiras
│   │   ├── /novo          # Nova prateleira
│   │   └── /[id]          # Detalhes da prateleira
│   ├── /entrada           # Entrada de estoque
│   ├── /saida             # Saída de estoque
│   ├── /transferencia     # Transferência entre prateleiras
│   ├── /ajuste            # Ajuste de estoque
│   ├── /movimentacoes     # Histórico de movimentações
│   └── /relatorio         # Relatório de estoque
├── /comissoes             # Sistema de comissões
│   ├── /                  # Resumo de comissões
│   └── /projecao          # Projeção de comissões
├── /financeiro           # Gestão financeira
│   ├── /                  # Visão geral financeira
│   ├── /despesas-fixas    # Despesas fixas
│   ├── /despesas-variaveis # Despesas variáveis
│   ├── /canais            # Canais de marketing
│   └── /gastos            # Gastos por colaborador
├── /barbearias            # Gestão de barbearias
│   ├── /                  # Lista de barbearias
│   ├── /novo              # Nova barbearia
│   └── /[id]              # Detalhes da barbearia
├── /configuracoes         # Configurações do sistema
│   ├── /                  # Configurações gerais
│   ├── /barbearia         # Configurações da barbearia
│   ├── /basicas           # Configurações básicas
│   └── /metas             # Metas e objetivos
└── /perfil                # Perfil do usuário
    └── /                  # Gestão de perfil (tabs)
```

## Telas Detalhadas

### 1. Autenticação

#### Login de Proprietário (`/`)
**Arquivo**: `pages/index.vue`
**Layout**: Sem layout (tela cheia)

**Funcionalidades**:
- Formulário de login com email e senha
- Validação de campos obrigatórios
- Toggle de visibilidade da senha
- Redirecionamento para dashboard após login
- Link para registro e login de colaborador
- Background com imagem e efeitos visuais

**Campos**:
- Email (obrigatório)
- Senha (obrigatório)

**Validações**:
- Email válido
- Senha não vazia

#### Login de Colaborador (`/login-colaborador`)
**Arquivo**: `pages/login-colaborador.vue`
**Layout**: Sem layout (tela cheia)

**Funcionalidades**:
- Formulário específico para colaboradores
- Campo adicional para código da barbearia
- Informações sobre o processo de login
- Validação de código da barbearia (6 caracteres)
- Redirecionamento para dashboard após login

**Campos**:
- Email (obrigatório)
- Senha (obrigatório)
- Código da Barbearia (obrigatório, 6 caracteres)

**Validações**:
- Email válido
- Senha não vazia
- Código da barbearia em maiúsculas

#### Registro (`/registro`)
**Arquivo**: `pages/registro.vue`
**Layout**: Sem layout (tela cheia)

**Funcionalidades**:
- Formulário completo de registro
- Validação de confirmação de senha
- Campos para dados da barbearia e proprietário
- Validação de campos obrigatórios
- Redirecionamento para dashboard após registro

**Campos**:
- Nome do Proprietário (obrigatório)
- Email (obrigatório)
- Nome da Barbearia (obrigatório)
- Telefone (opcional)
- Endereço (opcional)
- Senha (obrigatório, mínimo 6 caracteres)
- Confirmar Senha (obrigatório)

**Validações**:
- Senhas devem coincidir
- Email válido
- Campos obrigatórios preenchidos

### 2. Dashboard (`/dashboard`)
**Arquivo**: `pages/dashboard.vue`
**Componente**: `components/Dashboard.vue`

**Funcionalidades**:
- KPIs principais da barbearia
- Gráficos de performance
- Metas diárias/semanais/mensais
- Alertas importantes
- Clientes em risco
- Estatísticas de canais

**Dados Exibidos**:
- Receita total
- Número de serviços
- Número de produtos vendidos
- Número de clientes
- Ticket médio
- Taxa de conversão

### 3. Sistema de Agendamentos

#### Lista de Agendamentos (`/agenda`)
**Arquivo**: `pages/agenda/index.vue`
**Componente**: `components/AgendaGrid.vue`

**Funcionalidades**:
- Calendário visual com agendamentos
- Filtros por colaborador e data
- Estados dos agendamentos (agendado, confirmado, etc.)
- Criação rápida de agendamentos
- Visualização de disponibilidade

**Filtros**:
- Data (padrão: hoje)
- Colaborador (todos ou específico)
- Status do agendamento

#### Novo Agendamento (`/agenda/novo`)
**Arquivo**: `pages/agenda/novo.vue`

**Funcionalidades**:
- Formulário completo de agendamento
- Seleção de colaborador
- Seleção de cliente (com busca)
- Seleção de serviço
- Escolha de data e horário
- Verificação de disponibilidade
- Observações

**Campos**:
- Colaborador (obrigatório)
- Cliente (obrigatório)
- Serviço (obrigatório)
- Data (obrigatório)
- Horário de Início (obrigatório)
- Observações (opcional)

#### Detalhes do Agendamento (`/agenda/[id]`)
**Arquivo**: `pages/agenda/[id].vue`

**Funcionalidades**:
- Visualização completa do agendamento
- Informações do cliente e colaborador
- Serviços e produtos agendados
- Histórico de alterações
- Ações: confirmar, cancelar, editar
- Conversão para atendimento

### 4. Gestão de Clientes

#### Lista de Clientes (`/clientes`)
**Arquivo**: `pages/clientes/index.vue`
**Componente**: `components/Clients.vue`

**Funcionalidades**:
- Lista paginada de clientes
- Busca por nome ou telefone
- Filtros por origem e status
- Ações: visualizar, editar, deletar
- Indicadores de última visita
- Botão para novo cliente

**Filtros**:
- Busca por texto
- Origem (Walk-in, Instagram, etc.)
- Status (ativo, inativo)

#### Novo Cliente (`/clientes/novo`)
**Arquivo**: `pages/clientes/novo.vue`

**Funcionalidades**:
- Formulário de cadastro de cliente
- Validação de campos obrigatórios
- Seleção de origem
- Campo para quem indicou
- Observações

**Campos**:
- Nome (obrigatório)
- Telefone (opcional)
- Origem (obrigatório)
- Quem Indicou (opcional)
- Observações (opcional)

#### Detalhes do Cliente (`/clientes/[id]`)
**Arquivo**: `pages/clientes/[id].vue`

**Funcionalidades**:
- Informações completas do cliente
- Histórico de atendimentos
- Estatísticas de visitas
- Última compra de produto
- Botão "Ver Histórico"
- Ações: editar, deletar

#### Histórico do Cliente (`/clientes-historico-[id]`)
**Arquivo**: `pages/clientes-historico-[id].vue`

**Funcionalidades**:
- Timeline de atendimentos
- Estatísticas detalhadas
- Gráficos de frequência
- Análise de risco de churn
- Exportação de dados

### 5. Histórico de Atendimentos

#### Lista de Atendimentos (`/atendimentos`)
**Arquivo**: `pages/atendimentos/index.vue`
**Componente**: `components/VisitsList.vue`

**Funcionalidades**:
- Lista de atendimentos realizados
- Filtros por data e colaborador
- Busca por cliente
- Status dos atendimentos
- Valores e comissões

**Filtros**:
- Data de início e fim
- Colaborador
- Cliente (busca por texto)
- Status (compareceu, não compareceu)

#### Novo Atendimento (`/atendimentos/novo`)
**Arquivo**: `pages/atendimentos/novo.vue`

**Funcionalidades**:
- Formulário completo de atendimento
- Seleção de cliente e colaborador
- Adição de serviços e produtos
- Cálculo automático de valores
- Registro de origem e observações
- Controle de comparecimento

**Campos**:
- Data (obrigatório)
- Cliente (obrigatório)
- Colaborador Executor (obrigatório)
- Horário de Início e Fim
- Origem (obrigatório)
- Serviços (obrigatório)
- Produtos (opcional)
- Observações (opcional)
- Compareceu (checkbox)
- Primeira Visita (checkbox)

#### Detalhes do Atendimento (`/atendimentos/[id]`)
**Arquivo**: `pages/atendimentos/[id].vue`

**Funcionalidades**:
- Visualização completa do atendimento
- Informações do cliente e colaborador
- Lista de serviços e produtos
- Valores e comissões calculadas
- Histórico de alterações
- Ações: editar, deletar

### 6. Gestão de Colaboradores

#### Lista de Colaboradores (`/colaboradores`)
**Arquivo**: `pages/colaboradores/index.vue`
**Componente**: `components/ColaboradoresList.vue`

**Funcionalidades**:
- Lista de colaboradores da barbearia
- Busca por nome ou função
- Filtros por status (ativo/inativo)
- Ações: visualizar, editar, deletar
- Indicadores de permissões

**Filtros**:
- Busca por texto
- Status (ativo, inativo)
- Função

#### Novo Colaborador (`/colaboradores/novo`)
**Arquivo**: `pages/colaboradores/novo.vue`
**Componente**: `components/FormColaborador.vue`

**Funcionalidades**:
- Formulário completo de colaborador
- Criação de usuário (opcional)
- Definição de permissões
- Configuração de disponibilidade
- Associação com serviços

**Campos**:
- Nome (obrigatório)
- Função (obrigatório)
- Email (opcional)
- Senha (opcional, se email fornecido)
- Permissões (por recurso)
- Disponibilidade (dias da semana)

#### Detalhes do Colaborador (`/colaboradores/[id]`)
**Arquivo**: `pages/colaboradores/[id].vue`

**Funcionalidades**:
- Informações completas do colaborador
- Histórico de atendimentos
- Estatísticas de comissões
- Gestão de permissões
- Configuração de disponibilidade
- Associação com serviços
- Ações: editar, desativar

### 7. Catálogo de Serviços

#### Lista de Serviços (`/servicos`)
**Arquivo**: `pages/servicos/index.vue`
**Componente**: `components/ServicesList.vue`

**Funcionalidades**:
- Lista de serviços da barbearia
- Busca por nome
- Filtros por preço e comissão
- Ações: visualizar, editar, deletar
- Indicadores de metas

**Filtros**:
- Busca por texto
- Faixa de preço
- Percentual de comissão

#### Novo Serviço (`/servicos/novo`)
**Arquivo**: `pages/servicos/novo.vue`

**Funcionalidades**:
- Formulário de criação de serviço
- Definição de preço padrão
- Configuração de comissões (executor, assistente, indicação)
- Definição de meta diária
- Validação de campos

**Campos**:
- Nome (obrigatório)
- Preço Padrão (obrigatório)
- Comissão Executor (obrigatório)
- Comissão Assistente (opcional)
- Comissão Indicação (opcional)
- Meta Diária (opcional)

#### Detalhes do Serviço (`/servicos/[id]`)
**Arquivo**: `pages/servicos/[id].vue`

**Funcionalidades**:
- Informações completas do serviço
- Histórico de vendas
- Estatísticas de comissões
- Colaboradores associados
- Ações: editar, deletar

### 8. Catálogo de Produtos

#### Lista de Produtos (`/produtos`)
**Arquivo**: `pages/produtos/index.vue`
**Componente**: `components/ProductsList.vue`

**Funcionalidades**:
- Lista de produtos da barbearia
- Busca por nome
- Filtros por preço e categoria
- Ações: visualizar, editar, deletar
- Indicadores de estoque

**Filtros**:
- Busca por texto
- Faixa de preço
- Categoria

#### Novo Produto (`/produtos/novo`)
**Arquivo**: `pages/produtos/novo.vue`

**Funcionalidades**:
- Formulário de criação de produto
- Definição de preço padrão
- Configuração de comissão
- Definição de impostos e taxas
- Meta diária de vendas
- Formatação automática de campos

**Campos**:
- Nome (obrigatório)
- Preço Padrão (obrigatório)
- Comissão % (obrigatório)
- Imposto % (obrigatório)
- Taxa Cartão % (obrigatório)
- Meta Diária (opcional)

**Formatação**:
- Preço: conversão de vírgula para ponto, máximo 2 decimais
- Percentuais: conversão de vírgula para ponto, máximo 2 decimais
- Divisão por 100 antes do envio para API

#### Detalhes do Produto (`/produtos/[id]`)
**Arquivo**: `pages/produtos/[id].vue`

**Funcionalidades**:
- Informações completas do produto
- Histórico de vendas
- Estatísticas de comissões
- Controle de estoque
- Ações: editar, deletar

### 9. Controle de Estoque

#### Visão Geral (`/estoque`)
**Arquivo**: `pages/estoque/index.vue`

**Funcionalidades**:
- Dashboard do estoque
- Produtos com estoque baixo
- Movimentações recentes
- Valor total do estoque
- Alertas importantes

#### Gestão de Prateleiras (`/estoque/prateleiras`)
**Arquivo**: `pages/estoque/prateleiras/index.vue`

**Funcionalidades**:
- Lista de prateleiras
- Criação de novas prateleiras
- Edição de prateleiras existentes
- Controle de capacidade
- Status ativo/inativo

#### Nova Prateleira (`/estoque/prateleiras/novo`)
**Arquivo**: `pages/estoque/prateleiras/novo.vue`

**Campos**:
- Nome (obrigatório)
- Localização (obrigatório)
- Capacidade Máxima (opcional)

#### Detalhes da Prateleira (`/estoque/prateleiras/[id]`)
**Arquivo**: `pages/estoque/prateleiras/[id].vue`

**Funcionalidades**:
- Produtos na prateleira
- Movimentações da prateleira
- Controle de capacidade
- Ações: editar, deletar

#### Entrada de Estoque (`/estoque/entrada`)
**Arquivo**: `pages/estoque/entrada.vue`

**Funcionalidades**:
- Registro de entrada de produtos
- Seleção de produto e prateleira
- Informações de lote e validade
- Motivo da entrada
- Observações

#### Saída de Estoque (`/estoque/saida`)
**Arquivo**: `pages/estoque/saida.vue`

**Funcionalidades**:
- Registro de saída de produtos
- Verificação de disponibilidade
- Motivo da saída
- Observações

#### Transferência (`/estoque/transferencia`)
**Arquivo**: `pages/estoque/transferencia.vue`

**Funcionalidades**:
- Transferência entre prateleiras
- Seleção de produto e prateleiras
- Quantidade a transferir
- Motivo da transferência

#### Ajuste de Estoque (`/estoque/ajuste`)
**Arquivo**: `pages/estoque/ajuste.vue`

**Funcionalidades**:
- Ajuste de quantidade em estoque
- Seleção de produto e prateleira
- Nova quantidade
- Motivo do ajuste

#### Movimentações (`/estoque/movimentacoes`)
**Arquivo**: `pages/estoque/movimentacoes.vue`

**Funcionalidades**:
- Histórico completo de movimentações
- Filtros por tipo, produto, colaborador
- Período de data
- Exportação de dados

#### Relatório (`/estoque/relatorio`)
**Arquivo**: `pages/estoque/relatorio.vue`

**Funcionalidades**:
- Relatório completo do estoque
- Análise de movimentações
- Produtos com estoque baixo
- Valor total do estoque

### 10. Sistema de Comissões

#### Resumo de Comissões (`/comissoes`)
**Arquivo**: `pages/comissoes/index.vue`

**Funcionalidades**:
- Resumo geral de comissões
- Vendas de serviços e produtos
- Débitos e indicações
- Saldo líquido
- Filtros por mês
- Diferenciação entre proprietário e colaborador

**Para Proprietários**:
- Comissões de todos os colaboradores
- Resumo consolidado
- Comparação entre colaboradores

**Para Colaboradores**:
- Apenas suas próprias comissões
- Histórico detalhado
- Projeção de ganhos

#### Projeção de Comissões (`/comissoes/projecao`)
**Arquivo**: `pages/comissoes/projecao.vue`

**Funcionalidades**:
- Projeção de comissões futuras
- Baseada em metas e histórico
- Cenários otimistas e pessimistas
- Gráficos de projeção

### 11. Gestão Financeira

#### Visão Geral (`/financeiro`)
**Arquivo**: `pages/financeiro/index.vue`

**Funcionalidades**:
- Dashboard financeiro
- Receitas e despesas
- Margem de contribuição
- Lucro líquido
- Indicadores financeiros

#### Despesas Fixas (`/financeiro/despesas-fixas`)
**Arquivo**: `pages/financeiro/despesas-fixas.vue`

**Funcionalidades**:
- Gestão de despesas fixas
- Categorização de gastos
- Valores mensais
- Controle de orçamento

#### Despesas Variáveis (`/financeiro/despesas-variaveis`)
**Arquivo**: `pages/financeiro/despesas-variaveis.vue`

**Funcionalidades**:
- Gestão de despesas variáveis
- Categorização de gastos
- Valores mensais
- Análise de tendências

#### Canais (`/financeiro/canais`)
**Arquivo**: `pages/financeiro/canais.vue`

**Funcionalidades**:
- Gestão de canais de marketing
- Gastos por canal
- ROI por canal
- Análise de efetividade

#### Gastos (`/financeiro/gastos`)
**Arquivo**: `pages/financeiro/gastos.vue`

**Funcionalidades**:
- Gastos por colaborador
- Controle de adiantamentos
- Pagamentos e débitos
- Relatórios de gastos

### 12. Gestão de Barbearias

#### Lista de Barbearias (`/barbearias`)
**Arquivo**: `pages/barbearias/index.vue`

**Funcionalidades**:
- Lista de barbearias do proprietário
- Informações básicas
- Status ativo/inativo
- Ações: visualizar, editar, deletar

#### Nova Barbearia (`/barbearias/novo`)
**Arquivo**: `pages/barbearias/novo.vue`

**Funcionalidades**:
- Formulário de criação de barbearia
- Dados básicos da barbearia
- Configurações iniciais

#### Detalhes da Barbearia (`/barbearias/[id]`)
**Arquivo**: `pages/barbearias/[id].vue`

**Funcionalidades**:
- Informações completas da barbearia
- Estatísticas gerais
- Colaboradores vinculados
- Configurações específicas

### 13. Configurações

#### Configurações Gerais (`/configuracoes`)
**Arquivo**: `pages/configuracoes/index.vue`

**Funcionalidades**:
- Menu de configurações
- Acesso às diferentes seções
- Configurações por módulo

#### Configurações da Barbearia (`/configuracoes/barbearia`)
**Arquivo**: `pages/configuracoes/barbearia.vue`

**Funcionalidades**:
- Dados da barbearia
- Configurações específicas
- Integrações

#### Configurações Básicas (`/configuracoes/basicas`)
**Arquivo**: `pages/configuracoes/basicas.vue`

**Funcionalidades**:
- Configurações gerais do sistema
- Preferências do usuário
- Configurações de notificação

#### Metas (`/configuracoes/metas`)
**Arquivo**: `pages/configuracoes/metas.vue`

**Funcionalidades**:
- Definição de metas
- Metas diárias, semanais e mensais
- Acompanhamento de progresso

### 14. Perfil do Usuário

#### Gestão de Perfil (`/perfil`)
**Arquivo**: `pages/perfil/index.vue`

**Funcionalidades**:
- Interface com tabs para diferentes seções
- Informações pessoais
- Edição de dados
- Alteração de senha
- Upload de foto de perfil

**Tabs**:
- **Informações**: Dados pessoais e da barbearia
- **Editar**: Formulário de edição
- **Senha**: Alteração de senha
- **Foto**: Upload de foto de perfil

## Permissões e Acesso

### Controle de Acesso
- **Middleware Global**: `middleware/auth.global.ts`
- **Verificação de Token**: Automática em todas as rotas
- **Redirecionamento**: Para login em caso de token inválido

### Permissões por Recurso
- **clientes**: visualizar, criar, editar, excluir
- **colaboradores**: visualizar, criar, editar, excluir
- **servicos**: visualizar, criar, editar, excluir
- **produtos**: visualizar, criar, editar, excluir
- **agenda**: visualizar, criar, editar, excluir
- **atendimentos**: visualizar, criar, editar, excluir
- **comissoes**: visualizar (colaboradores sempre podem ver suas próprias)
- **financeiro**: visualizar, criar, editar, excluir
- **estoque**: visualizar, criar, editar, excluir
- **configuracoes**: visualizar, criar, editar, excluir

### Diferenciação por Tipo de Usuário
- **Proprietário**: Acesso total a todas as funcionalidades
- **Colaborador**: Acesso limitado por permissões específicas

## Navegação Mobile

### Adaptações Necessárias
1. **Bottom Navigation**: Substituir navbar lateral por navegação inferior
2. **Tabs**: Implementar navegação por tabs para seções relacionadas
3. **Drawer**: Menu lateral deslizante para navegação secundária
4. **Stack Navigation**: Navegação em pilha para detalhes

### Estrutura Sugerida para Mobile
```
Tab Navigation (Bottom):
├── Dashboard
├── Agenda
├── Clientes
├── Atendimentos
└── Perfil

Drawer Menu:
├── Serviços
├── Produtos
├── Colaboradores
├── Estoque
├── Comissões
├── Financeiro
├── Configurações
└── Logout
```

### Bibliotecas Recomendadas
- **React Navigation**: Navegação principal
- **Bottom Tabs**: Navegação inferior
- **Drawer Navigator**: Menu lateral
- **Stack Navigator**: Navegação em pilha

## Considerações de UX

### Padrões de Navegação
- **Breadcrumbs**: Para navegação hierárquica
- **Botões de Ação**: Sempre visíveis e acessíveis
- **Filtros**: Facilmente acessíveis e intuitivos
- **Busca**: Campo de busca em listas longas

### Feedback Visual
- **Loading States**: Indicadores de carregamento
- **Notificações**: Feedback de ações realizadas
- **Validações**: Mensagens de erro claras
- **Confirmações**: Diálogos para ações destrutivas

### Responsividade
- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: Adaptação para diferentes tamanhos
- **Touch Targets**: Elementos tocáveis adequados
- **Gestos**: Swipe, pull-to-refresh, etc.
