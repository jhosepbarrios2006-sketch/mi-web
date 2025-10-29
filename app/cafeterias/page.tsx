"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "react-qr-code";
import PromotionsSection from "@/components/PromotionsSection";
import CreateCoupon from "@/components/CreateCoupon";
import { motion } from "framer-motion";

export default function Cafeterias() {
  const [cafes, setCafes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCoupon, setShowCreateCoupon] = useState(false);

  useEffect(() => {
    const fetchCafes = async () => {
      const { data, error } = await supabase.from("cafeterias").select("*");
      if (error) {
        console.error("❌ Error al cargar cafeterías:", error);
      } else {
        setCafes(data);
      }
      setLoading(false);
    };
    fetchCafes();
  }, []);

  if (loading)
    return (
      <div
        className="flex justify-center items-center h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/33350257/pexels-photo-33350257.jpeg')",
        }}
      >
        <div className="bg-black/50 absolute inset-0"></div>
        <p className="relative text-lg font-semibold text-white animate-pulse z-10">
          Cargando cafeterías... ☕
        </p>
      </div>
    );

  return (
    <main
      className="relative py-16 px-6 min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/33350257/pexels-photo-33350257.jpeg')",
      }}
    >
      {/* 🔳 Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* ✨ Contenido */}
      <div className="relative z-10 w-full max-w-6xl">
        <h1 className="text-5xl font-bold text-center text-white mb-12 drop-shadow-lg">
          ☕ Directorio de Cafeterías con Descuentos
        </h1>

        {/* 🧋 Tarjetas de cafeterías */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {cafes.map((cafe, i) => (
            <motion.div
              key={cafe.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/95 rounded-2xl shadow-xl hover:scale-[1.03] transition-transform duration-300 overflow-hidden"
            >
              <img
                src={cafe.img}
                alt={cafe.nombre}
                className="h-52 w-full object-cover rounded-t-2xl"
              />
              <div className="p-6 text-left flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-[#4b2e16] mb-2 text-center">
                  {cafe.nombre}
                </h2>
                <p className="text-[#5a3b1e] text-center leading-relaxed">
                  {cafe.descripcion}
                </p>
                <p className="text-sm text-[#6b4e2e] mt-3 text-center">
                  📍 {cafe.direccion}
                </p>

                {/* 🔳 QR (desde BD o generado) */}
                <div className="mt-5 bg-white p-2 rounded-lg">
                  <QRCode
                    value={
                      cafe.qr ||
                      `https://tusitio.com/descuentos/${cafe.id}`
                    }
                    size={96}
                  />
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  Escanea para ver descuentos ☕
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Si no hay cafeterías */}
        {cafes.length === 0 && (
          <p className="text-center mt-10 text-white font-medium drop-shadow-md">
            No hay cafeterías registradas todavía ☕
          </p>
        )}

        

        {/* 🟢 Botón para generar cupón */}
        <div className="w-full flex justify-center mt-12 mb-12">
          <button
            onClick={() => setShowCreateCoupon(!showCreateCoupon)}
            className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors text-lg"
          >
            {showCreateCoupon ? "Cerrar Generador de Cupones" : "Generar Cupón"}
          </button>
        </div>

        {/* 🎟️ Generador de cupones */}
        {showCreateCoupon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl mb-12 px-4 mx-auto"
          >
            <CreateCoupon />
          </motion.div>
        )}
      </div>
    </main>
  );
}
