import supabase from "../database/supabase_con.js";

export async function insertDisease(disease) {
    const { data, error } = await supabase
        .from('diseases')
        .insert([disease])
        .select();

    if (error) {
        console.error('Error inserting disease:', error);
        throw error;
    }
    return data;
}

export async function selectDiseases(oldestDate) {
    const { data, error } = await supabase
        .from('diseases')
        .select()
        .or(`created_at.gte.${oldestDate},updated_at.gte.${oldestDate}`);

    if (error) {
        console.error('Error selecting diseases:', error);
        throw error;
    }

    return data;
}

export async function updateDisease(disease) {
    const { data, error } = await supabase
        .from('diseases')
        .update(disease)
        .eq('disease_id', disease.disease_id); // Cambia el nombre de la columna si tu PK es distinta

    if (error) {
        console.error('Error updating disease:', error);
        throw error;
    }

    return data;
}

