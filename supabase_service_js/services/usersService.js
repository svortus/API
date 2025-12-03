import { insertUser,updateUser,selectUsers } from "../repositories/usersRepository.js";
import{ conflictResolution } from "../templates/conflictResolutionTemplate.js";

export async function createUser(req, res) {
    const users = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    try {
        for (const user of users) {

        try {
            const data = await insertUser(user);
            results.push({ user: data, status: "success" });
        } catch (insertError) {
            results.push({ user, status: "error", reason: insertError.message });
        }
        }

        return res.status(207).json({ message: "Sync results", results });
    } catch (error) {
        console.error("Error creating users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function userConflictResolution(req, res) {
    return conflictResolution(req, res, {
        tableName: "users",
        selectFn: selectUsers,
        updateFn: updateUser,
        insertFn: insertUser,
        idField: "user_id" 
    });
}

