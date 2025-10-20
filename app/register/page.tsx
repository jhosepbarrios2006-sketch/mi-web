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
      router.push("/login") // después de registrarte, te envía al login
    }
  }

  return (
    <div className="login-background">
      <div className="login-card w-96 text-center">
        {/* 📝 Título con estilo degradado */}
        <h1 className="login-title">
          <span>📝 Registro</span>
        </h1>

        {/* 📧 Campo de correo */}
        <input
          type="email"
          placeholder="Correo"
          className="login-input w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔑 Campo de contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="login-input w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ Botón de registro */}
        <button
          onClick={handleRegister}
          className="btn w-full mb-3"
        >
          Registrarse
        </button>

        {/* 🔙 Volver a inicio de sesión */}
        <p className="login-text text-sm">
          ¿Ya tienes cuenta?{" "}
          <a
            onClick={() => router.push("/login")}
            className="cursor-pointer"
          >
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}
