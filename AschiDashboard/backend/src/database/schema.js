const db = require("./connection");

const ensureColumn = (table, column, definition) => {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all();
    const exists = columns.some(item => item.name === column);

    if (!exists) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
    }
};

const createSchema = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS clients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            segment TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id TEXT NOT NULL,
            description TEXT NOT NULL,
            type TEXT NOT NULL CHECK (type IN ('Entrada', 'Saida')),
            amount REAL NOT NULL CHECK (amount >= 0),
            occurred_at TEXT NOT NULL,
            category TEXT,
            source TEXT NOT NULL DEFAULT 'manual',
            external_id TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
            UNIQUE (client_id, source, external_id)
        );

        CREATE TABLE IF NOT EXISTS accounts_payable (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id TEXT NOT NULL,
            description TEXT NOT NULL,
            amount REAL NOT NULL CHECK (amount >= 0),
            due_date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pendente',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS monthly_cashflow (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id TEXT NOT NULL,
            month_label TEXT NOT NULL,
            income REAL NOT NULL CHECK (income >= 0),
            expense REAL NOT NULL CHECK (expense >= 0),
            display_order INTEGER NOT NULL,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS expense_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id TEXT NOT NULL,
            name TEXT NOT NULL,
            amount REAL NOT NULL CHECK (amount >= 0),
            color TEXT NOT NULL,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        );
    `);

    ensureColumn("transactions", "source", "TEXT NOT NULL DEFAULT 'manual'");
    ensureColumn("transactions", "external_id", "TEXT");

    db.exec(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_external_source
        ON transactions (client_id, source, external_id)
        WHERE external_id IS NOT NULL;
    `);
};

module.exports = createSchema;
