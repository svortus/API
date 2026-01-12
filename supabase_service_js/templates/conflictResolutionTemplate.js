import { updateByCode } from "../repositories/animalsRepository.js";

export async function conflictResolution(req, res, {
    tableName,
    selectFn,
    updateFn,
    insertFn,
    idField
}) {
    try {
        const items = Array.isArray(req.body) ? req.body : [req.body];

        // Normalizar datos
        const normalize = (item) => ({
            ...item,
            [idField]: String(item[idField]),
            updated_at: new Date(item.updated_at || item.created_at)
        });

        const normalizedItems = items.map(normalize);

        // Fecha MÁS ANTIGUA del cliente (NO más reciente)
        const oldestItem = normalizedItems.reduce((a, b) =>
            b.updated_at < a.updated_at ? b : a
        );

        const oldestDate = oldestItem.updated_at;

        // IDs del cliente → esenciales para evitar duplicate key
        const localIds = normalizedItems.map(i => i[idField]);

        // Trae del servidor:
        // - registros con esos IDs
        // - registros más nuevos
        const remoteItems = await selectFn(oldestDate, localIds);

        // Mapa para acceso rápido
        const remoteMap = new Map(
            remoteItems.map(i => [String(i[idField]), new Date(i.updated_at)])
        );

        const results = [];

        // 1) Procesar items locales
        for (const item of normalizedItems) {
            const id = item[idField];
            if (tableName === "animals") {

                const sameCode = remoteItems.find(
                    r => r.code_animal === item.code_animal &&
                        String(r[idField]) !== String(item[idField])
                );

                if (sameCode) {

                    const remoteDate = new Date(sameCode.updated_at);
                    const localDate = item.updated_at;

                    if (localDate > remoteDate) {
                        // local es más nuevo → actualizar el existente
                        item[idField] = sameCode[idField];

                        const updated = await updateByCode(item);

                        results.push({
                            status: "merged_update",
                            data: updated
                        });

                    } else {
                        // remoto es más nuevo → ignorar local
                        results.push({
                            status: "to_update",
                            sameCode
                        });
                    }

                    continue; // !!! evitar insert/update normal
                }
            }
            if (remoteMap.has(id)) {
                const remoteDate = remoteMap.get(id);

                if (item.updated_at > remoteDate) {
                    results.push({ status: "updated", data: await updateFn(item) });
                } else if (item.updated_at < remoteDate) {
                    results.push({ status: "to_update", item });
                } else {
                    results.push({ status: "no_action", item });
                }
            } 
            else {
                results.push({ status: "inserted", data: await insertFn(item) });
            }
        }

        // 2) Los que están en remote pero no en local
        const localIdSet = new Set(localIds);

        for (const remote of remoteItems) {
            const id = String(remote[idField]);

            if (!localIdSet.has(id)) {
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
