"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"   // 👈 Importar router

export default function LoginPage() {
  const router = useRouter() // 👈 Inicializar router
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      alert(error.message)
    } else {
      alert("Login exitoso 🎉")
      router.push("/")  // 👈 Redirigir al home
    }
  }

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      alert(error.message)
    } else {
      alert("Registro exitoso 🎉 Revisa tu correo para confirmar.")
      router.push("/")  // 👈 Redirigir al home después de registro
    }
  }

  const handleGuest = () => {
    alert("Entraste como invitado 🚀")
    router.push("/")  // 👈 Invitado también va al home
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black to-yellow-700">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">🔒 Ingresar</h1>

        <input
          type="email"
          placeholder="Correo"
          className="w-full p-3 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition mb-2"
        >
          Iniciar Sesión
        </button>

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition mb-2"
        >
          Registrarse
        </button>

        <button
          onClick={handleGuest}
          className="w-full bg-gray-300 text-black py-3 rounded-xl hover:bg-gray-400 transition"
        >
          Continuar como Invitado
        </button>
      </div>
    </div>
  )
}
