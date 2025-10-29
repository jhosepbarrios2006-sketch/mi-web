"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroPage() {
  const router = useRouter();
  const [particles, setParticles] = useState([]);
  const [audioStarted, setAudioStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLeaf, setShowLeaf] = useState(false);

  useEffect(() => {
    // 🌟 Generar partículas
    const generated = Array.from({ length: 25 }).map(() => ({
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
    }));
    setParticles(generated);
  }, []);

  const handleStart = async () => {
    if (audioStarted) return;
    setAudioStarted(true);
    setLoading(true);

    // 🎵 Sonido ambiental
    const sound = new Audio(
      "https://www.orangefreesounds.com/wp-content/uploads/2021/01/Sounds-in-a-forest.mp3"
    );
    sound.volume = 0.4;
    sound.loop = true;
    await sound.play().catch(() => {
      console.warn("El navegador bloqueó el audio hasta interacción del usuario.");
    });

    // 📊 Simulación de carga
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 10;
      if (p >= 100) {
        clearInterval(interval);
        setShowLeaf(true); // 🍃 Mostrar hoja final
        // 🔄 Fade out del sonido y redirección
        const fade = setInterval(() => {
          if (sound.volume > 0.05) {
            sound.volume -= 0.05;
          } else {
            clearInterval(fade);
            sound.pause();
            setTimeout(() => router.push("/login"), 2200); // 🔁 redirige después de animación
          }
        }, 100);
      } else {
        setProgress(p);
      }
    }, 400);
  };

  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-[#3e2723] to-[#4b2e16] text-white text-center"
      onClick={handleStart}
    >
      {/* 🌅 Fondo */}
      <motion.div
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[url('https://images.pexels.com/photos/697662/pexels-photo-697662.jpeg')] bg-cover bg-center blur-sm"
      />

      {/* 🧭 Brújula animada */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/149/149224.png"
        alt="Brújula"
        initial={{ rotate: 0, opacity: 0 }}
        animate={{ rotate: 360, opacity: 0.8 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-24 h-24 absolute top-16 right-16 drop-shadow-lg"
      />

      {/* 🌎 Texto central */}
      {!audioStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="z-10 max-w-2xl px-6"
        >
          <h1 className="text-5xl font-bold mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            🌎 Explorador Cafetero
          </h1>
          <p className="text-yellow-200 text-lg leading-relaxed">
            Haz clic para comenzar tu viaje sensorial por el mundo del café ☕✨
          </p>
          <p className="mt-4 text-sm text-yellow-300 animate-pulse">
            🔊 Toca la pantalla o haz clic para activar el sonido
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="z-20 flex flex-col items-center"
        >
          <h2 className="text-3xl font-semibold mb-4">Iniciando viaje...</h2>
          <div className="w-64 h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-300 rounded-full"
              style={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-3 text-sm text-yellow-200">{Math.round(progress)}%</p>
        </motion.div>
      )}

      {/* ✨ Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute bg-yellow-200 rounded-full"
            style={{
              width: p.width,
              height: p.height,
              top: p.top,
              left: p.left,
              opacity: 0.4,
            }}
            animate={{
              y: ["0%", "-40%"],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 🌰 Transición final con granos de café y logo */}
<AnimatePresence>
  {showLeaf && (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* GIF de granos grande y centrado */}
      <motion.img
        src="https://i.pinimg.com/originals/95/47/79/954779b87e4c85a7ade1a9ad20a1087b.gif"
        alt="Granos de café"
        className="w-[100vw] h-[100vh] object-contain opacity-90"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{
          scale: [0.6, 1.3, 2],
          opacity: [0, 1, 1, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      />

      {/* Logo o texto del Explorador Cafetero */}
      <motion.h1
        className="absolute text-5xl font-bold text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1.2, 1, 1.1],
        }}
        transition={{ duration: 3.5, ease: "easeInOut", delay: 1 }}
      >
        ☕ Explorador Cafetero
      </motion.h1>

      {/* Fondo negro que aparece al final */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.8, 1] }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />
    </motion.div>
  )}
</AnimatePresence>
    </main>
  );
}
