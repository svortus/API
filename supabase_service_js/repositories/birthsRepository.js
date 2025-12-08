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

export async function selectBirths(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `birth_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('births')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting births:', error);
        throw error;
    }

    return data;
}

export async function selectBirthsGreaterId(birth_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('births')
        .select()
        .gte('birth_id', birth_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting birth by id:', error);
        throw error;
    }
    return data;
}

export async function selectLastUpdated() {
    const { data, error } = await supabase
        .from("births")
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
    const iso = new Date(since).toISOString();

    const { data, error } = await supabase
        .from("births")
        .select()
        .or(`updated_at.gte.${iso},created_at.gte.${iso}`)
        .order("updated_at", { ascending: true });
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

