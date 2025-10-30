import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("🔵 MIDDLEWARE EJECUTÁNDOSE - Ruta:", req.nextUrl.pathname);
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Obtener sesión actual
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  console.log("📧 Email del usuario:", session?.user?.email || "❌ No hay sesión");

  // 🚫 Si no hay sesión y va a /admin → login
  if (!session && path.startsWith("/admin")) {
    console.log("🚫 BLOQUEADO: No hay sesión, redirigiendo a /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔐 Si hay sesión y va a /admin → verificar rol
  if (session && path.startsWith("/admin")) {
    console.log("🔍 Buscando usuario en tabla usuarios...");
    
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("email", session.user.email)
      .single();

    console.log("👤 Resultado de búsqueda:", { usuario, error: error?.message });

    // Si no es admin, redirigir al inicio
    if (!usuario || usuario.rol !== "admin") {
      console.log("⛔ BLOQUEADO: Usuario no es admin. Rol encontrado:", usuario?.rol || "ninguno");
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("✅ ACCESO PERMITIDO: Usuario es admin");
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};