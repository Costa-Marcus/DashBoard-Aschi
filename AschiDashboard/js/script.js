const clients = [
    {
        id: "aschi",
        nome: "ASCHI Finance",
        segmento: "Gestao financeira",
        descricao: "Operacao principal com foco em rotina financeira, contas e acompanhamento mensal.",
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

let selectedClientId = localStorage.getItem("selectedClientId") || clients[0].id;

if (!clients.some(client => client.id === selectedClientId)) {
    selectedClientId = clients[0].id;
}

const formatCurrency = value => value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
});

const formatPercent = value => `${value > 0 ? "+" : ""}${value.toLocaleString("pt-BR")}%`;

const getSelectedClient = () => {
    return clients.find(client => client.id === selectedClientId) || clients[0];
};

const setText = (id, value) => {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
};

const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
};

const setupSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleBtn");

    if (!sidebar || !toggleBtn) {
        return;
    }

    const layout = sidebar.closest(".layout");
    const savedState = localStorage.getItem("sidebarClosed") === "true";

    sidebar.classList.toggle("closed", savedState);
    layout?.classList.toggle("sidebar-collapsed", savedState);
    toggleBtn.setAttribute("aria-expanded", String(!savedState));

    toggleBtn.addEventListener("click", () => {
        const isClosed = sidebar.classList.toggle("closed");

        layout?.classList.toggle("sidebar-collapsed", isClosed);
        localStorage.setItem("sidebarClosed", String(isClosed));
        toggleBtn.setAttribute("aria-expanded", String(!isClosed));
    });
};

const setupFilters = () => {
    const currentDate = new Date();
    const clientSelect = document.getElementById("clientSelect");
    const monthSelect = document.getElementById("monthSelect");
    const yearSelect = document.getElementById("yearSelect");
    const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Marco",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    if (clientSelect) {
        const options = clients.map(client => {
            const option = document.createElement("option");

            option.value = client.id;
            option.textContent = client.nome;

            return option;
        });

        clientSelect.replaceChildren(...options);
        clientSelect.value = selectedClientId;
        clientSelect.addEventListener("change", () => {
            selectedClientId = clientSelect.value;
            localStorage.setItem("selectedClientId", selectedClientId);
            renderDashboard();
        });
    }

    if (monthSelect) {
        monthSelect.value = monthNames[currentDate.getMonth()];
    }

    if (yearSelect) {
        yearSelect.value = String(currentDate.getFullYear());
    }
};

const setupActiveStates = () => {
    const menuLinks = document.querySelectorAll(".menu a");

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuLinks.forEach(item => {
                item.classList.remove("active");
                item.removeAttribute("aria-current");
            });
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        });
    });
};

const renderClientInfo = client => {
    setText("dashboardTitle", `Painel Financeiro - ${client.nome}`);
    setText("dashboardDescription", client.descricao);
    setText("clienteNome", client.nome);
    setText("clienteSegmento", client.segmento);
    setText("clienteDescricao", client.descricao);
};

const renderIndicators = client => {
    const lucro = client.entradas - client.saidas;
    const margem = client.entradas > 0 ? Math.round((lucro / client.entradas) * 100) : 0;
    const ticketMedio = client.recebimentos > 0 ? client.entradas / client.recebimentos : 0;

    setText("entradaValor", formatCurrency(client.entradas));
    setText("saidaValor", formatCurrency(client.saidas));
    setText("lucro", formatCurrency(lucro));
    setText("contasValor", client.contasAPagar);
    setText("entradaVariacao", `${formatPercent(client.variacaoEntradas)} este mes`);
    setText("saidaVariacao", `${formatPercent(client.variacaoSaidas)} este mes`);
    setText("margemValor", `${margem}%`);
    setText("ticketValor", formatCurrency(ticketMedio));
    setText("recebimentosValor", client.recebimentos);

    const lucroElement = document.getElementById("lucro");

    if (lucroElement) {
        lucroElement.classList.toggle("positive", lucro >= 0);
        lucroElement.classList.toggle("negative", lucro < 0);
    }
};

const renderCashflowChart = client => {
    const chart = document.getElementById("cashflowChart");

    if (!chart) {
        return;
    }

    const maxValue = Math.max(
        ...client.fluxoMensal.flatMap(item => [item.entradas, item.saidas])
    );
    const bars = client.fluxoMensal.map(item => {
        const entradaHeight = Math.max((item.entradas / maxValue) * 100, 8);
        const saidaHeight = Math.max((item.saidas / maxValue) * 100, 8);
        const group = createElement("div", "bar-group");
        const barWrapper = createElement("div", "bars");
        const entryBar = createElement("span", "bar entry");
        const exitBar = createElement("span", "bar exit");
        const label = createElement("strong", "", item.mes);

        entryBar.style.height = `${entradaHeight}%`;
        exitBar.style.height = `${saidaHeight}%`;
        barWrapper.append(entryBar, exitBar);
        group.append(barWrapper, label);

        return group;
    });

    chart.replaceChildren(...bars);
};

const renderExpenseChart = client => {
    const chart = document.getElementById("expenseChart");
    const legend = document.getElementById("expenseLegend");
    const categoryList = document.getElementById("categoryList");

    if (!chart || !legend || !categoryList) {
        return;
    }

    const total = client.despesas.reduce((sum, item) => sum + item.valor, 0);
    let start = 0;
    const gradient = client.despesas.map(item => {
        const percent = total > 0 ? (item.valor / total) * 100 : 0;
        const segment = `${item.cor} ${start}% ${start + percent}%`;

        start += percent;

        return segment;
    }).join(", ");
    const totalLabel = createElement("span", "", formatCurrency(total));
    const legendItems = client.despesas.map(item => {
        const listItem = document.createElement("li");
        const color = document.createElement("span");
        const label = document.createTextNode(item.categoria);
        const value = createElement("strong", "", formatCurrency(item.valor));

        color.style.background = item.cor;
        listItem.append(color, label, value);

        return listItem;
    });
    const categoryButtons = client.despesas.map((item, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = item.categoria;
        button.classList.toggle("active", index === 0);
        button.addEventListener("click", () => {
            categoryList.querySelectorAll("button").forEach(categoryButton => {
                categoryButton.classList.remove("active");
            });
            button.classList.add("active");
        });

        return button;
    });

    chart.style.background = total > 0 ? `conic-gradient(${gradient})` : "var(--glass)";
    chart.replaceChildren(totalLabel);
    legend.replaceChildren(...legendItems);
    categoryList.replaceChildren(...categoryButtons);
};

const renderTable = client => {
    const tableBody = document.getElementById("tableBody");

    if (!tableBody) {
        return;
    }

    const rows = client.movimentacoes.map(item => {
        const typeClass = item.tipo === "Entrada" ? "positive" : "negative";
        const row = document.createElement("tr");
        const description = createElement("td", "", item.descricao);
        const type = document.createElement("td");
        const badge = createElement("span", `badge ${typeClass}`, item.tipo);
        const value = createElement("td", typeClass, formatCurrency(item.valor));

        type.append(badge);
        row.append(description, type, value);

        return row;
    });

    tableBody.replaceChildren(...rows);
};

const renderDashboard = () => {
    const client = getSelectedClient();

    renderClientInfo(client);
    renderIndicators(client);
    renderCashflowChart(client);
    renderExpenseChart(client);
    renderTable(client);
};

document.addEventListener("DOMContentLoaded", () => {
    setupSidebar();
    setupFilters();
    setupActiveStates();
    renderDashboard();
});
