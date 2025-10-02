"use client";

import { useState } from "react";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Gracias ${form.nombre}, tu mensaje fue enviado!`);
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-coffee-light py-12 px-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-brown-800 mb-6 text-center">
          📬 Contáctanos
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-brown-700 font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-coffee-dark outline-none"
            />
          </div>

          <div>
            <label className="block text-brown-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-coffee-dark outline-none"
            />
          </div>

          <div>
            <label className="block text-brown-700 font-medium">Mensaje</label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-xl h-28 resize-none focus:ring-2 focus:ring-coffee-dark outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-coffee-dark text-white py-3 rounded-xl font-semibold hover:bg-brown-800 transition"
          >
            Enviar Mensaje
          </button>
        </form>
      </div>
    </main>
  );
}
