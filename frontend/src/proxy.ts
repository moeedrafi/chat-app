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
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  try {
    verifyResponse = await fetch(`${API_URL}/auth/verify`, {
      headers: { cookie: request.headers.get("cookie") || "" },
    });
  } catch {
    return isAuthPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.url));
  }

  // User is authenticated
  if (verifyResponse.ok) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Access token expired
  if (verifyResponse.status === 401) {
    let refreshResponse: Response;
    try {
      refreshResponse = await attemptRefresh(request);
    } catch {
      return isAuthPage
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/login", request.url));
    }

    if (refreshResponse.ok) {
      const setCookieHeaders = refreshResponse.headers.getSetCookie();

      // Build a new request with updated cookies so downstream Server Components see them
      const requestHeaders = new Headers(request.headers);
      const existingCookie = requestHeaders.get("cookie") ?? "";
      const newCookiePairs = setCookieHeaders
        .map((c) => c.split(";")[0])
        .join("; ");

      requestHeaders.set("cookie", `${existingCookie}; ${newCookiePairs}`);

      const res = isAuthPage
        ? NextResponse.redirect(new URL("/", request.url))
        : NextResponse.next({ request: { headers: requestHeaders } });

      setCookieHeaders.forEach((cookie) => {
        res.headers.append("set-cookie", cookie);
      });

      return res;
    }
  }

  // User is not authenticated
  if (isAuthPage) {
    return NextResponse.next();
  }

  // Any other error (500, etc.) — fail open or closed depending on your preference
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
