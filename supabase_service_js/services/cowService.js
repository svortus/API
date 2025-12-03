import { insertCow,updateCow,selectCows } from "../repositories/cowRepository.js";
import{ conflictResolution } from "../templates/conflictResolutionTemplate.js";
export async function createCow(req, res) {
    const cows = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const cow of cows) {
            try {
                const data = await insertCow(cow);
                results.push({ cow: data, status: "success" });
            } catch (insertError) {
                results.push({ cow, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating cows:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function cowConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "cows",
        selectFn: selectCows,
        updateFn: updateCow,
        insertFn: insertCow,
        idField: "cow_id" // Ajusta el nombre del campo ID si es diferente
    });
}


