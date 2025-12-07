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

export async function selectCows(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `animal_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('animals')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting cows:', error);
        throw error;
    }

    return data;
}

export async function selectCowsGreaterId(animal_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('animals')
        .select()
        .gte('animal_id', animal_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting cow by id:', error);
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

