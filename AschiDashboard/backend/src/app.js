const express = require("express");
const path = require("path");
const clientRoutes = require("./routes/clientRoutes");
const financeRoutes = require("./routes/financeRoutes");
const createSchema = require("./database/schema");
const errorHandler = require("./middleware/errorHandler");

createSchema();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(204).send();
        return;
    }

    next();
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "aschi-finance-api" });
});

app.use("/api/clientes", clientRoutes);
app.use("/api", financeRoutes);
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));
app.use(errorHandler);

module.exports = app;
