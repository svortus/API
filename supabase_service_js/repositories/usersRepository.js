import supabase from "../database/supabase_con.js";

export async function insertUser(user) {
    const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select();

    if (error) {
        console.error('Error inserting user:', error);
        throw error;
    }

    return data;
}

export async function selectUsers(oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('users')
        .select()
        .or(`created_at.gte.${iso},updated_at.gte.${iso}`)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting users:', error);
        throw error;
    }

    return data;
}

export async function updateUser(user) {
    const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq('user_id', user.user_id); // Cambia 'user_id' por el nombre real de la PK en tu tabla

    if (error) {
        console.error('Error updating user:', error);
        throw error;
    }

    return data;
}

