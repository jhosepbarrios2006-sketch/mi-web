"use client"

import { useState } from "react"
import { Playfair_Display, Lora } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"], weight: "700" })
const lora = Lora({ subsets: ["latin"], weight: ["400","700"] })

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Gracias ${form.nombre}, tu mensaje fue enviado con éxito 💌`)
    setForm({ nombre: "", email: "", mensaje: "" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF3E0] px-4 py-12">
      <div className="w-full max-w-lg bg-[#D8BFAF] rounded-3xl shadow-lg p-10">
        {/* ✉️ Título principal */}
        <h1 className={`${playfair.className} text-4xl text-center text-[#E0B345] mb-8 drop-shadow-lg`}>
          📬 Contáctanos
        </h1>

        {/* 🧾 Formulario */}
        <form onSubmit={handleSubmit} className={`${lora.className} space-y-6`}>
          {/* Nombre */}
          <div>
            <label className="block text-[#4B3621] font-semibold mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E0B345] focus:outline-none focus:ring-2 focus:ring-[#E0B345] bg-[#FAF3E0] text-[#4B3621]"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-[#4B3621] font-semibold mb-2">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E0B345] focus:outline-none focus:ring-2 focus:ring-[#E0B345] bg-[#FAF3E0] text-[#4B3621]"
            />
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-[#4B3621] font-semibold mb-2">Mensaje</label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              className="w-full h-32 px-4 py-3 rounded-xl border border-[#E0B345] focus:outline-none focus:ring-2 focus:ring-[#E0B345] bg-[#FAF3E0] text-[#4B3621] resize-none"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-[#E0B345] text-[#1E1E1E] font-bold py-3 rounded-xl hover:bg-[#D4A833] transition-colors"
          >
            Enviar mensaje
          </button>
        </form>
      </div>
    </div>
  )
}
