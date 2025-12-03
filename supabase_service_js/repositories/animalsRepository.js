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
    const {data, error} = await supabase
        .from('animals')
        .select()
        .or(`created_at.gte.${oldestDate},updated_at.gte.${oldestDate}`);

    if(error){
        console.error('Error selecting animal:', error)
        throw error;
    }
    return data;
}
export async function selectAnimalGreaterId(animal_id,oldestDate){
    const {data, error} = await supabase
        .from('animals')
        .select()
        .and(`animal_id.gte.${animal_id},created_at.gte.${oldestDate}`);
    if(error){
        console.error('Error selecting animal by id:', error)
        throw error;
    }
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

