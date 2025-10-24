"use client";

import { motion } from "framer-motion";

export default function SaboresSection() {
  const items = [
    {
      title: "Café de Origen",
      subtitle: "Tostado medio - notas cítricas",
      img: "/images/sabor-origen.jpg",
    },
    {
      title: "Cold Brew",
      subtitle: "Infusión en frío, cuerpo suave",
      img: "/images/sabor-coldbrew.jpg",
    },
    {
      title: "Capuchino Especial",
      subtitle: "Espuma cremosa y arte latte",
      img: "/images/sabor-capuchino.jpg",
    },
  ];

  return (
    <section className="w-full bg-white py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-[#4b2e16] mb-6 text-center"
        >
          Sabores y especialidades
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center text-[#6b4e2e] mb-8 max-w-3xl mx-auto"
        >
          Descubre algunas de las preparaciones y sabores que hacen únicas a
          nuestras cafeterías: desde tazas de origen hasta creaciones de autor.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <motion.article
              key={it.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * idx, duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-lg bg-[#fffaf6] border border-transparent hover:shadow-xl transition-shadow"
            >
              <div className="h-48 md:h-56 w-full overflow-hidden">
                <img
                  src={it.img}
                  alt={it.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#4b2e16] mb-2">
                  {it.title}
                </h3>
                <p className="text-[#5a3b1e] mb-4">{it.subtitle}</p>
                <p className="text-sm text-[#6b4e2e]">
                  Ingredientes y método: granos locales seleccionados, molido
                  fresco y preparación cuidada por baristas expertos.
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
