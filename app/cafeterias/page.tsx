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
      <div className="login-background flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-brown-800 animate-pulse">
          Cargando cafeterías... ☕
        </p>
      </div>
    )

  return (
    <main className="login-background py-16 px-6 min-h-screen">
      {/* ✨ Título principal */}
      <h1 className="login-title text-center mb-12 drop-shadow-md">
        ☕ Directorio de Cafeterías
      </h1>

      {/* 🧋 Contenedor de tarjetas */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="login-card hover:scale-105 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Imagen */}
            <img
              src={cafe.img}
              alt={cafe.nombre}
              className="h-52 w-full object-cover rounded-t-2xl"
            />

            {/* Contenido */}
            <div className="p-6 text-left">
              <h2 className="text-2xl font-semibold text-brown-800 mb-2">
                {cafe.nombre}
              </h2>
              <p className="text-gray-600 leading-relaxed">{cafe.descripcion}</p>
              <p className="text-sm text-brown-600 mt-4">📍 {cafe.direccion}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Si no hay cafeterías */}
      {cafes.length === 0 && (
        <p className="text-center mt-10 text-brown-700 font-medium">
          No hay cafeterías registradas todavía ☕
        </p>
      )}
    </main>
  )
}
