const formatCurrency = value => value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2
});

const roundCurrency = value => Math.round((value + Number.EPSILON) * 100) / 100;

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
    const rawValue = String(field?.value || "").trim();

    if (!rawValue) {
        return 0;
    }

    const normalizedValue = rawValue.includes(",")
        ? rawValue.replace(/\./g, "").replace(",", ".")
        : rawValue;
    const value = Number(normalizedValue);

    return Number.isNaN(value) ? 0 : value;
};

const setElementText = (element, value) => {
    const isValueField = element instanceof HTMLInputElement
        || element instanceof HTMLTextAreaElement
        || element instanceof HTMLSelectElement;

    if (isValueField) {
        element.value = value;
        return;
    }

    element.textContent = value;
};

const setResultState = (element, state) => {
    element.classList.toggle("negative", state === "negative");
    element.classList.toggle("neutral", state === "neutral");
};

const setCurrencyResult = (id, value) => {
    const output = document.getElementById(id);

    if (!output) {
        return;
    }

    setElementText(output, formatCurrency(value));
    setResultState(output, value < 0 ? "negative" : "default");
};

const setTextResult = (id, value, state = "default") => {
    const output = document.getElementById(id);

    if (!output) {
        return;
    }

    setElementText(output, value);
    setResultState(output, state);
};

const setBreakdown = (id, items) => {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    const rows = items.map(item => {
        const row = document.createElement("div");
        const label = document.createElement("span");
        const value = document.createElement("strong");

        label.textContent = item.label;
        value.textContent = item.value;
        row.append(label, value);

        return row;
    });

    element.replaceChildren(...rows);
};

const calculateInss = salary => {
    const inssLimit = taxTables.inss2026[taxTables.inss2026.length - 1].limit;
    const taxableSalary = Math.min(salary, inssLimit);
    let previousLimit = 0;
    let contribution = 0;

    taxTables.inss2026.forEach(range => {
        if (taxableSalary > previousLimit) {
            const taxableAmount = Math.min(taxableSalary, range.limit) - previousLimit;
            contribution = roundCurrency(contribution + roundCurrency(taxableAmount * range.rate));
        }

        previousLimit = range.limit;
    });

    return roundCurrency(contribution);
};

const calculateIrrfReduction = (taxableIncome, tax) => {
    if (taxableIncome <= 5000) {
        return tax;
    }

    if (taxableIncome <= 7350) {
        return Math.min(roundCurrency(Math.max(978.62 - (0.133145 * taxableIncome), 0)), tax);
    }

    return 0;
};

const calculateIrrfForBase = (base, income) => {
    const range = taxTables.irrf2026.find(item => base <= item.limit);
    const rawTax = roundCurrency(Math.max((base * range.rate) - range.deduction, 0));
    const reduction = calculateIrrfReduction(income, rawTax);
    const tax = roundCurrency(Math.max(rawTax - reduction, 0));

    return {
        base,
        rawTax,
        reduction,
        tax
    };
};

