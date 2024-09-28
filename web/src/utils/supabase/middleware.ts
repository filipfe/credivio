import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import stripe from "../stripe/server";

const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/auth/confirm",
  "/forgot-password",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const { pathname, origin } = request.nextUrl;

  if (!user && !PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(`${origin}/sign-in`));
  }

  if (user) {
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(`${origin}/`));
    }
    if (pathname === "/settings/subscription") return supabaseResponse;
    try {
      const { data: subscription } = await stripe.subscriptions.list({
        customer: user.id,
      });
      const isActive = subscription.some((item) =>
        item.status === "active" || item.status === "trialing"
      );
      if (!isActive) {
        return NextResponse.redirect(
          new URL(`${origin}/settings/subscription`),
        );
      }
    } catch (err) {
      return NextResponse.redirect(new URL(`${origin}/settings/subscription`));
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
