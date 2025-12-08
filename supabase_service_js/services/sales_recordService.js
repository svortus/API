import { insertSalesRecord, updateSalesRecord, selectSalesRecords, selectLastUpdated, selectSinceLastDate } from "../repositories/sales_recordRepository.js";
import { conflictResolution } from "../templates/conflictResolutionTemplate.js";

export async function createSalesRecord(req, res) {
    const salesRecords = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const salesRecord of salesRecords) {
            try {
                const data = await insertSalesRecord(salesRecord);
                results.push({ salesRecord: data, status: "success" });
            } catch (insertError) {
                results.push({ salesRecord, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating sales records:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function salesRecordConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "sales_record",
        selectFn: selectSalesRecords,
        updateFn: updateSalesRecord,
        insertFn: insertSalesRecord,
        idField: "sale_id"
    });
}

export async function getSinceSalesRecords(req, res) {
    try {
        const date = req.query.date;
        const data = await selectSinceLastDate(date);
        return res.status(200).json({ salesRecords: data });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getLastUpdated(req, res) {
    try {
        const data = await selectLastUpdated();
        return res.json({ last_updated: data });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
