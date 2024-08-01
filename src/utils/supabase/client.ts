import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase"; // Database 타입을 정의한 파일 경로에 맞게 수정

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
