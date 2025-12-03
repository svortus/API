import supabase from "../database/supabase_con.js";

export async function insertCow(cow) {
    const { data, error } = await supabase
        .from('animals')
        .insert([cow])
        .select();

    if (error) {
        console.error('Error inserting cow:', error);
        throw error;
    }

    return data;
}

export async function selectCows(oldestDate) {
    const { data, error } = await supabase
        .from('animals')
        .select()
        .or(`created_at.gte.${oldestDate},updated_at.gte.${oldestDate}`);

    if (error) {
        console.error('Error selecting cows:', error);
        throw error;
    }

    return data;
}

export async function updateCow(cow) {
    const { data, error } = await supabase
        .from('animals')
        .update(cow)
        .eq('animal_id', cow.cow_id); // Usa el nombre real del ID de tu tabla

    if (error) {
        console.error('Error updating cow:', error);
        throw error;
    }

    return data;
}

