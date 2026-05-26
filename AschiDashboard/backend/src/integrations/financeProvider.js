const mockProvider = require("./mockFinanceProvider");

const providers = {
    mock: mockProvider
};

const getFinanceProvider = () => {
    const providerName = process.env.FINANCE_PROVIDER || "mock";

    return providers[providerName] || providers.mock;
};

module.exports = getFinanceProvider;
