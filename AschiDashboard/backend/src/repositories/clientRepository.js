const db = require("../database/connection");

const mapClient = row => ({
    id: row.id,
    nome: row.name,
    segmento: row.segment,
    descricao: row.description
});

const listClients = () => {
    return db.prepare(`
        SELECT id, name, segment, description
        FROM clients
        ORDER BY name
    `).all().map(mapClient);
};

const getClientById = id => {
    const row = db.prepare(`
        SELECT id, name, segment, description
        FROM clients
        WHERE id = ?
    `).get(id);

    return row ? mapClient(row) : null;
};

const createClient = client => {
    db.prepare(`
        INSERT INTO clients (id, name, segment, description)
        VALUES (@id, @name, @segment, @description)
    `).run(client);

    return getClientById(client.id);
};

const updateClient = (id, client) => {
    const result = db.prepare(`
        UPDATE clients
        SET name = @name,
            segment = @segment,
            description = @description,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
    `).run({ id, ...client });

    return result.changes > 0 ? getClientById(id) : null;
};

const deleteClient = id => {
    const result = db.prepare("DELETE FROM clients WHERE id = ?").run(id);

    return result.changes > 0;
};

module.exports = {
    createClient,
    deleteClient,
    getClientById,
    listClients,
    updateClient
};
