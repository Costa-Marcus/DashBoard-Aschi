const aschiClients = [
    {
        id: "aschi",
        nome: "ASCHI Finance",
        segmento: "Gestao interna",
        descricao: "Visao financeira da propria ASCHI para acompanhamento interno.",
        entradas: 128400,
        saidas: 76900,
        contasAPagar: 18,
        variacaoEntradas: 8.2,
        variacaoSaidas: -2.1,
        recebimentos: 42,
        fluxoMensal: [
            { mes: "Jan", entradas: 82000, saidas: 51000 },
            { mes: "Fev", entradas: 96000, saidas: 63000 },
            { mes: "Mar", entradas: 104000, saidas: 69000 },
            { mes: "Abr", entradas: 118000, saidas: 72000 },
            { mes: "Mai", entradas: 128400, saidas: 76900 },
            { mes: "Jun", entradas: 122000, saidas: 73500 }
        ],
        despesas: [
            { categoria: "Operacional", valor: 31500, cor: "#3b82f6" },
            { categoria: "Impostos", valor: 18800, cor: "#7dd3fc" },
            { categoria: "Equipe", valor: 16600, cor: "#34d399" },
            { categoria: "Servicos", valor: 10000, cor: "#fbbf24" }
        ],
        movimentacoes: [
            { descricao: "Pagamento fornecedor", tipo: "Saida", valor: 4200 },
            { descricao: "Recebimento cliente", tipo: "Entrada", valor: 12500 },
            { descricao: "Conta de energia", tipo: "Saida", valor: 890 },
            { descricao: "Mensalidade cliente", tipo: "Entrada", valor: 6800 },
            { descricao: "Impostos mensais", tipo: "Saida", valor: 5300 }
        ]
    },
    {
        id: "norte",
        nome: "Norte Solar",
        segmento: "Energia solar",
        descricao: "Cliente com receita concentrada em projetos, instalacoes e contratos de manutencao.",
        entradas: 214800,
        saidas: 142300,
        contasAPagar: 27,
        variacaoEntradas: 12.6,
        variacaoSaidas: 4.8,
        recebimentos: 31,
        fluxoMensal: [
            { mes: "Jan", entradas: 148000, saidas: 99000 },
            { mes: "Fev", entradas: 156000, saidas: 108000 },
            { mes: "Mar", entradas: 181000, saidas: 121000 },
            { mes: "Abr", entradas: 198000, saidas: 134500 },
            { mes: "Mai", entradas: 214800, saidas: 142300 },
            { mes: "Jun", entradas: 203000, saidas: 137000 }
        ],
        despesas: [
            { categoria: "Equipamentos", valor: 72000, cor: "#3b82f6" },
            { categoria: "Equipe", valor: 32800, cor: "#34d399" },
            { categoria: "Logistica", valor: 21400, cor: "#fbbf24" },
            { categoria: "Impostos", valor: 16100, cor: "#fb7185" }
        ],
        movimentacoes: [
            { descricao: "Projeto fotovoltaico", tipo: "Entrada", valor: 48500 },
            { descricao: "Compra inversores", tipo: "Saida", valor: 29300 },
            { descricao: "Contrato manutencao", tipo: "Entrada", valor: 9600 },
            { descricao: "Equipe tecnica", tipo: "Saida", valor: 18400 },
            { descricao: "Frete de placas", tipo: "Saida", valor: 7100 }
        ]
    },
    {
        id: "aurora",
        nome: "Aurora Clinic",
        segmento: "Saude",
        descricao: "Cliente de servicos recorrentes com alto volume de recebimentos e custos fixos previsiveis.",
        entradas: 96500,
        saidas: 58400,
        contasAPagar: 12,
        variacaoEntradas: -1.4,
        variacaoSaidas: -6.2,
        recebimentos: 86,
        fluxoMensal: [
            { mes: "Jan", entradas: 91000, saidas: 64200 },
            { mes: "Fev", entradas: 93800, saidas: 61700 },
            { mes: "Mar", entradas: 98700, saidas: 60300 },
            { mes: "Abr", entradas: 100200, saidas: 59200 },
            { mes: "Mai", entradas: 96500, saidas: 58400 },
            { mes: "Jun", entradas: 98200, saidas: 60100 }
        ],
        despesas: [
            { categoria: "Equipe", valor: 28600, cor: "#34d399" },
            { categoria: "Insumos", valor: 12400, cor: "#7dd3fc" },
            { categoria: "Operacional", valor: 9800, cor: "#3b82f6" },
            { categoria: "Impostos", valor: 7600, cor: "#fbbf24" }
        ],
        movimentacoes: [
            { descricao: "Consultas particulares", tipo: "Entrada", valor: 18400 },
            { descricao: "Folha assistencial", tipo: "Saida", valor: 22600 },
            { descricao: "Convenio medico", tipo: "Entrada", valor: 31200 },
            { descricao: "Materiais clinicos", tipo: "Saida", valor: 4900 },
            { descricao: "Repasse especialistas", tipo: "Saida", valor: 8700 }
        ]
    }
];
