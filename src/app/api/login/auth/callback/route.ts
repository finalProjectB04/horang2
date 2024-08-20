import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import Cookies from "js-cookie";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const user = sessionData?.session?.user;
    if (user) {
      const { id, email, user_metadata } = user;
      const { full_name, avatar_url } = user_metadata;

      // Users 테이블에 사용자 정보 저장
      const { error: dbError } = await supabase.from("Users").upsert({
        id,
        user_email: email,
        user_nickname: full_name,
        profile_url: avatar_url,
        provider: "google",
        provider_id: id,
      });

      if (dbError) {
        console.error("Error saving user to database:", dbError.message);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      // Zustand와 쿠키에 상태 저장
      const userState = {
        id,
        user_email: email,
        user_nickname: full_name,
        profile_url: avatar_url,
        provider: "google",
        provider_id: id,
      };

      // 쿠키 설정
      Cookies.set("user-storage", JSON.stringify(userState), { expires: 7 });

      // 리다이렉트
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      return isLocalEnv
        ? NextResponse.redirect(`${origin}${next}`)
        : forwardedHost
        ? NextResponse.redirect(`https://${forwardedHost}${next}`)
        : NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
