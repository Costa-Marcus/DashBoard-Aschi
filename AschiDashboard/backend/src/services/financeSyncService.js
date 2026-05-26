const clientRepository = require("../repositories/clientRepository");
const financeRepository = require("../repositories/financeRepository");
const getFinanceProvider = require("../integrations/financeProvider");
const HttpError = require("../utils/httpError");

const syncClientMovements = async clientId => {
    const client = clientRepository.getClientById(clientId);

    if (!client) {
        throw new HttpError(404, "Cliente nao encontrado.");
    }

    const provider = getFinanceProvider();
    const movements = await provider.fetchMovements(clientId);
    let imported = 0;

    movements.forEach(movement => {
        const inserted = financeRepository.createExternalTransaction({
            clientId,
            description: movement.descricao,
            type: movement.tipo,
            amount: movement.valor,
            occurredAt: movement.data,
            category: movement.categoria || null,
            source: process.env.FINANCE_PROVIDER || "mock",
            externalId: movement.externalId
        });

        if (inserted) {
            imported += 1;
        }
    });

    return {
        clienteId: clientId,
        recebidas: movements.length,
        importadas: imported
    };
};

module.exports = {
    syncClientMovements
};
