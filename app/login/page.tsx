"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      alert("Login exitoso 🎉")
      router.push("/")
    }
  }

  const handleGuest = () => {
    alert("Entraste como invitado 🚀")
    router.push("/")
  }

  return (
    <div className="login-background">
      <div className="login-card w-96 text-center">
        {/* 🔐 Título */}
        <h1 className="hero-title mb-6">🔒 Ingresar</h1>

        {/* 📧 Campo de correo */}
        <input
          type="email"
          placeholder="Correo electrónico"
          className="login-input w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔑 Campo de contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="login-input w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b08968]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 🧡 Botón principal */}
        <button
          onClick={handleLogin}
          className="btn w-full mb-3"
        >
          Iniciar Sesión
        </button>

        {/* 🚀 Invitado */}
        <button
          onClick={handleGuest}
          className="btn w-full bg-[#cbb39a] hover:bg-[#b08968]"
        >
          Continuar como Invitado
        </button>

        {/* 🔗 Registro */}
        <p className="login-text text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <a
            onClick={() => router.push("/register")}
            className="cursor-pointer text-[#b08968] hover:underline"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  )
}
