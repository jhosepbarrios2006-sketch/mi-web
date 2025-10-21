"use client";
import { useRouter } from "next/navigation";

export default function MapaPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#3e2b20]">
        🗺️ Mapa de Cafeterías
      </h1>

      <p className="max-w-lg mb-8 text-[#3e2b20]">
        Aquí puedes explorar las principales cafeterías de Fusagasugá.  
        Usa el mapa para encontrar la más cercana ☕
      </p>

      {/* 🌍 Mapa de Google (puedes cambiar la ubicación en el src) */}
      <div className="w-full max-w-3xl h-[500px] rounded-2xl shadow-lg overflow-hidden border border-[#d9b88f]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.977469002139!2d-74.36808452499206!3d4.336331846161237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f05d2d18e9e35%3A0x4061c7faef2bfe2!2sFusagasug%C3%A1%2C%20Cundinamarca!5e0!3m2!1ses!2sco!4v1729100000000!5m2!1ses!2sco"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* 🔙 Botón para volver */}
      <button
        onClick={() => router.push("/cafeterias")}
        className="mt-8 bg-[#f7d7b5] hover:bg-[#fbd3b0] transition-all px-5 py-2 rounded-xl shadow-md hover:scale-105"
      >
        ← Volver a Cafeterías
      </button>
    </div>
  );
}
