"use server";
import { cookies } from "next/headers";

export async function serverFetch(url: string, options?: RequestInit) {
  const cookieStore = await cookies();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      Cookie: cookieStore.toString(),
      ...options?.headers,
    },
  });

  return response.json();
}
