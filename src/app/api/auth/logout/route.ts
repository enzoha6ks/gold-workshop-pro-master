import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  
  // This expires the cookie immediately
  response.cookies.set("auth-token", "", { 
    expires: new Date(0),
    path: '/' 
  });
  
  return response;
}