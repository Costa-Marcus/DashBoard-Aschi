const express = require("express");
const financeSyncService = require("../services/financeSyncService");
const { requireString } = require("../utils/validators");

const router = express.Router();

router.post("/sincronizar-movimentacoes", async (req, res) => {
    const clientId = requireString(req.body, "clienteId");
    const result = await financeSyncService.syncClientMovements(clientId);

    res.json(result);
});

module.exports = router;
