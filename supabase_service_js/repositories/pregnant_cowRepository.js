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

export async function selectPregnantCows(oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('pregnant_cow')
        .select()
        .or(`created_at.gte.${iso},updated_at.gte.${iso}`)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting pregnant cows:', error);
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