const calculateIrrf = ({ income, inss, dependents, deductions }) => {
    const dependentDeduction = roundCurrency(dependents * taxTables.dependentDeduction);
    const legalDeductions = roundCurrency(inss + dependentDeduction + deductions);
    const legalBase = roundCurrency(Math.max(income - legalDeductions, 0));
    const simplifiedBase = roundCurrency(Math.max(income - taxTables.simplifiedDeduction, 0));
    const legalResult = calculateIrrfForBase(legalBase, income);
    const simplifiedResult = calculateIrrfForBase(simplifiedBase, income);
    const useSimplified = simplifiedResult.tax < legalResult.tax;
    const selectedResult = useSimplified ? simplifiedResult : legalResult;

    return {
        base: selectedResult.base,
        dependentDeduction,
        legalDeductions,
        rawTax: selectedResult.rawTax,
        reduction: selectedResult.reduction,
        tax: selectedResult.tax,
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

    const items = deductionState[scope].map((item, index) => {
        const listItem = document.createElement("li");
        const type = document.createElement("span");
        const value = document.createElement("strong");
        const button = document.createElement("button");
        const icon = document.createElement("i");

        type.textContent = item.type;
        value.textContent = formatCurrency(item.value);
        button.type = "button";
        button.dataset.removeDeduction = String(index);
        button.setAttribute("aria-label", "Remover deducao");
        icon.classList.add("fa-solid", "fa-xmark");

        button.append(icon);
        listItem.append(type, value, button);

        return listItem;
    });

    list.replaceChildren(...items);
};

const setupDeductions = () => {
    document.querySelectorAll("[data-deduction-scope]").forEach(builder => {
        const scope = builder.dataset.deductionScope;
        const typeField = builder.querySelector("[data-deduction-type]");
        const valueField = builder.querySelector("[data-deduction-value]");
        const addButton = builder.querySelector("[data-add-deduction]");
        const list = builder.querySelector(".deduction-list");

        addButton?.addEventListener("click", () => {
            const value = getNumber(valueField?.id);

            if (value <= 0 || !typeField) {
                return;
            }

            deductionState[scope].push({
                type: typeField.value,
                value: roundCurrency(value)
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

const calculateDeductionsTotal = scope => deductionState[scope].reduce((sum, item) => {
    return roundCurrency(sum + item.value);
}, 0);

const calculatePayrollTaxes = ({ gross, dependents, deductionScope }) => {
    const otherDeductions = calculateDeductionsTotal(deductionScope);
    const inss = calculateInss(gross);
    const irrf = calculateIrrf({
        income: gross,
        inss,
        dependents,
        deductions: otherDeductions
    });
    const totalTaxes = roundCurrency(inss + irrf.tax);
    const net = roundCurrency(gross - totalTaxes);
    const effectiveRate = gross > 0 ? (totalTaxes / gross) * 100 : 0;

    return {
        effectiveRate,
        inss,
        irrf,
        net,
        otherDeductions,
        totalTaxes
    };
};

const calculators = {
    partnerTaxes: () => {
        const gross = getNumber("socioBruto");
        const dependents = getNumber("socioDependentes");
        const payrollTaxes = calculatePayrollTaxes({
            gross,
            dependents,
            deductionScope: "socio"
        });

        setCurrencyResult("resultadoSocio", payrollTaxes.totalTaxes);
        setBreakdown("detalheSocio", [
            { label: "INSS", value: formatCurrency(payrollTaxes.inss) },
            { label: "IRRF", value: formatCurrency(payrollTaxes.irrf.tax) },
            { label: "Deducoes adicionadas", value: formatCurrency(payrollTaxes.otherDeductions) },
            { label: "Total de impostos", value: formatCurrency(payrollTaxes.totalTaxes) },
            { label: "Liquido estimado", value: formatCurrency(payrollTaxes.net) },
            { label: "Carga efetiva", value: `${payrollTaxes.effectiveRate.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%` }
        ]);
    },
    prolabore: () => {
        const gross = getNumber("prolaboreBruto");
        const dependents = getNumber("prolaboreDependentes");
        const payrollTaxes = calculatePayrollTaxes({
            gross,
            dependents,
            deductionScope: "prolabore"
        });

        setCurrencyResult("resultadoProlabore", payrollTaxes.net);
        setBreakdown("detalheProlabore", [
            { label: "INSS", value: formatCurrency(payrollTaxes.inss) },
            { label: "IRRF", value: formatCurrency(payrollTaxes.irrf.tax) },
            { label: "Deducoes adicionadas", value: formatCurrency(payrollTaxes.otherDeductions) },
            { label: "Base IRRF", value: formatCurrency(payrollTaxes.irrf.base) }
        ]);
    },
    irrf: () => {
        const income = getNumber("salarioIrrf");
        const manualInss = getNumber("inssIrrf");
        const inss = manualInss > 0 ? roundCurrency(manualInss) : calculateInss(income);
        const dependents = getNumber("dependentesIrrf");
        const deductions = calculateDeductionsTotal("irrf");
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
            { label: "Deducoes adicionadas", value: formatCurrency(deductions) },
            { label: "Modelo aplicado", value: result.useSimplified ? "Simplificado" : "Legal" },
            { label: "Base IRRF", value: formatCurrency(result.base) }
        ]);
    },
    fgts: () => {
        const salary = getNumber("salarioFgts");
        const rate = getNumber("aliquotaFgts") / 100;

        setCurrencyResult("resultadoFgts", roundCurrency(salary * rate));
    },
    compoundInterest: () => {
        const capital = getNumber("capital");
        const rate = getNumber("juros") / 100;
        const months = getNumber("tempo");
        const total = roundCurrency(capital * ((1 + rate) ** months));

        setCurrencyResult("resultadoJuros", total);
    },
    compound: () => calculators.compoundInterest()
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
