import supabase from "../database/supabase_con.js";

export async function insertMilkProduction(milkProduction) {
    const { data, error } = await supabase
        .from('milk_production')
        .insert([milkProduction])
        .select();

    if (error) {
        console.error('Error inserting milk production:', error);
        throw error;
    }

    return data;
}

export async function selectMilkProduction(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `milk_production_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('milk_production')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting milk production:', error);
        throw error;
    }

    return data;
}

export async function selectMilkProductionGreaterId(milk_production_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('milk_production')
        .select()
        .gte('milk_production_id', milk_production_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting milk production by id:', error);
        throw error;
    }
    return data;
}

export async function selectLastUpdated() {
    const { data, error } = await supabase
        .from("milk_production")
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
        .from("milk_production")
        .select()
        .or(`updated_at.gte.${iso},created_at.gte.${iso}`)
        .order("updated_at", { ascending: true });
    if (error) {
        console.error('Error selecting milk production:', error);
        throw error;
    }
    return data;
}

export async function updateMilkProduction(milkProduction) {
    const { data, error } = await supabase
        .from('milk_production')
        .update(milkProduction)
        .eq('milk_production_id', milkProduction.milk_production_id); // Ajusta el nombre de la columna si tu PK es distinta

    if (error) {
        console.error('Error updating milk production:', error);
        throw error;
    }

    return data;
}

