import "./globals.css"
import Link from "next/link"
import type { Metadata } from "next"
import AuthButton from "@/app/register/components/AuthButton"

export const metadata: Metadata = {
  title: "Mi Web",
  description: "Página de prueba con Next.js y Tailwind CSS",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-br from-[#fdfaf6] via-[#f8ecdc] to-[#f7d7b5] text-brown-800 font-poppins min-h-screen flex flex-col">
        {/* 🧭 HEADER */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/30 border-b border-brown-200 shadow-sm">
          <nav className="flex items-center justify-between px-8 py-4">
            {/* 🔹 Enlaces de navegación */}
            <div className="flex justify-center gap-6">
              <Link
                href="/"
                className="nav-button transition-all duration-300 hover:scale-105 hover:bg-[#fbd3b0]/70 px-4 py-2 rounded-xl"
              >
                🏠 Inicio
              </Link>

              <Link
                href="/cafeterias"
                className="nav-button transition-all duration-300 hover:scale-105 hover:bg-[#f7e6ca]/80 px-4 py-2 rounded-xl"
              >
                ☕ Cafeterías
              </Link>

              <Link
                href="/mapa"
                className="nav-button transition-all duration-300 hover:scale-105 hover:bg-[#fdebd3]/80 px-4 py-2 rounded-xl"
              >
                🗺️ Mapa
              </Link>

              <Link
                href="/contacto"
                className="nav-button transition-all duration-300 hover:scale-105 hover:bg-[#fdfaf6]/80 px-4 py-2 rounded-xl"
              >
                📩 Contacto
              </Link>
            </div>

            {/* 🔹 Botón de cerrar sesión (solo aparece si hay sesión iniciada) */}
            <AuthButton />
          </nav>
        </header>

        {/* 📄 CONTENIDO PRINCIPAL */}
        <main className="flex-grow px-6 sm:px-12 md:px-24 py-8">{children}</main>

        {/* 🍫 FOOTER */}
        <footer className="mt-12 py-6 text-center text-sm bg-gradient-to-r from-[#fffaf0] via-[#fdebd3] to-[#fbd3b0] shadow-inner">
          <p className="text-brown-900">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">Mi Web</span> | Diseñado con ☕ y amor 💛
          </p>
        </footer>
      </body>
    </html>
  )
}
