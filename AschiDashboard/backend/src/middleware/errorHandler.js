const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? "Erro interno do servidor." : error.message;

    if (statusCode === 500) {
        console.error(error);
    }

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
