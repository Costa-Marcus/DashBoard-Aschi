const ASCHI_API_URL = "http://localhost:3333/api";

const requestApi = async path => {
    const response = await fetch(`${ASCHI_API_URL}${path}`);

    if (!response.ok) {
        throw new Error(`API respondeu com status ${response.status}`);
    }

    return response.json();
};

const mapApiClient = client => ({
    id: client.id,
    nome: client.nome,
    segmento: client.segmento,
    descricao: client.descricao,
    entradas: client.entradas || 0,
    saidas: client.saidas || 0,
    contasAPagar: client.contasAPagar || 0,
    variacaoEntradas: client.variacaoEntradas || 0,
    variacaoSaidas: client.variacaoSaidas || 0,
    recebimentos: client.recebimentos || 0,
    fluxoMensal: client.fluxoMensal || [],
    despesas: client.despesas || [],
    movimentacoes: client.movimentacoes || []
});

window.aschiApi = {
    async getClients(fallbackClients) {
        try {
            return await requestApi("/clientes");
        } catch (error) {
            console.info("API indisponivel. Usando clientes locais.", error.message);
            return fallbackClients;
        }
    },

    async getClientDashboard(clientId, fallbackClients) {
        try {
            const client = await requestApi(`/clientes/${clientId}/dashboard`);
            return mapApiClient(client);
        } catch (error) {
            console.info("API indisponivel. Usando dashboard local.", error.message);
            return fallbackClients.find(client => client.id === clientId) || fallbackClients[0];
        }
    }
};
