"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Cafeterias() {
  const [cafes, setCafes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCafes = async () => {
      const { data, error } = await supabase.from("cafeterias").select("*")
      if (error) {
        console.error("Error al cargar cafeterías:", error)
      } else {
        setCafes(data)
      }
      setLoading(false)
    }
    fetchCafes()
  }, [])

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/33350257/pexels-photo-33350257.jpeg')",
        }}
      >
        <div className="bg-black/50 absolute inset-0"></div>
        <p className="relative text-lg font-semibold text-white animate-pulse z-10">
          Cargando cafeterías... ☕
        </p>
      </div>
    )

  return (
    <main
      className="relative py-16 px-6 min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/33350257/pexels-photo-33350257.jpeg')",
      }}
    >
      {/* 🔳 Overlay oscuro para mejorar contraste */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* ✨ Contenido principal */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Título principal */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12 drop-shadow-lg">
          ☕ Directorio de Cafeterías
        </h1>

        {/* 🧋 Tarjetas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cafes.map((cafe) => (
            <div
              key={cafe.id}
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 overflow-hidden"
            >
              <img
                src={cafe.img}
                alt={cafe.nombre}
                className="h-52 w-full object-cover rounded-t-2xl"
              />
              <div className="p-6 text-left">
                <h2 className="text-2xl font-semibold text-[#4b2e16] mb-2">
                  {cafe.nombre}
                </h2>
                <p className="text-[#5a3b1e] leading-relaxed">
                  {cafe.descripcion}
                </p>
                <p className="text-sm text-[#6b4e2e] mt-4">
                  📍 {cafe.direccion}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Si no hay cafeterías */}
        {cafes.length === 0 && (
          <p className="text-center mt-10 text-white font-medium drop-shadow-md">
            No hay cafeterías registradas todavía ☕
          </p>
        )}
      </div>
    </main>
  )
}
