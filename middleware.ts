import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚙️ Cliente de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value;
  const path = req.nextUrl.pathname;

  // 🚫 Si no hay token e intenta acceder a /admin → redirigir al login
  if (!token && path.startsWith("/admin")) {
    console.log("🚫 No hay token, redirigiendo a /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ⚡ Si no hay token, dejar pasar (para rutas públicas como /, /login, etc.)
  if (!token) {
    return NextResponse.next();
  }

  try {
    // 🔍 Verificar usuario autenticado
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log("⚠️ Usuario no autenticado:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("✅ Usuario autenticado:", user.email);

    // 🔁 Si el usuario autenticado intenta ir a /login → redirigir al inicio
    if (path === "/login") {
      console.log("🔁 Usuario autenticado, redirigiendo a /");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 🧭 Consultar rol del usuario
    const { data: usuario, error: rolError } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("email", user.email)
      .single();

    if (rolError) {
      console.error("❌ Error al obtener rol:", rolError);
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("👤 Rol del usuario:", usuario?.rol);

    // 🔒 Solo permitir admin en rutas /admin/*
    if (path.startsWith("/admin") && usuario?.rol !== "admin") {
      console.warn("⛔ Acceso denegado: no es admin");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Si todo bien → continuar
    return NextResponse.next();
  } catch (err) {
    console.error("💥 Error en middleware:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// ⚙️ Solo afecta rutas necesarias
export const config = {
  matcher: ["/admin/:path*", "/login"],
};
