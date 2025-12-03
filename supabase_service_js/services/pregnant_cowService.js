import { insertPregnantCow,updatePregnantCow,selectPregnantCows } from "../repositories/pregnant_cowRepository.js";
import{ conflictResolution } from "../templates/conflictResolutionTemplate.js";

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

