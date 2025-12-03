import { insertMilkProduction,updateMilkProduction,selectMilkProduction } from "../repositories/milk_productionRepository.js";
import{ conflictResolution } from "../templates/conflictResolutionTemplate.js";

export async function createMilkProduction(req, res) {
    const milkProductions = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const milkProduction of milkProductions) {
            try {
                const data = await insertMilkProduction(milkProduction);
                results.push({ milkProduction: data, status: "success" });
            } catch (insertError) {
                results.push({ milkProduction, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating milk productions:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function milkProductionConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "milk_production",
        selectFn: selectMilkProduction,
        updateFn: updateMilkProduction,
        insertFn: insertMilkProduction,
        idField: "milk_production_id" 
    });
}

