import supabase from "../database/supabase_con.js";

export async function insertBreed(breed) {
    const { data, error } = await supabase
        .from('breeds')
        .insert([breed])
        .select();

    if (error) {
        console.error('Error inserting breed:', error);
        throw error;
    }
    return data;
}

export async function selectBreeds(oldestDate) {
    const { data, error } = await supabase
        .from('breeds')
        .select()
        .or(`created_at.gte.${oldestDate},updated_at.gte.${oldestDate}`);

    if (error) {
        console.error('Error selecting breeds:', error);
        throw error;
    }

    return data;
}

export async function updateBreed(breed) {
    const { data, error } = await supabase
        .from('breeds')
        .update(breed)
        .eq('breed_id', breed.breed_id); // usa el nombre real de tu columna ID

    if (error) {
        console.error('Error updating breed:', error);
        throw error;
    }

    return data;
}

