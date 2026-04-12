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
  const cookies = response.headers.getSetCookie();

  cookies.forEach((cookie) => {
    res.headers.append("set-cookie", cookie);
  });

  return res;
}

export const config = {
  matcher: ["/((?!login|register|_next/static|_next/image|favicon.ico).*)"],
};
