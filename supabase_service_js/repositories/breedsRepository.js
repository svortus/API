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

export async function selectBreeds(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `breed_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('breeds')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting breeds:', error);
        throw error;
    }

    return data;
}

export async function selectBreedsGreaterId(breed_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('breeds')
        .select()
        .gte('breed_id', breed_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting breed by id:', error);
        throw error;
    }
    return data;
}

export async function selectLastUpdated() {
    const { data, error } = await supabase
        .from("breeds")
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
        .from("breeds")
        .select()
        .or(`updated_at.gte.${iso},created_at.gte.${iso}`)
        .order("updated_at", { ascending: true });
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

