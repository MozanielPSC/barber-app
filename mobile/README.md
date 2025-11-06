# Documentação Mobile - React Native

Esta pasta contém a documentação completa de todas as telas do sistema para implementação em React Native.

## Estrutura da Documentação

### 📚 Documentação Base
- **[00_BASE.md](./00_BASE.md)**: Sistema de cores, tipografia, componentes base e bibliotecas recomendadas

### 🔐 Autenticação
- **[01_LOGIN.md](./01_LOGIN.md)**: Tela de login de proprietário
- **[02_LOGIN_COLABORADOR.md](./02_LOGIN_COLABORADOR.md)**: Tela de login de colaborador
- **[03_REGISTRO.md](./03_REGISTRO.md)**: Tela de registro de proprietário

### 📊 Dashboard e Navegação
- **[04_DASHBOARD.md](./04_DASHBOARD.md)**: Tela principal do dashboard
- **[05_NAVBAR.md](./05_NAVBAR.md)**: Componente de navegação lateral (sidebar/drawer)

### 📅 Agenda
- **[06_AGENDA_LISTA.md](./06_AGENDA_LISTA.md)**: Lista de agendamentos
- **[07_AGENDA_NOVO.md](./07_AGENDA_NOVO.md)**: Criar novo agendamento
- **[08_AGENDA_DETALHES.md](./08_AGENDA_DETALHES.md)**: Detalhes do agendamento

### 👥 Clientes
- **[09_CLIENTES_LISTA.md](./09_CLIENTES_LISTA.md)**: Lista de clientes
- **[10_CLIENTES_NOVO.md](./10_CLIENTES_NOVO.md)**: Cadastrar cliente
- **[11_CLIENTES_DETALHES.md](./11_CLIENTES_DETALHES.md)**: Detalhes do cliente
- **[12_CLIENTES_HISTORICO.md](./12_CLIENTES_HISTORICO.md)**: Histórico do cliente

### 👔 Colaboradores
- **[13_COLABORADORES_LISTA.md](./13_COLABORADORES_LISTA.md)**: Lista de colaboradores
- **[14_COLABORADORES_NOVO.md](./14_COLABORADORES_NOVO.md)**: Cadastrar colaborador
- **[15_COLABORADORES_DETALHES.md](./15_COLABORADORES_DETALHES.md)**: Detalhes do colaborador

### 🔧 Serviços
- **[16_SERVICOS_LISTA.md](./16_SERVICOS_LISTA.md)**: Lista de serviços
- **[17_SERVICOS_NOVO.md](./17_SERVICOS_NOVO.md)**: Cadastrar serviço
- **[18_SERVICOS_DETALHES.md](./18_SERVICOS_DETALHES.md)**: Detalhes do serviço

### 🛍️ Produtos
- **[19_PRODUTOS_LISTA.md](./19_PRODUTOS_LISTA.md)**: Lista de produtos
- **[20_PRODUTOS_NOVO.md](./20_PRODUTOS_NOVO.md)**: Cadastrar produto
- **[21_PRODUTOS_DETALHES.md](./21_PRODUTOS_DETALHES.md)**: Detalhes do produto

### 📦 Estoque
- **[22_ESTOQUE_LISTA.md](./22_ESTOQUE_LISTA.md)**: Lista de estoque
- **[23_ESTOQUE_PRATELEIRAS.md](./23_ESTOQUE_PRATELEIRAS.md)**: Prateleiras
- **[24_ESTOQUE_MOVIMENTACOES.md](./24_ESTOQUE_MOVIMENTACOES.md)**: Movimentações (entrada, saída, ajuste, transferência)

### 📋 Atendimentos
- **[25_ATENDIMENTOS_LISTA.md](./25_ATENDIMENTOS_LISTA.md)**: Lista de atendimentos
- **[26_ATENDIMENTOS_NOVO.md](./26_ATENDIMENTOS_NOVO.md)**: Criar atendimento
- **[27_ATENDIMENTOS_DETALHES.md](./27_ATENDIMENTOS_DETALHES.md)**: Detalhes do atendimento

