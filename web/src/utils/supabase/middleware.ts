import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/auth/confirm",
  "/forgot-password",
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (user) {
    if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (
      request.nextUrl.pathname === "/settings/subscription" ||
      process.env.NODE_ENV !== "production"
    ) {
      return supabaseResponse;
    }

    const supabaseServiceRole = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    const { data: subscription, error } = await supabaseServiceRole.schema(
      "stripe",
    )
      .from("subscriptions")
      .select("attrs")
      .eq("customer", user.id)
      .maybeSingle();

    if (error) {
      const url = request.nextUrl.clone();
      url.pathname = "/settings/subscription";
      return NextResponse.redirect(url);
    }

    const isActive = subscription &&
      (subscription.attrs.status === "active" ||
        subscription.attrs.status === "trialing");

    if (!isActive) {
      const url = request.nextUrl.clone();
      url.pathname = "/settings/subscription";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

// const { data: services } = await supabase
// .from("services")
// .select("id, href, name");
// const service = (services as Service[])?.find(({ href }) =>
// pathname.startsWith(href)
// );
// if (service) {
// const { data } = await supabase
//   .from("user_services")
//   .select("is_trial")
//   .match({ service_id: service.id, user_id: user.id })
//   .single();
// return data
//   ? response
//   : NextResponse.redirect(`${origin}/unlock?name=${service.name}`);
// }
