import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { roleHome, type AppRole, type AppUserStatus } from "@/lib/auth-utils";

const authRoutes = ["/login", "/register"];
const adminRoutes = ["/dashboard/admin"];
const librarianRoutes = ["/dashboard/librarian"];

function isRoute(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (isRoute(pathname, authRoutes) && token?.role && token.status === "ACTIVE") {
    return NextResponse.redirect(new URL(roleHome[token.role as AppRole], request.url));
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (!token?.role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const status = token.status as AppUserStatus | undefined;
  if (status !== "ACTIVE") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const role = token.role as AppRole;
  if (isRoute(pathname, adminRoutes) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isRoute(pathname, librarianRoutes) && role === "MEMBER") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
