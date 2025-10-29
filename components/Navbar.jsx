"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-amber-700 text-white shadow-md">
      <Link href="/inicio" className="text-lg font-bold tracking-wide">
        ☕ Explorador Cafetero
      </Link>

      <div className="flex gap-4 text-sm">
        <Link href="/inicio" className="hover:underline">
          Inicio
        </Link>
        <Link href="/home" className="hover:underline">
          Misiones
        </Link>
        <Link href="/perfil" className="hover:underline">
          Perfil
        </Link>
      </div>
    </nav>
  );
}
