import supabase from "../database/supabase_con.js";


export async function insertPregnantCow(pregnantCow) {
    const { data, error } = await supabase
        .from('pregnant_cow')
        .insert([pregnantCow])
        .select();

    if (error) {
        console.error('Error inserting pregnant cow:', error);
        throw error;
    }

    return data;
}

export async function selectPregnantCows(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `pregnant_cow_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('pregnant_cow')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting pregnant cows:', error);
        throw error;
    }

    return data;
}

export async function selectPregnantCowsGreaterId(pregnant_cow_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('pregnant_cow')
        .select()
        .gte('pregnant_cow_id', pregnant_cow_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting pregnant cow by id:', error);
        throw error;
    }
    return data;
}

export async function updatePregnantCow(pregnantCow) {
    const { data, error } = await supabase
        .from('pregnant_cow')
        .update(pregnantCow)
        .eq('pregnant_cow_id', pregnantCow.pregnant_cow_id); // Ajusta el nombre de la PK si es diferente

    if (error) {
        console.error('Error updating pregnant cow:', error);
        throw error;
    }

    return data;
}

