import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config();

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,);

    const { data, error } = await supabase.from('users').select('user_id').limit(1);
    if (error) console.error('ERROR:', error);
    else console.log('DATA:', data);

export default supabase;

