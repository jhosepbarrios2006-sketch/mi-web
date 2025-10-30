import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // 🚫 Si no hay sesión y va a /admin → redirigir a /login
  if (!session && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔐 Si hay sesión y va a rutas protegidas, verificar rol
  if (session?.user && path.startsWith("/admin")) {
    const email = session.user.email;

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("email", email)
      .single();

    // ⛔ Si no es admin, redirigir al inicio
    if (error || usuario?.rol !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ✅ Si está autenticado y va a /login, redirigir al inicio
  if (session && path === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};