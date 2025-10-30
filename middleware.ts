import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Obtener sesión actual
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // 🚫 Si no hay sesión y va a /admin → login
  if (!session && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔐 Si hay sesión y va a /admin → verificar rol
  if (session && path.startsWith("/admin")) {
    const { data: usuario } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("email", session.user.email)
      .single();

    // Si no es admin, redirigir al inicio
    if (!usuario || usuario.rol !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};