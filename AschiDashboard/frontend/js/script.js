const operationalData = {
    entregasHoje: 6,
    pendencias: 9,
    alertas: 4,
    clientesAtivos: aschiClients.length,
    calendario: [
        { dia: "26", semana: "Ter", titulo: "DAS e impostos", cliente: "ASCHI Finance", status: "Hoje" },
        { dia: "27", semana: "Qua", titulo: "Fechamento mensal", cliente: "Norte Solar", status: "Amanha" },
        { dia: "29", semana: "Sex", titulo: "Conferencia de folha", cliente: "Aurora Clinic", status: "Pendente" },
        { dia: "02", semana: "Ter", titulo: "Envio de relatorio", cliente: "Norte Solar", status: "Programado" }
    ],
    alertasPendentes: [
        { tipo: "Documento", texto: "Norte Solar ainda nao enviou notas de compra do mes.", nivel: "Alta" },
        { tipo: "Fiscal", texto: "Conferencia de impostos da ASCHI precisa de revisao final.", nivel: "Media" },
        { tipo: "Folha", texto: "Aurora Clinic tem pro-labore pendente de confirmacao.", nivel: "Alta" },
        { tipo: "Financeiro", texto: "Dois lancamentos aguardam classificacao.", nivel: "Baixa" }
    ],
    entregas: [
        { cliente: "ASCHI Finance", tarefa: "Revisar impostos mensais", prazo: "Hoje", status: "Em andamento" },
        { cliente: "Norte Solar", tarefa: "Fechamento financeiro", prazo: "27/05", status: "Pendente" },
        { cliente: "Aurora Clinic", tarefa: "Validar folha e repasses", prazo: "29/05", status: "Pendente" },
        { cliente: "Norte Solar", tarefa: "Enviar dashboard de resultados", prazo: "02/06", status: "Programado" }
    ]
};

let clients = aschiClients;

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

const setupActiveStates = () => {
    document.querySelectorAll(".menu a").forEach(link => {
        link.addEventListener("click", () => {
            document.querySelectorAll(".menu a").forEach(item => {
                item.classList.remove("active");
                item.removeAttribute("aria-current");
            });
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        });
    });
};

const setupClientRedirect = () => {
    const clientSelect = document.getElementById("homeClientSelect");

    if (!clientSelect) {
        return;
    }

    const options = clients.map(client => {
        const option = document.createElement("option");

        option.value = client.id;
        option.textContent = client.nome;

        return option;
    });

    clientSelect.append(...options);
    clientSelect.addEventListener("change", () => {
        if (!clientSelect.value) {
            return;
        }

        localStorage.setItem("selectedClientId", clientSelect.value);
        window.location.href = `pages/Dashboard.html?cliente=${clientSelect.value}`;
    });
};

const buildStatus = text => {
    const status = createElement("span", "status-pill", text);

    status.classList.toggle("warning", text === "Pendente" || text === "Alta");
    status.classList.toggle("neutral-pill", text === "Programado" || text === "Baixa");

    return status;
};

const renderIndicators = () => {
    setText("entregasHoje", operationalData.entregasHoje);
    setText("pendenciasValor", operationalData.pendencias);
    setText("alertasValor", operationalData.alertas);
    setText("clientesValor", clients.length);
};

const renderCalendar = () => {
    const calendar = document.getElementById("calendarList");

    if (!calendar) {
        return;
    }

    const items = operationalData.calendario.map(item => {
        const row = createElement("article", "schedule-item");
        const date = createElement("div", "schedule-date");
        const day = createElement("strong", "", item.dia);
        const week = createElement("span", "", item.semana);
        const content = createElement("div", "schedule-content");
        const title = createElement("strong", "", item.titulo);
        const client = createElement("span", "", item.cliente);

        date.append(day, week);
        content.append(title, client);
        row.append(date, content, buildStatus(item.status));

        return row;
    });

    calendar.replaceChildren(...items);
};

const renderAlerts = () => {
    const alerts = document.getElementById("alertsList");

    if (!alerts) {
        return;
    }

    const items = operationalData.alertasPendentes.map(item => {
        const row = createElement("article", "alert-item");
        const icon = createElement("div", "alert-icon");
        const content = createElement("div", "alert-content");
        const type = createElement("strong", "", item.tipo);
        const text = createElement("span", "", item.texto);

        icon.append(createElement("i", "fa-solid fa-triangle-exclamation"));
        content.append(type, text);
        row.append(icon, content, buildStatus(item.nivel));

        return row;
    });

    alerts.replaceChildren(...items);
};

const renderDeliveries = () => {
    const tableBody = document.getElementById("deliveriesTable");

    if (!tableBody) {
        return;
    }

    const rows = operationalData.entregas.map(item => {
        const row = document.createElement("tr");
        const client = createElement("td", "", item.cliente);
        const task = createElement("td", "", item.tarefa);
        const deadline = createElement("td", "", item.prazo);
        const status = document.createElement("td");

        status.append(buildStatus(item.status));
        row.append(client, task, deadline, status);

        return row;
    });

    tableBody.replaceChildren(...rows);
};

const renderClients = () => {
    const clientGrid = document.getElementById("clientGrid");

    if (!clientGrid) {
        return;
    }

    const cards = clients.map(client => {
        const card = createElement("article", "client-card glass");
        const header = createElement("div", "client-card-header");
        const icon = createElement("div", "icon blue");
        const text = createElement("div");
        const title = createElement("h3", "", client.nome);
        const segment = createElement("span", "", client.segmento);
        const description = createElement("p", "", client.descricao);
        const link = document.createElement("a");

        icon.append(createElement("i", "fa-solid fa-building"));
        text.append(title, segment);
        header.append(icon, text);
        link.href = `pages/Dashboard.html?cliente=${client.id}`;
        link.textContent = "Abrir dashboard";
        link.addEventListener("click", () => {
            localStorage.setItem("selectedClientId", client.id);
        });
        card.append(header, description, link);

        return card;
    });

    clientGrid.replaceChildren(...cards);
};

document.addEventListener("DOMContentLoaded", async () => {
    clients = await window.aschiApi.getClients(aschiClients);
    setupSidebar();
    setupActiveStates();
    setupClientRedirect();
    renderIndicators();
    renderCalendar();
    renderAlerts();
    renderDeliveries();
    renderClients();
});
