import { insertPregnantCow, updatePregnantCow, selectPregnantCows, selectLastUpdated, selectSinceLastDate } from "../repositories/pregnant_cowRepository.js";
import { conflictResolution } from "../templates/conflictResolutionTemplate.js";

export async function createPregnantCow(req, res) {
    const pregnantCows = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const pregnantCow of pregnantCows) {
            try {
                const data = await insertPregnantCow(pregnantCow);
                results.push({ pregnantCow: data, status: "success" });
            } catch (insertError) {
                results.push({ pregnantCow, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating pregnant cows:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function pregnantCowConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "pregnant_cows",
        selectFn: selectPregnantCows,
        updateFn: updatePregnantCow,
        insertFn: insertPregnantCow,
        idField: "pregnant_cow_id"
    });
}

export async function getSincePregnantCows(req, res) {
    try {
        const date = req.query.date;
        const data = await selectSinceLastDate(date);
        return res.status(200).json({ pregnantCows: data });
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
