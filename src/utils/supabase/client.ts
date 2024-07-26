// import { createBrowserClient } from "@supabase/ssr";

import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
// export const supabase = createBrowserClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// );

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! as string;

export const supabase = createClient(supabaseUrl, supabaseKey);
