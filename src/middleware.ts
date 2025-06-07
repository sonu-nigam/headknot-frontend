import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req: any) => {
    console.log("Middleware triggered for request:", req.auth);
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.auth;

    const isAuthRoute = pathname.startsWith("/auth");

    if (isAuthRoute && isAuthenticated) {
        const newUrl = new URL("/", req.url);
        return NextResponse.redirect(newUrl);
    }

    if (!isAuthRoute && !isAuthenticated) {
        const newUrl = new URL("/auth/signin", req.url);
        newUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(newUrl);
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
