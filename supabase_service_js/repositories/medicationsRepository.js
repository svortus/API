import supabase from "../database/supabase_con.js";


export async function insertMedication(medication) {
    const { data, error } = await supabase
        .from('medications')
        .insert([medication])
        .select();

    if (error) {
        console.error('Error inserting medication:', error);
        throw error;
    }

    return data;
}

export async function selectMedications(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `medication_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('medications')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting medications:', error);
        throw error;
    }

    return data;
}

export async function selectMedicationsGreaterId(medication_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('medications')
        .select()
        .gte('medication_id', medication_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting medication by id:', error);
        throw error;
    }
    return data;
}

export async function updateMedication(medication) {
    const { data, error } = await supabase
        .from('medications')
        .update(medication)
        .eq('medication_id', medication.medication_id); // Usa el nombre real de tu columna ID

    if (error) {
        console.error('Error updating medication:', error);
        throw error;
    }

    return data;
}

