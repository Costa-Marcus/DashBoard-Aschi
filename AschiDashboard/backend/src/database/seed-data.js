const seedClients = [
    {
        id: "aschi",
        name: "ASCHI Finance",
        segment: "Gestao interna",
        description: "Visao financeira da propria ASCHI para acompanhamento interno.",
        cashflow: [
            ["Jan", 82000, 51000],
            ["Fev", 96000, 63000],
            ["Mar", 104000, 69000],
            ["Abr", 118000, 72000],
            ["Mai", 128400, 76900],
            ["Jun", 122000, 73500]
        ],
        expenses: [
            ["Operacional", 31500, "#3b82f6"],
            ["Impostos", 18800, "#7dd3fc"],
            ["Equipe", 16600, "#34d399"],
            ["Servicos", 10000, "#fbbf24"]
        ],
        transactions: [
            ["Pagamento fornecedor", "Saida", 4200, "2026-05-05", "Operacional"],
            ["Recebimento cliente", "Entrada", 12500, "2026-05-08", "Receita"],
            ["Conta de energia", "Saida", 890, "2026-05-10", "Operacional"],
            ["Mensalidade cliente", "Entrada", 6800, "2026-05-12", "Receita"],
            ["Impostos mensais", "Saida", 5300, "2026-05-18", "Impostos"]
        ],
        payables: [
            ["Fornecedor de sistemas", 2600, "2026-05-28", "Pendente"],
            ["Impostos mensais", 5300, "2026-05-30", "Pendente"]
        ]
    },
    {
        id: "norte",
        name: "Norte Solar",
        segment: "Energia solar",
        description: "Cliente com receita concentrada em projetos, instalacoes e contratos de manutencao.",
        cashflow: [
            ["Jan", 148000, 99000],
            ["Fev", 156000, 108000],
            ["Mar", 181000, 121000],
            ["Abr", 198000, 134500],
            ["Mai", 214800, 142300],
            ["Jun", 203000, 137000]
        ],
        expenses: [
            ["Equipamentos", 72000, "#3b82f6"],
            ["Equipe", 32800, "#34d399"],
            ["Logistica", 21400, "#fbbf24"],
            ["Impostos", 16100, "#fb7185"]
        ],
        transactions: [
            ["Projeto fotovoltaico", "Entrada", 48500, "2026-05-04", "Receita"],
            ["Compra inversores", "Saida", 29300, "2026-05-09", "Equipamentos"],
            ["Contrato manutencao", "Entrada", 9600, "2026-05-13", "Receita"],
            ["Equipe tecnica", "Saida", 18400, "2026-05-17", "Equipe"],
            ["Frete de placas", "Saida", 7100, "2026-05-20", "Logistica"]
        ],
        payables: [
            ["Fornecedor de placas", 44200, "2026-05-27", "Pendente"],
            ["Logistica regional", 6800, "2026-05-31", "Pendente"]
        ]
    },
    {
        id: "aurora",
        name: "Aurora Clinic",
        segment: "Saude",
        description: "Cliente de servicos recorrentes com alto volume de recebimentos e custos fixos previsiveis.",
        cashflow: [
            ["Jan", 91000, 64200],
            ["Fev", 93800, 61700],
            ["Mar", 98700, 60300],
            ["Abr", 100200, 59200],
            ["Mai", 96500, 58400],
            ["Jun", 98200, 60100]
        ],
        expenses: [
            ["Equipe", 28600, "#34d399"],
            ["Insumos", 12400, "#7dd3fc"],
            ["Operacional", 9800, "#3b82f6"],
            ["Impostos", 7600, "#fbbf24"]
        ],
        transactions: [
            ["Consultas particulares", "Entrada", 18400, "2026-05-03", "Receita"],
            ["Folha assistencial", "Saida", 22600, "2026-05-07", "Equipe"],
            ["Convenio medico", "Entrada", 31200, "2026-05-11", "Receita"],
            ["Materiais clinicos", "Saida", 4900, "2026-05-16", "Insumos"],
            ["Repasse especialistas", "Saida", 8700, "2026-05-21", "Equipe"]
        ],
        payables: [
            ["Laboratorio parceiro", 8200, "2026-05-29", "Pendente"],
            ["Materiais clinicos", 3100, "2026-06-02", "Pendente"]
        ]
    }
];

module.exports = seedClients;
