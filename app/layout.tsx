import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import AuthButton from "@/components/AuthButton"; // 👈 Importamos el botón con Supabase

export const metadata: Metadata = {
  title: "Mi Web",
  description: "Página de cafeterías modernas en la ciudad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-br from-[#fdfaf6] via-[#f8ecdc] to-[#f7d9b6] min-h-screen font-[Poppins] text-[#3e2723]">
        {/* 🌟 Navbar principal */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-10 py-5 backdrop-blur-md bg-white/70 shadow-md z-50 border-b border-[#d7ccc8]">
          {/* ☕ Logo y nombre */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold tracking-wide">
              ☕ MI WEB
            </span>
          </div>

          {/* 🔗 Enlaces de navegación */}
          <div className="flex items-center gap-6 text-[15px] font-medium">
            <Link
              href="/"
              className="hover:text-[#8d6e63] transition-colors duration-300"
            >
              INICIO
            </Link>

           
            <Link
              href="/contacto"
              className="hover:text-[#8d6e63] transition-colors duration-300"
            >
              CONTACTO
            </Link>

            {/* 🚪 Botón de cerrar sesión (con Supabase) */}
            <AuthButton />
          </div>
        </nav>

        {/* 📄 Contenido principal */}
        <main className="pt-28 px-4">{children}</main>
      </body>
    </html>
  );
}
