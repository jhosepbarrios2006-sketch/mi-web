import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 🔐 Crear cliente de Supabase con cookies (esto sí funciona en middleware)
  const supabase = createMiddlewareClient({ req, res });

  // ⚡ Obtener sesión activa
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // 🚫 Si no hay sesión y va a /admin → redirigir a /login
  if (!session && path.startsWith("/admin")) {
    console.log("🚫 No hay sesión, redirigiendo a /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🧭 Si hay sesión, obtener usuario y rol
  if (session?.user) {
    const email = session.user.email;

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("email", email)
      .single();

    if (error) {
      console.error("❌ Error al obtener rol:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("👤 Rol del usuario:", usuario?.rol);

    // 🔒 Si no es admin, no permitir acceso a /admin
    if (path.startsWith("/admin") && usuario?.rol !== "admin") {
      console.warn("⛔ Acceso denegado: no es admin");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 🔁 Si el usuario ya está logueado e intenta ir a /login → redirigir al inicio
    if (path === "/login") {
      console.log("🔁 Usuario autenticado, redirigiendo a /");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

// ⚙️ Aplica el middleware solo a rutas específicas
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