### 💰 Financeiro
- **[28_FINANCEIRO_DASHBOARD.md](./28_FINANCEIRO_DASHBOARD.md)**: Dashboard financeiro com gráficos neon
- **[29_FINANCEIRO_DESPESAS_FIXAS.md](./29_FINANCEIRO_DESPESAS_FIXAS.md)**: Despesas fixas
- **[30_FINANCEIRO_DESPESAS_VARIAVEIS.md](./30_FINANCEIRO_DESPESAS_VARIAVEIS.md)**: Despesas variáveis
- **[31_FINANCEIRO_CANAIS.md](./31_FINANCEIRO_CANAIS.md)**: Canais de marketing
- **[32_FINANCEIRO_GASTOS.md](./32_FINANCEIRO_GASTOS.md)**: Gastos de colaboradores

### 🎁 Assinaturas (Pote)
- **[33_POTE_CONFIGURACOES.md](./33_POTE_CONFIGURACOES.md)**: Configurações do pote
- **[34_POTE_PLANOS.md](./34_POTE_PLANOS.md)**: Planos de assinatura
- **[35_POTE_ASSINATURAS.md](./35_POTE_ASSINATURAS.md)**: Assinaturas ativas
- **[36_POTE_DISTRIBUICOES.md](./36_POTE_DISTRIBUICOES.md)**: Distribuições

### 💵 Comissões
- **[37_COMISSOES.md](./37_COMISSOES.md)**: Comissões do colaborador
- **[38_COMISSOES_PROJECAO.md](./38_COMISSOES_PROJECAO.md)**: Projeção de comissões

### 🎯 Metas
- **[39_METAS.md](./39_METAS.md)**: Configuração de metas

### 👤 Perfil
- **[40_PERFIL.md](./40_PERFIL.md)**: Perfil do usuário (edição, foto, senha)

### ⚙️ Configurações
- **[41_CONFIGURACOES.md](./41_CONFIGURACOES.md)**: Configurações gerais
- **[42_BARBEARIAS.md](./42_BARBEARIAS.md)**: Gerenciamento de barbearias

## Como Usar Esta Documentação

1. **Comece pelo arquivo base**: Leia `00_BASE.md` para entender o sistema de cores, componentes base e estrutura recomendada.

2. **Siga a ordem numérica**: Os arquivos estão numerados na ordem lógica de implementação (autenticação → dashboard → funcionalidades).

3. **Cada arquivo contém**:
   - Visão geral da tela
   - Layout visual detalhado
   - Cores e estilos
   - Componentes utilizados
   - Funcionalidades e validações
   - Rotas da API com exemplos
   - Stores utilizadas
   - Código React Native de exemplo
   - Notas de implementação

4. **Para implementação**:
   - Use os exemplos de código como base
   - Adapte as cores usando o sistema de tema documentado em `00_BASE.md`
   - Siga os padrões de navegação e estrutura de pastas recomendados
   - Implemente as validações e tratamentos de erro descritos

## Informações Importantes

- **Tema Claro/Escuro**: Todas as telas suportam ambos os modos. Use o ThemeContext documentado em `00_BASE.md`
- **Permissões**: Muitas telas verificam permissões antes de exibir conteúdo ou ações
- **Barbearia Selecionada**: A maioria das rotas requer `barbearia_id` como parâmetro
- **Autenticação**: Todas as rotas (exceto login/registro) requerem token de autenticação no header

## Bibliotecas Principais Recomendadas

- **Navegação**: `@react-navigation/native`
- **Estado**: `@reduxjs/toolkit` ou `zustand`
- **UI**: `react-native-paper` ou `react-native-elements`
- **Gráficos**: `react-native-chart-kit` ou `victory-native`
- **Formulários**: `react-hook-form` + `yup`
- **Gradientes**: `expo-linear-gradient`
- **Storage**: `@react-native-async-storage/async-storage`

## Suporte

Para dúvidas sobre implementação, consulte primeiro o arquivo `00_BASE.md` e depois o arquivo específico da tela em questão.

