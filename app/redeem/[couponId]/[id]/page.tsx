"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function RedeemPage() {
  const { id } = useParams(); // ID del usuario del QR
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [userData, setUserData] = useState<any>(null);
  const [redeemed, setRedeemed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cupones disponibles (podrías traerlos desde Supabase si prefieres)
  const coupons = [
    {
      id: 1,
      title: "☕ 20% en tu bebida favorita",
      description: "Presenta este cupón en caja para obtener el descuento.",
      cafe: "Tayronacafé",
    },
    {
      id: 2,
      title: "🍰 Postre gratis con dos cafés",
      description: "Promoción válida solo una vez por usuario.",
      cafe: "Café Rojas",
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("user_qr_codes")
        .select("user_id, qr_code, redeemed")
        .eq("user_id", id)
        .maybeSingle();

      if (error) console.error("❌ Error cargando datos del QR:", error);
      setUserData(data);
      setRedeemed(data?.redeemed || false);
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  const handleRedeem = async () => {
    if (!userData) return;

    const { error } = await supabase
      .from("user_qr_codes")
      .update({ redeemed: true })
      .eq("user_id", id);

    if (error) {
      console.error("❌ Error al redimir el cupón:", error);
    } else {
      setRedeemed(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#3e2723] text-white">
        <p className="animate-pulse text-lg">Cargando cupón...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#3e2723] to-[#4b2e16] text-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white text-[#4b2e16] rounded-2xl shadow-lg p-8 max-w-lg w-full text-center"
      >
        {!redeemed ? (
          <>
            <h1 className="text-3xl font-bold mb-4">🎁 Redime tu cupón</h1>
            <p className="text-lg mb-2">
              Hola {email ? <b>{email}</b> : "visitante"} 👋
            </p>
            <p className="text-[#5a3b1e] mb-6">
              Escogiste redimir tu cupón de descuento. Selecciona tu beneficio:
            </p>

            <div className="space-y-4 text-left mb-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="p-4 border rounded-xl hover:bg-[#f6efe9] transition"
                >
                  <h3 className="font-semibold text-lg">{coupon.title}</h3>
                  <p className="text-sm text-[#5a3b1e]">{coupon.description}</p>
                  <p className="text-xs mt-1">Cafetería: {coupon.cafe}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleRedeem}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Redimir ahora
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">🎉 Cupón redimido</h1>
            <p className="text-[#5a3b1e] mb-4">
              ¡Gracias por disfrutar tu beneficio en nuestras cafeterías!
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-[#4b2e16] text-white px-6 py-3 rounded-lg hover:bg-[#3e2723] transition"
            >
              Volver al inicio
            </button>
          </>
        )}
      </motion.div>
    </main>
  );
}
