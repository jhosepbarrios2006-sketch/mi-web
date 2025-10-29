"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
    } else {
      alert("Registro exitoso 🎉 Revisa tu correo para confirmar.")
      router.push("/login")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f4ede4] to-[#e1c6b2] p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
        {/* Título */}
        <h1 className="text-3xl font-bold text-[#b08968] text-center">📝 Registro</h1>

        {/* Input correo */}
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968] transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Input contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968] transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botón registro */}
        <button
          onClick={handleRegister}
          className="w-full bg-[#b08968] hover:bg-[#a06f4a] text-white font-semibold py-3 rounded-lg transition"
        >
          Registrarse
        </button>

        {/* Volver a login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => router.push("/login")}
            className="cursor-pointer text-[#b08968] hover:underline font-medium"
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  )
}
