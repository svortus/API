import { insertAnimal, selectAnimal, updateAnimal } from "../repositories/animalsRepository.js";
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

export async function getAnimals(req, res) {
    try {
        const oldestDate = req.query.oldestDate;
        const data = await selectAnimal(oldestDate);
        return res.status(200).json({ animals: data });
    } catch (error) {
        console.error("Error fetching animals:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

