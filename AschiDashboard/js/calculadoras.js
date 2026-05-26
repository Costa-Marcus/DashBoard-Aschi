const formatCurrency = value => value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2
});

const taxTables = {
    inss2026: [
        { limit: 1621.00, rate: 0.075 },
        { limit: 2902.84, rate: 0.09 },
        { limit: 4354.27, rate: 0.12 },
        { limit: 8475.55, rate: 0.14 }
    ],
    irrf2026: [
        { limit: 2428.80, rate: 0, deduction: 0 },
        { limit: 2826.65, rate: 0.075, deduction: 182.16 },
        { limit: 3751.05, rate: 0.15, deduction: 394.16 },
        { limit: 4664.68, rate: 0.225, deduction: 675.49 },
        { limit: Infinity, rate: 0.275, deduction: 908.73 }
    ],
    dependentDeduction: 189.59,
    simplifiedDeduction: 607.20
};

const deductionState = {
    irrf: [],
    prolabore: [],
    socio: []
};

const getNumber = id => {
    const field = document.getElementById(id);
    return Number(field?.value || 0);
};

const setResult = (id, value) => {
    const output = document.getElementById(id);

    if (!output) {
        return;
    }

    output.value = formatCurrency(value);
    output.textContent = formatCurrency(value);
    output.classList.toggle("negative", value < 0);
    output.classList.toggle("neutral", false);
};

const setTextResult = (id, value, state = "default") => {
    const output = document.getElementById(id);

    if (!output) {
        return;
    }

    output.value = value;
    output.textContent = value;
    output.classList.toggle("negative", state === "negative");
    output.classList.toggle("neutral", state === "neutral");
};

const setBreakdown = (id, items) => {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.innerHTML = items.map(item => `
        <div>
            <span>${item.label}</span>
            <strong>${item.value}</strong>
        </div>
    `).join("");
};

const calculateInss = salary => {
    let previousLimit = 0;
    let contribution = 0;

    taxTables.inss2026.forEach(range => {
        if (salary > previousLimit) {
            const taxableAmount = Math.min(salary, range.limit) - previousLimit;
            contribution += taxableAmount * range.rate;
        }

        previousLimit = range.limit;
    });

    return contribution;
};

const calculateIrrfReduction = taxableIncome => {
    if (taxableIncome <= 5000) {
        return Infinity;
    }

    if (taxableIncome <= 7350) {
        return Math.max(978.62 - (0.133145 * taxableIncome), 0);
    }

    return 0;
};

