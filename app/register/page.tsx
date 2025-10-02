"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1️⃣ Registrar en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    // 2️⃣ Guardar en la tabla "usuarios"
    const { error: dbError } = await supabase.from("usuarios").insert([
      {
        email,
        nombre,
      },
    ])

    if (dbError) {
      alert("Error al guardar usuario en la BD: " + dbError.message)
    } else {
      alert("Registro exitoso 🎉 Revisa tu correo para confirmar.")
      router.push("/") // Redirige al home
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-yellow-100 to-yellow-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 Registro</h1>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-3 border rounded mb-3"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Correo"
            className="w-full p-3 border rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}
