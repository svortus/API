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

export async function selectUsers(oldestDate, ids = []) {
    const iso = new Date(oldestDate).toISOString();


    const idFilter = ids.length > 0
        ? `user_id.in.(${ids.join(',')})`
        : null;

    const orFilters = [
        idFilter,
        `created_at.gte.${iso}`,
        `updated_at.gte.${iso}`
    ].filter(Boolean).join(',');

    const { data, error } = await supabase
        .from('users')
        .select()
        .or(orFilters)
        .order('updated_at', { ascending: true });

    if (error) {
        console.error('Error selecting users:', error);
        throw error;
    }

    return data;
}

export async function selectUsersGreaterId(user_id, oldestDate) {
    const iso = new Date(oldestDate).toISOString();
    const { data, error } = await supabase
        .from('users')
        .select()
        .gte('user_id', user_id)
        .gte('created_at', iso)
        .order('updated_at', { ascending: true });
    if (error) {
        console.error('Error selecting user by id:', error);
        throw error;
    }
    return data;
}

export async function selectLastUpdated() {
    const { data, error } = await supabase
        .from("users")
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
        .from("users")
        .select()
        .or(`updated_at.gte.${iso},created_at.gte.${iso}`)
        .order("updated_at", { ascending: true });
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

