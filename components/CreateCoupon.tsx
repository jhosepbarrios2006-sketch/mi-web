"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";

export default function CreateCoupon() {
  const [creating, setCreating] = useState(false);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function createCoupon() {
    try {
      setCreating(true);
      setMessage(null);

      // obtener usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay sesión activa. Por favor inicia sesión.");

      // crear un id único para el cupón
      const couponId = uuidv4();
      const code = `CUP-${couponId.slice(0, 8).toUpperCase()}`;

      // URL que se mostrará en el QR
      const qrUrl = `https://tucafesite.com/redeem/${user.id}?coupon=${couponId}`;

      // insertar en Supabase con owner_id (RLS)
      const { error } = await supabase.from("cupones").insert({
        id: couponId,
        owner_id: user.id, // 👈 Muy importante para RLS
        code,
        discount: 10,
        qr_url: qrUrl,
        redeemed: false,
      });

      if (error) throw error;

      // Mostrar QR
      setQrValue(qrUrl);
      setMessage("Cupón creado correctamente.");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message ?? "Error creando el cupón.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <button
        onClick={createCoupon}
        disabled={creating}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
      >
        {creating ? "Creando..." : "Generar cupón y QR"}
      </button>

      {message && <p className="mt-3 text-center">{message}</p>}

      {qrValue && (
        <div className="mt-5 flex flex-col items-center">
          <QRCode value={qrValue} />
          <p className="text-xs break-all mt-2 text-center">{qrValue}</p>
        </div>
      )}
    </div>
  );
}
