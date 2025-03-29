import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
    const session = await getToken({ req, secret: process.env.AUTH_SECRET });
    const { pathname } = req.nextUrl;

    const publicPaths = [
        "/auth/signin",
        "/auth/register",
        "/api/auth",
        "/_next/static",
        "/_next/image",
    ];

    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    if (!isPublicPath && !session) {
        const loginUrl = new URL("/auth/signin", req.url);
        loginUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(loginUrl);
    }

    const unauthPaths = ["/auth/signin", "/auth/register"];

    const isUnAuthPath = unauthPaths.some((path) => pathname.startsWith(path));

    if (isUnAuthPath && session) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/terms", "/contact", "/auth/signin", "/auth/register"],
};
