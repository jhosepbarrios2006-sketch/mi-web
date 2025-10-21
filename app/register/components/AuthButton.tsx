"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function AuthButton() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 🧠 Detectar si hay sesión activa
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }
    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // 🚪 Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/" // Redirige al inicio
  }

  if (loading) return null

  // ✅ Si hay sesión → muestra botón Cerrar sesión
  if (session) {
    return (
      <button
        onClick={handleLogout}
        className="bg-[#f7e6ca] text-brown-900 px-4 py-2 rounded-xl font-medium shadow hover:bg-[#fbd3b0] transition"
      >
        🚪 Cerrar sesión
      </button>
    )
  }

  // ❌ Si no hay sesión → muestra botones Iniciar sesión y Registrarse
  return (
    <div className="flex gap-2">
      <Link
        href="/login"
        className="bg-[#f7e6ca] text-brown-900 px-4 py-2 rounded-xl font-medium shadow hover:bg-[#fde2b5] transition"
      >
        🔐 Iniciar sesión
      </Link>
      <Link
        href="/register"
        className="bg-[#fde2b5] text-brown-900 px-4 py-2 rounded-xl font-medium shadow hover:bg-[#fbd3b0] transition"
      >
        ✨ Registrarse
      </Link>
    </div>
  )
}
