import supabase from "../database/supabase_con.js";

export async function insertAnimal(animal) {
    const { data, error } = await supabase
        .from('animals')
        .insert([animal])
        .select();

    if (error) {
        console.error('Error inserting animal:', error);
        throw error;
    }
    return data;
}
export async function selectAnimal(oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const {data, error} = await supabase
        .from('animals')
        .select()
        .or(`created_at.gte.${iso},updated_at.gte.${iso}`)
        .order('updated_at', { ascending: true });

    if(error){
        console.error('Error selecting animal:', error)
        throw error;
    }
    return data;
}
export async function selectAnimalGreaterId(animal_id,oldestDate){
    const iso = new Date(oldestDate).toISOString();
    const {data, error} = await supabase
        .from('animals')
        .select()
        .gte('animal_id', animal_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if(error){
        console.error('Error selecting animal by id:', error)
        throw error;
    }
    return data;
}
export async function updateAnimal(animal){
    const {data, error} = await supabase
        .from('animals')
        .update(animal)
        .eq('animal_id',animal.animal_id);
    if(error){
        console.error('Error updating animal:', error)
        throw error;
    }
    return data;
}

