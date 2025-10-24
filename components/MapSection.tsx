"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Importa Leaflet solo cuando haya "window"
const MapWithNoSSR = dynamic(() => import("./MapComponent"), { ssr: false });

export default function MapSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="text-center text-gray-600">Cargando mapa...</p>;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-center mb-4">
        🗺️ Cafeterías en Fusagasugá
      </h2>
      <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
        <MapWithNoSSR />
      </div>
    </div>
  );
}
