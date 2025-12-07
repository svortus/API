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