const calculateIrrf = ({ income, inss, dependents, deductions }) => {
    const dependentDeduction = dependents * taxTables.dependentDeduction;
    const legalDeductions = inss + dependentDeduction + deductions;
    const legalBase = Math.max(income - legalDeductions, 0);
    const simplifiedBase = Math.max(income - taxTables.simplifiedDeduction, 0);
    const useSimplified = simplifiedBase < legalBase;
    const base = useSimplified ? simplifiedBase : legalBase;
    const range = taxTables.irrf2026.find(item => base <= item.limit);
    const rawTax = Math.max((base * range.rate) - range.deduction, 0);
    const reduction = calculateIrrfReduction(income);
    const tax = Math.max(rawTax - reduction, 0);

    return {
        base,
        dependentDeduction,
        legalDeductions,
        rawTax,
        reduction: Number.isFinite(reduction) ? Math.min(reduction, rawTax) : rawTax,
        tax,
        useSimplified
    };
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

const renderDeductions = scope => {
    const lists = {
        irrf: "deducoesIrrf",
        prolabore: "deducoesProlabore",
        socio: "deducoesSocio"
    };
    const list = document.getElementById(lists[scope]);

    if (!list) {
        return;
    }

    list.innerHTML = deductionState[scope].map((item, index) => `
        <li>
            <span>${item.type}</span>
            <strong>${formatCurrency(item.value)}</strong>
            <button type="button" data-remove-deduction="${index}" aria-label="Remover dedução">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </li>
    `).join("");
};

const setupDeductions = () => {
    document.querySelectorAll("[data-deduction-scope]").forEach(builder => {
        const scope = builder.dataset.deductionScope;
        const typeField = builder.querySelector("[data-deduction-type]");
        const valueField = builder.querySelector("[data-deduction-value]");
        const addButton = builder.querySelector("[data-add-deduction]");
        const list = builder.querySelector(".deduction-list");

        addButton?.addEventListener("click", () => {
            const value = Number(valueField?.value || 0);

            if (value <= 0 || !typeField) {
                return;
            }

            deductionState[scope].push({
                type: typeField.value,
                value
            });

            valueField.value = "";
            renderDeductions(scope);
        });

        list?.addEventListener("click", event => {
            const button = event.target.closest("[data-remove-deduction]");

            if (!button) {
                return;
            }

            deductionState[scope].splice(Number(button.dataset.removeDeduction), 1);
            renderDeductions(scope);
        });
    });
};

const calculators = {
    partnerTaxes: () => {
        const gross = getNumber("socioBruto");
        const dependents = getNumber("socioDependentes");
        const otherDeductions = deductionState.socio.reduce((sum, item) => sum + item.value, 0);
        const inss = calculateInss(gross);
        const irrf = calculateIrrf({
            income: gross,
            inss,
            dependents,
            deductions: otherDeductions
        });
        const totalTaxes = inss + irrf.tax;
        const net = gross - totalTaxes;
        const effectiveRate = gross > 0 ? (totalTaxes / gross) * 100 : 0;

        setResult("resultadoSocio", totalTaxes);
        setBreakdown("detalheSocio", [
            { label: "INSS", value: formatCurrency(inss) },
            { label: "IRRF", value: formatCurrency(irrf.tax) },
            { label: "Deduções adicionadas", value: formatCurrency(otherDeductions) },
            { label: "Total de impostos", value: formatCurrency(totalTaxes) },
            { label: "Líquido estimado", value: formatCurrency(net) },
            { label: "Carga efetiva", value: `${effectiveRate.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%` }
        ]);
    },
    prolabore: () => {
        const gross = getNumber("prolaboreBruto");
        const dependents = getNumber("prolaboreDependentes");
        const otherDeductions = deductionState.prolabore.reduce((sum, item) => sum + item.value, 0);
        const inss = calculateInss(gross);
        const irrf = calculateIrrf({
            income: gross,
            inss,
            dependents,
            deductions: otherDeductions
        });
        const net = gross - inss - irrf.tax;

        setResult("resultadoProlabore", net);
        setBreakdown("detalheProlabore", [
            { label: "INSS", value: formatCurrency(inss) },
            { label: "IRRF", value: formatCurrency(irrf.tax) },
            { label: "Deduções adicionadas", value: formatCurrency(otherDeductions) },
            { label: "Base IRRF", value: formatCurrency(irrf.base) }
        ]);
    },
    irrf: () => {
        const income = getNumber("salarioIrrf");
        const manualInss = getNumber("inssIrrf");
        const inss = manualInss > 0 ? manualInss : calculateInss(income);
        const dependents = getNumber("dependentesIrrf");
        const deductions = deductionState.irrf.reduce((sum, item) => sum + item.value, 0);
        const result = calculateIrrf({
            income,
            inss,
            dependents,
            deductions
        });

        setTextResult("resultadoIrrf", `${formatCurrency(result.tax)} retido`, result.tax === 0 ? "neutral" : "default");
        setBreakdown("detalheIrrf", [
            { label: "INSS usado", value: formatCurrency(inss) },
            { label: "Dependentes", value: formatCurrency(result.dependentDeduction) },
            { label: "Deduções adicionadas", value: formatCurrency(deductions) },
            { label: "Modelo aplicado", value: result.useSimplified ? "Simplificado" : "Legal" },
            { label: "Base IRRF", value: formatCurrency(result.base) }
        ]);
    },
    fgts: () => {
        const salary = getNumber("salarioFgts");
        const rate = getNumber("aliquotaFgts") / 100;

        setResult("resultadoFgts", salary * rate);
    },
    compound: () => {
        const capital = getNumber("capital");
        const rate = getNumber("juros") / 100;
        const months = getNumber("tempo");
        const total = capital * ((1 + rate) ** months);

        setResult("resultadoJuros", total);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setupSidebar();
    setupDeductions();

    document.querySelectorAll(".calculator-form").forEach(form => {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const calculator = form.dataset.calculator;
            calculators[calculator]?.();
        });
    });
});
