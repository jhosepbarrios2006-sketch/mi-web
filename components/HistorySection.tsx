"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HistorySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // empieza y termina el efecto
  });

  // 🎨 Cambiamos el color de fondo según el scroll
  const background = useTransform(
    scrollYProgress,
    [0, 1],
    ["#f7f3ef", "#e8dccf"] // colores de inicio y final
  );

  return (
    <motion.section
      ref={ref}
      style={{ background }}
      className="w-full py-20 px-6 md:px-16 transition-colors duration-500"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* 📸 Imagen */}
        <motion.img
          src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg"
          alt="Cafeterías de Fusagasugá"
          className="w-full md:w-1/2 rounded-3xl shadow-lg object-cover"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />

        {/* 📝 Texto */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 text-[#4b2e16]">
            Un viaje entre aroma y tradición ☕
          </h2>
          <p className="text-lg text-[#5a3b1e] leading-relaxed">
            Fusagasugá, conocida como la <strong>Ciudad Jardín de Colombia</strong>, 
            también ha cultivado una profunda relación con el café. 
            En sus calles florecen pequeñas cafeterías familiares, 
            llenas de historias, tradiciones y sabores únicos que reflejan 
            el espíritu amable de su gente.
          </p>
          <p className="text-lg text-[#5a3b1e] leading-relaxed mt-4">
            Hoy, el café es mucho más que una bebida: es un punto de encuentro, 
            una forma de compartir momentos y descubrir nuevas experiencias 
            en cada rincón de la ciudad.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
