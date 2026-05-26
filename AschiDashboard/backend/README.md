# ASCHI Finance API

Backend inicial do ASCHI Finance com Node.js, Express e SQLite.

## Como rodar

Instale o Node.js LTS e execute:

```bash
cd backend
npm install
npm run seed
npm run dev
```

A API ficara disponivel em:

```text
http://localhost:3333/api
```

## Rotas iniciais

```text
GET    /api/health
GET    /api/clientes
POST   /api/clientes
GET    /api/clientes/:id
PUT    /api/clientes/:id
DELETE /api/clientes/:id
GET    /api/clientes/:id/dashboard
GET    /api/movimentacoes?clienteId=aschi
POST   /api/movimentacoes
PUT    /api/movimentacoes/:id
DELETE /api/movimentacoes/:id
GET    /api/contas-a-pagar?clienteId=aschi
POST   /api/contas-a-pagar
PUT    /api/contas-a-pagar/:id
DELETE /api/contas-a-pagar/:id
```

## Primeira meta funcional

O primeiro fluxo real do sistema e:

1. Cadastrar ou listar clientes pela API.
2. Cadastrar uma movimentacao financeira.
3. Salvar no SQLite.
4. Mostrar a informacao no dashboard do cliente.

Essa base ja prepara esse caminho sem exigir PostgreSQL ou autenticacao neste momento.
