import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Mi Web",
  description: "Página de prueba con Next.js y Tailwind",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        {/* 🔹 Menú de navegación */}
        <nav className="bg-brown-800 text-white px-6 py-4 flex gap-6 shadow-md">
  <Link href="/" className="hover:bg-brown-700 px-3 py-2 rounded">🏠 Inicio</Link>
  <Link href="/cafeterias" className="hover:bg-brown-700 px-3 py-2 rounded">☕ Cafeterías</Link>
  <Link href="/contacto" className="hover:bg-brown-700 px-3 py-2 rounded">📩 Contacto</Link>

        </nav>

        {/* 🔹 Aquí se cargan las páginas */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
