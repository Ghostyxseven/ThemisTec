import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/portal", request.url));
  response.cookies.delete("portal_token");
  return response;
}
