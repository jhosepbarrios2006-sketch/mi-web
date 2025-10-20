import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Mi Web",
  description: "Página de prueba con Next.js y Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* 🧭 HEADER */}
        <header className="sticky top-0 z-50 w-full shadow-md">
          <nav className="flex justify-center gap-6 py-4 backdrop-blur-md bg-white/40 border-b border-brown-200">
            <Link href="/" className="nav-button">
              🏠 Inicio
            </Link>
            <Link href="/cafeterias" className="nav-button">
              ☕ Cafeterías
            </Link>
            <Link href="/contacto" className="nav-button">
              📩 Contacto
            </Link>
          </nav>
        </header>

        {/* 📄 CONTENIDO PRINCIPAL */}
        <main className="px-6 sm:px-12 md:px-24">{children}</main>

        {/* 🍫 FOOTER */}
        <footer className="mt-16 py-6 text-center text-sm text-brown-800 bg-gradient-to-r from-[#fdfaf6] to-[#f7e6ca]">
          © {new Date().getFullYear()} Mi Web | Diseñado con ☕ y amor
        </footer>
      </body>
    </html>
  );
}
