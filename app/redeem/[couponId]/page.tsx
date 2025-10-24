"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Cafe {
  id: string;
  name: string;
  logo_url: string | null;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  redeemed: boolean;
  cafe_id?: string;
  expires_at?: string;
}

export default function RedeemPage() {
  const params = useParams();
  const couponId = params?.couponId;

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!couponId) {
      setStatus("URL inválida.");
      setLoading(false);
      return;
    }

    async function fetchCoupon() {
      try {
        // Obtener el cupón
        const { data: couponData, error: couponError } = await supabase
          .from("cupones")
          .select("*")
          .eq("id", couponId)
          .maybeSingle();

        if (couponError) throw couponError;
        if (!couponData) {
          setStatus("Cupón no encontrado.");
          return;
        }

        setCoupon(couponData);

        // Si tiene cafe_id, traer información de la cafetería desde la tabla "cafeterias"
        if (couponData.cafe_id) {
          const { data: cafeData, error: cafeError } = await supabase
            .from("cafeterias")
            .select("id, name, logo_url")
            .eq("id", couponData.cafe_id)
            .maybeSingle();

          if (cafeError) throw cafeError;
          setCafe(cafeData);
        }

        // Validaciones
        if (couponData.redeemed) {
          setStatus("Este cupón ya fue canjeado.");
        } else if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
          setStatus("Este cupón ha expirado.");
        }
      } catch (err: any) {
        console.error(err);
        setStatus(err.message ?? "Error al cargar el cupón.");
      } finally {
        setLoading(false);
      }
    }

    fetchCoupon();
  }, [couponId]);

  async function handleRedeem() {
    if (!coupon) return;

    try {
      const { error } = await supabase
        .from("cupones")
        .update({ redeemed: true })
        .eq("id", coupon.id);

      if (error) throw error;

      setCoupon({ ...coupon, redeemed: true });
      setStatus("Cupón canjeado correctamente. ¡Gracias!");
    } catch (err: any) {
      console.error(err);
      setStatus(err.message ?? "Error al canjear el cupón.");
    }
  }

  return (
    <main className="p-6 min-h-screen flex flex-col items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Canjear Cupón</h1>

      {loading && <p>Cargando...</p>}

      {!loading && status && <p className="mb-4 text-center">{status}</p>}

      {!loading && coupon && !coupon.redeemed && (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) && (
        <div className="border p-4 rounded-lg bg-white flex flex-col items-center">
          {/* Logo de la cafetería */}
          {cafe && cafe.logo_url && (
            <img src={cafe.logo_url} alt={cafe.name} className="w-20 h-20 mb-2 object-contain" />
          )}
          {/* Nombre de la cafetería */}
          {cafe && <p className="font-semibold mb-2">{cafe.name}</p>}

          <p className="font-semibold text-lg">Código: {coupon.code}</p>
          <p>Descuento: {coupon.discount}%</p>

          <button
            onClick={handleRedeem}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Canjear Cupón
          </button>
        </div>
      )}

      {!loading && coupon && coupon.redeemed && (
        <div className="border p-4 rounded-lg bg-white text-center">
          <p>Este cupón ya fue canjeado.</p>
        </div>
      )}

      {!loading && coupon && coupon.expires_at && new Date(coupon.expires_at) < new Date() && (
        <div className="border p-4 rounded-lg bg-white text-center">
          <p>Este cupón ha expirado.</p>
        </div>
      )}
    </main>
  );
}
