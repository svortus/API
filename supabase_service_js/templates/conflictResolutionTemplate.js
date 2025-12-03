export async function conflictResolution(req, res, {
    tableName,
    selectFn,
    updateFn,
    insertFn,
    idField
}) {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const newestItem = items.reduce((newest, current) => {
        const currentDate = new Date(current.updated_at || current.created_at);
        const newestDate = new Date(newest.updated_at || newest.created_at);
        return currentDate > newestDate ? current : newest;
    });

    const newestDate = newestItem.updated_at || newestItem.created_at;
    const remoteItems = await selectFn(newestDate);

    const remoteLastModifiedMap = new Map(
        remoteItems.map(i => [String(i[idField]), i.updated_at])
    );
    const localIds = new Set(items.map(i => String(i[idField])));
    const results = [];

    try {
        for (const item of items) {
            if (remoteLastModifiedMap.has(String(item[idField]))) {
                const remoteLastModified = remoteLastModifiedMap.get(item[idField]);

                if (item.updated_at > remoteLastModified) {
                    const data = await updateFn(item);
                    results.push({ status: "updated", data });
                } else if (item.updated_at < remoteLastModified) {
                    results.push({ status: "to_update", item });
                } else {
                    results.push({ status: "no_action", item });
                }
            } else {
                const data = await insertFn(item);
                results.push({ status: "inserted", data });
            }
        }

        for (const remoteItem of remoteItems) {
            if (!localIds.has(String(remoteItem[idField]))) {
                results.push({ status: "to_insert", remoteItem });
            }
        }

        return res.status(207).json({ message: `${tableName} conflict resolution results`, results });
    } catch (error) {
        console.error(`Error in ${tableName} conflict resolution:`, error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
