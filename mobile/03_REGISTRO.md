# Tela de Registro - Proprietário

## Visão Geral

Tela para criação de nova conta de proprietário de barbearia. Coleta informações do proprietário e da barbearia.

## Campos do Formulário

1. **Nome do Proprietário** (obrigatório)
2. **Email** (obrigatório)
3. **Nome da Barbearia** (obrigatório)
4. **Telefone** (opcional)
5. **Endereço** (opcional)
6. **Senha** (obrigatório, mínimo 6 caracteres)
7. **Confirmar Senha** (obrigatório, deve coincidir)

## Validações

- Senhas devem coincidir
- Senha mínimo 6 caracteres
- Email deve ser válido
- Campos obrigatórios marcados com *

## Rotas da API

### POST /auth/register

**Request Body:**
```json
{
  "email": "string",
  "senha": "string",
  "confirmar_senha": "string",
  "nome_barbearia": "string",
  "nome_proprietario": "string",
  "telefone": "string | null",
  "endereco": "string | null"
}
```

**Response**: Mesmo formato do login (user + token)

## Implementação React Native

Similar ao login, mas com mais campos em grid de 2 colunas onde apropriado.

