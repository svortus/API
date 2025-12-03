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

export async function selectWeightHistory() {
    const { data, error } = await supabase
        .from('weight_history')
        .select()
        .or(`created_at.gte.${oldestDate},updated_at.gte.${oldestDate}`);

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
        .eq('weight_history_id', weightHistory.weight_history_id); // Ajusta el nombre de la PK si es distinto

    if (error) {
        console.error('Error updating weight history:', error);
        throw error;
    }

    return data;
}

