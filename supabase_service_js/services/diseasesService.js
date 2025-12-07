import { insertDisease,updateDisease,selectDiseases } from "../repositories/diseasesRepository.js";
import{ conflictResolution } from "../templates/conflictResolutionTemplate.js";

export async function createDisease(req, res) {
    const diseases = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const disease of diseases) {
            try {
                const data = await insertDisease(disease);
                results.push({ disease: data, status: "success" });
            } catch (insertError) {
                results.push({ disease, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating diseases:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function diseaseConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "diseases",
        selectFn: selectDiseases,
        updateFn: updateDisease,
        insertFn: insertDisease,
        idField: "diseases_id" 
    });
}

