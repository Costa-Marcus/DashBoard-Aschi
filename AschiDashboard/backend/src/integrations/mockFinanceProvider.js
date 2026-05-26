const externalMovements = {
    aschi: [
        {
            externalId: "mock-aschi-001",
            descricao: "API bancaria - mensalidade recebida",
            tipo: "Entrada",
            valor: 7400,
            data: "2026-05-24",
            categoria: "Receita"
        },
        {
            externalId: "mock-aschi-002",
            descricao: "API bancaria - software financeiro",
            tipo: "Saida",
            valor: 620,
            data: "2026-05-25",
            categoria: "Operacional"
        }
    ],
    norte: [
        {
            externalId: "mock-norte-001",
            descricao: "API bancaria - parcela projeto solar",
            tipo: "Entrada",
            valor: 36500,
            data: "2026-05-24",
            categoria: "Receita"
        },
        {
            externalId: "mock-norte-002",
            descricao: "API bancaria - fornecedor estruturas",
            tipo: "Saida",
            valor: 12800,
            data: "2026-05-25",
            categoria: "Equipamentos"
        }
    ],
    aurora: [
        {
            externalId: "mock-aurora-001",
            descricao: "API bancaria - recebimento convenio",
            tipo: "Entrada",
            valor: 22400,
            data: "2026-05-24",
            categoria: "Receita"
        },
        {
            externalId: "mock-aurora-002",
            descricao: "API bancaria - compra insumos",
            tipo: "Saida",
            valor: 3800,
            data: "2026-05-25",
            categoria: "Insumos"
        }
    ]
};

const fetchMovements = async clientId => {
    return externalMovements[clientId] || [];
};

module.exports = {
    fetchMovements
};
