const express = require("express");
const clientRepository = require("../repositories/clientRepository");
const financeRepository = require("../repositories/financeRepository");
const HttpError = require("../utils/httpError");
const { requireString } = require("../utils/validators");

const router = express.Router();

router.get("/", (req, res) => {
    res.json(clientRepository.listClients());
});

router.post("/", (req, res) => {
    const client = {
        id: requireString(req.body, "id"),
        name: requireString(req.body, "name"),
        segment: requireString(req.body, "segment"),
        description: requireString(req.body, "description")
    };

    res.status(201).json(clientRepository.createClient(client));
});

router.get("/:id", (req, res) => {
    const client = clientRepository.getClientById(req.params.id);

    if (!client) {
        throw new HttpError(404, "Cliente nao encontrado.");
    }

    res.json(client);
});

router.put("/:id", (req, res) => {
    const client = {
        name: requireString(req.body, "name"),
        segment: requireString(req.body, "segment"),
        description: requireString(req.body, "description")
    };
    const updatedClient = clientRepository.updateClient(req.params.id, client);

    if (!updatedClient) {
        throw new HttpError(404, "Cliente nao encontrado.");
    }

    res.json(updatedClient);
});

router.delete("/:id", (req, res) => {
    const deleted = clientRepository.deleteClient(req.params.id);

    if (!deleted) {
        throw new HttpError(404, "Cliente nao encontrado.");
    }

    res.status(204).send();
});

router.get("/:id/dashboard", (req, res) => {
    const client = clientRepository.getClientById(req.params.id);

    if (!client) {
        throw new HttpError(404, "Cliente nao encontrado.");
    }

    res.json({
        ...client,
        ...financeRepository.getDashboard(req.params.id)
    });
});

module.exports = router;
