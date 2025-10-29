"use client";

import { motion } from "framer-motion";
import QRCode from "react-qr-code";

export default function MisionCard({ mision, onComplete }) {
  return (
    <motion.div
      className={`p-5 rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 transition transform hover:scale-105 ${
        mision.completada ? "opacity-60" : ""
      }`}
      whileHover={{ scale: 1.05 }}
    >
      <h2 className="text-2xl font-semibold mb-2 text-yellow-300">{mision.nombre}</h2>
      <p className="text-sm mb-4 text-yellow-100">{mision.descripcion}</p>

      <div className="flex justify-center mb-4">
        <QRCode
          value={mision.qr || `mision-${mision.id}`}
          size={100}
          bgColor="transparent"
          fgColor="#fff"
        />
      </div>

      {mision.completada ? (
        <p className="text-green-400 font-bold">✅ Completada</p>
      ) : (
        <button
          onClick={() => onComplete(mision.id)}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 py-2 rounded-xl"
        >
          Marcar como completada
        </button>
      )}
    </motion.div>
  );
}
