"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function RedeemPage({ params }: { params: { userId: string } }) {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [redeemed, setRedeemed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cafe = searchParams.get("cafe");
  const email = searchParams.get("email");

  // 🔹 Datos del cupón
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase
          .from("user_qr_codes")
          .select("user_id")
          .eq("user_id", params.userId)
          .maybeSingle();

        if (!data) {
          setError("Cupón no válido o usuario no encontrado.");
        } else {
          setUser({ id: params.userId, email: email ?? "No especificado" });
        }
      } catch (err) {
        console.error(err);
        setError("Hubo un problema al validar el cupón.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.userId]);

  // 🔸 Función para marcar el cupón como redimido
  const handleRedeem = async () => {
    try {
      const { error } = await supabase.from("redenciones").insert([
        {
          user_id: params.userId,
          cafe: cafe || "Desconocido",
          fecha: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setRedeemed(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar la redención.");
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#f5f0ea] text-[#4b2e16]">
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#f5f0ea] to-[#e6d8c3] text-[#4b2e16] p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-4">🎁 Redimir Cupón</h1>

        <p className="text-lg mb-4">
          <strong>Usuario ID:</strong> {user?.id}
        </p>
        <p className="text-lg mb-4">
          <strong>Email:</strong> {user?.email}
        </p>

        {cafe && (
          <p className="text-lg mb-4">
            <strong>Cafetería:</strong> {cafe}
          </p>
        )}

        {!redeemed ? (
          <>
            <p className="mb-6 text-[#5a3b1e]">
              Preséntate en la cafetería seleccionada y pulsa el botón para
              redimir tu promoción.
            </p>
            <button
              onClick={handleRedeem}
              className="bg-[#4b2e16] hover:bg-[#6b3e1f] text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              🎫 Redimir Cupón
            </button>
          </>
        ) : (
          <p className="text-green-700 font-semibold mt-6">
            ✅ Cupón redimido con éxito. ¡Disfruta tu beneficio!
          </p>
        )}
      </div>
    </main>
  );
}
