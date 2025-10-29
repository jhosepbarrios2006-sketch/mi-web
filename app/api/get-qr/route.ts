// File: app/api/get-qr/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    // Inicializar Supabase aquí dentro para evitar errores de prerender
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Falta parámetro: userId",
      });
    }

    // Buscar el QR de ese usuario
    const { data, error } = await supabase
      .from("user_qr_codes")
      .select("qr_code")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, qr: data.qr_code });
  } catch (err) {
    console.error("❌ Error obteniendo QR:", err);
    return NextResponse.json({
      success: false,
      message: "Error obteniendo QR",
      error: String(err),
    });
  }
}
