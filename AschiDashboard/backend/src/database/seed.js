const db = require("./connection");
const createSchema = require("./schema");
const seedClients = require("./seed-data");

const seed = () => {
    createSchema();

    const insertClient = db.prepare(`
        INSERT INTO clients (id, name, segment, description)
        VALUES (@id, @name, @segment, @description)
    `);
    const insertCashflow = db.prepare(`
        INSERT INTO monthly_cashflow (client_id, month_label, income, expense, display_order)
        VALUES (?, ?, ?, ?, ?)
    `);
    const insertExpense = db.prepare(`
        INSERT INTO expense_categories (client_id, name, amount, color)
        VALUES (?, ?, ?, ?)
    `);
    const insertTransaction = db.prepare(`
        INSERT INTO transactions (client_id, description, type, amount, occurred_at, category, source)
        VALUES (?, ?, ?, ?, ?, ?, 'seed')
    `);
    const insertPayable = db.prepare(`
        INSERT INTO accounts_payable (client_id, description, amount, due_date, status)
        VALUES (?, ?, ?, ?, ?)
    `);

    const runSeed = () => {
        db.exec("BEGIN TRANSACTION;");

        try {
        db.exec(`
            DELETE FROM accounts_payable;
            DELETE FROM transactions;
            DELETE FROM expense_categories;
            DELETE FROM monthly_cashflow;
            DELETE FROM clients;
        `);

        seedClients.forEach(client => {
            insertClient.run({
                id: client.id,
                name: client.name,
                segment: client.segment,
                description: client.description
            });

            client.cashflow.forEach(([month, income, expense], index) => {
                insertCashflow.run(client.id, month, income, expense, index + 1);
            });

            client.expenses.forEach(([name, amount, color]) => {
                insertExpense.run(client.id, name, amount, color);
            });

            client.transactions.forEach(([description, type, amount, occurredAt, category]) => {
                insertTransaction.run(client.id, description, type, amount, occurredAt, category);
            });

            client.payables.forEach(([description, amount, dueDate, status]) => {
                insertPayable.run(client.id, description, amount, dueDate, status);
            });
        });
            db.exec("COMMIT;");
        } catch (error) {
            db.exec("ROLLBACK;");
            throw error;
        }
    };

    runSeed();
};

if (require.main === module) {
    seed();
    console.log("Banco SQLite populado com dados iniciais.");
}

module.exports = seed;
