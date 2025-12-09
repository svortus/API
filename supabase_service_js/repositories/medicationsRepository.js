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

export async function selectLastUpdated() {
    const { data, error } = await supabase
        .from("medications")
        .select("updated_at")
        .order("updated_at", { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error selecting dates:', error);
        throw error;
    }

    const lastUpdated = data?.[0]?.updated_at || null;

    return lastUpdated;
}

export async function selectSinceLastDate(since) {
    if (isNaN(since)) since = new Date("1970-01-01");
    const iso = new Date(since).toISOString();

    const { data, error } = await supabase
        .from("medications")
        .select()
        .or(`updated_at.gte.${iso},created_at.gte.${iso}`)
        .order("updated_at", { ascending: true });
    if (error) {
        console.error('Error selecting medications:', error);
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

