import { insertAnimal, selectAnimal, selectLastUpdated, updateAnimal } from "../repositories/animalsRepository.js";
import{ conflictResolution } from "../templates/conflictResolutionTemplate.js";
export async function createAnimal(req, res) {
    const animals = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const animal of animals) {
            try {
                const data = await insertAnimal(animal);
                results.push({ animal: data, status: "success" });
            } catch (insertError) {
                results.push({ animal, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating animals:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function animalConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "animals",
        selectFn: selectAnimal,
        updateFn: updateAnimal,
        insertFn: insertAnimal,
        idField: "animal_id" // Ajusta el nombre del campo ID si es diferente
    });
}

export async function getSinceAnimals(req, res) {
    try {
        const date = req.query.date;
        const data = await selectSinceLastDate(date);
        return res.status(200).json({ animals: data });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getLastUpdated(req, res) {
    try{
        const data = await selectLastUpdated();
        //const lastUpdated = data?.[0]?.updated_at || null;
        return res.json({ last_updated: data });
    }catch{
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

