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

export async function selectDiseases(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `disease_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('diseases')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting diseases:', error);
        throw error;
    }

    return data;
}

export async function selectDiseasesGreaterId(disease_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('diseases')
        .select()
        .gte('disease_id', disease_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting disease by id:', error);
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

