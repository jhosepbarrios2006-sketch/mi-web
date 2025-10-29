import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode"; // 👈 Esta sí es segura en el backend

// Conexión segura a Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({
        success: false,
        error: "Faltan parámetros: userId o email.",
      });
    }

    // Generar URL de redención
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://tuapp.vercel.app";
    const redeemUrl = `${siteUrl}/redeem/${userId}?email=${encodeURIComponent(
      email
    )}`;

    // Generar el QR (imagen en base64)
    const qrDataUrl = await QRCode.toDataURL(redeemUrl);

    // Guardar o actualizar en Supabase
    const { error } = await supabase
      .from("user_qr_codes")
      .upsert([{ user_id: userId, qr_code: qrDataUrl }]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      qr: qrDataUrl,
      redeemUrl,
    });
  } catch (err) {
    console.error("❌ Error generando QR:", err);
    return NextResponse.json({
      success: false,
      error: String(err),
    });
  }
}
