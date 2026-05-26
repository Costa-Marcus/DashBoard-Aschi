const financialData = {
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
        { categoria: "Serviços", valor: 10000, cor: "#fbbf24" }
    ],
    movimentacoes: [
        { descricao: "Pagamento fornecedor", tipo: "Saída", valor: 4200 },
        { descricao: "Recebimento cliente", tipo: "Entrada", valor: 12500 },
        { descricao: "Conta de energia", tipo: "Saída", valor: 890 },
        { descricao: "Mensalidade cliente", tipo: "Entrada", valor: 6800 },
        { descricao: "Impostos mensais", tipo: "Saída", valor: 5300 }
    ]
};

const formatCurrency = value => value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
});

const formatPercent = value => `${value > 0 ? "+" : ""}${value.toLocaleString("pt-BR")}%`;

const setText = (id, value) => {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
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
    const monthSelect = document.getElementById("monthSelect");
    const yearSelect = document.getElementById("yearSelect");
    const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
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

    if (monthSelect) {
        monthSelect.value = monthNames[currentDate.getMonth()];
    }

    if (yearSelect) {
        yearSelect.value = String(currentDate.getFullYear());
    }
};

const setupActiveStates = () => {
    const menuLinks = document.querySelectorAll(".menu a");
    const categoryButtons = document.querySelectorAll(".mini-card button");

    menuLinks.forEach(link => {
        link.addEventListener("click", event => {
            if (link.getAttribute("href") === "#") {
                event.preventDefault();
            }

            menuLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });

    categoryButtons.forEach((button, index) => {
        button.classList.toggle("active", index === 0);

        button.addEventListener("click", () => {
            categoryButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");
        });
    });
};

const renderIndicators = () => {
    const lucro = financialData.entradas - financialData.saidas;
    const margem = Math.round((lucro / financialData.entradas) * 100);
    const ticketMedio = financialData.entradas / financialData.recebimentos;

    setText("entradaValor", formatCurrency(financialData.entradas));
    setText("saidaValor", formatCurrency(financialData.saidas));
    setText("lucro", formatCurrency(lucro));
    setText("contasValor", financialData.contasAPagar);
    setText("entradaVariacao", `${formatPercent(financialData.variacaoEntradas)} este mês`);
    setText("saidaVariacao", `${formatPercent(financialData.variacaoSaidas)} este mês`);
    setText("margemValor", `${margem}%`);
    setText("ticketValor", formatCurrency(ticketMedio));
    setText("recebimentosValor", financialData.recebimentos);

    const lucroElement = document.getElementById("lucro");

    if (lucroElement) {
        lucroElement.classList.toggle("positive", lucro >= 0);
        lucroElement.classList.toggle("negative", lucro < 0);
    }
};

const renderCashflowChart = () => {
    const chart = document.getElementById("cashflowChart");

    if (!chart) {
        return;
    }

    const maxValue = Math.max(
        ...financialData.fluxoMensal.flatMap(item => [item.entradas, item.saidas])
    );

    chart.innerHTML = financialData.fluxoMensal.map(item => {
        const entradaHeight = Math.max((item.entradas / maxValue) * 100, 8);
        const saidaHeight = Math.max((item.saidas / maxValue) * 100, 8);

        return `
            <div class="bar-group">
                <div class="bars">
                    <span class="bar entry" style="height: ${entradaHeight}%"></span>
                    <span class="bar exit" style="height: ${saidaHeight}%"></span>
                </div>
                <strong>${item.mes}</strong>
            </div>
        `;
    }).join("");
};

const renderExpenseChart = () => {
    const chart = document.getElementById("expenseChart");
    const legend = document.getElementById("expenseLegend");

    if (!chart || !legend) {
        return;
    }

    const total = financialData.despesas.reduce((sum, item) => sum + item.valor, 0);
    let start = 0;

    const gradient = financialData.despesas.map(item => {
        const percent = (item.valor / total) * 100;
        const segment = `${item.cor} ${start}% ${start + percent}%`;

        start += percent;

        return segment;
    }).join(", ");

    chart.style.background = `conic-gradient(${gradient})`;
    chart.innerHTML = `<span>${formatCurrency(total)}</span>`;

    legend.innerHTML = financialData.despesas.map(item => `
        <li>
            <span style="background: ${item.cor}"></span>
            ${item.categoria}
            <strong>${formatCurrency(item.valor)}</strong>
        </li>
    `).join("");
};

const renderTable = () => {
    const tableBody = document.getElementById("tableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = financialData.movimentacoes.map(item => {
        const typeClass = item.tipo === "Entrada" ? "positive" : "negative";

        return `
            <tr>
                <td>${item.descricao}</td>
                <td><span class="badge ${typeClass}">${item.tipo}</span></td>
                <td class="${typeClass}">${formatCurrency(item.valor)}</td>
            </tr>
        `;
    }).join("");
};

document.addEventListener("DOMContentLoaded", () => {
    setupSidebar();
    setupFilters();
    setupActiveStates();
    renderIndicators();
    renderCashflowChart();
    renderExpenseChart();
    renderTable();
});
