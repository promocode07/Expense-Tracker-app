import {createClient} from '@supabase/supabase-js';

//Database URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

//Anon key, for safe communicatio with the database
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);