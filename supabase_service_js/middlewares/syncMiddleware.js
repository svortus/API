


export const ChangeSyncedMiddleware = (req, res, next) => {
    if (Array.isArray(req.body)) {
        // Si es un arreglo, iteramos cada objeto
        req.body = req.body.map(user => {
        const synced = Number(user.synced);
        return {
            ...user,
            synced: synced === 0 || synced === 1 ? true : true,
        };
        });
        console.log(req.body);
        return next();
    }

    if (typeof req.body === 'object') {
        // Si es un solo objeto
        const synced = Number(req.body.synced);
        req.body.synced = synced === 0 || synced === 1 ? true : true;
        console.log(req.body);
        return next();
    }

    // Si no es ni objeto ni arreglo, es formato inválido
    return res.status(400).json({
        error: "Invalid request format: expected an object or array of objects.",
    });
};

export const ApiKey = (req, res, next) => {
    const apiKeyHeader = req.header("API_KEY");
    if(process.env.API_KEY == apiKeyHeader){
        console.log("successfully authenticated");
        return next();
    }else{
        console.log("Unautorized");
        return res.status(401).json({
            message: 'Unauthorized: invalid API key',
        })
    }
}