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

export async function selectMilkProduction(oldestDate) {
    const { data, error } = await supabase
        .from('milk_production')
        .select()
        .or(`created_at.gte.${oldestDate},updated_at.gte.${oldestDate}`);

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

