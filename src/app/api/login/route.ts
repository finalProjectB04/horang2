import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabase = createClient();

    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return NextResponse.json({ error: loginError.message }, { status: 401 });
    }

    if (sessionData?.session) {
      const userId = sessionData.user.id;

      const { data: userData, error: fetchError } = await supabase
        .from("Users")
        .select("id, user_email, user_nickname, profile_url")
        .eq("id", userId)
        .maybeSingle();

      if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
      }

      const response = NextResponse.json(userData);
      response.cookies.set("supabaseSession", JSON.stringify(sessionData.session), {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 3600,
      });
      return response;
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
