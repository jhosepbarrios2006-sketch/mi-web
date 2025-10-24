"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RedeemPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const userId = params?.userId;
  const couponId = searchParams?.get("coupon");

  const [coupon, setCoupon] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!couponId) {
      setStatus("URL inválida: falta el id del cupón.");
      setLoading(false);
      return;
    }

    async function fetchCoupon() {
      setLoading(true);
      try {
        // consultar cupón en Supabase (público)
        const { data, error } = await supabase
          .from("cupones")
          .select("*")
          .eq("id", couponId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setStatus("Cupón no encontrado.");
          setCoupon(null);
          return;
        }

        if (data.redeemed) {
          setStatus("Este cupón ya fue canjeado.");
        } else {
          setCoupon(data);
          setStatus(null);
        }
      } catch (err: any) {
        console.error(err);
        setStatus(err.message ?? "Error al consultar el cupón.");
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

      {!loading && status && <p className="mb-4">{status}</p>}

      {!loading && coupon && !coupon.redeemed && (
        <div className="border p-4 rounded-lg bg-white">
          <p className="font-semibold">Código: {coupon.code}</p>
          <p>Descuento: {coupon.discount}%</p>
          <p>Cafetería: {coupon.cafe_id ?? "Todas"}</p>
          <button
            onClick={handleRedeem}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Canjear Cupón
          </button>
        </div>
      )}

      {!loading && coupon && coupon.redeemed && (
        <div className="border p-4 rounded-lg bg-white">
          <p>Este cupón ya fue canjeado.</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p>Propietario del cupón: {userId}</p>
      </div>
    </main>
  );
}
