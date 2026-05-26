const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const dataDir = path.join(__dirname, "..", "..", "data");
const dbPath = path.join(dataDir, "aschi-finance.db");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

module.exports = db;
