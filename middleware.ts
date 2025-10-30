import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  // 🚫 Si no hay sesión y va a /admin → redirigir a /login
  if (!session && path.startsWith("/admin")) {
    console.log("🚫 No hay sesión, redirigiendo a /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔐 Si hay sesión y va a /admin, verificar rol
  if (session?.user && path.startsWith("/admin")) {
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("email", session.user.email)
      .maybeSingle();

    console.log("👤 Usuario encontrado:", usuario);
    console.log("🎭 Rol:", usuario?.rol);

    // ⛔ Si no existe o no es admin, redirigir al inicio
    if (error || !usuario || usuario.rol !== "admin") {
      console.warn("⛔ Acceso denegado: no es admin o usuario no existe");
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("✅ Acceso permitido a /admin");
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