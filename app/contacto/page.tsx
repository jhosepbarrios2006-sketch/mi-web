"use client"

import { useState } from "react"

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
    <div className="login-background">
      <div className="login-card w-full max-w-lg text-center">
        {/*✉️ Título principal */}
        <h1 className="login-title mb-6">📬 Contáctanos</h1>

        {/* 🧾 Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Nombre */}
          <div>
            <label className="block text-brown-800 font-semibold mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="login-input w-full"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-brown-800 font-semibold mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="login-input w-full"
            />
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-brown-800 font-semibold mb-1">Mensaje</label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              className="login-input w-full h-32 resize-none"
            />
          </div>

          {/* Botón */}
          <button type="submit" className="btn w-full">
            Enviar mensaje
          </button>
        </form>
      </div>
    </div>
  )
}
