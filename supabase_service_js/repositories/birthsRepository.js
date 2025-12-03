import supabase from "../database/supabase_con.js";

export async function insertBirth(birth) {
    const { data, error } = await supabase
        .from('births')
        .insert([birth])
        .select();
    
    if (error) {
        console.error('Error inserting birth:', error);
        throw error;
    }
    return data;
}

export async function selectBirths(oldestDate) {
    const { data, error } = await supabase
        .from('births')
        .select()
        .or(`created_at.gte.${oldestDate},updated_at.gte.${oldestDate}`);
    if (error) {
        console.error('Error selecting births:', error);
        throw error;
    }

    return data;
}

export async function updateBirth(birth) {
    const { data, error } = await supabase
        .from('births')
        .update(birth)
        .eq('birth_id', birth.birth_id);

    if (error) {
        console.error('Error updating birth:', error);
        throw error;
    }

    return data;
}

