const HttpError = require("./httpError");

const requireString = (body, field) => {
    const value = String(body[field] || "").trim();

    if (!value) {
        throw new HttpError(400, `Campo obrigatorio: ${field}`);
    }

    return value;
};

const requireNumber = (body, field) => {
    const value = Number(body[field]);

    if (!Number.isFinite(value) || value < 0) {
        throw new HttpError(400, `Campo numerico invalido: ${field}`);
    }

    return value;
};

module.exports = {
    requireNumber,
    requireString
};
