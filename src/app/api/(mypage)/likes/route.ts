import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  const supabase = createClient();

  try {
    let { data, error } = await supabase
      .from("Likes")
      .select("*")
      .eq("user_id", id as string);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json({ error: "Error fetching likes" }, { status: 500 });
  }
}
