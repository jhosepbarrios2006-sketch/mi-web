"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { supabase } from "@/lib/supabaseClient";

export default function PromotionsSection() {
  const [userQR, setUserQR] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const promotions = [
    {
      id: 1,
      cafe: "Tayronacafé",
      description: "20% de descuento en tu segunda bebida al presentar este QR.",
      image:
        "https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 2,
      cafe: "Café Rojas",
      description:
        "Postre gratis al comprar dos bebidas. Solo para miembros registrados.",
      image:
        "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: 3,
      cafe: "Filadelfia Café Boutique",
      description:
        "15% en tu primera compra mostrando este QR exclusivo de la web.",
      image:
        "https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  useEffect(() => {
    const fetchOrCreateUserQR = async () => {
      console.log("🚀 Iniciando proceso de QR...");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.log("⚠️ No hay sesión activa o error:", sessionError);
        setUserQR(null);
        setLoading(false);
        return;
      }

      const user = session.user;
      console.log("✅ Usuario detectado:", user.id, user.email);

      const { data: existingQR, error: fetchError } = await supabase
        .from("user_qr_codes")
        .select("qr_code")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("❌ Error buscando QR existente:", fetchError);
      }

      const newQRValue = `https://tucafesite.com/redeem/${user.id}?email=${encodeURIComponent(
        user.email ?? ""
      )}`;

      // 🧩 Usamos UPSERT en lugar de INSERT
      const { data: upsertData, error: upsertError } = await supabase
        .from("user_qr_codes")
        .upsert([{ user_id: user.id, qr_code: newQRValue }], {
          onConflict: "user_id", // evita el error 409
        })
        .select();

      if (upsertError) {
  console.error("❌ Error guardando QR (upsert):", upsertError?.message || upsertError);
} else {
  console.log("✅ QR guardado/actualizado correctamente:", upsertData);
}

      setLoading(false);
    };

    fetchOrCreateUserQR();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          console.log("🟢 Sesión detectada por listener:", session.user.id);
          setUserQR(
            `https://tucafesite.com/redeem/${session.user.id}?email=${encodeURIComponent(
              session.user.email ?? ""
            )}`
          );
        } else {
          console.log("🔴 Sesión cerrada");
          setUserQR(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-600 py-10">
        Cargando promociones...
      </p>
    );
  }

  return (
    <section className="w-full max-w-6xl px-6 py-16 mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold text-[#4b2e16] mb-4"
      >
        🎁 Promociones y Descuentos Exclusivos
      </motion.h2>

      {userQR ? (
        <div className="mb-10">
          <p className="text-[#5a3b1e] text-lg mb-4">
            Escanea tu código QR personal para redimir tus descuentos:
          </p>
          <div className="bg-white p-4 rounded-xl shadow inline-block">
            <QRCode value={userQR} size={150} />
          </div>
        </div>
      ) : (
        <p className="text-[#8c7b6a] text-lg mb-8">
          Inicia sesión para ver tu código QR personal.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-10">
        {promotions.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-[1.03] transition-transform border border-[#d6c1a7]"
          >
            <img
              src={promo.image}
              alt={promo.cafe}
              className="w-full h-52 object-cover"
            />
            <div className="p-5 text-left">
              <h3 className="text-2xl font-semibold text-[#4b2e16] mb-2">
                {promo.cafe}
              </h3>
              <p className="text-[#5a3b1e] mb-4">{promo.description}</p>
              <p className="text-sm text-[#8c7b6a] text-center">
                *Promoción válida solo para usuarios registrados*
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
