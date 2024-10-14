import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "pl"];
const defaultLocale = "en";

// Get the preferred locale, similar to the above or using a library
function getLocale(req: NextRequest) {
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => (headers[key] = value));
  const languages = new Negotiator({ headers }).languages();
  const locale = match(languages, locales, defaultLocale);
  return locale;
}

export function middleware(req: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = req.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(req);
  req.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
