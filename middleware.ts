import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔧 Configura tu cliente de Supabase (usa variables del entorno)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value;

  // 🚫 Si no hay sesión, redirigir al login
  if (!token) {
    console.log("🚫 No hay token, redirigiendo a /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // 🔍 Verificamos el usuario autenticado
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log("⚠️ Usuario no autenticado o error:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("✅ Usuario autenticado:", user.email);

    // 🧭 Verificamos el rol en la tabla `usuarios`
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

    const path = req.nextUrl.pathname;

    // 🛑 Si no es admin y trata de entrar a /admin, lo redirigimos
    if (path.startsWith("/admin") && usuario?.rol !== "admin") {
      console.warn("⛔ Acceso denegado: no es admin");
      return NextResponse.redirect(new URL("/cafeterias", req.url));
    }

    // ✅ Si pasa todo, continúa
    return NextResponse.next();
  } catch (err) {
    console.error("💥 Error en middleware:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// ⚙️ Define las rutas protegidas
export const config = {
  matcher: ["/admin/:path*", "/cafeterias/:path*"], // 👈 cambia o agrega más si quieres
};
