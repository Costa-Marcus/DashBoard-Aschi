const express = require("express");
const clientRepository = require("../repositories/clientRepository");
const financeRepository = require("../repositories/financeRepository");
const HttpError = require("../utils/httpError");
const { requireNumber, requireString } = require("../utils/validators");

const router = express.Router();

const ensureClientExists = clientId => {
    if (!clientRepository.getClientById(clientId)) {
        throw new HttpError(404, "Cliente nao encontrado.");
    }
};

router.get("/movimentacoes", (req, res) => {
    const clientId = requireString(req.query, "clienteId");

    ensureClientExists(clientId);
    res.json(financeRepository.listTransactions(clientId));
});

router.post("/movimentacoes", (req, res) => {
    const transaction = {
        clientId: requireString(req.body, "clienteId"),
        description: requireString(req.body, "descricao"),
        type: requireString(req.body, "tipo"),
        amount: requireNumber(req.body, "valor"),
        occurredAt: requireString(req.body, "data"),
        category: String(req.body.categoria || "").trim() || null,
        source: "manual",
        externalId: null
    };

    if (!["Entrada", "Saida"].includes(transaction.type)) {
        throw new HttpError(400, "Tipo deve ser Entrada ou Saida.");
    }

    ensureClientExists(transaction.clientId);
    res.status(201).json(financeRepository.createTransaction(transaction));
});

router.put("/movimentacoes/:id", (req, res) => {
    const transaction = {
        clientId: requireString(req.body, "clienteId"),
        description: requireString(req.body, "descricao"),
        type: requireString(req.body, "tipo"),
        amount: requireNumber(req.body, "valor"),
        occurredAt: requireString(req.body, "data"),
        category: String(req.body.categoria || "").trim() || null,
        source: "manual",
        externalId: null
    };

    if (!["Entrada", "Saida"].includes(transaction.type)) {
        throw new HttpError(400, "Tipo deve ser Entrada ou Saida.");
    }

    ensureClientExists(transaction.clientId);

    const updated = financeRepository.updateTransaction(req.params.id, transaction);

    if (!updated) {
        throw new HttpError(404, "Movimentacao nao encontrada.");
    }

    res.json(updated);
});

router.delete("/movimentacoes/:id", (req, res) => {
    const deleted = financeRepository.deleteTransaction(req.params.id);

    if (!deleted) {
        throw new HttpError(404, "Movimentacao nao encontrada.");
    }

    res.status(204).send();
});

router.get("/contas-a-pagar", (req, res) => {
    const clientId = requireString(req.query, "clienteId");

    ensureClientExists(clientId);
    res.json(financeRepository.listPayables(clientId));
});

router.post("/contas-a-pagar", (req, res) => {
    const payable = {
        clientId: requireString(req.body, "clienteId"),
        description: requireString(req.body, "descricao"),
        amount: requireNumber(req.body, "valor"),
        dueDate: requireString(req.body, "vencimento"),
        status: String(req.body.status || "Pendente").trim()
    };

    ensureClientExists(payable.clientId);
    res.status(201).json(financeRepository.createPayable(payable));
});

router.put("/contas-a-pagar/:id", (req, res) => {
    const payable = {
        clientId: requireString(req.body, "clienteId"),
        description: requireString(req.body, "descricao"),
        amount: requireNumber(req.body, "valor"),
        dueDate: requireString(req.body, "vencimento"),
        status: String(req.body.status || "Pendente").trim()
    };

    ensureClientExists(payable.clientId);

    const updated = financeRepository.updatePayable(req.params.id, payable);

    if (!updated) {
        throw new HttpError(404, "Conta a pagar nao encontrada.");
    }

    res.json(updated);
});

router.delete("/contas-a-pagar/:id", (req, res) => {
    const deleted = financeRepository.deletePayable(req.params.id);

    if (!deleted) {
        throw new HttpError(404, "Conta a pagar nao encontrada.");
    }

    res.status(204).send();
});

module.exports = router;
