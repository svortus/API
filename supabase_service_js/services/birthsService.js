
import { insertBirth, updateBirth, selectBirths, selectLastUpdated, selectSinceLastDate } from "../repositories/birthsRepository.js";
import { conflictResolution } from "../templates/conflictResolutionTemplate.js";

export async function createBirth(req, res) {
    const births = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const birth of births) {
            try {
                const data = await insertBirth(birth);
                results.push({ birth: data, status: "success" });
            } catch (insertError) {
                results.push({ birth, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating births:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function birthConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "births",
        selectFn: selectBirths,
        updateFn: updateBirth,
        insertFn: insertBirth,
        idField: "birth_id"
    });
}

export async function getSinceBirths(req, res) {
    try {
        const date = req.query.date;
        const data = await selectSinceLastDate(date);
        return res.status(200).json({ births: data });
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

