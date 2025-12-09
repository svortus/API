import supabase from "../database/supabase_con.js";


export async function insertWeightHistory(weightHistory) {
    const { data, error } = await supabase
        .from('weight_history')
        .insert([weightHistory])
        .select();

    if (error) {
        console.error('Error inserting weight history:', error);
        throw error;
    }

    return data;
}

export async function selectWeightHistory(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `weight_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('weight_history')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting weight history:', error);
        throw error;
    }

    return data;
}

export async function selectWeightHistoryGreaterId(weight_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('weight_history')
        .select()
        .gte('weight_id', weight_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting weight history by id:', error);
        throw error;
    }
    return data;
}

export async function selectLastUpdated() {
    const { data, error } = await supabase
        .from("weight_history")
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
        .from("weight_history")
        .select()
        .or(`updated_at.gte.${iso},created_at.gte.${iso}`)
        .order("updated_at", { ascending: true });
    if (error) {
        console.error('Error selecting weight history:', error);
        throw error;
    }
    return data;
}

export async function updateWeightHistory(weightHistory) {
    const { data, error } = await supabase
        .from('weight_history')
        .update(weightHistory)
        .eq('weight_id', weightHistory.weight_id); // Ajusta el nombre de la PK si es distinto

    if (error) {
        console.error('Error updating weight history:', error);
        throw error;
    }

    return data;
}

