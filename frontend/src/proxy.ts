import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function attemptRefresh(request: NextRequest): Promise<Response> {
  return fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });
}

export async function proxy(request: NextRequest) {
  let verifyResponse: Response;

  try {
    verifyResponse = await fetch(`${API_URL}/auth/verify`, {
      headers: { cookie: request.headers.get("cookie") || "" },
    });
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (verifyResponse.ok) {
    const res = NextResponse.next();
    verifyResponse.headers.getSetCookie().forEach((cookie) => {
      res.headers.append("set-cookie", cookie);
    });

    return res;
  }

  if (verifyResponse.status === 401) {
    let refreshResponse: Response;
    try {
      refreshResponse = await attemptRefresh(request);
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (refreshResponse.ok) {
      const res = NextResponse.next();
      refreshResponse.headers.getSetCookie().forEach((cookie) => {
        res.headers.append("set-cookie", cookie);
      });
      return res;
    }

    // Refresh token also expired/invalid — send to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Any other error (500, etc.) — fail open or closed depending on your preference
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!login|register|_next/static|_next/image|favicon.ico).*)"],
};
