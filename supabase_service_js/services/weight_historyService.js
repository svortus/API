import { insertWeightHistory,updateWeightHistory,selectWeightHistory } from "../repositories/weight_historyRepository.js";
import{ conflictResolution } from "../templates/conflictResolutionTemplate.js";

export async function createWeightHistory(req, res) {   
    const weightHistories = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const weightHistory of weightHistories) {
            try {
                const data = await insertWeightHistory(weightHistory);
                results.push({ weightHistory: data, status: "success" });
            } catch (insertError) {
                results.push({ weightHistory, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating weight histories:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function weightHistoryConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "weight_history",
        selectFn: selectWeightHistory,
        updateFn: updateWeightHistory,
        insertFn: insertWeightHistory,
        idField: "weight_id" 
    });
}

