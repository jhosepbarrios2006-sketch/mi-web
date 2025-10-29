"use client";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Laura G.",
    text: "El ambiente del Tayronacafé es único, el aroma del café se siente desde la entrada. ¡Recomendadísimo!",
    img: "https://randomuser.me/api/portraits/women/79.jpg",
  },
  {
    name: "Carlos M.",
    text: "Café Rojas tiene el mejor latte que he probado. Perfecto para pasar la tarde con amigos.",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    name: "Diana P.",
    text: "Cundinamarca Café es mi favorito para trabajar, tiene una vibra tranquila y el espresso es espectacular.",
    img: "https://randomuser.me/api/portraits/women/43.jpg",
  },
];

export default function ReviewsSection() {
  return (
    <section className="w-full bg-[#fff7ec] py-20 px-6 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold mb-6 text-[#4b2e16]"
      >
        Opiniones de nuestros visitantes 💬
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg text-[#5a3b1e] max-w-2xl mx-auto mb-12"
      >
        Descubre lo que dicen las personas que ya han disfrutado del sabor y la
        calidez de nuestras cafeterías.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <img
              src={r.img}
              alt={r.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-[#4b2e16] mb-2">{r.name}</h3>
            <p className="text-[#6b4e2e] italic leading-relaxed">“{r.text}”</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
