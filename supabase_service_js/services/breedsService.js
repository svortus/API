import { insertBreed, updateBreed, selectBreeds, selectLastUpdated, selectSinceLastDate } from "../repositories/breedsRepository.js";
import { conflictResolution } from "../templates/conflictResolutionTemplate.js";

export async function createBreed(req, res) {
    const breeds = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const breed of breeds) {
            try {
                const data = await insertBreed(breed);
                results.push({ breed: data, status: "success" });
            } catch (insertError) {
                results.push({ breed, status: "error", reason: insertError.message });
            }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating breeds:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function breedConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "breeds",
        selectFn: selectBreeds,
        updateFn: updateBreed,
        insertFn: insertBreed,
        idField: "breed_id"
    });
}

export async function getSinceBreeds(req, res) {
    try {
        const date = req.query.date;
        const data = await selectSinceLastDate(date);
        return res.status(200).json({ breeds: data });
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
