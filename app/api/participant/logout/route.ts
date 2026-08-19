import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set("participant_session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return response;
}
