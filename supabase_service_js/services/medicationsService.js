import { insertMedication, updateMedication, selectMedications, selectLastUpdated, selectSinceLastDate } from "../repositories/medicationsRepository.js";
import { conflictResolution } from "../templates/conflictResolutionTemplate.js";

export async function createMedication(req, res) {
    const medications = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const medication of medications) {
            try {
                const data = await insertMedication(medication);
                results.push({ medication: data, status: "success" });
            } catch (insertError) {
                results.push({ medication, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating medications:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function medicationConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "medications",
        selectFn: selectMedications,
        updateFn: updateMedication,
        insertFn: insertMedication,
        idField: "medication_id"
    });
}

export async function getSinceMedications(req, res) {
    try {
        const date = req.query.date;
        const data = await selectSinceLastDate(date);
        return res.status(200).json({ medications: data });
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
