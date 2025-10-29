"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";

export default function RedeemPage({ params }: { params: { id: string } }) {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const cafe = searchParams.get("cafe");

  const [loading, setLoading] = useState(true);
  const [redeemed, setRedeemed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<any>(null);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const { data, error } = await supabase
          .from("cupones")
          .select("*")
          .eq("id", params.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setError("Cupón no válido o no encontrado.");
          return;
        }

        setCoupon(data);
        setRedeemed(data.redeemed || false);
      } catch (err) {
        console.error(err);
        setError("Error al obtener los datos del cupón.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [params.id]);

  const handleRedeem = async () => {
    try {
      const { error } = await supabase
        .from("cupones")
        .update({ redeemed: true })
        .eq("id", params.id);

      if (error) throw error;
      setRedeemed(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo redimir el cupón.");
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#3e2723] text-white">
        <p className="animate-pulse text-lg">Cargando cupón...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#f5f0ea] text-red-600">
        <p className="text-xl font-semibold">{error}</p>
      </main>
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
            <p className="mb-2 text-[#5a3b1e]">
              Hola {email ? <b>{email}</b> : "visitante"} 👋
            </p>
            <p className="text-[#5a3b1e] mb-6">
              {cafe ? (
                <>Cafetería: <strong>{cafe}</strong></>
              ) : (
                "Escoge tu beneficio y redime en la cafetería indicada."
              )}
            </p>

            <p className="text-lg font-semibold mb-2">
              Descuento: {coupon?.discount ?? 20}%
            </p>

            <button
              onClick={handleRedeem}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Redimir ahora
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">✅ Cupón redimido</h1>
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
