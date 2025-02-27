import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Clear your custom auth tokens
  cookieStore.delete("authToken");
  cookieStore.delete("refreshToken");

  return NextResponse.json({ success: true });
}
