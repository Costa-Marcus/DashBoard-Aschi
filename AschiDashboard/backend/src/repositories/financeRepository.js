const db = require("../database/connection");

const listTransactions = clientId => {
    return db.prepare(`
        SELECT id, client_id, description, type, amount, occurred_at, category, source, external_id
        FROM transactions
        WHERE client_id = ?
        ORDER BY occurred_at DESC, id DESC
    `).all(clientId).map(row => ({
        id: row.id,
        clienteId: row.client_id,
        descricao: row.description,
        tipo: row.type,
        valor: row.amount,
        data: row.occurred_at,
        categoria: row.category,
        origem: row.source,
        idExterno: row.external_id
    }));
};

const createTransaction = transaction => {
    const result = db.prepare(`
        INSERT INTO transactions (client_id, description, type, amount, occurred_at, category, source, external_id)
        VALUES (@clientId, @description, @type, @amount, @occurredAt, @category, @source, @externalId)
    `).run(transaction);

    return getTransactionById(result.lastInsertRowid);
};

const getTransactionById = id => {
    const row = db.prepare(`
        SELECT id, client_id, description, type, amount, occurred_at, category, source, external_id
        FROM transactions
        WHERE id = ?
    `).get(id);

    return row ? {
        id: row.id,
        clienteId: row.client_id,
        descricao: row.description,
        tipo: row.type,
        valor: row.amount,
        data: row.occurred_at,
        categoria: row.category,
        origem: row.source,
        idExterno: row.external_id
    } : null;
};

const updateTransaction = (id, transaction) => {
    const result = db.prepare(`
        UPDATE transactions
        SET client_id = @clientId,
            description = @description,
            type = @type,
            amount = @amount,
            occurred_at = @occurredAt,
            category = @category,
            source = @source,
            external_id = @externalId
        WHERE id = @id
    `).run({ id, ...transaction });

    return result.changes > 0 ? getTransactionById(id) : null;
};

const deleteTransaction = id => {
    const result = db.prepare("DELETE FROM transactions WHERE id = ?").run(id);

    return result.changes > 0;
};

const createExternalTransaction = transaction => {
    const result = db.prepare(`
        INSERT OR IGNORE INTO transactions (
            client_id,
            description,
            type,
            amount,
            occurred_at,
            category,
            source,
            external_id
        )
        VALUES (
            @clientId,
            @description,
            @type,
            @amount,
            @occurredAt,
            @category,
            @source,
            @externalId
        )
    `).run(transaction);

    return result.changes > 0;
};

const listPayables = clientId => {
    return db.prepare(`
        SELECT id, client_id, description, amount, due_date, status
        FROM accounts_payable
        WHERE client_id = ?
        ORDER BY due_date, id
    `).all(clientId).map(row => ({
        id: row.id,
        clienteId: row.client_id,
        descricao: row.description,
        valor: row.amount,
        vencimento: row.due_date,
        status: row.status
    }));
};

const createPayable = payable => {
    const result = db.prepare(`
        INSERT INTO accounts_payable (client_id, description, amount, due_date, status)
        VALUES (@clientId, @description, @amount, @dueDate, @status)
    `).run(payable);

    return getPayableById(result.lastInsertRowid);
};

const getPayableById = id => {
    const row = db.prepare(`
        SELECT id, client_id, description, amount, due_date, status
        FROM accounts_payable
        WHERE id = ?
    `).get(id);

    return row ? {
        id: row.id,
        clienteId: row.client_id,
        descricao: row.description,
        valor: row.amount,
        vencimento: row.due_date,
        status: row.status
    } : null;
};

const updatePayable = (id, payable) => {
    const result = db.prepare(`
        UPDATE accounts_payable
        SET client_id = @clientId,
            description = @description,
            amount = @amount,
            due_date = @dueDate,
            status = @status
        WHERE id = @id
    `).run({ id, ...payable });

    return result.changes > 0 ? getPayableById(id) : null;
};

const deletePayable = id => {
    const result = db.prepare("DELETE FROM accounts_payable WHERE id = ?").run(id);

    return result.changes > 0;
};

const getDashboard = clientId => {
    const cashflow = db.prepare(`
        SELECT month_label, income, expense
        FROM monthly_cashflow
        WHERE client_id = ?
        ORDER BY display_order
    `).all(clientId);
    const expenses = db.prepare(`
        SELECT name, amount, color
        FROM expense_categories
        WHERE client_id = ?
        ORDER BY amount DESC
    `).all(clientId);
    const transactions = listTransactions(clientId).slice(0, 5);
    const payables = listPayables(clientId);
    const totals = cashflow[cashflow.length - 1] || { income: 0, expense: 0 };
    const previousTotals = cashflow[cashflow.length - 2] || totals;
    const incomeVariation = previousTotals.income > 0
        ? ((totals.income - previousTotals.income) / previousTotals.income) * 100
        : 0;
    const expenseVariation = previousTotals.expense > 0
        ? ((totals.expense - previousTotals.expense) / previousTotals.expense) * 100
        : 0;

    return {
        entradas: totals.income,
        saidas: totals.expense,
        contasAPagar: payables.filter(item => item.status !== "Pago").length,
        variacaoEntradas: Number(incomeVariation.toFixed(1)),
        variacaoSaidas: Number(expenseVariation.toFixed(1)),
        recebimentos: transactions.filter(item => item.tipo === "Entrada").length,
        fluxoMensal: cashflow.map(item => ({
            mes: item.month_label,
            entradas: item.income,
            saidas: item.expense
        })),
        despesas: expenses.map(item => ({
            categoria: item.name,
            valor: item.amount,
            cor: item.color
        })),
        movimentacoes: transactions
    };
};

module.exports = {
    createPayable,
    createExternalTransaction,
    createTransaction,
    deletePayable,
    deleteTransaction,
    getDashboard,
    getPayableById,
    getTransactionById,
    listPayables,
    listTransactions,
    updatePayable,
    updateTransaction
};
