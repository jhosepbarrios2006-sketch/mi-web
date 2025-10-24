"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HistorySection from "../components/HistorySection";
import ReviewsSection from "../components/ReviewsSection";
import MapSection from "../components/MapSection";
import PromotionsSection from "../components/PromotionsSection";
import CreateCoupon from "../components/CreateCoupon";

export default function HomePage() {
  const router = useRouter();
  const [showCreateCoupon, setShowCreateCoupon] = useState(false);

  return (
    <main className="flex flex-col items-center min-h-screen bg-[var(--background)] text-[var(--foreground)] font-[var(--font-sans)]">

      {/* 🌇 HERO */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full h-[480px] bg-cover bg-center flex items-center justify-center text-center relative"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/26730484/pexels-photo-26730484.jpeg?_gl=1*1gpxnl0*_ga*MTEwNTU2NTAwOC4xNzYxMDgyNTg3*_ga_8JE65Q40S6*czE3NjEwODI1ODYkbzEkZzEkdDE3NjEwODI2MzckajkkbDAkaDA.')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
            DEJA QUE EL CAFÉ TE GUÍE.
            <br />
            LAS CAFETERÍAS MÁS ESPECIALES DE LA CIUDAD.
          </h1>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push("/cafeterias")}
              className="hero-btn bg-black text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              VER CAFETERÍAS
            </button>
            <button
              onClick={() => alert('Función próximamente')}
              className="hero-btn bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              RESERVA MESA
            </button>
          </div>
        </div>
      </motion.section>

      {/* 🏞️ HISTORIA DE FUSAGASUGÁ */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <HistorySection />
      </motion.div>

      {/* ☕ CAFETERÍAS */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="w-full max-w-6xl px-8 py-16 text-center"
      >
        <h2 className="text-4xl font-bold mb-3 text-[#4b2e16]">
          Descubra nuestras cafeterías más queridas
        </h2>
        <p className="text-[#6b4e2e] mb-12 text-lg">
          Explore los lugares más acogedores y deliciosos donde disfrutar un
          buen café. Perfectos para relajarse, trabajar o compartir.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              name: "Tayronacafé",
              img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/49/2e/50/caption.jpg?w=1100&h=-1&s=1",
              desc: "Famoso por su capuchino y ambiente relajado. Ideal para trabajar o leer un libro.",
            },
            {
              name: "Café Rojas",
              img: "https://www.centrocomercialsantacruzplaza.com/wp-content/uploads/2025/01/cafe-rojas-fusagasuga-3.jpeg",
              desc: "Perfecto para los amantes de los lattes y postres caseros. Ambiente cálido y moderno.",
            },
            {
              name: "Filadelfia Café Boutique",
              img: "https://media-cdn.tripadvisor.com/media/photo-p/1d/15/44/48/filadelfia-c.jpg",
              desc: "Especialistas en espresso intenso y croissants recién horneados. Un clásico.",
            },
          ].map((cafe, i) => (
            <motion.div
              key={cafe.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="card hover:scale-[1.03] transition-transform rounded-2xl shadow-lg overflow-hidden bg-white"
            >
              <img
                src={cafe.img}
                alt={cafe.name}
                className="h-56 w-full object-cover"
              />
              <div className="p-6 text-left">
                <h3 className="text-2xl font-semibold text-[#4b2e16] mb-2">
                  {cafe.name}
                </h3>
                <p className="text-[#5a3b1e] leading-relaxed">{cafe.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 💬 RESEÑAS */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <ReviewsSection />
      </motion.div>

      {/* 🗺️ MAPA */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <MapSection />
      </motion.div>

      {/* 🎁 PROMOCIONES */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <PromotionsSection />
      </motion.div>

      {/* 🟢 BOTÓN DE GENERAR CUPÓN AL FINAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex justify-center mt-12 mb-12"
      >
        <button
          onClick={() => setShowCreateCoupon(!showCreateCoupon)}
          className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors text-lg"
        >
          {showCreateCoupon ? "Cerrar Generador de Cupones" : "Generar Cupón"}
        </button>
      </motion.div>

      {/* 🎟️ GENERADOR DE CUPONES */}
      {showCreateCoupon && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl mb-12 px-4"
        >
          <CreateCoupon />
        </motion.div>
      )}

      {/* 🧡 FOOTER */}
      <footer className="w-full py-6 text-center bg-[#4b2e16] text-white mt-auto rounded-t-3xl">
        <p>© {new Date().getFullYear()} Explorador Cafetero | Diseñado con ☕ y amor 💛</p>
      </footer>
    </main>
  );
}
