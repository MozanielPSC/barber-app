# Componente de Navegação (Sidebar/Navbar)

## Visão Geral

Menu lateral (drawer) com navegação principal do sistema. Suporta modo colapsado, tema claro/escuro, e exibe diferentes itens baseado em permissões.

## Estrutura

1. **Header**: Logo/nome da barbearia + botão collapse/close
2. **Seleção de Barbearia** (só proprietários): SelectBarbearia component
3. **Info Barbearia** (só colaboradores): Nome da barbearia fixo
4. **Menu de Navegação**: Lista de itens com submenus
5. **Footer**: Toggle tema + botão logout

## Itens do Menu

- Dashboard
- Agenda
- Cadastros (submenu):
  - Barbearias (proprietário)
  - Clientes
  - Colaboradores (proprietário)
  - Serviços
  - Produtos
  - Estoque
  - Prateleiras
- Atendimentos
- Financeiro
- Minhas Comissões (colaborador)
- Assinaturas (submenu, se tiver permissão)
- Metas (proprietário)
- Perfil
- Configurações

## Estados Visuais

- **Item Ativo**: `bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300`
- **Item Normal**: `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`
- **Modo Colapsado**: Apenas ícones, largura 64px
- **Modo Expandido**: Ícones + texto, largura 256px

## Implementação React Native

Use `react-native-drawer` ou `@react-navigation/drawer`. Para mobile, o drawer deve ser sempre ocultável (overlay).

