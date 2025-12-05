export async function conflictResolution(req, res, {
    tableName,
    selectFn,
    updateFn,
    insertFn,
    idField
}) {
    try {
        const items = Array.isArray(req.body) ? req.body : [req.body];

        const normalize = (item) => ({
            ...item,
            [idField]: String(item[idField]),
            updated_at: new Date(item.updated_at || item.created_at)
        });

        const normalizedItems = items.map(normalize);

        // IDENTIFICA EL MÁS RECIENTE PARA DEFINIR RANGO DE SELECT
        const newestItem = normalizedItems.reduce((a, b) =>
            b.updated_at > a.updated_at ? b : a
        );

        const remoteItems = await selectFn(newestItem.updated_at);

        // MAP PARA ENCONTRAR RÁPIDO
        const remoteMap = new Map(
            remoteItems.map(i => [String(i[idField]), new Date(i.updated_at)])
        );

        const results = [];

        // 1) PROCESA ITEMS LOCALES
        for (const item of normalizedItems) {
            const id = item[idField];
            if (remoteMap.has(id)) {
                const remoteDate = remoteMap.get(id);

                if (item.updated_at > remoteDate) {
                    results.push({ status: "updated", data: await updateFn(item) });
                } else if (item.updated_at < remoteDate) {
                    results.push({ status: "to_update", item });
                } else {
                    results.push({ status: "no_action", item });
                }
            } else {
                results.push({ status: "inserted", data: await insertFn(item) });
            }
        }

        // 2) PROCESA LOS QUE ESTÁN EN REMOTO PERO NO EN LOCAL → IMPORTACIÓN
        const localIds = new Set(normalizedItems.map(i => i[idField]));

        for (const remote of remoteItems) {
            const id = String(remote[idField]);

            if (!localIds.has(id)) {
                results.push({ status: "to_insert", remote });
            }
        }

        return res.status(207).json({ 
            message: `${tableName} conflict resolved`,
            results 
        });

    } catch (error) {
        console.error(`Error in ${tableName} conflict resolution:`, error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
