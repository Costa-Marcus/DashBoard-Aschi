# ASCHI Finance

Projeto separado em duas partes:

```text
frontend/  Interface visual em HTML, CSS e JavaScript
backend/   API em Node.js, Express e SQLite
```

## Rodando o backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

Depois acesse:

```text
http://localhost:3333
```

O backend tambem serve o frontend estatico, entao a interface abre pelo mesmo servidor.

## Sem backend

Tambem e possivel abrir `frontend/index.html` diretamente no navegador. Nesse caso, o frontend usa dados locais de fallback.

## Proxima etapa sugerida

Criar uma tela de cadastro de movimentacao financeira para usar a rota:

```text
POST /api/movimentacoes
```

Esse e o primeiro fluxo funcional real: cadastrar entrada ou saida, salvar no SQLite e refletir no dashboard do cliente.
