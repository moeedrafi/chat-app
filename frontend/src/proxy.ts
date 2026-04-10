import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
    {
      headers: { cookie: request.headers.get("cookie") || "" },
    },
  );
  if (response.status === 401) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // forward any new cookies NestJS set (rotated tokens)
  const res = NextResponse.next();
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("set-cookie", setCookie);
  }
  return res;
}

export const config = {
  matcher: ["/:path*"],
};
