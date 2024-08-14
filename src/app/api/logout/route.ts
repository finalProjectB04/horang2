import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  try {
    const supabase = createClient();

    // Supabase에서 로그아웃 처리
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 세션 쿠키 삭제
    const response = NextResponse.json({ success: true });
    response.cookies.set("supabaseSession", "", {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: -1, // 즉시 만료시켜서 쿠키를 삭제
    });

    return response;
  } catch (error) {
    console.error("Server error during logout:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
